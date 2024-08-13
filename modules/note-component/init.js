import { ACTIONS, store } from "./note-component.data.js";
import { NoteComponent } from "./note-component.component.js";
import { createEncryptedLocalStorage } from "../encrypted-web-storage/encrypted-local-storage.js";
import { isPastCurrentTimestamp } from "./date.utils.js";

const LOCALSTORAGE_KEY = "note0";

const localStorageDriver = async () => {
  const storage = createEncryptedLocalStorage({
    localStorageKey: LOCALSTORAGE_KEY,
  });

  //   Init state with localstorage
  const note = await storage.getItem();
  if (typeof note === "object" && note !== null) {
    // Add to state
    store.dispatch({
      type: ACTIONS.UPDATE,
      value: {
        value: note.value,
        expires: note.expires,
      },
    });
  } else {
    store.dispatch({
      type: ACTIONS.CREATE,
    });
  }

  // Listen for changes
  store.listen(async (state) => {
    await storage.setItem(state.notes[0]);
  });
};

const expirationListener = () => {
  store.listen((state) => {
    const note = state.notes[0];
    if (note && isPastCurrentTimestamp(note.expires)) {
      alert("Note expired.");
      store.dispatch({
        type: ACTIONS.CLEAR,
        value,
      });
    }
  });
};

const init = async () => {
  // Local Storage
  await localStorageDriver();
  await expirationListener();

  // DOM
  customElements.define("note-component", NoteComponent);
  document.body.appendChild(document.createElement("note-component"));
};

init();
