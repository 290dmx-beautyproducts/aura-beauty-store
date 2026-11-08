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
    var y = window.scrollY; hd.classList.toggle('scrolled', y > 8);
    if (y > lastY && y > 140) hd.classList.add('hide'); else hd.classList.remove('hide'); lastY = y;
  }, { passive: true });
  var fab = $('fab'), fb2 = $('fab-btn');
  if (fb2) {
    fb2.addEventListener('click', function (e) { e.stopPropagation(); var o = fab.classList.toggle('open'); fb2.setAttribute('aria-expanded', o ? 'true' : 'false'); });
    document.addEventListener('click', function (e) { if (!e.target.closest('#fab')) { fab.classList.remove('open'); fb2.setAttribute('aria-expanded', 'false'); } });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]'); if (!a || e.defaultPrevented || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(https?:|tel:|mailto:|sms:|javascript:)/.test(h)) return;
    e.preventDefault(); document.body.classList.add('leaving'); setTimeout(function () { location.href = h; }, 380);
  });
  window.addEventListener('pageshow', function () { document.body.classList.remove('leaving'); });

  window.AuraStore = { add: addToCart, products: PRODUCTS };
  renderCart();
})();
