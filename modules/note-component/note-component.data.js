import { createReducerStore } from "../create-reducer-store/create-reducer-store.js";

const initial = [{ value: "", expires: "" }];

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.UPDATE:
      return [{ ...state[0], ...action.value }];
    case ACTIONS.CLEAR:
      return [{ value: "", expires: "" }];
    default:
      return state;
  }
};

export const store = createReducerStore({
  initial,
  reducer,
});

export const ACTIONS = {
  UPDATE: "UPDATE",
  CLEAR: "CLEAR",
};
