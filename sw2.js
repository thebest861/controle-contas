const CACHE = "controle-contas-v1";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        "/controle-contas/",
        "/controle-contas/index.html",
        "/controle-contas/manifest.json",
        "/controle-contas/icon-192.png",
        "/controle-contas/icon-512.png"
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE && caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});
