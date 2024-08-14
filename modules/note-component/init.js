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

// Listen for changes and check if any notes have expired
const expirationListener = () => {
  store.listen((state) => {
    let notesCleared = false;
    // Check if any notes have expired
    state.notes.forEach((note, i) => {
      // If note is expired, clear it
      if (isPastCurrentTimestamp(note.expires)) {
        store.dispatch({
          type: ACTIONS.CLEAR,
          payload: i,
        });
      }
    });
    // Notify user if any notes were cleared
    if (notesCleared) {
      alert("Note expired.");
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
