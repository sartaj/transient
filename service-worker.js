const __dirname = self.location.pathname.replace("/service-worker.js", "");
const relativePath = (p) => [__dirname, p].join("");

const VERSION = "202408123";

importScripts(relativePath("/modules/service-workers/offline.sw.js"));
importScripts(relativePath("/modules/service-workers/version.sw.js"));
