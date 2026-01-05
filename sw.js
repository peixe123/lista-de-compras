const CACHE_NAME = 'lista-compras-v44-1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './produtos.json',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalação: Cacheia os arquivos estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Cacheando arquivos do app');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação: Limpa caches antigos se a versão mudar
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Interceptação: Serve o cache se estiver offline, ou busca na rede
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Retorna do cache se existir
      if (cachedResponse) {
        return cachedResponse;
      }
      // Se não, busca na rede
      return fetch(event.request).catch(() => {
        // Se falhar (offline total) e não for um recurso essencial, não faz nada
        // (O index.html já estaria no cache pelo 'install')
      });
    })
  );
});
