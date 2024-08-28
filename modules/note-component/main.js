/**
 * Using a state+action+reducer based central state management system on pure functions
 * Web storage and the Web Components act just listen to changes to the state and render accordingly.
 * They can then update the state with the dispatch method.
 * Calling the web storage and UI listeners "drivers" here as inspired by https://cycle.js.org/
 */
import { createIndexedDBStorage } from "../web-storage/web-storage.js";
import { ACTIONS, store, initialState } from "./data/note.state.js";
import { debounce } from "../data-utils/data.utils.js";
// Importing the component defines the Web Component (see import)
import { NotesContainer } from "./view/notes-container.component.js";

const INTRO_MESSAGE = `Welcome To Transient!
The Disappearing Notes App For Transient Thoughts

• 💣 Notes will automatically delete in a few days. 
• 📲 Installable: Add To Home Screen / Install today.
• 😶‍🌫️ Fully private: Data stays on device.

• ➕ Add Note: Tap the plus icon to add a new note.
• 📝 Reset Timer: Tap the timer on the bottom to reset it.
• 🗑️ Delete Note: Tap the trash icon to delete a note.
`;

/**
 * Driver to hydrate the store from local storage, and save updates to local storage.
 */
const localStorageDriver = async () => {
  const storage = createIndexedDBStorage(
    "TransientNoteDB",
    "TransientNotesStore"
  );

  //   Init state with localstorage
  const activeNotes = (await storage.list("expired", false)) || [];
  const expiredNotes = (await storage.list("expired", true)) || [];

  const showIntro = activeNotes.length === 0 && expiredNotes.length === 0;
  const noActiveNotes = activeNotes.length === 0;

  if (showIntro) {
    // Add a note if none exist
    store.dispatch({
      type: ACTIONS.ADD,
      payload: {
        value: INTRO_MESSAGE,
      },
    });
  } else if (noActiveNotes) {
    // Add an empty note if no active notes exist
    store.dispatch({
      type: ACTIONS.ADD,
      payload: {
        value: "",
      },
    });
  } else {
    // Hydrate the store from storage
    store.dispatch({
      type: ACTIONS.HYDRATE,
      payload: {
        showExpired: false,
        notes: activeNotes,
        expiredNotes,
      },
    });
  }

  /**
   * @param {import('./data/note.state.js').State} state
   * @param {import('./data/note.state.js').Actions} action
   */
  const listener = async (state, action) => {
    // Delete if note was cleared
    if (action.type === ACTIONS.CLEAR) {
      await storage.removeItem(action.payload.id);
    }
    // Update if note was updated
    if (action.type === ACTIONS.UPDATE || action.type === ACTIONS.RESET_TIMER) {
      const note = state.notes.find((note) => note.id === action.payload.id);
      if (note) {
        await storage.setItem(note.id, note);
      }
    }
    // Add new note that should be at the beginning
    if (action.type === ACTIONS.ADD) {
      const note = state.notes[0];
      if (note) {
        await storage.setItem(note.id, note);
      }
    }

    // Always set the expired notes for now since we don't have a way to see if a note was pushed to expired.
    // todo: make more efficient.
    state.expiredNotes.forEach(async (note) => {
      await storage.setItem(note.id, note);
    });
  };

  // Debounce the listener
  const debouncedListneer = debounce(listener, 200);

  // Listen for changes
  store.listen(debouncedListneer);
};

/**
 * Main function to initialize the app.
 */
export const main = async () => {
  // Local Storage
  await localStorageDriver();

  // DOM
  document.body.appendChild(document.createElement(NotesContainer));
};
