import {
  getPrivateKey,
  getPublicKey,
  encryptData,
  decryptData,
} from "./encryption.js";

/**
 * @typedef {Object} EncryptedLocalStorageOpts
 * @property {string} key - localStorage key
 * @param {EncryptedLocalStorageOpts} opts
 */
export const createEncryptedLocalStorage = (opts) => {
  const clear = async () => {
    try {
      localStorage.clear(opts.key);
      alert("Note cleared!");
    } catch (e) {
      alert("Failed saving note.");
      console.error(new Error(e));
    }
  };

  const getItem = async () => {
    try {
      return localStorage.getItem(opts.key);
      // const encryptedNote = localStorage.getItem(opts.key);
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
      localStorage.setItem(opts.key, value);
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
