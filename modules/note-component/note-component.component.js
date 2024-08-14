import { onVersion } from "../service-workers/version.client.js";
import { ACTIONS, isNoteObj, store } from "./data/note.state.js";
import { timestampToDaysFromNow } from "./data/note.utils.js";

const SAVE_BUTTON = "#saveButton";
const CLEAR_BUTTON = "#clearButton";
const NOTE_INPUT = "#noteInput";
const DAYS_LEFT = "#daysLeft";

const VERSION = "#version";

export class NoteComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      if (!this.shadowRoot) {
        throw new Error("Component failed to attach shadow root.");
      }

      // Mount
      const url = new URL("note-component.html", import.meta.url);
      const html = await fetch(url).then((response) => response.text());
      this.shadowRoot.innerHTML = html;

      // Hooks
      $(this.shadowRoot, SAVE_BUTTON).addEventListener(
        "click",
        this.saveNote.bind(this)
      );

      $(this.shadowRoot, CLEAR_BUTTON).addEventListener(
        "click",
        this.clearNote.bind(this)
      );

      // window.addEventListener("keydown", this.handleKeyDown.bind(this), true);
      window.addEventListener("keyup", this.handleKeyUp.bind(this), true);

      // Render
      this.render();
    } catch (e) {
      alert("Failed loading note component.");
      handleError(e);
    }
  }

  disconnectedCallback() {
    $(this.shadowRoot, SAVE_BUTTON).removeEventListener(
      "click",
      this.saveNote.bind(this)
    );

    $(this.shadowRoot, CLEAR_BUTTON).removeEventListener(
      "click",
      this.clearNote.bind(this)
    );

    // window.removeEventListener("keydown", this.handleKeyDown, true);
    window.removeEventListener("keyup", this.handleKeyUp, true);
  }

  // For saving while typing
  // handleKeyDown(event) {
  //   if (event.key === "Enter") {
  //     event.preventDefault(); // Prevent the default enter key behavior
  //     this.insertNewLine(event);
  //   }
  // }

  // For saving while typing
  handleKeyUp() {
    this.saveNote();
  }

  /**
   * Insert special markdown characters into the mix.
   */
  // insertNewLine(event) {
  //   const textarea = this.shadowRoot.querySelector(NOTE_INPUT);
  //   const cursorPosition = textarea.selectionStart;
  //   const textBeforeCursor = textarea.value.slice(0, cursorPosition);
  //   const lastLineBreakIndex = textBeforeCursor.lastIndexOf("\n");
  //   const previousLine = textBeforeCursor.slice(lastLineBreakIndex + 1);

  //   const listItemPatterns = [
  //     /^-\s\[ \]/, // Pattern for "- [ ]"
  //     /^[-*•]/, // Pattern for "-", "*", and "•"
  //   ];
  //   let prefix = "";

  //   // Check if the previous line matches any of the patterns
  //   for (const pattern of listItemPatterns) {
  //     if (pattern.test(previousLine.trim())) {
  //       prefix = previousLine.trim().match(pattern)[0] + " ";
  //       break;
  //     }
  //   }

  //   event.preventDefault(); // Prevent the default enter key behavior

  //   const textAfterCursor = textarea.value.slice(cursorPosition);
  //   const newText = textBeforeCursor + "\n" + prefix + textAfterCursor;
  //   textarea.value = newText;

  //   // Move the cursor to the end of the inserted text
  //   const newCursorPosition = cursorPosition + 1 + prefix.length;
  //   textarea.selectionStart = textarea.selectionEnd = newCursorPosition;
  // }

  async clearNote() {
    try {
      if (window.confirm("Clear Note?")) {
        verifyInput($(this.shadowRoot, NOTE_INPUT)).value = "";
        store.dispatch({ type: ACTIONS.CLEAR });
      }
    } catch (e) {
      handleError(e);
    }
  }

  async saveNote() {
    try {
      const note = verifyInput($(this.shadowRoot, NOTE_INPUT)).value;
      store.dispatch({ type: ACTIONS.UPDATE, value: { value: note } });
    } catch (e) {
      handleError(e);
    }
  }

  async render() {
    const dom = this.shadowRoot;

    onVersion((version) => {
      $(dom, VERSION).innerHTML = `v.${version}`;
    });

    store.listen((state) => {
      const thisItem = state.notes[0];
      if (isNoteObj(thisItem)) {
        verifyInput($(dom, NOTE_INPUT)).value = thisItem.value;
        $(dom, DAYS_LEFT).innerHTML = String(
          timestampToDaysFromNow(thisItem.expires)
        );
      }
    });
  }
}

/**
 * @param {unknown} e
 */
const handleError = (e) => {
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
const verifyInput = (element) => {
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
const $ = (dom, selector) => {
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
