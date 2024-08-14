import { createWebStorage } from "../web-storage/web-storage.js";
import { ACTIONS, store } from "./data/note.state.js";
import { isNoteObj, isPastCurrentTimestamp } from "./data/note.utils.js";
import { NoteComponent } from "./note-component.component.js";

const LOCALSTORAGE_KEY = "note0";

const localStorageDriver = async () => {
  const storage = createWebStorage({
    localStorageKey: LOCALSTORAGE_KEY,
    validate: isNoteObj,
  });

  //   Init state with localstorage
  const note = await storage.getItem();
  if (note) {
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
