import {
  Reducer,
  Store,
} from "../../create-reducer-store/create-reducer-store";

export type Note = {
  expires: string;
  value: string;
};

type State = {
  notes: Note[];
};

export declare enum ACTIONS {
  "UPDATE" = "UPDATE",
  "CLEAR" = "CLEAR",
  "CREATE" = "CREATE",
}

export type Actions =
  | {
      type: typeof ACTIONS.UPDATE;
      value: Partial<Note>;
    }
  | {
      type: typeof ACTIONS.CLEAR;
    }
  | {
      type: typeof ACTIONS.CREATE;
    };

export declare const store: Store<State, Actions>;
