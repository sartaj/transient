/**
 * @param {unknown} e
 */
export const handleError = (e) => {
  if (e instanceof Error) {
    console.error(e);
  } else if (typeof e === "string") {
    console.error(new Error(e));
  } else {
    console.error(new Error("Unknown error."));
  }
};

/**
 * Ultra strict type guard check to verify query elements are input elements.
 * @param {HTMLElement | null} element
 * @returns {HTMLTextAreaElement | HTMLInputElement}
 */
export const verifyInput = (element) => {
  if (
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLInputElement
  ) {
    return element;
  } else {
    throw new Error("Element is not an input element.");
  }
};

/**
 * Safe query selector for shadow DOM that passes ts strict checks.
 *
 * @param {ShadowRoot | null} dom - The DOM element to search within.
 * @param {string} selector - The CSS selector to match against.
 * @returns {HTMLElement} - The first element that matches the selector.
 */
export const $ = (dom, selector) => {
  if (!dom) {
    throw new Error("Component failed to attach shadow root.");
  }
  const element = dom.querySelector(selector);
  if (element instanceof HTMLElement) {
    return element;
  } else {
    throw new Error("Element not found.");
  }
};
