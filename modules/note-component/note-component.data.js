import { createReducerStore } from "../create-reducer-store/create-reducer-store.js";
import { daysFromNowToTimestamp } from "./date.utils.js";

const DEFAULT_EXPIRATION = 3;

// todo: make an array of items
const initial = { notes: [] };

const createExpiringNote = () => {
  return {
    value: "",
    // Set in date format
    expires: daysFromNowToTimestamp(DEFAULT_EXPIRATION),
  };
};

const reducer = (state, action) => {
  switch (action.type) {
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

export const ACTIONS = {
  UPDATE: "UPDATE",
  CLEAR: "CLEAR",
  CREATE: "CREATE",
};

export const store = createReducerStore({
  initial,
  reducer,
});
