const __dirname = self.location.pathname.replace("/service-worker.js", "");
const relativePath = (p) => [__dirname, p].join("");

// const VERSION = `${Date.now()}`;
const VERSION = "20240812323";

importScripts(relativePath("/modules/service-workers/offline.sw.js"));
importScripts(relativePath("/modules/service-workers/version.sw.js"));
