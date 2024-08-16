import {
  $,
  handleError,
  verifyInput,
} from "../../web-component-utils/web-components.utils.js";
import { DEFAULT_EXPIRATION, ACTIONS, store } from "../data/note.state.js";
import {
  timestampToDaysFromNow,
  daysFromNowToTimestamp,
} from "../data/note.utils.js";

// Inputs
const CLEAR_BUTTON = "#clearButton";
const RESET_TIMER = "#resetTimerButton";
const NOTE_INPUT = "#noteInput";

// Template elements
const DAYS_LEFT = "#daysLeft";

export const NoteItemAttributes = {
  NoteExpires: "note-expires",
  NoteDefaultValue: "note-default-value",
};

export class NoteItemElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      if (!this.shadowRoot) {
        throw new Error("No shadow root for item.");
      }

      // Mount
      const url = new URL("note-item.html", import.meta.url);
      const html = await fetch(url).then((response) => response.text());
      this.shadowRoot.innerHTML = html;

      // Hooks
      $(this.shadowRoot, CLEAR_BUTTON).addEventListener(
        "click",
        this.clearNote.bind(this)
      );

      $(this.shadowRoot, RESET_TIMER).addEventListener(
        "click",
        this.resetTimer.bind(this)
      );

      $(this.shadowRoot, NOTE_INPUT).addEventListener(
        "input",
        this.handleInput.bind(this)
      );

      $(this.shadowRoot, NOTE_INPUT).addEventListener(
        "keydown",
        this.handleKeyDown.bind(this),
        true
      );

      // Render
      this.render();
    } catch (e) {
      alert("Failed loading note component.");
      handleError(e);
    }
  }

  disconnectedCallback() {
    $(this.shadowRoot, CLEAR_BUTTON).removeEventListener(
      "click",
      this.clearNote.bind(this)
    );

    $(this.shadowRoot, RESET_TIMER).removeEventListener(
      "click",
      this.resetTimer.bind(this)
    );

    $(this.shadowRoot, NOTE_INPUT).removeEventListener(
      "input",
      this.handleInput.bind(this)
    );

    $(this.shadowRoot, NOTE_INPUT).removeEventListener(
      "keydown",
      this.handleKeyDown,
      true
    );
  }

  autoResize() {
    const element = $(this.shadowRoot, NOTE_INPUT);
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  }

  handleInput() {
    this.autoResize();
    this.saveNote();
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default enter key behavior
      this.insertNewLine(event);
      this.autoResize();
    }
  }

  /**
   * Insert special markdown characters into the mix.
   * @param {KeyboardEvent} event
   */
  insertNewLine(event) {
    const textarea = verifyInput($(this.shadowRoot, NOTE_INPUT));
    const cursorPosition = textarea.selectionStart || textarea.value.length + 1;
    const textBeforeCursor = textarea.value.slice(0, cursorPosition);
    const lastLineBreakIndex = textBeforeCursor.lastIndexOf("\n");
    const previousLine = textBeforeCursor.slice(lastLineBreakIndex + 1);

    const listItemPatterns = [
      /^-\s\[ \]/, // Pattern for "- [ ]"
      /^[-*•]/, // Pattern for "-", "*", and "•"
    ];
    let prefix = "";

    // Check if the previous line matches any of the patterns
    for (const pattern of listItemPatterns) {
      const prevLineTrimmed = previousLine.trim();
      if (pattern.test(prevLineTrimmed)) {
        const matchedPattern = prevLineTrimmed.match(pattern);
        if (matchedPattern !== null) {
          prefix = matchedPattern[0] + " ";
          break;
        }
      }
    }

    event.preventDefault(); // Prevent the default enter key behavior

    const textAfterCursor = textarea.value.slice(cursorPosition);
    const newText = textBeforeCursor + "\n" + prefix + textAfterCursor;
    textarea.value = newText;

    // Move the cursor to the end of the inserted text
    const newCursorPosition = cursorPosition + 1 + prefix.length;
    textarea.selectionStart = textarea.selectionEnd = newCursorPosition;
  }

  async clearNote() {
    try {
      if (window.confirm("Clear Note?")) {
        verifyInput($(this.shadowRoot, NOTE_INPUT)).value = "";
        store.dispatch({ type: ACTIONS.CLEAR, payload: this.noteExpires });
      }
    } catch (e) {
      handleError(e);
    }
  }

  async resetTimer() {
    try {
      if (window.confirm("Reset Timer?")) {
        $(this.shadowRoot, DAYS_LEFT).innerHTML = String(
          timestampToDaysFromNow(daysFromNowToTimestamp(DEFAULT_EXPIRATION))
        );
        store.dispatch({ type: ACTIONS.CLEAR, payload: this.noteExpires });
      }
    } catch (e) {
      handleError(e);
    }
  }

  get noteExpires() {
    return this.getAttribute(NoteItemAttributes.NoteExpires) || "0";
  }

  get noteDefaultValue() {
    return this.getAttribute(NoteItemAttributes.NoteDefaultValue) || "";
  }

  async saveNote() {
    try {
      const noteValue = verifyInput($(this.shadowRoot, NOTE_INPUT)).value;
      store.dispatch({
        type: ACTIONS.UPDATE,
        payload: {
          value: noteValue,
          key: this.noteExpires,
        },
      });
    } catch (e) {
      handleError(e);
    }
  }

  async render() {
    const dom = this.shadowRoot;

    verifyInput($(dom, NOTE_INPUT)).value = this.noteDefaultValue;
    this.autoResize();

    $(dom, DAYS_LEFT).innerHTML = String(
      timestampToDaysFromNow(this.noteExpires)
    );
  }
}

export const NoteItem = "note-item";

customElements.define(NoteItem, NoteItemElement);
