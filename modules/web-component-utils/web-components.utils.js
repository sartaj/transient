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

// const createElementMap = ({ dom, container, items, WebComponent, getKey }) => {
//   const ATTRIBUTE_KEY = "key";
//   const ATTRIBUTE_INDEX = "index";

//   const currentElements = dom.querySelectorAll(WebComponent);

//   const currentKeys = Array.from(currentElements).map((item) =>
//     item.getAttribute(ATTRIBUTE_KEY)
//   );

//   // Loop through the notes and render the note item components if they don't exist yet.
//   items.forEach((items, index) => {
//     const keyValue = getKey(items);
//     const indexOfItem = currentKeys.indexOf(keyValue);
//     // Check if item already exists
//     if (indexOfItem !== -1) {
//       currentKeys.splice(indexOfItem, 1); // Remove the key from the array
//       return;
//     }
//     // Add element to the container if it already doesn't exist.
//     const component = document.createElement(WebComponent);
//     component.setAttribute(ATTRIBUTE_INDEX, index); // Pass index to the child component
//     component.setAttribute(ATTRIBUTE_KEY, keyValue); // Assuming the expiration is unique
//     container.appendChild(component);
//   });

//   // Any items left in the array are expired and should be removed
//   currentKeys.forEach((key) => {
//     const item = dom.querySelector(`[${ATTRIBUTE_KEY}="${key}"]`);
//     item.remove();
//   });
// };
