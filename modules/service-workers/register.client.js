/**
 * @param {URL} url
 */

export const register = (url) => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register(url, {
          // Keep both imports and main sw in network.
          updateViaCache: "none",
        })
        .then(
          (registration) => {
            console.log("REG", registration);
            console.info(
              "[Service Worker] Registration successful with scope: ",
              registration.scope
            );
          },
          (error) => {
            console.info("[Service Worker] registration failed: ", error);
          }
        );
    });
  }
};
