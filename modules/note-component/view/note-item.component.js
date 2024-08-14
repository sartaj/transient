import { ACTIONS, isNoteObj, store } from "../data/note.state.js";
import { timestampToDaysFromNow } from "../data/note.utils.js";
import {
  $,
  handleError,
  verifyInput,
} from "../../web-component-utils/web-components.utils.js";

// Inputs
const SAVE_BUTTON = "#saveButton";
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

    window.removeEventListener("keyup", this.handleKeyUp, true);
  }

  handleKeyUp() {
    this.saveNote();
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

    $(dom, DAYS_LEFT).innerHTML = String(
      timestampToDaysFromNow(this.noteExpires)
    );
  }
}

export const NoteItem = "note-item";

customElements.define(NoteItem, NoteItemElement);
