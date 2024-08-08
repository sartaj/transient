if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const url = new URL("service-worker.js", import.meta.url);
      navigator.serviceWorker.register(url).then(
        (registration) => {
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        },
        (error) => {
          console.log("ServiceWorker registration failed: ", error);
        }
      );
    });
  }