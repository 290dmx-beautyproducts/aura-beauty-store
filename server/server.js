'use strict';
/*
  Aura Beauty Products: M-Pesa STK Push server (Safaricom Daraja)

  What it does
    1. The website sends the cart + customer phone here.
    2. We recalculate the price ourselves (customers cannot change it), then ask Safaricom to
       pop up the M-Pesa PIN prompt on the customer's phone (STK Push).
    3. Safaricom tells us the result on the callback URL. The website polls /status to show it.

  Secrets live ONLY in environment variables (see .env.example). Nothing secret is in the website.
*/
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { priceOrder } = require('./catalog');

const env = process.env;
const PORT = Number(env.PORT) || 8787;
const DARAJA_ENV = env.DARAJA_ENV === 'production' ? 'production' : 'sandbox';
const BASE = (env.DARAJA_BASE || (DARAJA_ENV === 'production' ? 'https://api.safaricom.co.ke' : 'https://sandbox.safaricom.co.ke')).replace(/\/$/, '');
const SELF_URL = (env.PUBLIC_URL || env.RENDER_EXTERNAL_URL || '').replace(/\/$/, '');
const SHORTCODE = env.DARAJA_SHORTCODE || '';
const TX_TYPE = env.DARAJA_TRANSACTION_TYPE === 'CustomerBuyGoodsOnline' ? 'CustomerBuyGoodsOnline' : 'CustomerPayBillOnline';
const PARTY_B = env.DARAJA_PARTYB || SHORTCODE;
const ACCOUNT_REF = String(env.ACCOUNT_REFERENCE || 'AuraBeauty').slice(0, 12);
const TX_DESC = String(env.TRANSACTION_DESC || 'Aura order').slice(0, 13);
const ORDER_TIMEOUT_MS = 150 * 1000;
const QUERY_AFTER_MS = Number(env.QUERY_AFTER_MS) || 20000;

function isConfigured() {
  return !!(env.DARAJA_CONSUMER_KEY && env.DARAJA_CONSUMER_SECRET && SHORTCODE && env.DARAJA_PASSKEY && SELF_URL && env.CALLBACK_SECRET);
}

/* ---------------- tiny in-memory order book ----------------
   Fine for starting out. Render restarts clear it, so for a busy shop store orders in a database.
   Every paid order is also printed to the server log as one line of JSON (see "PAID" below). */
const orders = new Map();
setInterval(() => { const cut = Date.now() - 24 * 3600 * 1000; for (const [k, o] of orders) if (o.createdAt < cut) orders.delete(k); }, 30 * 60 * 1000).unref();

/* ---------------- simple abuse protection ---------------- */
const hits = new Map();
function limited(key, max, windowMs) {
  const now = Date.now(); const list = (hits.get(key) || []).filter(t => now - t < windowMs);
  if (list.length >= max) { hits.set(key, list); return true; }
  list.push(now); hits.set(key, list); return false;
}
setInterval(() => { const now = Date.now(); for (const [k, l] of hits) { const f = l.filter(t => now - t < 3600e3); if (f.length) hits.set(k, f); else hits.delete(k); } }, 10 * 60 * 1000).unref();

/* ---------------- helpers ---------------- */
function normalizePhone(input) {
  const d = String(input || '').replace(/[\s\-()+]/g, '');
  const m = d.match(/^(?:254|0)?([17]\d{8})$/);
  return m ? '254' + m[1] : null;
}
function nairobiTimestamp() {
  const d = new Date(Date.now() + 3 * 3600 * 1000), p = (n) => String(n).padStart(2, '0');
  return d.getUTCFullYear() + p(d.getUTCMonth() + 1) + p(d.getUTCDate()) + p(d.getUTCHours()) + p(d.getUTCMinutes()) + p(d.getUTCSeconds());
}
async function http(url, options, timeoutMs = 20000) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: ctl.signal });
    let data = null; try { data = await res.json(); } catch (e) { /* not JSON */ }
    return { ok: res.ok, status: res.status, data };
  } finally { clearTimeout(t); }
}

let tokenCache = { value: null, exp: 0 };
async function getToken() {
  if (tokenCache.value && Date.now() < tokenCache.exp) return tokenCache.value;
  const auth = Buffer.from(env.DARAJA_CONSUMER_KEY + ':' + env.DARAJA_CONSUMER_SECRET).toString('base64');
  const r = await http(BASE + '/oauth/v1/generate?grant_type=client_credentials', { headers: { Authorization: 'Basic ' + auth } });
  if (!r.ok || !r.data || !r.data.access_token) throw new Error('Daraja token request failed (' + r.status + ')');
  tokenCache = { value: r.data.access_token, exp: Date.now() + (Number(r.data.expires_in) || 3599) * 1000 - 60000 };
  return tokenCache.value;
}
function stkPassword(ts) { return Buffer.from(SHORTCODE + env.DARAJA_PASSKEY + ts).toString('base64'); }

async function sendStkPush(order) {
  const token = await getToken(), ts = nairobiTimestamp();
  const body = {
    BusinessShortCode: SHORTCODE, Password: stkPassword(ts), Timestamp: ts, TransactionType: TX_TYPE,
    Amount: order.amount, PartyA: order.phone, PartyB: PARTY_B, PhoneNumber: order.phone,
    CallBackURL: SELF_URL + '/api/mpesa/callback/' + env.CALLBACK_SECRET,
    AccountReference: ACCOUNT_REF, TransactionDesc: TX_DESC
  };
  return http(BASE + '/mpesa/stkpush/v1/processrequest', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
}
async function queryStk(order) {
  const token = await getToken(), ts = nairobiTimestamp();
  return http(BASE + '/mpesa/stkpushquery/v1/query', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ BusinessShortCode: SHORTCODE, Password: stkPassword(ts), Timestamp: ts, CheckoutRequestID: order.checkoutRequestId }) });
}

/* Result codes Safaricom returns, in plain words */
function describeResult(code, fallback) {
  switch (Number(code)) {
    case 0: return { status: 'paid', message: 'Payment received.' };
    case 1: return { status: 'failed', message: 'Your M-Pesa balance is not enough for this payment.' };
    case 1032: return { status: 'cancelled', message: 'You cancelled the payment request.' };
    case 1037: return { status: 'timeout', message: 'The request timed out on your phone. Please try again.' };
    case 2001: return { status: 'failed', message: 'The M-Pesa PIN entered was wrong.' };
    default: return { status: 'failed', message: fallback || 'The payment did not go through. Please try again.' };
  }
}
function markPaid(order, receipt) {
  if (order.status === 'paid') return;
  order.status = 'paid'; order.receipt = receipt || order.receipt || ''; order.message = 'Payment received.'; order.paidAt = Date.now();
  console.log('PAID ' + JSON.stringify({ orderId: order.id, receipt: order.receipt, amount: order.amount, phone: order.phone.slice(0, 6) + '***' + order.phone.slice(-3), name: order.name, area: order.area, zone: order.zone, items: order.lines.map(l => l.qty + 'x ' + l.name) }));
  /* Add your own follow-up here (email, WhatsApp notification, save to a database, etc.) */
}

/* ---------------- web server ---------------- */
const app = express();
app.set('trust proxy', 1);
const allowed = String(env.ALLOWED_ORIGIN || '*').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({ origin: (origin, cb) => cb(null, !origin || allowed.includes('*') || allowed.includes(origin)), methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '20kb' }));

app.get('/', (req, res) => res.json({ service: 'Aura Beauty API', mpesa: isConfigured() ? 'ready' : 'not configured yet' }));
app.get('/health', (req, res) => res.send('ok'));

/* 1) Start a payment */
app.post('/api/mpesa/stkpush', async (req, res) => {
  try {
    if (!isConfigured()) return res.status(503).json({ ok: false, code: 'not_configured', error: 'M-Pesa payments are being set up. Please order on WhatsApp for now.' });
    const b = req.body || {};
    const phone = normalizePhone(b.phone);
    const name = String(b.name || '').trim().slice(0, 60), area = String(b.area || '').trim().slice(0, 120);
    if (!phone) return res.status(400).json({ ok: false, error: 'Please enter a valid M-Pesa number, like 0712 345 678.' });
    if (name.length < 2 || area.length < 2) return res.status(400).json({ ok: false, error: 'Please enter your name and delivery area.' });
    const priced = priceOrder(b.items, b.zone);
    if (!priced.ok) return res.status(400).json({ ok: false, error: priced.error });
    if (limited('ip:' + req.ip, 8, 10 * 60 * 1000) || limited('ph:' + phone, 4, 10 * 60 * 1000))
      return res.status(429).json({ ok: false, error: 'Too many attempts. Please wait a few minutes and try again.' });

    const order = { id: crypto.randomBytes(8).toString('hex'), status: 'pending', message: 'Waiting for you to enter your M-Pesa PIN.', phone, name, area, zone: b.zone, lines: priced.lines, subtotal: priced.subtotal, fee: priced.fee, amount: priced.total, createdAt: Date.now(), lastQuery: 0, receipt: '' };
    orders.set(order.id, order);

    const r = await sendStkPush(order);
    if (!r.ok || !r.data || String(r.data.ResponseCode) !== '0') {
      console.error('STK push rejected', r.status, JSON.stringify(r.data));
      order.status = 'failed'; order.message = 'We could not send the payment request. Please check your number and try again.';
      return res.status(502).json({ ok: false, error: order.message });
    }
    order.checkoutRequestId = r.data.CheckoutRequestID; order.merchantRequestId = r.data.MerchantRequestID;
    res.json({ ok: true, orderId: order.id, amount: order.amount, message: r.data.CustomerMessage || 'Check your phone and enter your M-Pesa PIN.' });
  } catch (err) {
    console.error('stkpush error', err && err.message);
    res.status(500).json({ ok: false, error: 'Something went wrong on our side. Please try again in a moment.' });
  }
});

/* 2) The website asks "did it go through?" */
app.get('/api/mpesa/status/:id', async (req, res) => {
  const order = orders.get(String(req.params.id));
  if (!order) return res.status(404).json({ ok: false, status: 'unknown', message: 'Order not found.' });
  try {
    if (order.status === 'pending') {
      const age = Date.now() - order.createdAt;
      /* Safety net: if the callback was missed, ask Safaricom directly */
      if (age > QUERY_AFTER_MS && Date.now() - order.lastQuery > 10000 && order.checkoutRequestId) {
        order.lastQuery = Date.now();
        const q = await queryStk(order);
        if (q.ok && q.data && q.data.ResultCode !== undefined) {
          const d = describeResult(q.data.ResultCode, q.data.ResultDesc);
          if (d.status === 'paid') markPaid(order, order.receipt || 'confirmed');
          else { order.status = d.status; order.message = d.message; }
        }
      }
      if (order.status === 'pending' && Date.now() - order.createdAt > ORDER_TIMEOUT_MS) { order.status = 'timeout'; order.message = 'We did not get a response from M-Pesa in time.'; }
    }
  } catch (e) { /* querying is best effort */ }
  res.json({ ok: true, status: order.status, message: order.message, receipt: order.receipt || '', amount: order.amount });
});

/* 3) Safaricom reports the result here (the secret in the address keeps strangers out) */
app.post('/api/mpesa/callback/:secret', (req, res) => {
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  try {
    if (!env.CALLBACK_SECRET || req.params.secret !== env.CALLBACK_SECRET) return;
    const cb = req.body && req.body.Body && req.body.Body.stkCallback; if (!cb) return;
    let order = null; for (const o of orders.values()) if (o.checkoutRequestId === cb.CheckoutRequestID) { order = o; break; }
    if (!order) return console.warn('Callback for unknown order', cb.CheckoutRequestID);
    const d = describeResult(cb.ResultCode, cb.ResultDesc);
    if (d.status === 'paid') {
      const items = (cb.CallbackMetadata && cb.CallbackMetadata.Item) || [], get = (n) => { const f = items.find(i => i.Name === n); return f ? f.Value : undefined; };
      const paidAmount = Number(get('Amount')), receipt = String(get('MpesaReceiptNumber') || '');
      if (paidAmount !== order.amount) { order.status = 'review'; order.message = 'Payment received but the amount needs checking. We will contact you.'; order.receipt = receipt; console.warn('AMOUNT MISMATCH', order.id, paidAmount, order.amount, receipt); return; }
      markPaid(order, receipt);
    } else { order.status = d.status; order.message = d.message; }
  } catch (e) { console.error('callback error', e && e.message); }
});

if (require.main === module) {
  app.listen(PORT, () => console.log('Aura Beauty API listening on ' + PORT + ' | Daraja: ' + DARAJA_ENV + ' | M-Pesa ' + (isConfigured() ? 'ready' : 'NOT configured (add the environment variables)')));
  /* Keep a free Render server awake while it is running (also add an outside pinger, see README) */
  if (env.RENDER_EXTERNAL_URL) setInterval(() => fetch(env.RENDER_EXTERNAL_URL + '/health').catch(() => {}), 10 * 60 * 1000).unref();
}
module.exports = { app, normalizePhone };
