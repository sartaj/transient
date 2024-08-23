import { createReducerStore } from "../../create-reducer-store/create-reducer-store.js";
import {
  daysFromNowToTimestamp,
  isPastCurrentTimestamp,
} from "./note.utils.js";

/**
 * @typedef {import('./note.state').State} State
 * @typedef {import('./note.state').Note} Note
 */

/**
 * Default expiration in days
 */
export const DEFAULT_EXPIRATION = 3;

/**
 * todo: make an array of items
 * @type {State}
 */
const initial = { notes: [], expiredNotes: [] };

/**
 * @returns {Note}
 */
const createExpiringNote = (value = "") => {
  const expires = daysFromNowToTimestamp(DEFAULT_EXPIRATION);
  return {
    value,
    // ID is the first expiry date. This wont change
    id: expires,
    // Set in date format
    expired: false,
    // Expires can change.
    expires,
  };
};

/**
 * @type {import('./note.state').NoteReducer}
 */
export const reducer = (s, action) => {
  const state = parseState(s);

  switch (action.type) {
    case ACTIONS.HYDRATE:
      return parseState(action.payload);
    case ACTIONS.UPDATE:
      return {
        ...state,
        notes: state.notes.map((note) => {
          if (note.expires === action.payload.id) {
            return {
              ...note,
              value: action.payload.value,
            };
          }
          return note;
        }),
      };
    case ACTIONS.CLEAR:
      // If there is only one note, then we should create a new blank note
      if (state.notes.length === 1) {
        return {
          ...state,
          notes: [createExpiringNote()],
        };
      } else {
        // Otherwise, remove the note that has the expiration as a key.
        return {
          ...state,
          notes: state.notes.filter((note) => note.expires !== action.payload),
        };
      }
    case ACTIONS.RESET_TIMER:
      return {
        ...state,
        notes: state.notes.map((note) => {
          if (note.expires !== action.payload) {
            return note;
          }
          return {
            ...note,
            expires: daysFromNowToTimestamp(DEFAULT_EXPIRATION),
          };
        }),
      };
    case ACTIONS.ADD:
      return {
        ...state,
        notes: [createExpiringNote(action.payload?.value), ...state.notes],
      };
    default:
      return state;
  }
};

/**
 * @type {State} state
 * @returns {State}
 */
const parseState = (state) => {
  // Clear expired notes
  let expiredNotes = state.expiredNotes || [];
  const activeNotes = state.notes.filter((note) => {
    // If note is expired, clear it
    if (isPastCurrentTimestamp(note.expires)) {
      expiredNotes = [...expiredNotes, { ...note, expired: true }];
      return false;
    }
    return true;
  });

  // Sort ascending, because the renderer will prepend.
  const sortedNotes = activeNotes.sort((a, b) =>
    a.expires.localeCompare(b.expires)
  );

  const sortedExpiredNotes = expiredNotes.sort((a, b) =>
    a.expires.localeCompare(b.expires)
  );

  /** @type {State} */
  const stateToUpdate = {
    ...state,
    notes: sortedNotes,
    expiredNotes: sortedExpiredNotes,
  };
  return stateToUpdate;
};

export const ACTIONS = Object.freeze({
  UPDATE: "UPDATE",
  CLEAR: "CLEAR",
  ADD: "ADD",
  HYDRATE: "HYDRATE",
});

/**
 * @type {import('./note.state').IsNote}
 */
export const isNoteObj = (obj) =>
  typeof obj === "object" && obj !== null && "value" in obj && "expires" in obj;

/**
 * @type {import('./note.state').IsNoteState}
 */
export const isNoteState = (obj) =>
  typeof obj === "object" && obj !== null && "notes" in obj;

/**
 * @type {import('./note.state').NoteStore}
 */
export const store = createReducerStore({
  initial,
  reducer,
});
