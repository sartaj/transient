import { onVersion } from "../../service-workers/version.client.js";
import {
  $,
  $all,
  handleError,
  verifyButton,
} from "../../web-component-utils/web-components.utils.js";
import { ACTIONS, store } from "../data/note.state.js";
import { NoteItem, NoteItemAttributes } from "./note-item.component.js";

const VERSION = "#version";
const ADD_NOTE = "#addNote";
const ACTIVE_NOTES_LIST = "#activeNotesList";
const SHOW_EXPIRED_NOTES = "#showExpiredNotes";
const EXPIRED_LIST = "#expiredNotesList";

export class NotesContainerElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      if (!this.shadowRoot) {
        throw new Error("No shadow root for container.");
      }
      // Mount
      const url = new URL("notes-container.html", import.meta.url);
      const html = await fetch(url).then((response) => response.text());
      this.shadowRoot.innerHTML = html;

      // Hooks
      $(this.shadowRoot, ADD_NOTE).addEventListener(
        "click",
        this.addNote.bind(this)
      );

      $(this.shadowRoot, SHOW_EXPIRED_NOTES).addEventListener(
        "click",
        this.showExpiredNotes.bind(this)
      );

      // Render
      this.render();
    } catch (e) {
      alert("Failed loading notes container component.");
      handleError(e);
    }
  }

  disconnectedCallback() {
    $(this.shadowRoot, ADD_NOTE).removeEventListener(
      "click",
      this.addNote.bind(this)
    );

    $(this.shadowRoot, SHOW_EXPIRED_NOTES).removeEventListener(
      "click",
      this.showExpiredNotes.bind(this)
    );
  }

  async addNote() {
    store.dispatch({
      type: ACTIONS.ADD,
    });
  }

  async showExpiredNotes() {
    const dom = this.shadowRoot;
    this.renderList(EXPIRED_LIST, "expiredNotes", () => {
      const expiredNotesEl = verifyButton($(dom, SHOW_EXPIRED_NOTES));
      expiredNotesEl.innerHTML = "Expired Notes";
      expiredNotesEl.style.background = "transparent";
      expiredNotesEl.disabled = true;
      expiredNotesEl.style.cursor = "default";
    });
  }

  /**
   *
   * @param {string} notesListId
   * @param {"notes" | "expiredNotes"} notesKey
   * @param {Function} [afterRender]
   */
  async renderList(notesListId, notesKey, afterRender) {
    const dom = this.shadowRoot;

    const keyAttr = NoteItemAttributes.NoteId;

    // Listen for changes to the note state and render the child components
    store.listen((state) => {
      const notesContainer = $(dom, notesListId);

      const noteItems = $all(notesContainer, NoteItem);
      const noteKeys = Array.from(noteItems).map((item) =>
        item.getAttribute(keyAttr)
      );

      // Loop through the notes and render the note item components if they don't exist yet
      state[notesKey].forEach((note) => {
        const indexOfItem = noteKeys.indexOf(note.expires);
        // Check if item already exists, if it does, ignore re-rendering
        if (indexOfItem !== -1) {
          noteKeys.splice(indexOfItem, 1); // Remove the key from the array
          return;
        }

        // Add element to the container if it already doesn't exist
        const noteComponent = document.createElement(NoteItem);

        // Assuming the id is unique
        noteComponent.setAttribute(NoteItemAttributes.NoteId, note.id);

        // Set expiration
        noteComponent.setAttribute(
          NoteItemAttributes.NoteExpires,
          note.expires
        );

        // Set expiration
        noteComponent.setAttribute(
          NoteItemAttributes.NoteDisabled,
          note.disabled
        );

        // Set default value
        noteComponent.setAttribute(
          NoteItemAttributes.NoteDefaultValue,
          note.value
        );

        // Prepend because we are going backwards
        notesContainer.prepend(noteComponent);
      });

      // Any items left in the array are expired and should be removed
      noteKeys.forEach((key) => {
        const item = $(dom, `[${keyAttr}="${key}"]`);
        item.remove();
      });

      // Run the after render hook
      if (afterRender) {
        afterRender();
      }
    });
  }

  async render() {
    const dom = this.shadowRoot;
    // Listen for the version from the service worker, and render
    onVersion((version) => {
      $(dom, VERSION).innerHTML = `v.${version}`;
    });

    let componentJustMounted = true;
    await this.renderList(ACTIVE_NOTES_LIST, "notes", () => {
      // Focus on the first note when the component just mounted
      if (componentJustMounted) {
        componentJustMounted = false;
        // Focus on the first note. Hack the next frame by setting a timeout
        setTimeout(() => {
          const firstNote = $(dom, NoteItem);
          const firstTextArea = $(firstNote.shadowRoot, "textarea");
          firstTextArea.focus();
        }, 300);
      }
    });
  }
}

export const NotesContainer = "notes-container";

customElements.define(NotesContainer, NotesContainerElement);
