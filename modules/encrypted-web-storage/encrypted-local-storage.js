// import {
//   getPrivateKey,
//   getPublicKey,
//   encryptData,
//   decryptData,
// } from "./encryption.js";

/**
 * @typedef {Object} EncryptedLocalStorageOpts
 * @property {string} localStorageKey - localStorage key
 * @property {string} cookieKey - cookie key
 * @property {number} expiration - expires in days
 * @param {EncryptedLocalStorageOpts} opts
 */
export const createEncryptedLocalStorage = (opts) => {
  // 1 week default

  const clear = async () => {
    try {
      localStorage.clear(opts.localStorageKey);
      alert("Note cleared!");
    } catch (e) {
      alert("Failed saving note.");
      console.error(new Error(e));
    }
  };

  const getItem = () => {
    try {
      return JSON.parse(localStorage.getItem(opts.localStorageKey));
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
      //   const publicKey = await getPublicKey();
      //   console.log("publicKey", publicKey);
      //   const encryptedNote = await encryptData(value, publicKey);
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
