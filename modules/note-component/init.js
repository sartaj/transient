import { createWebStorage } from "../web-storage/web-storage.js";
import { ACTIONS, isNoteState, store } from "./data/note.state.js";
import { isPastCurrentTimestamp } from "./data/note.utils.js";
import { NoteComponent } from "./note-component.component.js";

const LOCALSTORAGE_KEY = "note-state";

const localStorageDriver = async () => {
  const storage = createWebStorage({
    localStorageKey: LOCALSTORAGE_KEY,
    validate: isNoteState,
  });

  //   Init state with localstorage
  const state = await storage.getItem();
  if (state) {
    // Add to state
    store.dispatch({
      type: ACTIONS.HYDRATE,
      payload: state,
    });
  } else {
    store.dispatch({
      type: ACTIONS.CREATE,
    });
  }

  // Listen for changes
  store.listen(async (state) => {
    await storage.setItem(state);
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
