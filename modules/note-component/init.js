import { ACTIONS, store } from "./note-component.data.js";
import { NoteComponent } from "./note-component.component.js";
import { createEncryptedLocalStorage } from "../encrypted-web-storage/encrypted-local-storage.js";

const LOCALSTORAGE_KEY = "encryptedNote";
const COOKIE_KEY = "encryptedNoteExpiration";

const localStorageDriver = async () => {
  const storage = createEncryptedLocalStorage({
    localStorageKey: LOCALSTORAGE_KEY,
    cookieKey: COOKIE_KEY,
    expiration: 3,
  });

  //   Init state with localstorage
  const decryptedNote = await storage.getItem();
  const daysLeft = await storage.getExpiration();

  // Add to state
  store.dispatch({
    type: ACTIONS.UPDATE,
    value: {
      value: decryptedNote,
      expires: daysLeft,
    },
  });

  // Listen for changes
  store.listen(async (state) => {
    await storage.setItem(state[0].value);
  });
};

const init = async () => {
  // Local Storage
  await localStorageDriver();

  // Dom
  customElements.define("note-component", NoteComponent);
  document.body.appendChild(document.createElement("note-component"));
};

init();
