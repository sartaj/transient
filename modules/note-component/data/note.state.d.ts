import {
  Store,
  Reducer,
} from "../../create-reducer-store/create-reducer-store";

type Expires = string;

export type Note = {
  /** Expires doubles as unique key */
  expires: Expires;
  value: string;
};

type State = {
  notes: Note[];
};

export declare enum ACTIONS {
  "UPDATE" = "UPDATE",
  "CLEAR" = "CLEAR",
  "ADD" = "ADD",
  "RESET_TIMER" = "RESET_TIMER",
  "HYDRATE" = "HYDRATE",
}

export type Actions =
  | {
      type: typeof ACTIONS.HYDRATE;
      payload: State;
    }
  | {
      type: typeof ACTIONS.UPDATE;
      payload: {
        key: Expires;
        value: string;
      };
    }
  | {
      type: typeof ACTIONS.CLEAR;
      payload: Expires;
    }
  | {
      type: typeof ACTIONS.RESET_TIMER;
      payload: Expires;
    }
  | {
      type: typeof ACTIONS.ADD;
      payload?: string;
    };

export type NoteReducer = Reducer<State, Actions>;

export type NoteStore = Store<State, Actions>;

export declare const DEFAULT_EXPIRATION = 3;

export type IsNote = (obj: unknown) => obj is Note;
export declare const isNoteObj: IsNote;

export type IsNoteState = (obj: unknown) => obj is State;
export declare const isNoteState: IsNoteState;

export declare const store: NoteStore;
