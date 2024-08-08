import { createEncryptedLocalStorage } from "../encrypted-web-storage/encrypted-local-storage.js";

const LOCALSTORAGE_KEY = "encryptedNote";

const SAVE_BUTTON = "#saveButton";
const CLEAR_BUTTON = "#clearButton";
const NOTE_INPUT = "#noteInput";

customElements.define(
  "note-component",
  class NoteComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.encryptedLocalStorage = createEncryptedLocalStorage({
        key: LOCALSTORAGE_KEY,
      });
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

        window.addEventListener("keydown", this.handleKeyDown.bind(this), true);

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

      // if we needed keyboard shortcuts like ctrl+s
      // window.removeEventListener("keydown", this.handleKeyDown, true);
    }

    // For saving while typing
    handleKeyDown(event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default enter key behavior
        this.insertNewLine(event);
      }
      this.saveNote();
    }

    /**
     * Insert special markdown characters into the mix.
     * @param {KeyboardEvent} event
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
          this.shadowRoot.querySelector(NOTE_INPUT).value = "";
          await this.encryptedLocalStorage.clear();
        }
      } catch (e) {
        console.error(new Error(e));
      }
    }

    async saveNote() {
      try {
        const note = this.shadowRoot.querySelector(NOTE_INPUT).value;
        await this.encryptedLocalStorage.setItem(note);
      } catch (e) {
        console.error(new Error(e));
      }
    }

    async render() {
      const decryptedNote = await this.encryptedLocalStorage.getItem();
      this.shadowRoot.querySelector(NOTE_INPUT).value = decryptedNote;
    }
  }
);
