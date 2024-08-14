export const createWebStorage = (opts) => {
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
