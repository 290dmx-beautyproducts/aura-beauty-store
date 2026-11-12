(function () {
  'use strict';

  /* ================================================================
     CONTACT SETTINGS: change these two lines when you have your numbers.
     Use digits only, with the country code, no plus sign and no spaces.
     Example: 254712345678
     ================================================================ */
  var WHATSAPP_NUMBER = '254700000000';
  var PHONE_NUMBER = '254700000000';
  /* Social media links: paste your full page links between the quotes. */
  var SOCIAL = { instagram: '', tiktok: '', facebook: '', youtube: '' };
  /* M-PESA SETTINGS: when your payment server is ready (see the "server" folder), paste its address
     between the quotes, for example 'https://aura-beauty-api.onrender.com'. Leave empty until then. */
  var MPESA_API_URL = window.AURA_MPESA_API || '';

  var PRODUCTS = [
    { id: 's1', tag: 'Acne care', cat: 'skin', name: 'Clear Skin Niacinamide Serum', desc: 'Calms breakouts and refines pores.', price: 1450, hue: ['#F7D6DF', '#E7A3B5'] },
    { id: 's2', tag: 'Dark spots', cat: 'skin', name: 'Dark Spot Corrector Serum', desc: 'Targets uneven tone and stubborn marks.', price: 1800, hue: ['#FCE7C8', '#E8B77A'] },
    { id: 's3', tag: 'Brightening', cat: 'skin', name: 'Vitamin C Brightening Serum', desc: 'Boosts radiance for a fresh glow.', price: 1650, hue: ['#FFE9B8', '#F0B94A'] },
    { id: 's4', tag: 'Acne care', cat: 'skin', name: 'Salicylic Acne Control Serum', desc: 'Unclogs pores and helps prevent new spots.', price: 1350, hue: ['#D8EDE6', '#8CC7B2'] },
    { id: 's5', tag: 'Hydration', cat: 'skin', name: 'Hydrating Barrier Moisturizer', desc: 'Lightweight daily hydration for oily and combination skin.', price: 1200, hue: ['#DDE6F7', '#9DB5E3'] },
    { id: 's6', tag: 'Cleanser', cat: 'skin', name: 'Gentle Foaming Cleanser', desc: 'Cleans without stripping the skin.', price: 950, hue: ['#EADCF4', '#B99AD9'] },
    { id: 'w1', tag: 'Lace front', cat: 'crown', name: 'Bob Lace Front Wig', desc: 'Sleek 12-inch bob with a natural hairline.', price: 4500, hue: ['#3b1f2b', '#8a4b5e'] },
    { id: 'w2', tag: 'Headband', cat: 'crown', name: 'Synthetic Headband Wig', desc: 'Throw on and go. Soft, light and easy to style.', price: 2600, hue: ['#2a1b26', '#6d3f56'] },
    { id: 'w3', tag: 'Hair blend', cat: 'crown', name: 'Body Wave Hair Blend Wig', desc: 'Full bouncy waves with a natural finish.', price: 5500, hue: ['#351b22', '#a05a66'] },
    { id: 'w4', tag: 'Human hair', cat: 'crown', name: 'Straight Human Hair Wig', desc: 'Silky 18-inch straight hair, heat-friendly.', price: 9800, hue: ['#1f1520', '#5b3350'] },
    { id: 'w5', tag: 'Closure', cat: 'crown', name: 'Curly Closure Wig', desc: 'Defined curls with a pre-plucked closure.', price: 6800, hue: ['#2b1822', '#7e4358'] },
    { id: 'w6', tag: 'Frontal', cat: 'crown', name: 'Deep Wave Frontal Wig', desc: 'Luxurious deep waves with a 13x4 frontal.', price: 12500, hue: ['#241320', '#6b3a56'] }
  ];
  var FEATURED = ['s1', 's2', 'w1', 'w3'];
  var CLIPS = [
    { title: 'Serum Glow Routine', src: 'videos/serum-routine.mp4' },
    { title: 'Wig Install Tips', src: 'videos/wig-install.mp4' },
    { title: 'Unboxing an Order', src: 'videos/unboxing.mp4' }
  ];
  var GALLERY = [
    { title: 'Clearer Skin in 8 Weeks', tag: 'Glowing Skin', a: ['#C98E86', '#A5655F'], b: ['#F2CDBF', '#E5A898'], spots: true },
    { title: 'Even Tone, Fading Marks', tag: 'Glowing Skin', a: ['#9C6B4E', '#7A4D36'], b: ['#C58E69', '#A8714F'], spots: true },
    { title: 'Bob Lace Front Makeover', tag: 'The Crown', a: ['#E9DCD3', '#CDB8AA'], b: ['#3b1f2b', '#8a4b5e'], spots: false }
  ];
  var ZONES = { local: 'Local Base', suburbs: 'Mombasa Suburbs', upcountry: 'Upcountry' };

  function $(id) { return document.getElementById(id); }
  function money(n) { return 'KSh ' + Number(n).toLocaleString('en-KE'); }
  function find(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function waLink(text) { return 'https://wa.me/' + WHATSAPP_NUMBER + (text ? '?text=' + encodeURIComponent(text) : ''); }

  /* ---------- Contact buttons (wired for whatever content is on screen) ---------- */
  function wireLinks(root) {
    root = root || document;
    root.querySelectorAll('[data-wa]').forEach(function (a) {
      a.href = waLink(a.getAttribute('data-wa') || 'Hello Aura Beauty, I would like to order.');
      a.target = '_blank'; a.rel = 'noopener';
    });
    root.querySelectorAll('[data-social]').forEach(function (a) {
      var u = SOCIAL[a.getAttribute('data-social')];
      if (u) a.href = u; else a.addEventListener('click', function (e) { e.preventDefault(); toast('Link coming soon'); });
    });
    root.querySelectorAll('[data-call]').forEach(function (a) { a.href = 'tel:+' + PHONE_NUMBER; });
    root.querySelectorAll('[data-phone-text]').forEach(function (s) { s.textContent = '+' + PHONE_NUMBER; });
    root.querySelectorAll('[data-year]').forEach(function (s) { s.textContent = new Date().getFullYear(); });
  }

  /* ---------- Cart state (shared by all pages) ---------- */
  var cart = [];
  try {
    var saved = JSON.parse(localStorage.getItem('aura-cart') || '[]');
    if (Array.isArray(saved)) cart = saved.filter(function (i) { return i && i.id && i.qty > 0 && find(i.id); });
  } catch (e) { cart = []; }
  function save() { try { localStorage.setItem('aura-cart', JSON.stringify(cart)); } catch (e) {} }

  var toastTimer;
  function toast(msg) {
    var t = $('toast'); if (!t) return;
    t.textContent = msg; t.style.opacity = '1';
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.style.opacity = '0'; }, 1800);
  }

  function art(p) {
    var a = p.hue[0], b = p.hue[1], gid = 'g' + p.id + Math.floor(Math.random() * 1e6), inner;
    if (p.cat === 'skin') {
      inner = '<rect x="78" y="34" width="44" height="22" rx="5" fill="#4A1942"/><rect x="92" y="14" width="16" height="24" rx="4" fill="#B76E79"/>' +
        '<rect x="64" y="54" width="72" height="104" rx="14" fill="#fff" fill-opacity=".92"/><rect x="64" y="86" width="72" height="34" fill="' + b + '" fill-opacity=".55"/>' +
        '<text x="100" y="108" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#4A1942">AURA</text>' +
        '<rect x="70" y="60" width="5" height="92" rx="2.5" fill="#fff" fill-opacity=".7"/><path d="M158 52l2.2 5.600 5.600 2.200-5.600 2.200L158 68l-2.200-5.600-5.600-2.200 5.600-2.200z" fill="#C9A24B" fill-opacity=".85"/><circle cx="44" cy="120" r="3" fill="#C9A24B" fill-opacity=".6"/><ellipse cx="100" cy="170" rx="38" ry="5" fill="#000" fill-opacity=".1"/>';
    } else {
      inner = '<path d="M100 28 C58 28 44 70 46 112 C47 138 56 156 68 166 L68 120 C68 80 84 62 100 62 C116 62 132 80 132 120 L132 166 C144 156 153 138 154 112 C156 70 142 28 100 28 Z" fill="' + b + '"/>' +
        '<path d="M100 36 C66 38 56 74 58 108" stroke="#fff" stroke-opacity=".28" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M84 42 C72 80 72 130 78 160" stroke="#fff" stroke-opacity=".16" stroke-width="2" fill="none"/><path d="M116 42 C128 80 128 130 122 160" stroke="#000" stroke-opacity=".14" stroke-width="2" fill="none"/><path d="M164 40l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#C9A24B" fill-opacity=".85"/><ellipse cx="100" cy="176" rx="34" ry="6" fill="#000" fill-opacity=".12"/>';
    }
    return '<svg viewBox="0 0 200 190" class="w-full h-full" role="img" aria-label="' + p.name + '"><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + (p.cat === 'skin' ? a : '#F7E9EC') + '"/><stop offset="1" stop-color="' + (p.cat === 'skin' ? '#fff' : '#E9D3DA') + '"/></linearGradient></defs><rect width="200" height="190" fill="url(#' + gid + ')"/>' + inner + '</svg>';
  }

  function cardHtml(p) {
    return '<article class="card fade-in bg-white rounded-2xl overflow-hidden border border-rose/15">' +
      '<div class="relative aspect-[16/11] bg-blush">' + art(p) + '<span class="ptag">' + p.tag + '</span></div><div class="p-3">' +
      '<h3 class="font-semibold text-plum leading-snug text-sm">' + p.name + '</h3>' +
      '<p class="text-[11px] text-gray-500 mt-0.5 min-h-[1.7rem] leading-snug">' + p.desc + '</p>' +
      '<div class="mt-1.5 flex items-center justify-between gap-2"><span class="font-bold text-plum whitespace-nowrap">' + money(p.price) + '</span>' +
      '<button data-add="' + p.id + '" class="bg-plum text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-rose transition whitespace-nowrap">Add</button></div></div></article>';
  }

  /* ---------- Product grids (only on pages that have them) ---------- */
  function renderGrids(root) {
    (root || document).querySelectorAll('[data-grid]').forEach(function (grid) {
      var mode = grid.getAttribute('data-grid'), list;
      if (mode === 'featured') list = FEATURED.map(find);
      else list = PRODUCTS.filter(function (p) { return p.cat === mode; });
      grid.innerHTML = list.map(cardHtml).join('');
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (b) { addToCart(b.getAttribute('data-add')); var old = b.textContent; b.textContent = '\u2713'; b.classList.add('added'); setTimeout(function () { b.textContent = old; b.classList.remove('added'); }, 1000); }
  });

  /* ---------- Cart logic ---------- */
  function addToCart(id) {
    var item = cart.filter(function (i) { return i.id === id; })[0];
    if (item) item.qty += 1; else cart.push({ id: id, qty: 1 });
    save(); renderCart(); toast(find(id).name + ' added to cart');
    document.querySelectorAll('.hdr-cart').forEach(function (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); });
  }
  function subtotal() { return cart.reduce(function (s, i) { return s + find(i.id).price * i.qty; }, 0); }
  function deliveryFee(sub) {
    var z = $('zone').value;
    if (sub === 0) return 0;
    if (z === 'local') return sub > 1500 ? 0 : 150;
    if (z === 'suburbs') return 250;
    return 350;
  }
  function renderCart() {
    var count = cart.reduce(function (s, i) { return s + i.qty; }, 0);
    document.querySelectorAll('.cart-count').forEach(function (c) { c.textContent = count; });
    var box = $('cart-items');
    if (!cart.length) {
      box.innerHTML = '<div class="text-center text-gray-500 py-16"><p class="font-serif text-2xl text-plum mb-2">Your cart is empty</p><p class="text-sm">Add a serum or a wig to get started.</p></div>';
    } else {
      box.innerHTML = cart.map(function (i) {
        var p = find(i.id);
        return '<div class="flex gap-3 items-center"><div class="w-12 h-12 rounded-lg overflow-hidden bg-blush shrink-0">' + art(p) + '</div>' +
          '<div class="flex-1 min-w-0"><p class="text-sm font-semibold text-plum leading-snug">' + p.name + '</p><p class="text-xs text-gray-500">' + money(p.price) + '</p>' +
          '<div class="flex items-center gap-2 mt-1"><button data-dec="' + p.id + '" class="w-6 h-6 rounded-full border border-rose/40 text-plum leading-none" aria-label="Decrease">&minus;</button>' +
          '<span class="text-sm w-5 text-center">' + i.qty + '</span><button data-inc="' + p.id + '" class="w-6 h-6 rounded-full border border-rose/40 text-plum leading-none" aria-label="Increase">+</button></div></div>' +
          '<div class="text-right"><p class="text-sm font-semibold">' + money(p.price * i.qty) + '</p><button data-rm="' + p.id + '" class="text-xs text-rose hover:underline mt-1">Remove</button></div></div>';
      }).join('');
    }
    var sub = subtotal(), fee = deliveryFee(sub);
    $('subtotal').textContent = money(sub);
    $('delivery').textContent = (sub > 0 && fee === 0) ? 'FREE' : money(fee);
    $('total').textContent = money(sub + fee);
    $('free-hint').textContent = ($('zone').value === 'local' && sub > 0 && sub <= 1500) ? 'Add ' + money(1501 - sub) + ' more for free local delivery.' : '';
    $('wa-checkout').disabled = cart.length === 0; $('mpesa-pay').disabled = cart.length === 0;
  }
  function change(id, d) {
    var item = cart.filter(function (i) { return i.id === id; })[0]; if (!item) return;
    item.qty += d; if (item.qty <= 0) cart = cart.filter(function (i) { return i.id !== id; });
    save(); renderCart();
  }
  $('cart-items').addEventListener('click', function (e) {
    var inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]'), rm = e.target.closest('[data-rm]');
    if (inc) change(inc.getAttribute('data-inc'), 1);
    else if (dec) change(dec.getAttribute('data-dec'), -1);
    else if (rm) { cart = cart.filter(function (i) { return i.id !== rm.getAttribute('data-rm'); }); save(); renderCart(); }
  });
  $('zone').addEventListener('change', renderCart);
  $('clear-cart').addEventListener('click', function () { cart = []; save(); renderCart(); });
  function openCart() { closeMenu(); $('cart-panel').classList.add('open'); $('cart-overlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeCart() { $('cart-panel').classList.remove('open'); $('cart-overlay').classList.remove('open'); document.body.style.overflow = ''; }
  document.querySelectorAll('.open-cart').forEach(function (b) { b.addEventListener('click', openCart); });
  $('close-cart').addEventListener('click', closeCart);
  $('cart-overlay').addEventListener('click', closeCart);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeCart(); });

  /* ---------- WhatsApp checkout ---------- */
  $('wa-checkout').addEventListener('click', function () {
    if (!cart.length) return;
    var name = $('cust-name').value.trim(), area = $('cust-area').value.trim();
    if (!name || !area) { toast('Please add your name and area first'); (name ? $('cust-area') : $('cust-name')).focus(); return; }
    var sub = subtotal(), fee = deliveryFee(sub), L = [];
    L.push('*New Order: Aura Beauty*', '', '*Name:* ' + name, '', '*Items:*');
    cart.forEach(function (i, n) { var p = find(i.id); L.push((n + 1) + '. ' + p.name + ' x' + i.qty + ' = ' + money(p.price * i.qty)); });
    L.push('', '*Delivery zone:* ' + ZONES[$('zone').value], '*Delivery address:* ' + area, '',
      'Subtotal: ' + money(sub), 'Delivery: ' + (fee === 0 ? 'FREE' : money(fee)), '*TOTAL: ' + money(sub + fee) + '*', '',
      'I will pay by M-Pesa once you confirm availability. Thank you!');
    window.open(waLink(L.join('\n')), '_blank', 'noopener');
  });


  /* ---------- M-Pesa STK Push (customer gets a PIN prompt on their phone) ---------- */
  var pay = { poll: null, tick: null, snap: null, busy: false };
  var PHONE_SVG = '<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></svg>';
  try { var savedPhone = localStorage.getItem('aura-phone'); if (savedPhone && $('cust-phone')) $('cust-phone').value = savedPhone; } catch (e) {}
  function normPhone(v) { var m = String(v || '').replace(/[\s\-()+]/g, '').match(/^(?:254|0)?([17]\d{8})$/); return m ? '254' + m[1] : null; }
  function payShow(html) { var v = $('pay-view'); v.innerHTML = html; v.classList.add('on'); }
  function payStop() { clearInterval(pay.poll); clearInterval(pay.tick); pay.poll = pay.tick = null; }
  function payClose() { payStop(); pay.busy = false; var v = $('pay-view'); v.classList.remove('on'); v.innerHTML = ''; }
  function payBtn(id, label, cls) { return '<button id="' + id + '" class="w-full ' + cls + ' font-semibold py-3 rounded-full transition">' + label + '</button>'; }
  function payFail(msg, setup) {
    payStop(); pay.busy = false;
    payShow('<div class="pay-bad"><svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></div>' +
      '<h3 class="font-serif text-2xl font-bold text-plum mt-4">' + (setup ? 'M-Pesa is almost ready' : 'Payment not completed') + '</h3>' +
      '<p class="text-sm text-gray-600 mt-2 max-w-xs">' + esc(msg) + '</p><div class="w-full max-w-xs space-y-2 mt-5">' +
      (setup ? payBtn('pay-wa', 'Order on WhatsApp instead', 'bg-[#25D366] text-white') : payBtn('pay-retry', 'Try again', 'bg-plum text-white')) +
      payBtn('pay-back', 'Back to cart', 'border border-plum/30 text-plum bg-white') + '</div>');
  }
  function payWaiting(amount) {
    var left = 150;
    payShow('<div class="pay-ring">' + PHONE_SVG + '</div><h3 class="font-serif text-2xl font-bold text-plum mt-5">Check your phone</h3>' +
      '<p class="text-sm text-gray-600 mt-2 max-w-xs">M-Pesa is asking you to pay <b>' + money(amount) + '</b> to Aura Beauty. Enter your M-Pesa PIN to finish.</p>' +
      '<p class="text-xs text-gray-400 mt-4">Waiting for confirmation <span id="pay-count">' + left + '</span>s</p>' +
      '<p id="pay-hint" class="text-xs text-gray-500 mt-3 max-w-xs" style="display:none">No prompt yet? Make sure your phone is on and has network. You can cancel and try again.</p>' +
      '<button id="pay-cancel" class="mt-5 text-sm text-gray-500 underline">Cancel</button>');
    pay.tick = setInterval(function () {
      left--; var c = $('pay-count'); if (c) c.textContent = Math.max(left, 0);
      var h = $('pay-hint'); if (h && left < 115) h.style.display = 'block';
      if (left <= 0) payFail('We did not get a confirmation. If money left your M-Pesa, please WhatsApp us your phone number and we will check it right away.');
    }, 1000);
  }
  function paySuccess(receipt) {
    payStop(); pay.busy = false; pay.snap.receipt = receipt || '';
    cart = []; save(); renderCart();
    payShow('<div class="pay-ok"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>' +
      '<h3 class="font-serif text-2xl font-bold text-plum mt-5">Payment received!</h3>' +
      '<p class="text-sm text-gray-600 mt-2">Thank you, ' + esc(pay.snap.name) + '. Your order is confirmed.</p>' +
      (receipt ? '<p class="mt-3 text-xs uppercase tracking-widest text-gray-400">M-Pesa receipt</p><p class="font-mono font-bold text-plum text-lg">' + esc(receipt) + '</p>' : '') +
      '<div class="w-full max-w-xs space-y-2 mt-5">' + payBtn('pay-send', 'Send order details on WhatsApp', 'bg-[#25D366] text-white') + payBtn('pay-done', 'Done', 'border border-plum/30 text-plum bg-white') + '</div>');
  }
  function payCheck(orderId, amount) {
    fetch(MPESA_API_URL.replace(/\/$/, '') + '/api/mpesa/status/' + encodeURIComponent(orderId)).then(function (r) { return r.json(); }).then(function (d) {
      if (!pay.busy) return;
      if (d.status === 'paid') paySuccess(d.receipt);
      else if (d.status === 'review') paySuccess(d.receipt);
      else if (d.status && d.status !== 'pending') payFail(d.message || 'The payment did not go through.');
    }).catch(function () { /* network blip: keep waiting */ });
  }
  function startPay() {
    if (!cart.length || pay.busy) return;
    var name = $('cust-name').value.trim(), area = $('cust-area').value.trim(), phone = normPhone($('cust-phone').value);
    if (!name || !area) { toast('Please add your name and area first'); (name ? $('cust-area') : $('cust-name')).focus(); return; }
    if (!phone) { toast('Enter a valid M-Pesa number, like 0712 345 678'); $('cust-phone').focus(); return; }
    if (!MPESA_API_URL) { payFail('Card-free M-Pesa payments are being set up. For now, please order on WhatsApp and we will send you payment details.', true); return; }
    try { localStorage.setItem('aura-phone', $('cust-phone').value.trim()); } catch (e) {}
    var sub = subtotal(), fee = deliveryFee(sub), zone = $('zone').value;
    pay.snap = { name: name, area: area, zone: ZONES[zone], sub: sub, fee: fee, total: sub + fee, lines: cart.map(function (i) { var p = find(i.id); return p.name + ' x' + i.qty + ' = ' + money(p.price * i.qty); }) };
    pay.busy = true;
    payShow('<div class="pay-spin"></div><p class="text-sm text-gray-600 mt-4">Sending payment request...</p>');
    fetch(MPESA_API_URL.replace(/\/$/, '') + '/api/mpesa/stkpush', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: phone, name: name, area: area, zone: zone, items: cart.map(function (i) { return { id: i.id, qty: i.qty }; }) }) })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (d) {
        if (!d.ok) { payFail(d.error || 'We could not start the payment. Please try again.', d.code === 'not_configured'); return; }
        payWaiting(d.amount || pay.snap.total);
        pay.poll = setInterval(function () { payCheck(d.orderId, d.amount); }, 3000);
        setTimeout(function () { payCheck(d.orderId, d.amount); }, 1500);
      })
      .catch(function () { payFail('We could not reach the payment server. Please check your internet and try again.'); });
  }
  function payWhatsApp() {
    var s = pay.snap; if (!s) return;
    var L = ['*PAID via M-Pesa*' + (s.receipt ? ' (Receipt: ' + s.receipt + ')' : ''), '', '*Name:* ' + s.name, '', '*Items:*'];
    s.lines.forEach(function (l, n) { L.push((n + 1) + '. ' + l); });
    L.push('', '*Delivery zone:* ' + s.zone, '*Delivery address:* ' + s.area, '', 'Subtotal: ' + money(s.sub), 'Delivery: ' + (s.fee === 0 ? 'FREE' : money(s.fee)), '*TOTAL PAID: ' + money(s.total) + '*');
    window.open(waLink(L.join('\n')), '_blank', 'noopener');
  }
  $('mpesa-pay').addEventListener('click', startPay);
  $('pay-view').addEventListener('click', function (e) {
    var id = (e.target.closest('button') || {}).id;
    if (id === 'pay-cancel') { payClose(); toast('Cancelled. If you already paid, WhatsApp us your receipt.'); }
    else if (id === 'pay-back') payClose();
    else if (id === 'pay-done') { payClose(); closeCart(); }
    else if (id === 'pay-retry') { payClose(); startPay(); }
    else if (id === 'pay-send') payWhatsApp();
    else if (id === 'pay-wa') { payClose(); $('wa-checkout').click(); }
  });

  /* ---------- Mobile menu ---------- */

  /* ---------- Video showcase (home page) ---------- */
  var player = $('clip-player');
  if (player) {
    var fb = $('video-fallback');
    $('clip-list').innerHTML = CLIPS.map(function (c, i) {
      return '<button data-clip="' + i + '" class="shrink-0 flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-xs font-medium transition"><span class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></span>' + c.title + '</button>';
    }).join('');
    $('clip-list').addEventListener('click', function (e) {
      var b = e.target.closest('[data-clip]'); if (!b) return;
      var c = CLIPS[Number(b.getAttribute('data-clip'))];
      $('fallback-title').textContent = c.title; $('fallback-text').textContent = 'Loading clip...';
      fb.classList.remove('hidden'); player.classList.add('hidden');
      player.src = c.src; player.load(); player.play().catch(function () {});
    });
    player.addEventListener('loadeddata', function () { fb.classList.add('hidden'); player.classList.remove('hidden'); });
    player.addEventListener('error', function () { player.classList.add('hidden'); fb.classList.remove('hidden'); $('fallback-text').textContent = 'This clip is coming soon. Check back shortly.'; });
  }

  /* ---------- Before / After gallery ---------- */
  function panel(c, label, spots, key) {
    var dots = '';
    if (spots) dots = [[22,30,9],[60,24,7],[38,62,10],[74,58,8],[50,82,6],[18,76,7],[82,32,6]].map(function (p) { return '<circle cx="' + p[0] + '%" cy="' + p[1] + '%" r="' + p[2] + '" fill="#6e2f2a" fill-opacity=".38"/>'; }).join('');
    return '<svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none"><defs><linearGradient id="' + key + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#' + key + ')"/>' + dots + '</svg>' +
      '<span class="absolute top-3 ' + (label === 'before' ? 'left-3' : 'right-3') + ' bg-black/45 text-white text-[10px] tracking-widest uppercase px-2 py-1 rounded-full">' + label + '</span>';
  }
  function renderGallery() {
    var ba = $('ba-grid'); if (!ba) return;
    ba.innerHTML = GALLERY.map(function (g, i) {
      return '<div class="fade-in' + (i === 2 ? ' col-span-2 md:col-span-1' : '') + '"><div class="ba-wrap ' + (i === 2 ? 'aspect-[16/9] md:aspect-[4/5]' : 'aspect-[4/5]') + ' shadow-lg"><div class="absolute inset-0">' + panel(g.a, 'before', g.spots, 'b' + i) + '</div>' +
        '<div class="ba-after">' + panel(g.b, 'after', false, 'a' + i) + '</div><div class="ba-handle"></div>' +
        '<input type="range" min="0" max="100" value="50" class="ba-range" aria-label="Before and after slider"></div>' +
        '<div class="mt-2"><p class="text-[10px] uppercase tracking-widest text-rose font-semibold">' + g.tag + '</p><p class="font-serif text-base md:text-xl font-bold text-plum leading-tight">' + g.title + '</p></div></div>';
    }).join('');
    document.querySelectorAll('.ba-wrap').forEach(function (w) {
      var r = w.querySelector('.ba-range'), a = w.querySelector('.ba-after'), h = w.querySelector('.ba-handle');
      function u() { a.style.clipPath = 'inset(0 0 0 ' + r.value + '%)'; h.style.left = r.value + '%'; }
      r.addEventListener('input', u); u();
    });
  }

  /* ---------- Shared account system (header, sign up, log in) ---------- */
  var RESERVED = ['aura_official', 'amina.glows', 'zawadi.wigs', 'nyali.skin', 'mombasa.locs'];
  function lget(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function lset(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function curUser() { var id = lget('ar-session', null); return lget('ar-users', []).filter(function (u) { return u.id === id; })[0] || null; }
  function hashPw(pw) {
    if (window.crypto && crypto.subtle) return crypto.subtle.digest('SHA-256', new TextEncoder().encode('aura:' + pw)).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); });
    return Promise.resolve('p:' + pw);
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function hdrLogin() {
    var b = $('hdr-login'); if (!b) return; var u = curUser();
    if (u) { b.innerHTML = '<span class="av">' + esc((u.name || u.handle).charAt(0).toUpperCase()) + '</span><span>Profile</span>'; b.href = 'account.html'; }
    else { b.textContent = 'Log in'; b.href = '#'; }
  }
  function refreshAccount() {
    var g = $('acct-gate'), m = $('acct-main'); if (!g || !m) return; var u = curUser();
    g.classList.toggle('hidden', !!u); m.classList.toggle('hidden', !u);
    if (u) {
      document.querySelectorAll('[data-user-name]').forEach(function (e) { e.textContent = u.name; });
      document.querySelectorAll('[data-user-handle]').forEach(function (e) { e.textContent = u.handle; });
      document.querySelectorAll('[data-user-initial]').forEach(function (e) { e.textContent = (u.name || u.handle).charAt(0).toUpperCase(); });
    }
  }
  function announce() { hdrLogin(); refreshAccount(); window.dispatchEvent(new Event('aura-auth')); }
  function logout() { lset('ar-session', null); announce(); toast('You have been logged out'); }

  function openAuth(msg, cb) {
    var old = $('au-root'); if (old) old.remove();
    var mode = 'login';
    var w = document.createElement('div'); w.id = 'au-root'; w.className = 'au-back fixed inset-0 z-[70] flex items-center justify-center p-4';
    w.innerHTML = '<div class="absolute inset-0 bg-black/60 backdrop-blur-sm" data-au-close></div><div class="au-card relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl"><div id="au-body"></div></div>';
    document.body.appendChild(w);
    function close() { w.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    function draw(err) {
      $('au-body').innerHTML = '<div class="relative bg-gradient-to-br from-plum via-[#7b3a6e] to-rose text-white text-center px-6 pt-7 pb-6"><button data-au-close class="absolute right-4 top-3 text-2xl leading-none text-white/80 hover:text-white" aria-label="Close">&times;</button>' +
        '<span class="logo-mark mx-auto">A</span><p class="font-serif text-3xl font-bold mt-3">Aura Beauty</p><p class="text-xs text-white/80 mt-1">' + esc(msg || 'Log in or create your account') + '</p></div>' +
        '<div class="p-6"><div class="flex bg-blush rounded-full p-1 mb-4 text-sm font-semibold"><button data-au-mode="login" class="flex-1 py-2 rounded-full transition ' + (mode === 'login' ? 'bg-plum text-white shadow' : 'text-plum') + '">Log in</button><button data-au-mode="signup" class="flex-1 py-2 rounded-full transition ' + (mode === 'signup' ? 'bg-plum text-white shadow' : 'text-plum') + '">Sign up</button></div>' +
        (mode === 'signup' ? '<input id="au-name" placeholder="Full name" class="au-in mb-3">' : '') +
        '<input id="au-handle" placeholder="Username" autocapitalize="none" autocomplete="username" class="au-in mb-3"><input id="au-pw" type="password" placeholder="Password (6+ characters)" autocomplete="' + (mode === 'login' ? 'current-password' : 'new-password') + '" class="au-in mb-2">' +
        '<p class="text-red-500 text-xs min-h-[1.1rem] mb-2">' + (err || '') + '</p><button id="au-go" class="w-full py-3 rounded-full bg-gradient-to-r from-plum to-rose text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition">' + (mode === 'login' ? 'Log in' : 'Create account') + '</button>' +
        '<p class="text-[11px] text-gray-400 text-center mt-4">Preview mode: accounts are saved on this device only.</p></div>';
      var f = $(mode === 'signup' ? 'au-name' : 'au-handle'); if (f) f.focus();
    }
    draw();
    w.addEventListener('click', function (e) {
      if (e.target.closest('[data-au-close]')) { close(); return; }
      var md = e.target.closest('[data-au-mode]'); if (md) { mode = md.getAttribute('data-au-mode'); draw(); return; }
      if (!e.target.closest('#au-go')) return;
      var handle = $('au-handle').value.trim().toLowerCase().replace(/^@/, ''), pw = $('au-pw').value;
      if (!/^[a-z0-9_.]{3,20}$/.test(handle)) return draw('Username: 3 to 20 letters, numbers, dots or underscores.');
      if (pw.length < 6) return draw('Password must be at least 6 characters.');
      hashPw(pw).then(function (h) {
        var users = lget('ar-users', []), u = users.filter(function (x) { return x.handle === handle; })[0];
        if (mode === 'signup') {
          var name = $('au-name').value.trim(); if (!name) return draw('Please enter your name.');
          if (u || RESERVED.indexOf(handle) >= 0) return draw('That username is taken.');
          var cols = ['#B76E79', '#4A1942', '#1E7B5F', '#C9A24B', '#7b3a6e', '#D98324'];
          u = { id: 'u_' + Math.random().toString(36).slice(2, 9), name: name, handle: handle, bio: '', color: cols[users.length % cols.length], pw: h };
          users.push(u); lset('ar-users', users);
        } else if (!u || u.demo || u.pw !== h) return draw('Wrong username or password.');
        lset('ar-session', u.id); close(); toast('Welcome, @' + u.handle); announce(); if (cb) cb(u);
      });
    });
    w.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.tagName === 'INPUT') $('au-go').click(); });
  }
  window.AuraAuth = { open: openAuth, logout: logout, current: curUser };
  var hb = $('hdr-login');
  if (hb) hb.addEventListener('click', function (e) { if (!curUser()) { e.preventDefault(); openAuth(); } });
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-login]')) openAuth();
    if (e.target.closest('#acct-logout')) logout();
  });
  hdrLogin(); refreshAccount();

  /* ---------- Header behaviour, speed-dial, page transitions ---------- */
  var hd = $('hdr'), lastY = 0;
  if (hd) window.addEventListener('scroll', function () {
    hd.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
  var fab = $('fab'), fb2 = $('fab-btn');
  if (fb2) {
    fb2.addEventListener('click', function (e) { e.stopPropagation(); var o = fab.classList.toggle('open'); fb2.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    document.addEventListener('click', function (e) { if (!e.target.closest('#fab')) { fab.classList.remove('open'); fb2.setAttribute('aria-expanded', 'false'); } });
  }

  /* ---------- Pre-load every page + offline cache ---------- */
  var PAGES = ['index.html', 'glowing-skin.html', 'the-crown.html', 'gallery.html', 'reels.html', 'account.html', 'contact.html', 'about.html', 'faq.html', 'privacy.html', 'terms.html', 'community.html'];
  function warm() {
    PAGES.forEach(function (p) {
      if (location.pathname.slice(-p.length) === p) return;
      var l = document.createElement('link'); l.rel = 'prefetch'; l.href = p; document.head.appendChild(l);
    });
  }
  (window.requestIdleCallback || function (f) { setTimeout(f, 500); })(warm);
  if ('serviceWorker' in navigator && /^https?:/.test(location.protocol)) {
    var hadCtl = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      try { if (hadCtl && !sessionStorage.getItem('aura-sw-reload')) { sessionStorage.setItem('aura-sw-reload', '1'); location.reload(); } } catch (e) {}
    });
    setTimeout(function () { try { sessionStorage.removeItem('aura-sw-reload'); } catch (e) {} }, 6000);
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }


  /* ============ App shell: ONE persistent header + footer; only the content changes ============ */
  var VER = (document.currentScript && /[?&]v=([^&]+)/.exec(document.currentScript.src) || [])[1] || '';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var navToken = 0, destroyReels = null;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  function splitLetters(el) {
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    var n = 0;
    Array.prototype.slice.call(el.childNodes).forEach(function (c) {
      if (c.nodeType === 3) {
        var frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'); w.className = 'rw'; w.setAttribute('aria-hidden', 'true');
          part.split('').forEach(function (ch) { var s = document.createElement('span'); s.className = 'rl'; s.textContent = ch; s.style.animationDelay = Math.min(n * 24, 560) + 'ms'; n++; w.appendChild(s); });
          frag.appendChild(w);
        });
        el.replaceChild(frag, c);
      } else if (c.nodeType === 1) { c.classList.add('rxu'); c.style.animationDelay = Math.min(n * 24, 560) + 'ms'; n += 4; }
    });
  }
  function reveal(root) {
    if (reduce) return;
    root.querySelectorAll('h1').forEach(splitLetters);
    var i = 0;
    root.querySelectorAll('.banner p, .dash p, h2, article.card, .dash .card, details.dd, details.faq, .acc, .ba-wrap, section > p').forEach(function (el) {
      if (el.closest('.rl,.rw')) return;
      el.classList.add('rx'); el.style.animationDelay = Math.min(200 + i * 45, 720) + 'ms'; i++;
    });
  }

  function setActive(path) {
    var f = path.split('/').pop() || 'index.html';
    document.querySelectorAll('.hdr-nav a, .mp-item').forEach(function (a) {
      var on = a.getAttribute('href') === f; a.classList.toggle('on', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var s = document.querySelector('.hdr-strip'), o = s && s.querySelector('a.on');
    if (s && o) { var left = Math.max(0, o.offsetLeft - (s.clientWidth - o.offsetWidth) / 2); if (s.scrollTo && !reduce) s.scrollTo({ left: left, behavior: 'smooth' }); else s.scrollLeft = left; }
  }
  function mountReels() {
    if (!$('feed')) return;
    function go() { if (window.AuraReelsMount && $('feed') && !destroyReels) destroyReels = window.AuraReelsMount(); }
    if (window.AuraReelsMount) go();
    else { var s = document.createElement('script'); s.src = 'assets/reels.js' + (VER ? '?v=' + VER : ''); s.onload = go; document.head.appendChild(s); }
  }
  function initPage(root) {
    wireLinks(root); renderGrids(root); renderGallery(); refreshAccount(); mountReels(); reveal(root);
  }

  /* ---------- Mobile menu ---------- */
  var menuRoot = $('menu-root'), menuBtn = $('menu-btn');
  function closeMenu() { if (menuRoot && menuRoot.classList.contains('open')) { menuRoot.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); } }
  if (menuBtn && menuRoot) {
    menuBtn.addEventListener('click', function (e) { e.stopPropagation(); var o = menuRoot.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    $('menu-back').addEventListener('click', closeMenu);
    menuRoot.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1024) closeMenu(); });
  }
  var ORDER = ['index', 'glowing-skin', 'the-crown', 'gallery', 'reels', 'contact', 'about', 'faq', 'privacy', 'terms', 'community', 'account'];
  function pageIdx(n) { var i = ORDER.indexOf(n); return i < 0 ? 99 : i; }
  var ghostEl = null;
  function dropGhost() { if (ghostEl) { ghostEl.remove(); ghostEl = null; } }
  function sweepHeader() {
    var h = $('hdr'); if (!h || !h.animate) return;
    var s = $('hdr-sweep'); if (!s) { s = document.createElement('i'); s.id = 'hdr-sweep'; h.appendChild(s); }
    s.animate([{ opacity: 0, transform: 'translateX(-100%)' }, { opacity: 1, offset: .25 }, { opacity: 1, offset: .75 }, { opacity: 0, transform: 'translateX(400%)' }], { duration: 900, easing: 'cubic-bezier(.4,0,.2,1)' });
  }
  function shineBg() {
    var sh = $('bg-shine'); if (sh && sh.animate) sh.animate([{ opacity: 0, transform: 'translateX(-130%) skewX(-18deg)' }, { opacity: .9, offset: .5 }, { opacity: 0, transform: 'translateX(420%) skewX(-18deg)' }], { duration: 1100, easing: 'ease-in-out' });
  }
  /* Old content is cloned into a ghost that drifts away while the new content glides in: the screen is never blank. */
  function animateSwap(swap, oldPage, newPage, main) {
    dropGhost();
    if (reduce || !main.animate) { swap(); return; }
    var dir = pageIdx(newPage) >= pageIdx(oldPage) ? 1 : -1, ghost = null;
    if (oldPage !== 'reels') {
      var r = main.getBoundingClientRect();
      ghost = main.cloneNode(true); ghost.className = 'pg-ghost'; ghost.removeAttribute('id');
      Array.prototype.forEach.call(ghost.querySelectorAll('[id]'), function (n) { n.removeAttribute('id'); });
      Array.prototype.forEach.call(ghost.querySelectorAll('video,script,audio'), function (n) { n.remove(); });
      ghost.setAttribute('aria-hidden', 'true'); ghost.setAttribute('inert', '');
      ghost.style.cssText = 'top:' + r.top + 'px;left:' + r.left + 'px;width:' + r.width + 'px;height:' + r.height + 'px;';
      document.body.appendChild(ghost); ghostEl = ghost;
    }
    swap();
    if (ghost) {
      ghost.animate([{ opacity: 1, transform: 'translateX(0) scale(1)' }, { opacity: 0, transform: 'translateX(' + (-dir * 56) + 'px) scale(.985)' }], { duration: 380, easing: 'cubic-bezier(.3,0,.7,.3)', fill: 'forwards' })
        .onfinish = function () { if (ghostEl === ghost) dropGhost(); else ghost.remove(); };
    }
    main.animate([{ opacity: 0, transform: 'translateX(' + (dir * 64) + 'px) scale(1.012)' }, { opacity: 1, transform: 'none' }], { duration: 780, delay: ghost ? 170 : 0, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
    sweepHeader(); shineBg();
  }

  function navigate(url, push) {
    var u = new URL(url, location.href), token = ++navToken, main = document.querySelector('main');
    fetch(u.pathname + u.search).then(function (r) { if (!r.ok) throw 0; return r.text(); }).then(function (html) {
      if (token !== navToken) return;
      var doc = new DOMParser().parseFromString(html, 'text/html'), nm = doc.querySelector('main');
      if (!nm) throw 0;
      var oldPage = document.body.getAttribute('data-page') || '', newPage = doc.body.getAttribute('data-page') || '';
      function swap() {
        try {
          if (destroyReels) { try { destroyReels(); } catch (e) {} destroyReels = null; }
          closeCart(); closeMenu(); if (fab) fab.classList.remove('open'); var au = $('au-root'); if (au) au.remove();
          document.title = doc.title; document.body.setAttribute('data-page', newPage);
          if (push) history.pushState({}, '', u.pathname + u.search + u.hash);
          main.innerHTML = nm.innerHTML;
          window.scrollTo(0, 0); setActive(u.pathname);
          initPage(main);
        } catch (err) { location.href = u.href; }
      }
      animateSwap(swap, oldPage, newPage, main);
    }).catch(function () { if (token === navToken) location.href = u.href; });
  }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href]'); if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var h = a.getAttribute('href'); if (!h || h.charAt(0) === '#' || /^(tel:|mailto:|sms:|javascript:)/.test(h)) return;
    var u; try { u = new URL(a.href, location.href); } catch (er) { return; }
    if (u.origin !== location.origin || !/(\.html|\/)$/.test(u.pathname)) return;
    e.preventDefault();
    if (u.pathname === location.pathname && u.search === location.search) return;
    navigate(u.href, true);
  });
  window.addEventListener('popstate', function () { navigate(location.href, false); });

  var firstMain = document.querySelector('main');
  setActive(location.pathname);
  initPage(firstMain);


  /* ============ Rotating wallpaper: random start, slow zoom in/out, new picture every ~3.6s ============ */
  (function () {
    var host = $('bg-layers'); if (!host) return;
    var SETS = {
      land: ['l01','l02','l03','l04','l05','l06','l07','l08','l09','l10','l11'],
      port: ['p01','p02','p03','p04','p05','p06','p07','p08','p09','p10']
    };
    var HOLD = 3600, TRANS = 1300, mq = window.matchMedia('(max-width: 767px), (orientation: portrait)');
    var key = null, bag = [], timer = null, count = 0, last = null;
    try { last = localStorage.getItem('aura-bg-last'); } catch (e) {}
    function url(n) { return 'assets/bg/' + n + '.webp' + (VER ? '?v=' + VER : ''); }
    function shuffle(a, avoid) {
      var r = a.slice(), i, j, t;
      for (i = r.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = r[i]; r[i] = r[j]; r[j] = t; }
      if (avoid && r.length > 1 && r[0] === avoid) { j = 1 + Math.floor(Math.random() * (r.length - 1)); t = r[0]; r[0] = r[j]; r[j] = t; }
      return r;
    }
    function next() {
      var set = mq.matches ? SETS.port : SETS.land;
      if (!bag.length) bag = shuffle(set, last);
      var n = bag.shift(); last = n; try { localStorage.setItem('aura-bg-last', n); } catch (e) {}
      return n;
    }
    var FX = [
      function () { return [{ opacity: 0, filter: 'blur(16px) brightness(1.2)' }, { opacity: 1, filter: 'blur(0px) brightness(1)' }]; },
      function () { return [{ clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(78% at 50% 50%)' }]; },
      function () { return [{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }]; },
      function () { return [{ clipPath: 'polygon(0 0,0 0,0 0)' }, { clipPath: 'polygon(0 0,240% 0,0 240%)' }]; },
      function () { return [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }]; }
    ];
    function kenBurns(inner, zoomIn) {
      var tx = (Math.random() * 2 - 1) * 2.4, ty = (Math.random() * 2 - 1) * 2.4;
      var a = 'scale(1.0) translate(0,0)', b = 'scale(1.13) translate(' + tx + '%,' + ty + '%)';
      inner.animate(zoomIn ? [{ transform: a }, { transform: b }] : [{ transform: b }, { transform: a }], { duration: HOLD + TRANS * 2, easing: 'ease-in-out', fill: 'forwards' });
    }
    function show(first) {
      var name = next(), img = new Image();
      img.onload = function () {
        var layer = document.createElement('div'), inner = document.createElement('div');
        layer.className = 'bg-l'; inner.className = 'bg-i'; inner.style.backgroundImage = 'url(' + img.src + ')';
        layer.appendChild(inner); host.appendChild(layer);
        kenBurns(inner, count % 2 === 0); count++;
        var olds = Array.prototype.slice.call(host.children, 0, -1);
        if (!reduce && !first && olds.length) {
          var fx = FX[Math.floor(Math.random() * FX.length)]();
          layer.animate(fx, { duration: TRANS, easing: 'cubic-bezier(.65,0,.25,1)' }).onfinish = function () { olds.forEach(function (o) { o.remove(); }); };
          var sh = $('bg-shine'); if (sh && sh.animate) sh.animate([{ opacity: 0, transform: 'translateX(-130%) skewX(-18deg)' }, { opacity: 1, offset: .5 }, { opacity: 0, transform: 'translateX(420%) skewX(-18deg)' }], { duration: TRANS + 200, easing: 'ease-in-out' });
        } else if (first) {
          layer.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: 'ease-out' });
        } else { olds.forEach(function (o) { o.remove(); }); }
        schedule();
      };
      img.onerror = function () { schedule(); };
      img.src = url(name);
    }
    function schedule() {
      clearTimeout(timer);
      if (reduce || document.hidden) return;
      timer = setTimeout(function () { show(false); }, HOLD + Math.round(Math.random() * 400));
    }
    function restart() { bag = []; host.innerHTML = ''; count = 0; clearTimeout(timer); show(true); }
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else schedule(); });
    if (mq.addEventListener) mq.addEventListener('change', restart); else if (mq.addListener) mq.addListener(restart);
    show(true);
  })();

  window.AuraStore = { add: addToCart, products: PRODUCTS };
  renderCart();
})();
