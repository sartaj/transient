import { createReducerStore } from "../../create-reducer-store/create-reducer-store.js";
import { daysFromNowToTimestamp } from "./note.utils.js";

/**
 * @typedef {import('./note.state').State} State
 * @typedef {import('./note.state').Note} Note
 */

/**
 * Default expiration in days
 */
const DEFAULT_EXPIRATION = 3;

/**
 * todo: make an array of items
 * @type {State}
 */
const initial = { notes: [] };

/**
 * @returns {Note}
 */
const createExpiringNote = () => {
  return {
    value: "",
    // Set in date format
    expires: daysFromNowToTimestamp(DEFAULT_EXPIRATION),
  };
};

/**
 * @type {import('./note.state').NoteReducer}
 */
const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.HYDRATE:
      return action.payload;
    case ACTIONS.UPDATE:
      const currentNote = state.notes[0] || createExpiringNote();
      return {
        ...state,
        notes: [{ ...currentNote, ...action.value }],
      };
    case ACTIONS.CREATE:
    case ACTIONS.CLEAR:
      return {
        ...state,
        notes: [createExpiringNote()],
      };
    default:
      return state;
  }
};

/**
 * @type {import('./note.state').ACTIONS}
 */
export const ACTIONS = {
  UPDATE: "UPDATE",
  CLEAR: "CLEAR",
  CREATE: "CREATE",
  HYDRATE: "HYDRATE",
};

/**
 * @type {import('./note.state').IsNote}
 */
export const isNoteObj = (obj) =>
  typeof obj === "object" && obj !== null && obj.value && obj.expires;

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
