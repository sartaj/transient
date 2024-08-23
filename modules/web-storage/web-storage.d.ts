/**
 * Local storage with async methods to allow for future extendability to potentially encryption and/or indexedDB.
 */
declare const createLocalStorage: <T extends object>(p: {
  localStorageKey: string;
  validate: (val: unknown) => val is T;
}) => {
  clear: () => Promise<void>;
  setItem: (val: T) => Promise<void>;
  getItem: () => Promise<T | null>;
};

/**
 * Interface representing the API for IndexedDB storage.
 */
interface IndexedDBStorage {
  /**
   * Retrieves an item from the storage.
   * @param key - The key of the item to retrieve.
   * @returns A promise that resolves to the item's value, or null if not found.
   */
  getItem(key: string): Promise<any | null>;

  /**
   * Stores an item in the storage.
   * @param key - The key of the item to store.
   * @param value - The value of the item to store.
   * @returns A promise that resolves when the item has been stored.
   */
  setItem(key: string, value: any): Promise<void>;

  /**
   * Removes an item from the storage.
   * @param key - The key of the item to remove.
   * @returns A promise that resolves when the item has been removed.
   */
  removeItem(key: string): Promise<void>;

  /**
   * Clears all items from the storage.
   * @returns A promise that resolves when all items have been cleared.
   */
  clear(): Promise<void>;

  /**
   * Retrieves all keys from the storage.
   * @returns A promise that resolves to an array of all keys.
   */
  keys(): Promise<string[]>;

  /**
   * Lists all items in the storage that match the specified key-value filter.
   * @param filterKey - The key to filter by.
   * @param filterValue - The value to match against the key.
   * @returns A promise that resolves to an array of matching items.
   */
  list(filterKey: string, filterValue: any): Promise<any[]>;
}

/**
 * Factory function to create an IndexedDB storage instance.
 *
 * @param dbName - The name of the database. Defaults to 'MyDatabase'.
 * @param storeName - The name of the object store. Defaults to 'MyStore'.
 * @returns An object that implements the IndexedDBStorage interface.
 *
 * @example
 * const storage = createIndexedDBStorage();
 *
 * // Setting an item
 * storage.setItem('name', 'John Doe').then(() => {
 *     console.log('Item set!');
 * });
 *
 * // Getting an item
 * storage.getItem('name').then((value) => {
 *     console.log('Item value:', value); // Output: 'John Doe'
 * });
 *
 * // Removing an item
 * storage.removeItem('name').then(() => {
 *     console.log('Item removed!');
 * });
 *
 * // Clearing all items
 * storage.clear().then(() => {
 *     console.log('Store cleared!');
 * });
 *
 * // Getting all keys
 * storage.keys().then((keys) => {
 *     console.log('Keys:', keys); // Output: Array of keys
 * });
 */
declare function createIndexedDBStorage(
  dbName?: string,
  storeName?: string
): IndexedDBStorage;

export { createIndexedDBStorage, IndexedDBStorage, createLocalStorage };
