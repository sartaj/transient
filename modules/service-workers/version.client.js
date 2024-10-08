/**
 * @param {(s: string) => void} cb
 */
export const onVersion = (cb) => {
  const channel = new BroadcastChannel("version");
  channel.addEventListener("message", (event) => {
    localStorage.setItem("version", event.data);
    cb(event.data);
  });
  const version = localStorage.getItem("version");
  if (version !== null) {
    cb(version);
  }
};
