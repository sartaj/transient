export const createLocalStorage = (opts) => {
  const clear = async () => {
    try {
      localStorage.removeItem(opts.localStorageKey);
      alert("Note cleared!");
    } catch (e) {
      alert("Failed saving note.");
      console.error(new Error(e));
    }
  };

  const getItem = () => {
    try {
      const json = JSON.parse(localStorage.getItem(opts.localStorageKey));
      if (opts.validate(json)) {
        return json;
      } else {
        return null;
      }
    } catch (e) {
      console.error(new Error(e));
      return null;
    }
  };

  const setItem = async (value) => {
    try {
      localStorage.setItem(opts.localStorageKey, JSON.stringify(value));
    } catch (e) {
      alert("Failed saving.");
      console.error(new Error(e));
    }
  };

  return {
    getItem,
    setItem,
    clear,
  };
};

export function createIndexedDBStorage(
  dbName = "MyDatabase",
  storeName = "MyStore"
) {
  let db = null;

  async function open() {
    if (db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };

      request.onsuccess = (event) => {
        db = event.target.result;
        resolve();
      };

      request.onerror = (event) => {
        reject(`IndexedDB error: ${event.target.errorCode}`);
      };
    });
  }

  async function getItem(key) {
    await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.get(key);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(`Error getting item with key "${key}"`);
      };
    });
  }

  async function setItem(key, value) {
    await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.put(value, key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(`Error setting item with key "${key}"`);
      };
    });
  }

  async function removeItem(key) {
    await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.delete(key);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(`Error removing item with key "${key}"`);
      };
    });
  }

  async function clear() {
    await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readwrite");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(`Error clearing store`);
      };
    });
  }

  async function keys() {
    await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.getAllKeys();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(`Error getting keys`);
      };
    });
  }

  async function list(filterKey, filterValue) {
    await open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], "readonly");
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.openCursor();
      const results = [];

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value[filterKey] === filterValue) {
            results.push(cursor.value);
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
        reject(
          `Error listing items with filter key "${filterKey}" and value "${filterValue}"`
        );
      };
    });
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    keys,
    list,
  };
}
