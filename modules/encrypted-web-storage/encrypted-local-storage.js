import "./encryption.js";
import { cookieFactory } from "./cookie-factory.js";
/**
 * @typedef {Object} EncryptedLocalStorageOpts
 * @property {string} localStorageKey - localStorage key
 * @property {string} cookieKey - cookie key
 * @property {number} expiration - expires in days
 * @param {EncryptedLocalStorageOpts} opts
 */
export const createEncryptedLocalStorage = (opts) => {
  const cookie = cookieFactory(opts.cookieKey);

  const getExpiration = () => {
    const val = cookie.get();
    if (val) {
      return dateToDaysFromNow(val);
    } else {
      return null;
    }
  };

  // 1 week default
  const setExpiration = (days = 7) => {
    const dateFromNow = daysFromNowToDate(days);
    cookie.set(dateFromNow, dateFromNow);
  };

  const clear = async () => {
    try {
      localStorage.clear(opts.localStorageKey);
      alert("Note cleared!");
    } catch (e) {
      alert("Failed saving note.");
      console.error(new Error(e));
    }
  };

  const getItem = async () => {
    try {
      return localStorage.getItem(opts.localStorageKey);
      // const encryptedNote = localStorage.getItem(opts.localStorageKey);
      // if (encryptedNote) {
      //   const privateKey = await getPrivateKey();
      //   const decryptedNote = await decryptData(encryptedNote, privateKey);
      //   return decryptedNote;
      // } else {
      //   return "";
      // }
    } catch (e) {
      console.error(new Error(e));
    }
  };

  /** @param value {string} */
  const setItem = async (value) => {
    try {
      // const publicKey = await getPublicKey();
      // console.log("publicKey", publicKey);
      // const encryptedNote = await encryptData(value, publicKey);
      localStorage.setItem(opts.localStorageKey, value);
      setExpiration(opts.expiration);
    } catch (e) {
      alert("Failed saving.");
      console.error(new Error(e));
    }
  };

  // On init, check if expired
  const init = async () => {
    const note = (await getItem()) || "";
    if (!cookie.get() && note.trim().length > 0) {
      localStorage.clear(opts.localStorageKey);
      alert("Note expired.");
    }
  };

  init();

  return {
    getItem,
    setItem,
    clear,
    getExpiration,
  };
};

/**
 * @param {number} days
 */
const daysFromNowToDate = (days) => {
  const now = new Date();
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + days); // Add days
  return futureDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
};

/**
 * @param {string} futureDate - Format: YYYY-MM-DD
 */
const dateToDaysFromNow = (futureDate) => {
  const now = new Date();
  const future = new Date(futureDate);
  const timeDiff = future - now; // Difference in milliseconds
  return Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), 0); // Convert to days
};
