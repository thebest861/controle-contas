// Nome e versão do cache
const CACHE_NAME = "controle-contas-v1";

// Arquivos essenciais do app
const FILES_TO_CACHE = [
  "/controle-contas/",
  "/controle-contas/index.html",
  "/controle-contas/manifest.json",
  "/controle-contas/icon-192.png",
  "/controle-contas/icon-512.png"
];

/* ===============================
   EVENTO: INSTALL
   =============================== */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

/* ===============================
   EVENTO: ACTIVATE
   =============================== */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/* ===============================
   EVENTO: FETCH
   Estratégia: Cache First, Network Fallback
   =============================== */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Se encontrou no cache, retorna
      if (response) {
        return response;
      }

      // Senão, busca na rede
      return fetch(event.request)
        .then(networkResponse => {
          // Clona a resposta para salvar no cache
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Falha total (offline sem cache)
          return new Response("Sem conexão com a internet.", {
            status: 503,
            statusText: "Offline"
          });
        });
    })
  );
});
