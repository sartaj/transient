/**
 * Using a state+action+reducer based central state management system on pure functions
 * Web storage and the Web Components act just listen to changes to the state and render accordingly.
 * They can then update the state with the dispatch method.
 * Calling the web storage and UI listeners "drivers" here as inspired by https://cycle.js.org/
 */
import { createWebStorage } from "../web-storage/web-storage.js";
import { ACTIONS, isNoteState, store } from "./data/note.state.js";
import { isPastCurrentTimestamp } from "./data/note.utils.js";

// Importing the component defines the Web Component (see import)
import { NotesContainer } from "./view/notes-container.component.js";

const LOCALSTORAGE_KEY = "note-state";

/**
 * Driver to hydrate the store from local storage, and save updates to local storage.
 */
const localStorageDriver = async () => {
  const storage = createWebStorage({
    localStorageKey: LOCALSTORAGE_KEY,
    validate: isNoteState,
  });

  //   Init state with localstorage
  const state = await storage.getItem();
  if (state) {
    // Hydrate the store from storage
    store.dispatch({
      type: ACTIONS.HYDRATE,
      payload: state,
    });
  } else {
    // Add a note if none exist
    store.dispatch({
      type: ACTIONS.ADD,
    });
  }

  // Listen for changes
  store.listen(async (state) => {
    await storage.setItem(state);
  });
};

/**
 * Special state listener that checks if any notes are expired.
 * If so, it clears them.
 * This could theoretically just be in the reducer, but having it here now
 * so that it is easier to push the alert.
 */
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

/**
 * Main function to initialize the app.
 */
export const main = async () => {
  // Local Storage
  await localStorageDriver();
  await expirationListener();

  // DOM
  document.body.appendChild(document.createElement(NotesContainer));
};
