if (typeof VERSION === "undefined") {
  throw new Error("Must define VERSION in the root service worker.");
}

// Delete old content
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      console.debug(
        "[Service Worker] [Activate] Searching for Old Cache. Current Cache:",
        VERSION
      );

      await caches.keys().then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key === VERSION) {
              return;
            }
            // Delete cache we are no longer wanting.
            console.debug(
              "[Service Worker] [Activate] Deleting Cache",
              VERSION
            );
            return caches.delete(key);
          })
        );
      });
    })()
  );
});

// Responding to fetches
self.addEventListener("fetch", (event) => {
  if (!event.request.url.startsWith("http")) {
    return;
  }
  event.respondWith(
    (async () => {
      const r = await caches.match(event.request);
      if (r) {
        // Return cache
        return r;
      }
      console.debug(
        `[Service Worker] [Fetch] Fetching from network and caching: ${event.request.url}`
      );
      const response = await fetch(event.request);
      const cache = await caches.open(VERSION);
      cache.put(event.request, response.clone());
      return response;
    })()
  );
});
