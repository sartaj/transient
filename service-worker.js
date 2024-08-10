const __dirname = self.location.pathname.replace("/service-worker.js", "");
const relativePath = (p) => [__dirname, p].join("");

const CACHE_NAME = "offline-cache-v11";

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
].map(relativePath);

importScripts(relativePath("/modules/service-workers/offline.js"));
