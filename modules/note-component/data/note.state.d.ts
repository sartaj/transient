import {
  Store,
  Reducer,
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
  "ADD" = "ADD",
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
        key: string;
        value: string;
      };
    }
  | {
      type: typeof ACTIONS.CLEAR;
      /** Line number to clear */
      payload: number;
    }
  | {
      type: typeof ACTIONS.ADD;
    };

export type NoteReducer = Reducer<State, Actions>;

export type NoteStore = Store<State, Actions>;

export type IsNote = (obj: unknown) => obj is Note;
export declare const isNoteObj: IsNote;

export type IsNoteState = (obj: unknown) => obj is State;
export declare const isNoteState: IsNoteState;

export declare const store: NoteStore;
