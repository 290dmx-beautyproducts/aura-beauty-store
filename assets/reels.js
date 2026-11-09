window.AuraReelsMount = function () {
  'use strict';
  var __off = [];
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function load(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function store(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { toast('Storage is full on this device'); } }
  function compact(n) { n = Number(n) || 0; if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.0', '') + 'M'; if (n >= 1e3) return (n / 1e3).toFixed(1).replace('.0', '') + 'K'; return String(n); }
  function ago(t) { var s = Math.floor((Date.now() - t) / 1000); if (s < 60) return 'now'; var m = Math.floor(s / 60); if (m < 60) return m + 'm'; var h = Math.floor(m / 60); if (h < 24) return h + 'h'; var d = Math.floor(h / 24); if (d < 7) return d + 'd'; return Math.floor(d / 7) + 'w'; }
  var tt;
  function toast(m) { var t = document.getElementById('toast'); if (!t) return; t.textContent = m; t.style.opacity = '1'; clearTimeout(tt); tt = setTimeout(function () { t.style.opacity = '0'; }, 2000); }

  /* ---------- Icons ---------- */
  var I = {
    heart: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.600 3 5 6.500 5c2 0 3.500 1.100 5.500 3 2-1.900 3.500-3 5.500-3C21 5 22.800 8.600 21.500 11.800 19.500 16.400 12 21 12 21z"/></svg>',
    heartF: '<svg viewBox="0 0 24 24" width="28" height="28" fill="#ff3040" stroke="#ff3040" stroke-width="2" stroke-linejoin="round"><path d="M12 21s-7.5-4.6-9.5-9.2C1.2 8.600 3 5 6.500 5c2 0 3.500 1.100 5.500 3 2-1.900 3.500-3 5.500-3C21 5 22.800 8.600 21.500 11.800 19.500 16.400 12 21 12 21z"/></svg>',
    comment: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 11.500a8.500 8.500 0 0 1-12.300 7.600L3 21l1.900-5.600A8.500 8.500 0 1 1 21 11.500z"/></svg>',
    share: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M22 3 9.500 10.500M22 3l-7 18-5.500-10.500L22 3zM9.500 10.500 2 8l20-5"/></svg>',
    save: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.500L6 21z"/></svg>',
    saveF: '<svg viewBox="0 0 24 24" width="26" height="26" fill="#fff" stroke="#fff" stroke-width="2" stroke-linejoin="round"><path d="M6 3h12v18l-6-4.500L6 21z"/></svg>',
    more: '<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><circle cx="5" cy="12" r="1.800"/><circle cx="12" cy="12" r="1.800"/><circle cx="19" cy="12" r="1.800"/></svg>',
    mute: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6M16 9l6 6"/></svg>',
    sound: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.500 8.500a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>',
    auto: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 5 6 5 6-5M6 13l6 5 6-5"/></svg>',
    plus: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5"/><path d="M12 8v8M8 12h8"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="64" height="64" fill="#fff"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" width="64" height="64" fill="#fff"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
    music: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    bag: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>'
  };

  /* ---------- Storage layer ---------- */
  var users = load('ar-users', []), posts = load('ar-posts', []), follows = load('ar-follows', {}), hidden = load('ar-hidden', []);
  var session = load('ar-session', null);
  function saveAll() { store('ar-users', users); store('ar-posts', posts); store('ar-follows', follows); store('ar-hidden', hidden); store('ar-session', session); }
  function uid(p) { return p + Math.random().toString(36).slice(2, 9); }
  function userById(id) { return users.filter(function (u) { return u.id === id; })[0]; }
  function me() { return session ? userById(session) : null; }
  function postById(id) { return posts.filter(function (p) { return p.id === id; })[0]; }

  var DB;
  function idb() {
    return new Promise(function (res, rej) {
      if (DB) return res(DB);
      var r = indexedDB.open('aura-reels', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('videos'); };
      r.onsuccess = function () { DB = r.result; res(DB); };
      r.onerror = function () { rej(r.error); };
    });
  }
  function putBlob(id, blob) { return idb().then(function (db) { return new Promise(function (res, rej) { var t = db.transaction('videos', 'readwrite'); t.objectStore('videos').put(blob, id); t.oncomplete = res; t.onerror = function () { rej(t.error); }; }); }); }
  function getBlob(id) { return idb().then(function (db) { return new Promise(function (res) { var q = db.transaction('videos').objectStore('videos').get(id); q.onsuccess = function () { res(q.result); }; q.onerror = function () { res(null); }; }); }); }
  function delBlob(id) { return idb().then(function (db) { db.transaction('videos', 'readwrite').objectStore('videos').delete(id); }).catch(function () {}); }
  var urlCache = {};
  function blobUrl(id) { if (urlCache[id]) return Promise.resolve(urlCache[id]); return getBlob(id).then(function (b) { if (!b) return null; urlCache[id] = URL.createObjectURL(b); return urlCache[id]; }); }

  function hashPw(pw) {
    if (window.crypto && crypto.subtle) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode('aura:' + pw)).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); });
    }
    return Promise.resolve('p:' + pw);
  }

  /* ---------- Seed demo content ---------- */
  var DEMO_USERS = [
    { id: 'u_aura', name: 'Aura Beauty Products', handle: 'aura_official', bio: 'Skincare and wigs, delivered across Kenya.', color: '#4A1942', demo: true, followers: 12400 },
    { id: 'u_amina', name: 'Amina Wanjiru', handle: 'amina.glows', bio: 'Fading dark spots, one serum at a time.', color: '#B76E79', demo: true, followers: 3820 },
    { id: 'u_zawadi', name: 'Zawadi Achieng', handle: 'zawadi.wigs', bio: 'Wig installs and styling tips.', color: '#7b3a6e', demo: true, followers: 8150 },
    { id: 'u_nyali', name: 'Nyali Skin Diary', handle: 'nyali.skin', bio: 'Real skin. Real routines. Mombasa.', color: '#1E7B5F', demo: true, followers: 2290 },
    { id: 'u_locs', name: 'Mombasa Locs', handle: 'mombasa.locs', bio: 'Loc care and healthy hair.', color: '#C9A24B', demo: true, followers: 5430 }
  ];
  var DEMO_POSTS = [
    { id: 'd1', userId: 'u_aura', caption: 'Our 3-step glow routine for clearer skin #skincare #glowingskin #auraglow', audio: 'Original audio', theme: ['#4A1942', '#B76E79', '#F2C9CF'], title: '3-Step Glow Routine', lines: ['1. Cleanse gently', '2. Niacinamide serum', '3. Moisturise + SPF'], product: 's1', seed: { likes: 1243, comments: 2, views: 48200 }, age: 2 },
    { id: 'd2', userId: 'u_zawadi', caption: 'Bob lace front, fully styled in under a minute #wigs #thecrown #boblife', audio: 'Soft Girl Era - Zawadi', theme: ['#241320', '#8a4b5e', '#E9D3DA'], title: 'Bob Lace Front', lines: ['Part and flatten', 'Secure the band', 'Style and go'], product: 'w1', seed: { likes: 3980, comments: 3, views: 91000 }, age: 5 },
    { id: 'd3', userId: 'u_amina', caption: 'Dark spots update: week 8. Patience and sunscreen win #darkspots #beforeandafter', audio: 'Original audio', theme: ['#7a4d36', '#E8B77A', '#FCE7C8'], title: 'Week 8 Update', lines: ['Week 1: uneven tone', 'Week 4: marks fading', 'Week 8: glowing'], product: 's2', seed: { likes: 2105, comments: 2, views: 36700 }, age: 9 },
    { id: 'd4', userId: 'u_nyali', caption: 'Tiny habits that cleared my breakouts #acne #skincare #clearskin', audio: 'Calm Morning - Nyali', theme: ['#14523f', '#8CC7B2', '#D8EDE6'], title: 'Clear Skin Habits', lines: ['Wash after the gym', 'Clean pillowcases', 'Hands off your face'], product: 's4', seed: { likes: 987, comments: 1, views: 12900 }, age: 14 },
    { id: 'd5', userId: 'u_locs', caption: 'Sunday loc reset. Oil, retwist, done #locs #hairoil #haircare', audio: 'Original audio', theme: ['#5b3a12', '#C9A24B', '#FBF5F0'], title: 'Loc Sunday Reset', lines: ['Cleanse the scalp', 'Light oil massage', 'Retwist and wrap'], seed: { likes: 1670, comments: 1, views: 22800 }, age: 20 }
  ];
  var DEMO_COMMENTS = {
    d1: [{ u: 'u_amina', t: 'Obsessed with step 2! My skin loves it', ago: 3 }, { u: 'u_nyali', t: 'Saving this routine', ago: 6 }],
    d2: [{ u: 'u_aura', t: 'So clean! Love this install', ago: 4 }, { u: 'u_locs', t: 'That bob is everything', ago: 8 }, { u: 'u_amina', t: 'Where can I get this one?', ago: 12 }],
    d3: [{ u: 'u_zawadi', t: 'Look at that glow!', ago: 5 }, { u: 'u_aura', t: 'Thank you for sharing your journey', ago: 7 }],
    d4: [{ u: 'u_aura', t: 'Great tips, all true', ago: 10 }],
    d5: [{ u: 'u_nyali', t: 'Healthy hair goals', ago: 9 }]
  };
  function seedDemo() {
    var added = false;
    DEMO_USERS.forEach(function (u) { if (!userById(u.id)) { users.push(u); added = true; } });
    DEMO_POSTS.forEach(function (d) {
      if (!postById(d.id)) {
        posts.push({ id: d.id, userId: d.userId, kind: 'demo', caption: d.caption, audio: d.audio, theme: d.theme, title: d.title, lines: d.lines, product: d.product || '', createdAt: Date.now() - d.age * 3600e3, likes: [], saves: [], seed: d.seed,
          comments: (DEMO_COMMENTS[d.id] || []).map(function (c, i) { return { id: d.id + 'c' + i, userId: c.u, text: c.t, at: Date.now() - c.ago * 3600e3, likes: [], seedLikes: 3 + i * 2 }; }) });
        added = true;
      }
    });
    if (added) saveAll();
  }
  seedDemo();

  /* ---------- State ---------- */
  var tab = 'foryou', tagFilter = '', muted = true, activeId = null, auto = !!load('ar-auto', false), demoTimer = null;
  var feed = $('#feed');
  var seenViews = {};

  function visiblePosts() {
    var list = posts.filter(function (p) { return hidden.indexOf(p.id) < 0; });
    if (tab === 'following') { var f = me() ? (follows[me().id] || []) : []; list = list.filter(function (p) { return f.indexOf(p.userId) >= 0; }); }
    if (tagFilter) list = list.filter(function (p) { return (p.caption || '').toLowerCase().indexOf(tagFilter.toLowerCase()) >= 0; });
    return list.sort(function (a, b) { return b.createdAt - a.createdAt; });
  }
  function likeCount(p) { return (p.seed ? p.seed.likes : 0) + p.likes.length; }
  function commentCount(p) { return p.comments.length + (p.seed ? Math.max(0, p.seed.comments - p.comments.length) * 0 : 0); }
  function isFollowing(userId) { var m = me(); return m && (follows[m.id] || []).indexOf(userId) >= 0; }
  function avatar(u, size) {
    var s = size || 40; var c = u && u.color ? u.color : '#B76E79';
    return '<span class="inline-flex items-center justify-center rounded-full text-white font-semibold shrink-0" style="width:' + s + 'px;height:' + s + 'px;background:' + c + ';font-size:' + Math.round(s * 0.42) + 'px">' + esc(((u && (u.handle || u.name)) || '?').charAt(0).toUpperCase()) + '</span>';
  }
  function linkTags(text) {
    return esc(text).replace(/#([A-Za-z0-9_]+)/g, '<a href="#" data-tag="$1" class="font-semibold">#$1</a>').replace(/@([A-Za-z0-9_.]+)/g, '<a href="#" data-handle="$1" class="font-semibold">@$1</a>');
  }

  /* ---------- Feed rendering ---------- */
  function reelHtml(p) {
    var u = userById(p.userId) || { handle: 'unknown', color: '#999' };
    var mine = me() && me().id === p.userId;
    var liked = me() && p.likes.indexOf(me().id) >= 0, saved = me() && p.saves.indexOf(me().id) >= 0;
    var media;
    if (p.kind === 'demo') {
      media = '<div class="demo absolute inset-0" style="background:linear-gradient(160deg,' + p.theme[0] + ',' + p.theme[1] + ',' + p.theme[2] + ');background-size:300% 300%">' +
        '<div class="absolute inset-0 flex flex-col items-center justify-center text-center px-8 text-white">' +
        '<p class="uppercase tracking-[.3em] text-[10px] opacity-80 mb-3">Sample reel</p><h3 class="font-serif text-4xl font-bold leading-tight drop-shadow">' + esc(p.title) + '</h3>' +
        '<div class="mt-6 space-y-3 text-lg font-medium">' + p.lines.map(function (l, i) { return '<p class="demo-line" style="animation-delay:' + (1 + i * 2) + 's">' + esc(l) + '</p>'; }).join('') + '</div></div></div>';
    } else {
      media = '<video class="absolute inset-0 w-full h-full object-cover bg-black" loop playsinline preload="metadata" ' + (muted ? 'muted' : '') + '></video>';
    }
    var prod = p.product && window.AuraStore ? window.AuraStore.products.filter(function (x) { return x.id === p.product; })[0] : null;
    return '<div class="reel" data-id="' + p.id + '"><div class="reel-box">' + media +
      '<div class="absolute inset-0 pointer-events-none" style="background:linear-gradient(to top,rgba(0,0,0,.65) 0%,rgba(0,0,0,0) 38%,rgba(0,0,0,0) 80%,rgba(0,0,0,.35) 100%)"></div>' +
      '<div class="tap-icon absolute inset-0 flex items-center justify-center pointer-events-none"></div>' +
      '<div class="burst absolute pointer-events-none"></div>' +
      '<div class="rail absolute right-2 bottom-24 flex flex-col items-center gap-5 text-white">' +
        '<button data-act="like" class="flex flex-col items-center gap-1" aria-label="Like"><span class="ic">' + (liked ? I.heartF : I.heart) + '</span><span class="text-xs font-semibold lc">' + compact(likeCount(p)) + '</span></button>' +
        '<button data-act="comment" class="flex flex-col items-center gap-1" aria-label="Comments">' + I.comment + '<span class="text-xs font-semibold cc">' + compact(p.comments.length) + '</span></button>' +
        '<button data-act="share" class="flex flex-col items-center gap-1" aria-label="Share">' + I.share + '<span class="text-xs font-semibold">' + compact((p.seed ? Math.floor(p.seed.likes / 9) : 0) + (p.shares || 0)) + '</span></button>' +
        '<button data-act="save" class="flex flex-col items-center gap-1" aria-label="Save"><span class="ic">' + (saved ? I.saveF : I.save) + '</span></button>' +
        '<button data-act="more" aria-label="More">' + I.more + '</button>' +
        '<span data-act="audio" class="w-8 h-8 rounded-lg border-2 border-white overflow-hidden flex items-center justify-center" style="background:' + (u.color || '#B76E79') + '">' + I.music + '</span>' +
      '</div>' +
      '<div class="absolute left-3 right-16 bottom-6 text-white">' +
        '<div class="flex items-center gap-2 mb-2"><button data-act="profile" class="flex items-center gap-2">' + avatar(u, 34) + '<span class="font-semibold text-sm">' + esc(u.handle) + '</span></button>' +
        (mine ? '' : '<button data-act="follow" class="fol border border-white/80 rounded-lg px-3 py-1 text-xs font-semibold">' + (isFollowing(p.userId) ? 'Following' : 'Follow') + '</button>') + '</div>' +
        '<p class="cap text-sm leading-snug clamp1">' + linkTags(p.caption || '') + '</p>' +
        (p.caption && p.caption.length > 48 ? '<button data-act="more-cap" class="text-xs text-white/70">more</button>' : '') +
        '<div class="flex items-center gap-1.5 mt-2 text-xs overflow-hidden"><span class="shrink-0">' + I.music + '</span><span class="marquee"><span>' + esc(p.audio || 'Original audio') + ' &middot; ' + esc(u.handle) + '</span></span></div>' +
        (prod ? '<button data-act="shop" data-pid="' + prod.id + '" class="mt-2 inline-flex items-center gap-1.5 bg-white/20 backdrop-blur rounded-lg px-2.5 py-1.5 text-xs font-semibold">' + I.bag + esc(prod.name) + ' &middot; KSh ' + prod.price.toLocaleString('en-KE') + '</button>' : '') +
      '</div>' +
      '<div class="pbar absolute left-0 right-0 bottom-0 h-1 bg-white/30 cursor-pointer" data-act="seek"><div class="pfill h-full bg-white" style="width:0%"></div></div>' +
    '</div></div>';
  }

  function renderFeed(keepId) {
    var list = visiblePosts();
    var chip = tagFilter ? '<div class="absolute top-14 left-0 right-0 z-20 flex justify-center pointer-events-none"><button id="clear-tag" class="pointer-events-auto bg-white/90 text-plum rounded-full px-3 py-1 text-xs font-semibold">#' + esc(tagFilter) + ' &times;</button></div>' : '';
    var old = $('#tagchip'); if (old) old.remove();
    $('#reels-root').insertAdjacentHTML('beforeend', '<div id="tagchip">' + chip + '</div>');
    if (!list.length) {
      var msg = tab === 'following' ? (me() ? 'Follow creators to see their reels here.' : 'Log in and follow creators to see their reels here.') : 'No reels found.';
      feed.innerHTML = '<div class="reel"><div class="reel-box flex flex-col items-center justify-center text-center text-white px-8 bg-neutral-900"><p class="font-serif text-3xl mb-2">Nothing here yet</p><p class="text-sm text-white/70">' + msg + '</p>' +
        (tab === 'following' && !me() ? '<button data-act="login" class="mt-5 bg-white text-plum font-semibold px-5 py-2 rounded-full text-sm">Log in</button>' : '') + '</div></div>';
      return;
    }
    feed.innerHTML = list.map(reelHtml).join('');
    $$('.reel', feed).forEach(function (r) {
      var p = postById(r.getAttribute('data-id'));
      if (p && p.kind === 'video') { var v = $('video', r); blobUrl(p.id).then(function (url) { if (url) { v.src = url; v.muted = muted; if (activeId === p.id) v.play().catch(function () {}); } }); }
      io.observe(r);
    });
    if (keepId) { var t = $('.reel[data-id="' + keepId + '"]', feed); if (t) feed.scrollTop = t.offsetTop; }
    else feed.scrollTop = 0;
  }

  /* ---------- Active reel handling ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var r = e.target, id = r.getAttribute('data-id');
      if (e.isIntersecting && e.intersectionRatio > 0.65) { activate(r, id); }
      else { deactivate(r); }
    });
  }, { root: feed, threshold: [0, 0.65, 0.9] });

  function activate(r, id) {
    activeId = id; r.classList.add('active');
    var v = $('video', r); if (v) { v.muted = muted; v.loop = !auto; v.play().catch(function () {}); }
    var d = $('.demo', r); if (d) { d.classList.remove('paused'); d.classList.add('run'); }
    clearTimeout(demoTimer); if (d) demoTimer = setTimeout(function () { if (auto && activeId === id) nextReel(r); }, 8200);
    if (!seenViews[id]) { seenViews[id] = 1; var p = postById(id); if (p) { p.views = (p.views || 0) + 1; } }
  }
  function deactivate(r) {
    r.classList.remove('active'); clearTimeout(demoTimer);
    var v = $('video', r); if (v) { v.pause(); try { v.currentTime = 0; } catch (e) {} }
    var d = $('.demo', r); if (d) { d.classList.remove('run'); }
    var f = $('.pfill', r); if (f) f.style.width = '0%';
  }
  feed.addEventListener('timeupdate', function (e) {
    var v = e.target; if (v.tagName !== 'VIDEO' || !v.duration) return;
    var f = $('.pfill', v.closest('.reel')); if (f) f.style.width = (v.currentTime / v.duration * 100) + '%';
  }, true);

  function nextReel(r) { var n = r.nextElementSibling; if (n && n.classList.contains('reel')) n.scrollIntoView({ behavior: 'smooth' }); else feed.scrollTo({ top: 0, behavior: 'smooth' }); }
  feed.addEventListener('ended', function (e) { if (auto && e.target.tagName === 'VIDEO') nextReel(e.target.closest('.reel')); }, true);

  /* ---------- Gestures: tap to pause, double-tap to like ---------- */
  var lastTap = 0, lastTimer = null;
  feed.addEventListener('click', function (e) {
    var actEl = e.target.closest('[data-act],[data-tag],[data-handle]');
    var reel = e.target.closest('.reel'); if (!reel) return;
    if (e.target.closest('[data-tag]')) { e.preventDefault(); tagFilter = e.target.closest('[data-tag]').getAttribute('data-tag'); renderFeed(); return; }
    if (e.target.closest('[data-handle]')) { e.preventDefault(); var u = users.filter(function (x) { return x.handle === e.target.closest('[data-handle]').getAttribute('data-handle'); })[0]; if (u) openProfile(u.id); return; }
    if (actEl) { handleAction(actEl, reel, e); return; }
    var box = e.target.closest('.reel-box'); if (!box) return;
    var now = Date.now();
    if (now - lastTap < 300) { clearTimeout(lastTimer); lastTap = 0; doubleTapLike(reel, e); }
    else { lastTap = now; lastTimer = setTimeout(function () { togglePlay(reel); }, 260); }
  });
  function togglePlay(reel) {
    var v = $('video', reel), d = $('.demo', reel), ic = $('.tap-icon', reel), paused;
    if (v) { if (v.paused) { v.play().catch(function () {}); paused = false; } else { v.pause(); paused = true; } }
    else if (d) { paused = !d.classList.contains('paused'); d.classList.toggle('paused', paused); }
    ic.innerHTML = '<span class="pop">' + (paused ? I.pause : I.play) + '</span>';
    setTimeout(function () { ic.innerHTML = ''; }, 600);
  }
  function doubleTapLike(reel, e) {
    var id = reel.getAttribute('data-id'), p = postById(id);
    if (!me()) { openAuth('Log in to like reels'); return; }
    if (p.likes.indexOf(me().id) < 0) toggleLike(id);
    var box = $('.reel-box', reel), b = $('.burst', reel), rect = box.getBoundingClientRect();
    b.style.left = (e.clientX - rect.left - 50) + 'px'; b.style.top = (e.clientY - rect.top - 50) + 'px';
    b.innerHTML = '<span class="big-heart">' + I.heartF.replace(/width="28" height="28"/, 'width="100" height="100"') + '</span>';
    setTimeout(function () { b.innerHTML = ''; }, 800);
  }

  /* ---------- Actions ---------- */
  function handleAction(el, reel, e) {
    var act = el.getAttribute('data-act'), id = reel ? reel.getAttribute('data-id') : null;
    if (act === 'like') return needLogin('Log in to like reels', function () { toggleLike(id); });
    if (act === 'comment') return openComments(id);
    if (act === 'share') return openShare(id);
    if (act === 'save') return needLogin('Log in to save reels', function () { toggleSave(id); });
    if (act === 'more') return openMore(id);
    if (act === 'follow') return needLogin('Log in to follow creators', function () { toggleFollow(postById(id).userId); });
    if (act === 'profile') return openProfile(postById(id).userId);
    if (act === 'more-cap') { var c = $('.cap', reel); c.classList.toggle('clamp1'); el.textContent = c.classList.contains('clamp1') ? 'more' : 'less'; return; }
    if (act === 'audio') return toast('Original audio by ' + (userById(postById(id).userId) || {}).handle);
    if (act === 'login') return openAuth();
    if (act === 'shop') { if (window.AuraStore) { window.AuraStore.add(el.getAttribute('data-pid')); } return; }
    if (act === 'seek') { var v = $('video', reel); if (v && v.duration) { var r = el.getBoundingClientRect(); v.currentTime = ((e.clientX - r.left) / r.width) * v.duration; } return; }
  }
  function needLogin(msg, fn) { if (!me()) { openAuth(msg); return; } fn(); }
  function refresh(id) {
    var p = postById(id), r = $('.reel[data-id="' + id + '"]', feed); if (!p || !r) return;
    var liked = me() && p.likes.indexOf(me().id) >= 0, saved = me() && p.saves.indexOf(me().id) >= 0;
    $('[data-act="like"] .ic', r).innerHTML = liked ? I.heartF : I.heart; $('.lc', r).textContent = compact(likeCount(p));
    $('[data-act="save"] .ic', r).innerHTML = saved ? I.saveF : I.save; $('.cc', r).textContent = compact(p.comments.length);
    var fol = $('.fol', r); if (fol) fol.textContent = isFollowing(p.userId) ? 'Following' : 'Follow';
  }
  function toggleLike(id) { var p = postById(id), m = me(), i = p.likes.indexOf(m.id); if (i < 0) p.likes.push(m.id); else p.likes.splice(i, 1); saveAll(); refresh(id); }
  function toggleSave(id) { var p = postById(id), m = me(), i = p.saves.indexOf(m.id); if (i < 0) { p.saves.push(m.id); toast('Saved to your collection'); } else p.saves.splice(i, 1); saveAll(); refresh(id); }
  function toggleFollow(userId) {
    var m = me(); follows[m.id] = follows[m.id] || []; var i = follows[m.id].indexOf(userId);
    if (i < 0) { follows[m.id].push(userId); toast('Following @' + userById(userId).handle); } else follows[m.id].splice(i, 1);
    saveAll(); $$('.reel', feed).forEach(function (r) { refresh(r.getAttribute('data-id')); });
    var pf = $('#profile-follow'); if (pf) pf.textContent = isFollowing(userId) ? 'Following' : 'Follow';
  }

  /* ---------- Sheets ---------- */
  function sheet(html, cls) {
    closeSheet();
    var w = document.createElement('div'); w.id = 'sheet-root'; w.className = 'fixed inset-0 z-[55] flex items-end justify-center';
    w.innerHTML = '<div class="absolute inset-0 bg-black/60" data-close></div><div class="sheet relative bg-white text-neutral-900 rounded-t-2xl w-full ' + (cls || '') + '" style="max-width:var(--rw)">' + html + '</div>';
    w.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeSheet(); });
    document.body.appendChild(w); return w;
  }
  function closeSheet() { var s = $('#sheet-root'); if (s) s.remove(); }

  /* Comments */
  function openComments(id) {
    var w = sheet('<div class="flex flex-col" style="height:68vh"><div class="text-center font-semibold py-3 border-b relative">Comments<button data-close class="absolute right-4 top-2 text-2xl leading-none">&times;</button></div><div id="cmt-list" class="flex-1 overflow-y-auto px-4 py-3 space-y-4"></div>' +
      '<div class="border-t p-3 flex items-center gap-2" id="cmt-bar"></div></div>');
    function draw() {
      var p = postById(id), m = me();
      $('#cmt-list', w).innerHTML = p.comments.length ? p.comments.slice().sort(function (a, b) { return (b.likes.length + (b.seedLikes || 0)) - (a.likes.length + (a.seedLikes || 0)) || b.at - a.at; }).map(function (c) {
        var u = userById(c.userId) || { handle: 'user', color: '#999' }, liked = m && c.likes.indexOf(m.id) >= 0, n = c.likes.length + (c.seedLikes || 0);
        return '<div class="flex gap-3" data-cid="' + c.id + '">' + avatar(u, 34) + '<div class="flex-1 min-w-0 text-sm"><p><b>' + esc(u.handle) + '</b> <span class="text-neutral-400 text-xs">' + ago(c.at) + '</span></p><p class="break-words">' + linkTags(c.text) + '</p>' +
          '<div class="text-xs text-neutral-500 mt-1 flex gap-4"><button data-reply="' + esc(u.handle) + '">Reply</button>' + (m && c.userId === m.id ? '<button data-delc="' + c.id + '" class="text-red-500">Delete</button>' : '') + '</div></div>' +
          '<button data-clike="' + c.id + '" class="flex flex-col items-center text-xs text-neutral-500"><span style="color:' + (liked ? '#ff3040' : '#999') + '">' + (liked ? '&#10084;' : '&#9825;') + '</span>' + (n ? n : '') + '</button></div>';
      }).join('') : '<p class="text-center text-neutral-500 py-10 text-sm">No comments yet. Start the conversation.</p>';
      $('#cmt-bar', w).innerHTML = m ? avatar(m, 32) + '<input id="cmt-in" maxlength="500" placeholder="Add a comment..." class="flex-1 text-sm border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-rose"><button id="cmt-post" class="text-sm font-semibold text-rose px-2">Post</button>' :
        '<button data-login class="flex-1 text-sm bg-plum text-white rounded-full py-2 font-semibold">Log in to comment</button>';
    }
    draw();
    w.addEventListener('click', function (e) {
      var p = postById(id), m = me();
      if (e.target.closest('[data-login]')) { closeSheet(); openAuth('Log in to comment'); return; }
      var rp = e.target.closest('[data-reply]'); if (rp) { var inp = $('#cmt-in', w); if (inp) { inp.value = '@' + rp.getAttribute('data-reply') + ' '; inp.focus(); } else { closeSheet(); openAuth('Log in to reply'); } return; }
      var cl = e.target.closest('[data-clike]'); if (cl) { if (!m) { closeSheet(); openAuth('Log in to like comments'); return; } var c = p.comments.filter(function (x) { return x.id === cl.getAttribute('data-clike'); })[0], i = c.likes.indexOf(m.id); if (i < 0) c.likes.push(m.id); else c.likes.splice(i, 1); saveAll(); draw(); return; }
      var dc = e.target.closest('[data-delc]'); if (dc) { p.comments = p.comments.filter(function (x) { return x.id !== dc.getAttribute('data-delc'); }); saveAll(); draw(); refresh(id); return; }
      if (e.target.closest('#cmt-post')) post();
    });
    w.addEventListener('keydown', function (e) { if (e.key === 'Enter' && e.target.id === 'cmt-in') post(); });
    function post() {
      var inp = $('#cmt-in', w), t = inp.value.trim(); if (!t) return;
      postById(id).comments.push({ id: uid('c'), userId: me().id, text: t, at: Date.now(), likes: [] }); saveAll(); draw(); refresh(id);
      var l = $('#cmt-list', w); l.scrollTop = 0;
    }
  }

  /* Share */
  function reelLink(id) { return location.origin + location.pathname + '#reel=' + id; }
  function openShare(id) {
    var link = reelLink(id), p = postById(id);
    var w = sheet('<div class="p-5"><div class="text-center font-semibold mb-4">Share</div><div class="grid grid-cols-4 gap-3 text-center text-xs">' +
      '<button data-s="copy" class="flex flex-col items-center gap-2"><span class="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-lg">&#128279;</span>Copy link</button>' +
      '<button data-s="wa" class="flex flex-col items-center gap-2"><span class="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center text-lg">W</span>WhatsApp</button>' +
      '<button data-s="fb" class="flex flex-col items-center gap-2"><span class="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-lg font-bold">f</span>Facebook</button>' +
      '<button data-s="x" class="flex flex-col items-center gap-2"><span class="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-lg font-bold">X</span>Post</button>' +
      '<button data-s="sms" class="flex flex-col items-center gap-2"><span class="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-lg">&#9993;</span>Message</button>' +
      '<button data-s="native" class="flex flex-col items-center gap-2"><span class="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-lg">&#8943;</span>More</button></div>' +
      '<button data-close class="w-full mt-5 py-3 text-sm font-semibold border-t">Cancel</button></div>');
    w.addEventListener('click', function (e) {
      var b = e.target.closest('[data-s]'); if (!b) return; var k = b.getAttribute('data-s'), txt = 'Watch this reel on Aura Reels: ' + link;
      p.shares = (p.shares || 0) + 1; saveAll();
      if (k === 'copy') { (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () { toast('Link copied'); }, function () { toast(link); }); }
      else if (k === 'wa') window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank', 'noopener');
      else if (k === 'fb') window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(link), '_blank', 'noopener');
      else if (k === 'x') window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(txt), '_blank', 'noopener');
      else if (k === 'sms') location.href = 'sms:?&body=' + encodeURIComponent(txt);
      else if (navigator.share) navigator.share({ title: 'Aura Reels', text: 'Watch this reel', url: link }).catch(function () {});
      else toast('Sharing is not supported on this device');
      closeSheet();
    });
  }

  /* More menu */
  function openMore(id) {
    var p = postById(id), m = me(), mine = m && m.id === p.userId;
    var w = sheet('<div class="p-2 text-center text-sm">' +
      '<button data-m="report" class="w-full py-3.5 text-red-500 font-semibold border-b">Report</button>' +
      (mine ? '<button data-m="delete" class="w-full py-3.5 text-red-500 font-semibold border-b">Delete reel</button>' : '<button data-m="hide" class="w-full py-3.5 border-b">Not interested</button>') +
      '<button data-m="copy" class="w-full py-3.5 border-b">Copy link</button><button data-m="profile" class="w-full py-3.5 border-b">About this account</button><button data-close class="w-full py-3.5">Cancel</button></div>');
    w.addEventListener('click', function (e) {
      var b = e.target.closest('[data-m]'); if (!b) return; var k = b.getAttribute('data-m');
      if (k === 'report') { closeSheet(); sheet('<div class="p-5 text-sm"><p class="font-semibold text-center mb-3">Report</p><p class="text-neutral-500 mb-3">Why are you reporting this reel?</p>' + ['Spam or scam', 'Nudity or sexual content', 'Hate or harassment', 'False information', 'Unsafe product claims', 'Something else'].map(function (r) { return '<button data-rep class="w-full text-left py-3 border-b">' + r + '</button>'; }).join('') + '<button data-close class="w-full mt-3 py-2 font-semibold">Cancel</button></div>').addEventListener('click', function (ev) { if (ev.target.closest('[data-rep]')) { closeSheet(); toast('Thanks for letting us know. We will review this reel.'); } }); return; }
      if (k === 'delete') { if (confirm('Delete this reel? This cannot be undone.')) { posts = posts.filter(function (x) { return x.id !== id; }); delBlob(id); saveAll(); closeSheet(); renderFeed(); toast('Reel deleted'); } return; }
      if (k === 'hide') { hidden.push(id); saveAll(); closeSheet(); renderFeed(); toast('We will show fewer reels like this'); return; }
      if (k === 'copy') { closeSheet(); openShare(id); return; }
      if (k === 'profile') { closeSheet(); openProfile(p.userId); }
    });
  }

  /* ---------- Auth (shared with the whole site) ---------- */
  function openAuth(msg) { if (window.AuraAuth) window.AuraAuth.open(msg); }
  var onAuth = function () { users = load('ar-users', []); session = load('ar-session', null); seedDemo(); renderTopbar(); renderFeed(activeId); };
  window.addEventListener('aura-auth', onAuth); __off.push(function () { window.removeEventListener('aura-auth', onAuth); });

  /* ---------- Profile ---------- */
  function openProfile(userId) {
    var u = userById(userId); if (!u) return; var m = me(), mine = m && m.id === u.id;
    var list = posts.filter(function (p) { return p.userId === u.id; }).sort(function (a, b) { return b.createdAt - a.createdAt; });
    var followers = (u.followers || 0) + Object.keys(follows).filter(function (k) { return (follows[k] || []).indexOf(u.id) >= 0; }).length;
    var following = (follows[u.id] || []).length;
    var likes = list.reduce(function (s, p) { return s + likeCount(p); }, 0);
    var old = $('#profile-root'); if (old) old.remove();
    var w = document.createElement('div'); w.id = 'profile-root'; w.className = 'fixed inset-0 z-[54] bg-white text-neutral-900 overflow-y-auto';
    w.innerHTML = '<div class="max-w-xl mx-auto"><div class="sticky top-0 bg-white/95 backdrop-blur flex items-center justify-between px-4 h-14 border-b z-10"><button id="p-back" class="text-2xl px-2" aria-label="Back">&larr;</button><p class="font-semibold">' + esc(u.handle) + '</p><span class="w-8"></span></div>' +
      '<div class="p-5"><div class="flex items-center gap-5">' + avatar(u, 84) + '<div class="flex-1 grid grid-cols-3 text-center"><div><p class="font-bold text-lg">' + compact(list.length) + '</p><p class="text-xs text-neutral-500">reels</p></div><div><p class="font-bold text-lg">' + compact(followers) + '</p><p class="text-xs text-neutral-500">followers</p></div><div><p class="font-bold text-lg">' + compact(following) + '</p><p class="text-xs text-neutral-500">following</p></div></div></div>' +
      '<p class="font-semibold mt-3">' + esc(u.name) + '</p><p class="text-sm text-neutral-600">' + esc(u.bio || 'No bio yet.') + '</p><p class="text-xs text-neutral-400 mt-1">' + compact(likes) + ' likes in total</p>' +
      '<div class="flex gap-2 mt-4">' + (mine ? '<button id="p-edit" class="flex-1 bg-neutral-100 rounded-lg py-2 text-sm font-semibold">Edit profile</button><button id="p-logout" class="flex-1 bg-neutral-100 rounded-lg py-2 text-sm font-semibold">Log out</button>' :
        '<button id="profile-follow" class="flex-1 bg-plum text-white rounded-lg py-2 text-sm font-semibold">' + (isFollowing(u.id) ? 'Following' : 'Follow') + '</button>') + '</div></div>' +
      '<div class="grid grid-cols-3 gap-0.5 px-0.5 pb-10" id="p-grid">' + (list.length ? list.map(function (p) {
        var t = p.kind === 'demo' ? '<div class="absolute inset-0 flex items-center justify-center text-white text-center text-xs p-2 font-semibold" style="background:linear-gradient(160deg,' + p.theme[0] + ',' + p.theme[1] + ')">' + esc(p.title) + '</div>' : '<video data-thumb="' + p.id + '" class="absolute inset-0 w-full h-full object-cover bg-black" muted playsinline preload="metadata"></video>';
        return '<button data-open="' + p.id + '" class="relative block aspect-[9/16] bg-neutral-200">' + t + '<span class="absolute bottom-1 left-1 text-white text-xs font-semibold drop-shadow">&#9654; ' + compact((p.seed ? p.seed.views : 0) + (p.views || 0)) + '</span></button>';
      }).join('') : '<p class="col-span-3 text-center text-neutral-400 py-16 text-sm">' + (mine ? 'You have not posted any reels yet.' : 'No reels yet.') + '</p>') + '</div></div>';
    document.body.appendChild(w);
    $$('[data-thumb]', w).forEach(function (v) { blobUrl(v.getAttribute('data-thumb')).then(function (url) { if (url) v.src = url + '#t=0.1'; }); });
    w.addEventListener('click', function (e) {
      if (e.target.closest('#p-back')) { w.remove(); return; }
      var op = e.target.closest('[data-open]'); if (op) { w.remove(); tab = 'foryou'; tagFilter = ''; setTabs(); renderFeed(op.getAttribute('data-open')); return; }
      if (e.target.closest('#profile-follow')) { needLogin('Log in to follow creators', function () { toggleFollow(u.id); }); return; }
      if (e.target.closest('#p-logout')) { w.remove(); if (window.AuraAuth) window.AuraAuth.logout(); return; }
      if (e.target.closest('#p-edit')) { var nb = prompt('Write your bio (150 characters max):', u.bio || ''); if (nb !== null) { u.bio = nb.slice(0, 150); saveAll(); openProfile(u.id); } }
    });
  }

  /* ---------- Create reel ---------- */
  function openCreate() {
    if (!me()) { openAuth('Log in to post a reel'); return; }
    var file = null, dur = 0;
    var w = sheet('<div class="p-5 max-h-[92vh] overflow-y-auto" id="cr-box"></div>');
    function draw() {
      var prods = window.AuraStore ? window.AuraStore.products : [];
      $('#cr-box', w).innerHTML = '<div class="flex items-center justify-between mb-4"><button data-close class="text-sm text-neutral-500">Cancel</button><p class="font-semibold">New reel</p><button id="cr-share" class="text-sm font-semibold text-rose ' + (file ? '' : 'opacity-40') + '">Share</button></div>' +
        (file ? '<div class="flex gap-3"><div class="w-28 shrink-0 aspect-[9/16] bg-black rounded-lg overflow-hidden"><video id="cr-prev" class="w-full h-full object-cover" muted loop playsinline controls></video></div><div class="flex-1"><textarea id="cr-cap" maxlength="2200" rows="5" placeholder="Write a caption... use #hashtags" class="w-full border rounded-lg p-2 text-sm"></textarea><p class="text-right text-[11px] text-neutral-400"><span id="cr-count">0</span>/2200</p></div></div>' +
          '<label class="block text-xs font-semibold mt-3 mb-1">Audio name</label><input id="cr-audio" value="Original audio" maxlength="60" class="w-full border rounded-lg px-3 py-2 text-sm">' +
          '<label class="block text-xs font-semibold mt-3 mb-1">Tag a product (optional)</label><select id="cr-prod" class="w-full border rounded-lg px-3 py-2 text-sm bg-white"><option value="">No product</option>' + prods.map(function (p) { return '<option value="' + p.id + '">' + esc(p.name) + '</option>'; }).join('') + '</select>' +
          '<p class="text-[11px] text-neutral-400 mt-3">Length: ' + Math.round(dur) + 's. Reels can be up to 90 seconds. By posting you confirm you own this video and that it follows our community rules.</p>' :
          '<label class="block border-2 border-dashed border-rose/50 rounded-2xl py-14 text-center cursor-pointer hover:bg-blush"><span class="block text-4xl mb-2">&#127916;</span><span class="font-semibold text-plum">Select a video</span><span class="block text-xs text-neutral-500 mt-1">Vertical video works best. MP4 or MOV, up to 90 seconds.</span><input id="cr-file" type="file" accept="video/*" class="hidden"></label>');
      var f = $('#cr-file', w); if (f) f.addEventListener('change', pick);
      var cap = $('#cr-cap', w); if (cap) cap.addEventListener('input', function () { $('#cr-count', w).textContent = cap.value.length; });
      var pv = $('#cr-prev', w); if (pv && file) { pv.src = URL.createObjectURL(file); pv.play().catch(function () {}); }
    }
    function pick(e) {
      var f = e.target.files[0]; if (!f) return;
      if (f.type.indexOf('video') !== 0) return toast('Please choose a video file');
      if (f.size > 150 * 1024 * 1024) return toast('Video is too large. Maximum 150 MB.');
      var v = document.createElement('video'); v.preload = 'metadata'; v.onloadedmetadata = function () {
        if (v.duration > 90.5) return toast('Reels can be up to 90 seconds long');
        file = f; dur = v.duration || 0; URL.revokeObjectURL(v.src); draw();
      }; v.onerror = function () { toast('This video format is not supported by your browser'); }; v.src = URL.createObjectURL(f);
    }
    draw();
    w.addEventListener('click', function (e) {
      if (!e.target.closest('#cr-share') || !file) return;
      var id = uid('r_'), btn = e.target.closest('#cr-share'); btn.textContent = 'Posting...';
      putBlob(id, file).then(function () {
        posts.push({ id: id, userId: me().id, kind: 'video', caption: $('#cr-cap', w).value.trim(), audio: $('#cr-audio', w).value.trim() || 'Original audio', product: $('#cr-prod', w).value, createdAt: Date.now(), likes: [], saves: [], comments: [], views: 0 });
        saveAll(); closeSheet(); tab = 'foryou'; tagFilter = ''; setTabs(); renderFeed(); toast('Your reel is live!');
      }).catch(function () { toast('Could not save the video on this device'); btn.textContent = 'Share'; });
    });
  }

  /* ---------- Top bar ---------- */
  function setTabs() { $$('[data-tab]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === tab); }); }
  function renderTopbar() {
    $('#btn-mute').innerHTML = muted ? I.mute : I.sound; $('#btn-create').innerHTML = I.plus;
    var ab = $('#btn-auto'); ab.innerHTML = I.auto; ab.style.background = auto ? 'rgba(255,255,255,.3)' : 'transparent'; ab.setAttribute('aria-pressed', auto ? 'true' : 'false');
  }
  $('#topbar').addEventListener('click', function (e) {
    var t = e.target.closest('[data-tab]'); if (t) { tab = t.getAttribute('data-tab'); tagFilter = ''; setTabs(); renderFeed(); return; }
    if (e.target.closest('#btn-mute')) { muted = !muted; $$('video', feed).forEach(function (v) { v.muted = muted; }); renderTopbar(); toast(muted ? 'Sound off' : 'Sound on'); return; }
    if (e.target.closest('#btn-create')) { openCreate(); return; }
    if (e.target.closest('#btn-auto')) { auto = !auto; store('ar-auto', auto); renderTopbar(); var ar = $('.reel.active', feed), av = ar && $('video', ar); if (av) av.loop = !auto; if (ar && $('.demo', ar)) { clearTimeout(demoTimer); if (auto) demoTimer = setTimeout(function () { if (auto) nextReel(ar); }, 8200); } toast(auto ? 'Auto-scroll on' : 'Auto-scroll off'); return; }
  });
  $('#reels-root').addEventListener('click', function (e) { if (e.target.closest('#clear-tag')) { tagFilter = ''; renderFeed(); } });

  /* Keyboard */
  var onKey = function (e) {
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || $('#sheet-root') || $('#profile-root')) { if (e.key === 'Escape') { closeSheet(); } return; }
    var r = $('.reel.active', feed);
    if (e.key === 'ArrowDown' && r && r.nextElementSibling) { e.preventDefault(); r.nextElementSibling.scrollIntoView({ behavior: 'smooth' }); }
    else if (e.key === 'ArrowUp' && r && r.previousElementSibling) { e.preventDefault(); r.previousElementSibling.scrollIntoView({ behavior: 'smooth' }); }
    else if (e.key === ' ' && r) { e.preventDefault(); togglePlay(r); }
    else if (e.key.toLowerCase() === 'm') $('#btn-mute').click();
    else if (e.key.toLowerCase() === 'l' && r) { needLogin('Log in to like reels', function () { toggleLike(r.getAttribute('data-id')); }); }
  };
  document.addEventListener('keydown', onKey); __off.push(function () { document.removeEventListener('keydown', onKey); });

  /* ---------- Init ---------- */
  window.AuraReels = { account: function () { if (me()) openProfile(me().id); else openAuth(); } };
  setTabs(); renderTopbar();
  var m = location.hash.match(/reel=([\w]+)/);
  renderFeed(m && postById(m[1]) ? m[1] : null);
  if (location.hash === '#login' || location.hash === '#me') { window.AuraReels.account(); }
  var onUnload = function () { store('ar-posts', posts); };
  window.addEventListener('beforeunload', onUnload);
  __off.push(function () { window.removeEventListener('beforeunload', onUnload); store('ar-posts', posts); });
  return function destroy() {
    __off.forEach(function (f) { try { f(); } catch (e) {} });
    clearTimeout(demoTimer); try { io.disconnect(); } catch (e) {}
    closeSheet(); var pr = document.getElementById('profile-root'); if (pr) pr.remove();
    $$('video', feed).forEach(function (v) { try { v.pause(); } catch (e) {} });
  };
};
