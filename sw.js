/* ── Credi Yupi — Service Worker ──────────────────────────── */
const CACHE_NAME = 'crediyupi-v1';
const ASSETS = [
  './modulo-cuotas.html',
  './manifest.json',
  './icon.svg'
];

/* Instalar: precachear recursos principales */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

/* Activar: eliminar caches viejos */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* Fetch: cache-first para ASSETS, network-first para el resto */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  /* CDN externos (fonts, Leaflet, etc.): network-first */
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  /* Recursos locales: cache-first con actualización en background */
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        const network = fetch(event.request).then(response => {
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
        return cached || network;
      })
    )
  );
});
