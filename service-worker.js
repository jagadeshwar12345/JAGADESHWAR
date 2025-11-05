const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/icon-192.svg',
    '/icon-512.svg',
    '/manifest.json'
];

self.addEventListener('install', event => {
  console.log('[Service Worker] Installing Service Worker ...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[Service Worker] Precaching App Shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating Service Worker ....');
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});


self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                
                return fetch(event.request)
                    .then(res => {
                        return caches.open(DYNAMIC_CACHE)
                            .then(cache => {
                                if (event.request.url.startsWith('chrome-extension://')) {
                                    return res;
                                }
                                cache.put(event.request.url, res.clone());
                                return res;
                            });
                    })
                    .catch(err => {
                        // Optional: return a fallback page if offline and not in cache
                    });
            })
    );
});