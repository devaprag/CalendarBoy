// Service worker: lets Calendar Boy open offline (needed to install it as an app).
// Network first: online, every file is fetched fresh (revalidated past the HTTP cache), so a new
// release shows up straight away. The cache is only the offline fallback.
// Firestore and sign-in traffic is never touched; only this site's files and the Firebase SDK scripts.
const CACHE = 'calendar-boy';
const FIREBASE_SDK = 'https://www.gstatic.com/firebasejs/';

// Cache the page and every file it links to, so the first offline open works even if the
// page that registered this worker loaded its files before the worker was running.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const page = await fetch('./', { cache: 'no-cache' });
    const html = await page.clone().text();
    await cache.put('./', page);
    const urls = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m => m[1])
      .filter(u => !/^(https?:|data:|mailto:)/.test(u));
    await Promise.all(urls.map(u => fetch(u, { cache: 'no-cache' })
      .then(res => res.ok && cache.put(u, res)).catch(() => {})));
  })());
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) if (name !== CACHE) await caches.delete(name);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const ours = new URL(req.url).origin === self.location.origin;
  if (!ours && !req.url.startsWith(FIREBASE_SDK)) return;
  event.respondWith((async () => {
    try {
      // A navigation request can't be copied with new options, so rebuild it from its URL.
      const fresh = req.mode === 'navigate' ? new Request(req.url, { cache: 'no-cache' })
        : ours ? new Request(req, { cache: 'no-cache' }) : req;
      const res = await fetch(fresh);
      // The SDK scripts load without CORS, so their responses are opaque (status 0) but usable.
      if (res.ok || res.type === 'opaque') (await caches.open(CACHE)).put(req, res.clone());
      return res;
    } catch (err) {
      const hit = await caches.match(req) || (req.mode === 'navigate' && await caches.match('./'));
      if (hit) return hit;
      throw err;
    }
  })());
});
