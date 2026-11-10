const V='aura-1794308104';
const FONTS='aura-fonts';
const FONT_CSS='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&display=block';
const PRE=["./", "index.html", "glowing-skin.html", "the-crown.html", "gallery.html", "account.html", "contact.html", "reels.html", "about.html", "privacy.html", "terms.html", "community.html", "faq.html", "assets/tailwind.css?v=1794308104", "assets/style.css?v=1794308104", "assets/site.js?v=1794308104", "assets/reels.js?v=1794308104"];
self.addEventListener('install',e=>{e.waitUntil(Promise.all([
  caches.open(V).then(c=>c.addAll(PRE)),
  caches.open(FONTS).then(c=>fetch(FONT_CSS,{mode:'no-cors'}).then(r=>c.put(FONT_CSS,r))).catch(()=>{})
]).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==FONTS).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
    e.respondWith(caches.open(FONTS).then(async c=>{
      const hit=await c.match(r); if(hit) return hit;
      const res=await fetch(r); if(res&&(res.ok||res.type==='opaque')) c.put(r,res.clone()); return res;
    }));
    return;
  }
  if(u.origin!==location.origin) return;
  if(r.mode==='navigate'||r.destination==='document'){
    e.respondWith((async()=>{
      const c=await caches.open(V);
      try{
        const res=await Promise.race([fetch(r),new Promise((_,rej)=>setTimeout(()=>rej('t'),2500))]);
        if(res&&res.ok) c.put(r,res.clone());
        return res;
      }catch(err){ return (await c.match(r))||(await c.match(u.pathname))||Response.error(); }
    })());
    return;
  }
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(r);
    const net=fetch(r).then(res=>{ if(res&&res.ok) c.put(r,res.clone()); return res; }).catch(()=>hit);
    if(hit){ e.waitUntil(net); return hit; }
    return net;
  }));
});
