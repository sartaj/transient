import { Note } from "./note.state";

export declare const isNoteObj: (obj: unknown) => obj is Note;

export declare const timestampToDaysFromNow: (timestamp: string) => number;
export declare const daysFromNowToTimestamp: (daysFromNow: number) => string;
export declare const isPastCurrentTimestamp: (timestamp: string) => boolean;
