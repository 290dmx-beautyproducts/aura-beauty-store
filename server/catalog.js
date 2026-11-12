'use strict';
/*
  PRICE LIST (server copy). The server calculates the amount itself, so a customer can never
  change the price from their browser. KEEP THIS IN SYNC with the products in assets/site.js.
*/
const PRICES = {
  s1: 1450, s2: 1800, s3: 1650, s4: 1350, s5: 1200, s6: 950,
  w1: 4500, w2: 2600, w3: 5500, w4: 9800, w5: 6800, w6: 12500
};
const NAMES = {
  s1: 'Clear Skin Niacinamide Serum', s2: 'Dark Spot Corrector Serum', s3: 'Vitamin C Brightening Serum',
  s4: 'Salicylic Acne Control Serum', s5: 'Hydrating Barrier Moisturizer', s6: 'Gentle Foaming Cleanser',
  w1: 'Bob Lace Front Wig', w2: 'Synthetic Headband Wig', w3: 'Body Wave Hair Blend Wig',
  w4: 'Straight Human Hair Wig', w5: 'Curly Closure Wig', w6: 'Deep Wave Frontal Wig'
};
const ZONES = ['local', 'suburbs', 'upcountry'];

function deliveryFee(zone, subtotal) {
  if (zone === 'local') return subtotal > 1500 ? 0 : 150;   // free over KSh 1,500
  if (zone === 'suburbs') return 250;
  return 350;                                                // upcountry
}

/** items: [{id, qty}] -> { ok, subtotal, fee, total, lines } or { ok:false, error } */
function priceOrder(items, zone) {
  if (!ZONES.includes(zone)) return { ok: false, error: 'Please choose a delivery location.' };
  if (!Array.isArray(items) || items.length < 1 || items.length > 30) return { ok: false, error: 'Your cart is empty.' };
  let subtotal = 0; const lines = [];
  for (const it of items) {
    const qty = Number(it && it.qty);
    if (!it || !Object.prototype.hasOwnProperty.call(PRICES, it.id) || !Number.isInteger(qty) || qty < 1 || qty > 20)
      return { ok: false, error: 'One of the items in your cart is not valid. Please refresh and try again.' };
    subtotal += PRICES[it.id] * qty; lines.push({ id: it.id, name: NAMES[it.id], qty, price: PRICES[it.id] });
  }
  const fee = deliveryFee(zone, subtotal);
  return { ok: true, subtotal, fee, total: subtotal + fee, lines };
}
module.exports = { priceOrder, ZONES };
