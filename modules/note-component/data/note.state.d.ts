import {
  Store,
  Reducer,
} from "../../create-reducer-store/create-reducer-store";

type Expires = string;
type ID = string;

export type Note = {
  /** ID is the original unique key for db storage */
  id: ID;
  expires: Expires;
  expired: boolean;
  value: string;
};

type State = {
  notes: Note[];
  expiredNotes: Note[];
  showExpired: boolean;
};

export declare enum ACTIONS {
  "UPDATE" = "UPDATE",
  "CLEAR" = "CLEAR",
  "EXPIRE" = "EXPIRE",
  "ADD" = "ADD",
  "RESET_TIMER" = "RESET_TIMER",
  "HYDRATE" = "HYDRATE",
  "TOGGLE_SHOW_EXPIRED" = "TOGGLE_SHOW_EXPIRED",
}

export type Actions =
  | {
      type: ACTIONS.HYDRATE;
      payload: State;
    }
  | {
      type: ACTIONS.UPDATE;
      payload: {
        id: ID;
        value: string;
      };
    }
  | {
      type: ACTIONS.RESET_TIMER;
      payload: {
        id: ID;
      };
    }
  | {
      type: ACTIONS.ADD;
      payload?: {
        value: string;
      };
    }
  | {
      type: ACTIONS.CLEAR;
      payload: {
        id: ID;
      };
    }
  | {
      type: ACTIONS.EXPIRE;
      payload: {
        id: ID;
      };
    }
  | {
      type: ACTIONS.TOGGLE_SHOW_EXPIRED;
    };

export declare const initialState: State;

export type NoteReducer = Reducer<State, Actions>;

export type NoteStore = Store<State, Actions>;

export declare const DEFAULT_EXPIRATION = 3;

export type IsNote = (obj: unknown) => obj is Note;
export declare const isNoteObj: IsNote;

export type IsNoteState = (obj: unknown) => obj is State;
export declare const isNoteState: IsNoteState;

export declare const store: NoteStore;
