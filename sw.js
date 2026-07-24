const CACHE = 'content-forge-v3';
const ROOT = new URL('./', self.location).href;
const SHELL = [ROOT, ROOT + 'manifest.json', ROOT + 'icon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const root = new URL('./', self.location);
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(root.href)));
  } else if (url.origin === root.origin && url.pathname.startsWith(root.pathname)) {
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
  }
});
