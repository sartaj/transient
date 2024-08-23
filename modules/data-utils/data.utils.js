/**
 * @type {import('./data.utils').debounce}
 */
export function debounce(func, wait, immediate = false) {
  let timeout;

  return function (...args) {
    const context = this;

    // Clear the previous timeout
    if (timeout) clearTimeout(timeout);

    if (immediate && !timeout) {
      // Call the function immediately
      func.apply(context, args);
    }

    // Set up a new timeout
    timeout = setTimeout(() => {
      if (!immediate) {
        // Call the function after the wait period
        func.apply(context, args);
      }
    }, wait);
  };
}
