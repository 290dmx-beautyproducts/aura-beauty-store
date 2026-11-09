const V='aura-1794156261';
const PRE=["./", "index.html", "glowing-skin.html", "the-crown.html", "gallery.html", "account.html", "contact.html", "reels.html", "about.html", "privacy.html", "terms.html", "community.html", "faq.html", "assets/tailwind.css?v=1794156261", "assets/style.css?v=1794156261", "assets/site.js?v=1794156261", "assets/reels.js?v=1794156261"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(PRE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url); if(u.origin!==location.origin) return;
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(r);
    const net=fetch(r).then(res=>{ if(res&&res.ok) c.put(r,res.clone()); return res; }).catch(()=>hit);
    if(hit){ e.waitUntil(net); return hit; }
    return net;
  }));
});
