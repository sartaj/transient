/**
 * Local storage with async methods to allow for future extendability to potentially encryption and/or indexedDB.
 */
export declare const createWebStorage: <T extends object>(p: {
  localStorageKey: string;
  validate: (val: unknown) => val is T;
}) => {
  clear: () => Promise<void>;
  setItem: (val: T) => Promise<void>;
  getItem: () => Promise<T | null>;
};
