const C='mmb-1',A=['./','index.html','about.html','statistics.html','settings.html','assets/css/app.css','assets/js/data.js','assets/js/geo.js','assets/js/creator.js','assets/js/app.js','assets/js/map.js','assets/js/stats.js','assets/svg/favicon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A))));
self.addEventListener('fetch',e=>{if(e.request.method!='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(x=>{const y=x.clone();caches.open(C).then(c=>c.put(e.request,y));return x}).catch(()=>r)))});
