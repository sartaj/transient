if (typeof VERSION === "undefined") {
  throw new Error("Must define VERSION in the root service worker.");
}

const channel = new BroadcastChannel("version");
channel.postMessage(VERSION);
