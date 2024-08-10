if (typeof CACHE_NAME === "undefined") {
  throw new Error("Must define CACHE_NAME in the root service worker.");
}

console.log("CURRENT CACHE", CACHE_NAME);

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
      if (!e.request.url.startsWith("http")) {
        return;
        //skip request
      }
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        console.log(`[Service Worker] Using cache as fetch: ${e.request.url}`);
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(CACHE_NAME);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});
