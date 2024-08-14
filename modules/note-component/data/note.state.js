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
      return {
        ...state,
        notes: state.notes.map((note) => {
          if (note.expires === action.payload.key) {
            return {
              expires: note.expires,
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
        // Otherwise, remove the note at the index
        return {
          ...state,
          notes: state.notes.splice(state.payload, 1),
        };
      }
    case ACTIONS.ADD:
      return {
        ...state,
        notes: [...state.notes, createExpiringNote()],
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
  ADD: "ADD",
  HYDRATE: "HYDRATE",
};

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
