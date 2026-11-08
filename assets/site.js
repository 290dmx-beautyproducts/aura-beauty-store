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

  var PRODUCTS = [
    { id: 's1', cat: 'skin', name: 'Clear Skin Niacinamide Serum', desc: 'Calms breakouts and refines pores.', price: 1450, hue: ['#F7D6DF', '#E7A3B5'] },
    { id: 's2', cat: 'skin', name: 'Dark Spot Corrector Serum', desc: 'Targets uneven tone and stubborn marks.', price: 1800, hue: ['#FCE7C8', '#E8B77A'] },
    { id: 's3', cat: 'skin', name: 'Vitamin C Brightening Serum', desc: 'Boosts radiance for a fresh glow.', price: 1650, hue: ['#FFE9B8', '#F0B94A'] },
    { id: 's4', cat: 'skin', name: 'Salicylic Acne Control Serum', desc: 'Unclogs pores and helps prevent new spots.', price: 1350, hue: ['#D8EDE6', '#8CC7B2'] },
    { id: 's5', cat: 'skin', name: 'Hydrating Barrier Moisturizer', desc: 'Lightweight daily hydration for oily and combination skin.', price: 1200, hue: ['#DDE6F7', '#9DB5E3'] },
    { id: 's6', cat: 'skin', name: 'Gentle Foaming Cleanser', desc: 'Cleans without stripping the skin.', price: 950, hue: ['#EADCF4', '#B99AD9'] },
    { id: 'w1', cat: 'crown', name: 'Bob Lace Front Wig', desc: 'Sleek 12-inch bob with a natural hairline.', price: 4500, hue: ['#3b1f2b', '#8a4b5e'] },
    { id: 'w2', cat: 'crown', name: 'Synthetic Headband Wig', desc: 'Throw on and go. Soft, light and easy to style.', price: 2600, hue: ['#2a1b26', '#6d3f56'] },
    { id: 'w3', cat: 'crown', name: 'Body Wave Hair Blend Wig', desc: 'Full bouncy waves with a natural finish.', price: 5500, hue: ['#351b22', '#a05a66'] },
    { id: 'w4', cat: 'crown', name: 'Straight Human Hair Wig', desc: 'Silky 18-inch straight hair, heat-friendly.', price: 9800, hue: ['#1f1520', '#5b3350'] },
    { id: 'w5', cat: 'crown', name: 'Curly Closure Wig', desc: 'Defined curls with a pre-plucked closure.', price: 6800, hue: ['#2b1822', '#7e4358'] },
    { id: 'w6', cat: 'crown', name: 'Deep Wave Frontal Wig', desc: 'Luxurious deep waves with a 13x4 frontal.', price: 12500, hue: ['#241320', '#6b3a56'] }
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

  /* ---------- Contact buttons on every page ---------- */
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waLink(a.getAttribute('data-wa') || 'Hello Aura Beauty, I would like to order.');
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-social]').forEach(function (a) {
    var u = SOCIAL[a.getAttribute('data-social')];
    if (u) a.href = u; else a.addEventListener('click', function (e) { e.preventDefault(); toast('Link coming soon'); });
  });
  document.querySelectorAll('[data-call]').forEach(function (a) { a.href = 'tel:+' + PHONE_NUMBER; });
  document.querySelectorAll('[data-phone-text]').forEach(function (s) { s.textContent = '+' + PHONE_NUMBER; });

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
        '<text x="100" y="108" text-anchor="middle" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#4A1942">AURA</text>';
    } else {
      inner = '<path d="M100 28 C58 28 44 70 46 112 C47 138 56 156 68 166 L68 120 C68 80 84 62 100 62 C116 62 132 80 132 120 L132 166 C144 156 153 138 154 112 C156 70 142 28 100 28 Z" fill="' + b + '"/>' +
        '<path d="M100 36 C66 38 56 74 58 108" stroke="#fff" stroke-opacity=".28" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="100" cy="176" rx="34" ry="6" fill="#000" fill-opacity=".12"/>';
    }
    return '<svg viewBox="0 0 200 190" class="w-full h-full" role="img" aria-label="' + p.name + '"><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + (p.cat === 'skin' ? a : '#F7E9EC') + '"/><stop offset="1" stop-color="' + (p.cat === 'skin' ? '#fff' : '#E9D3DA') + '"/></linearGradient></defs><rect width="200" height="190" fill="url(#' + gid + ')"/>' + inner + '</svg>';
  }

  function cardHtml(p) {
    return '<article class="card fade-in bg-white rounded-2xl overflow-hidden border border-rose/15">' +
      '<div class="aspect-[4/3.8] bg-blush">' + art(p) + '</div><div class="p-4">' +
      '<h3 class="font-semibold text-plum leading-snug">' + p.name + '</h3>' +
      '<p class="text-xs text-gray-500 mt-1 min-h-[2.2rem]">' + p.desc + '</p>' +
      '<div class="mt-3 flex items-center justify-between gap-2"><span class="font-bold text-plum">' + money(p.price) + '</span>' +
      '<button data-add="' + p.id + '" class="bg-plum text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-rose transition">Add to cart</button></div></div></article>';
  }

  /* ---------- Product grids (only on pages that have them) ---------- */
  document.querySelectorAll('[data-grid]').forEach(function (grid) {
    var mode = grid.getAttribute('data-grid'), list;
    if (mode === 'featured') list = FEATURED.map(find);
    else list = PRODUCTS.filter(function (p) { return p.cat === mode; });
    grid.innerHTML = list.map(cardHtml).join('');
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (b) addToCart(b.getAttribute('data-add'));
  });

  /* ---------- Cart logic ---------- */
  function addToCart(id) {
    var item = cart.filter(function (i) { return i.id === id; })[0];
    if (item) item.qty += 1; else cart.push({ id: id, qty: 1 });
    save(); renderCart(); toast(find(id).name + ' added to cart');
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
        return '<div class="flex gap-3 items-center"><div class="w-16 h-16 rounded-lg overflow-hidden bg-blush shrink-0">' + art(p) + '</div>' +
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
    $('wa-checkout').disabled = cart.length === 0;
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
  function openCart() { $('cart-panel').classList.add('open'); $('cart-overlay').classList.add('open'); document.body.style.overflow = 'hidden'; }
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
  var ba = $('ba-grid');
  function panel(c, label, spots, key) {
    var dots = '';
    if (spots) dots = [[22,30,9],[60,24,7],[38,62,10],[74,58,8],[50,82,6],[18,76,7],[82,32,6]].map(function (p) { return '<circle cx="' + p[0] + '%" cy="' + p[1] + '%" r="' + p[2] + '" fill="#6e2f2a" fill-opacity=".38"/>'; }).join('');
    return '<svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none"><defs><linearGradient id="' + key + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#' + key + ')"/>' + dots + '</svg>' +
      '<span class="absolute top-3 ' + (label === 'before' ? 'left-3' : 'right-3') + ' bg-black/45 text-white text-[10px] tracking-widest uppercase px-2 py-1 rounded-full">' + label + '</span>';
  }
  if (ba) {
    ba.innerHTML = GALLERY.map(function (g, i) {
      return '<div class="fade-in"><div class="ba-wrap aspect-[4/5] shadow-lg"><div class="absolute inset-0">' + panel(g.a, 'before', g.spots, 'b' + i) + '</div>' +
        '<div class="ba-after">' + panel(g.b, 'after', false, 'a' + i) + '</div><div class="ba-handle"></div>' +
        '<input type="range" min="0" max="100" value="50" class="ba-range" aria-label="Before and after slider"></div>' +
        '<div class="mt-3"><p class="text-xs uppercase tracking-widest text-rose font-semibold">' + g.tag + '</p><p class="font-serif text-xl font-bold text-plum">' + g.title + '</p></div></div>';
    }).join('');
    document.querySelectorAll('.ba-wrap').forEach(function (w) {
      var r = w.querySelector('.ba-range'), a = w.querySelector('.ba-after'), h = w.querySelector('.ba-handle');
      function u() { a.style.clipPath = 'inset(0 0 0 ' + r.value + '%)'; h.style.left = r.value + '%'; }
      r.addEventListener('input', u); u();
    });
  }

  document.querySelectorAll('[data-year]').forEach(function (s) { s.textContent = new Date().getFullYear(); });
  /* ---------- Header login button ---------- */
  function hdrLogin() {
    var b = $('hdr-login'); if (!b) return; var h = '';
    try { var sid = JSON.parse(localStorage.getItem('ar-session')), us = JSON.parse(localStorage.getItem('ar-users') || '[]'); var u = us.filter(function (x) { return x.id === sid; })[0]; if (u) h = u.handle; } catch (e) {}
    b.textContent = h ? '@' + h : 'Log in'; b.href = h ? 'reels.html#me' : 'reels.html#login';
  }
  var hb = $('hdr-login');
  if (hb) hb.addEventListener('click', function (e) { if (window.AuraReels) { e.preventDefault(); window.AuraReels.account(); } });
  window.AuraHeaderRefresh = hdrLogin; hdrLogin();

  window.AuraStore = { add: addToCart, products: PRODUCTS };
  renderCart();
})();
