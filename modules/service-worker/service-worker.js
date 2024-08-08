/**
 * @param {Location} location
 */
const getConfig = async (location) => {
  try {
    const res = await fetch(
      new URL("/module-config.json", `${location.origin}/${location.pathname}`)
    );
    const json = await res.json();

    // Get json settings
    const config = json["service-worker"];
    const cacheName = config["cache_name"];
    const contentToCache = config["offline_files"];
    return { contentToCache, cacheName };
  } catch (e) {
    console.error(
      "Failed to get module-config.json. Offline mode will not work"
    );
    console.error(new Error(e));
    return { contentToCache: [], cacheName: "" };
  }
};

// Save to cache
self.addEventListener("install", (e) => {
  console.log(
    "[Service Worker] [Install] Origin",
    self.location.origin,
    self.location.pathname,
    self.location.href
  );

  e.waitUntil(
    (async () => {
      const { cacheName, contentToCache } = await getConfig(self.location);
      const cache = await caches.open(cacheName);
      console.log(
        "[Service Worker] [Install] Adding to Cache:",
        cacheName,
        contentToCache
      );
      await cache.addAll(contentToCache);
    })()
  );
});

// Delete old content
self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const { cacheName } = await getConfig(self.location);
      console.log(
        "[Service Worker] [Activate] Searching for Old Cache. Current Cache:",
        cacheName
      );

      await caches.keys().then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key === cacheName) {
              return;
            }
            // Delete cache we are no longer wanting.
            console.log(
              "[Service Worker] [Activate] Deleting Cache",
              cacheName
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
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});
