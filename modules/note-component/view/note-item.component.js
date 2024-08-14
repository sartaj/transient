import { ACTIONS, isNoteObj, store } from "../data/note.state.js";
import { timestampToDaysFromNow } from "../data/note.utils.js";
import {
  $,
  handleError,
  verifyInput,
} from "../../web-component-utils/web-components.utils.js";

// Inputs
const CLEAR_BUTTON = "#clearButton";
const NOTE_INPUT = "#noteInput";

// Template elements
const DAYS_LEFT = "#daysLeft";

export const NoteItemAttributes = {
  NoteIndex: "note-index",
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
      // Mount
      const url = new URL("note-item.html", import.meta.url);
      const html = await fetch(url).then((response) => response.text());
      this.shadowRoot.innerHTML = html;

      // Get note index from attribute
      this.noteIndex =
        parseInt(this.getAttribute(NoteItemAttributes.NoteIndex), 10) || 0;

      this.noteExpires = this.getAttribute(NoteItemAttributes.NoteExpires) || 0;

      this.noteDefaultValue =
        this.getAttribute(NoteItemAttributes.NoteDefaultValue) || "";

      // Hooks
      $(this.shadowRoot, CLEAR_BUTTON).addEventListener(
        "click",
        this.clearNote.bind(this)
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

    $(this.shadowRoot, NOTE_INPUT).removeEventListener(
      "input",
      this.handeInput.bind(this)
    );

    $(this.shadowRoot, NOTE_INPUT).removeEventListener(
      "keydown",
      this.handleKeyDown,
      true
    );
  }

  autoResize() {
    const element = $(this.shadowRoot, NOTE_INPUT);
    console.log(element.scrollHeight);
    element.style.height = "5px";
    element.style.height = element.scrollHeight + "px";
  }

  handleInput() {
    this.autoResize();
    this.saveNote();
  }

  handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default enter key behavior
      this.insertNewLine(event);
      this.autoResize();
    }
  }

  /**
   * Insert special markdown characters into the mix.
   */
  insertNewLine(event) {
    const textarea = this.shadowRoot.querySelector(NOTE_INPUT);
    const cursorPosition = textarea.selectionStart;
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
      if (pattern.test(previousLine.trim())) {
        prefix = previousLine.trim().match(pattern)[0] + " ";
        break;
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
        store.dispatch({ type: ACTIONS.CLEAR, payload: this.noteIndex });
      }
    } catch (e) {
      handleError(e);
    }
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
