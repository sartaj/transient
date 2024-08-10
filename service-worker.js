const CACHE_NAME = "offline-cache-v8";
const OFFLINE_FILES = [
  "/",
  "/index.html",
  "/entry.js",
  "/style.css",
  "/app.webmanifest",
  "/modules/encrypted-web-storage/cookie-factory.js",
  "/modules/encrypted-web-storage/encryption.js",
  "/modules/encrypted-web-storage/encrypted-local-storage.js",
  "/modules/note-component/note-component.js",
  "/modules/note-component/note-component.html",
].map((file) => {
  // Add base path.
  return `${self.location.pathname.replace("/service-worker.js", "")}${file}`;
});

// Save to cache
self.addEventListener("install", (e) => {
  console.log("[Service Worker] [Install] Origin", { location: self.location });
  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log(
        "[Service Worker] [Install] Adding to Cache:",
        CACHE_NAME,
        OFFLINE_FILES
      );
      await cache.addAll(OFFLINE_FILES);
    })()
  );
});

// Delete old content
self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      console.log(
        "[Service Worker] [Activate] Searching for Old Cache. Current Cache:",
        CACHE_NAME
      );

      await caches.keys().then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key === CACHE_NAME) {
              return;
            }
            // Delete cache we are no longer wanting.
            console.log(
              "[Service Worker] [Activate] Deleting Cache",
              CACHE_NAME
            );
            return caches.delete(key);
          })
        );
      });
    })()
  );
});

// Responding to fetches
self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        console.log(`[Service Worker] Using cache as fetch: ${e.request.url}`);
        return r;
      }
      const response = await fetch(e.request);
      // Only put offline files in there
      if(OFFLINE_FILES.includes(e.request)) {
        const cache = await caches.open(CACHE_NAME);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());  
      }
      return response;
    })()
  );
});
