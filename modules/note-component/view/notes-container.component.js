import { onVersion } from "../../service-workers/version.client.js";
import {
  $,
  $all,
  handleError,
} from "../../web-component-utils/web-components.utils.js";
import { ACTIONS, store } from "../data/note.state.js";

import { NoteItem, NoteItemAttributes } from "./note-item.component.js";

const VERSION = "#version";
const ADD_NOTE = "#addNote";

export class NotesContainerElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      // Mount
      const url = new URL("notes-container.html", import.meta.url);
      const html = await fetch(url).then((response) => response.text());
      this.shadowRoot.innerHTML = html;

      // Hooks
      $(this.shadowRoot, ADD_NOTE).addEventListener(
        "click",
        this.addNote.bind(this)
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
  }

  async addNote() {
    store.dispatch({
      type: ACTIONS.ADD,
    });
  }

  async render() {
    const dom = this.shadowRoot;
    // Listen for the version from the service worker, and render
    onVersion((version) => {
      $(dom, VERSION).innerHTML = `v.${version}`;
    });

    const keyAttr = NoteItemAttributes.NoteExpires;

    // Listen for changes to the note state and render the child components
    store.listen((state) => {
      const notesContainer = $(dom, "#notesContainer");

      const noteItems = $all(dom, NoteItem);
      const noteKeys = Array.from(noteItems).map((item) =>
        item.getAttribute(keyAttr)
      );

      // Loop through the notes and render the note item components if they don't exist yet.
      state.notes.forEach((note, index) => {
        const indexOfItem = noteKeys.indexOf(note.expires);
        // Check if item already exists
        if (indexOfItem !== -1) {
          noteKeys.splice(indexOfItem, 1); // Remove the key from the array
          return;
        }
        // Add element to the container if it already doesn't exist.
        const noteComponent = document.createElement(NoteItem);
        noteComponent.setAttribute(
          NoteItemAttributes.NoteIndex,
          index.toString()
        ); // Pass index to the child component
        noteComponent.setAttribute(
          NoteItemAttributes.NoteExpires,
          note.expires
        ); // Assuming the expiration is unique
        noteComponent.setAttribute(
          NoteItemAttributes.NoteDefaultValue,
          note.value
        );
        notesContainer.appendChild(noteComponent);
      });

      // Any items left in the array are expired and should be removed
      noteKeys.forEach((key) => {
        const item = $(dom, `[${keyAttr}="${key}"]`);
        item.remove();
      });
    });
  }
}

export const NotesContainer = "notes-container";

customElements.define(NotesContainer, NotesContainerElement);
