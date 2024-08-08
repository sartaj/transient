
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(OFFLINE_FILES);
//     })
//   );
// });

self.addEventListener('install', event => {
  event.waitUntil(
      fetch('/module-config.json')
          .then(response => response.json())
          .then(response => {
              const config = response['service-worker'];
              console.log("CONFIG", config)
              return caches.open(config.cache_name).then(cache => {
                  return cache.addAll(config.offline_files);
              });
          })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
