import { onVersion } from "../service-workers/version.client.js";
import { store, ACTIONS } from "./note-component.data.js";
import { timestampToDaysFromNow } from "./date.utils.js";

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
      // Mount
      const url = new URL("note-component.html", import.meta.url);
      const html = await fetch(url).then((response) => response.text());
      this.shadowRoot.innerHTML = html;

      // Hooks
      this.shadowRoot
        .querySelector(SAVE_BUTTON)
        .addEventListener("click", this.saveNote.bind(this));

      this.shadowRoot
        .querySelector(CLEAR_BUTTON)
        .addEventListener("click", this.clearNote.bind(this));

      // window.addEventListener("keydown", this.handleKeyDown.bind(this), true);
      window.addEventListener("keyup", this.handleKeyUp.bind(this), true);

      // Render
      this.render();
    } catch (e) {
      alert("Failed loading note component.");
      console.error(new Error(e));
    }
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector(SAVE_BUTTON)
      .removeEventListener("click", this.saveNote.bind(this));

    this.shadowRoot
      .querySelector(CLEAR_BUTTON)
      .removeEventListener("click", this.clearNote.bind(this));

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
   * @param {KeyboardEvent} event
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
        this.shadowRoot.querySelector(NOTE_INPUT).value = "";
        store.dispatch({ type: ACTIONS.CLEAR });
      }
    } catch (e) {
      console.error(new Error(e));
    }
  }

  async saveNote() {
    try {
      const note = this.shadowRoot.querySelector(NOTE_INPUT).value;
      store.dispatch({ type: ACTIONS.UPDATE, value: { value: note } });
    } catch (e) {
      console.error(new Error(e));
    }
  }

  async render() {
    onVersion((version) => {
      this.shadowRoot.querySelector(VERSION).innerHTML = `v.${version}`;
    });

    store.listen((state) => {
      const thisItem = state.notes[0];
      if (typeof thisItem === "object" && thisItem !== null) {
        this.shadowRoot.querySelector(NOTE_INPUT).value = thisItem.value;
        this.shadowRoot.querySelector(DAYS_LEFT).innerHTML =
          timestampToDaysFromNow(thisItem.expires);
      }
    });
  }
}
