import { store } from "../data/note.state.js";
import { handleError, $ } from "./web-components.utils.js";
import { onVersion } from "../../service-workers/version.client.js";

import "./note-item.component.js";
const VERSION = "#version";

export class NotesContainerComponent extends HTMLElement {
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

      // Render
      this.render();
    } catch (e) {
      alert("Failed loading notes container component.");
      handleError(e);
    }
  }

  async render() {
    const dom = this.shadowRoot;
    // Listen for the version from the service worker, and render
    onVersion((version) => {
      $(dom, VERSION).innerHTML = `v.${version}`;
    });

    // Listen for changes to the note state and render the child components
    store.listen((state) => {
      const notesContainer = $(dom, "#notesContainer");
      // Loop through the notes and render the note item components if they don't exist yet.
      state.notes.forEach((note, index) => {
        // Check if item already exists
        // todo: make it based on a key and not an index, or there may be bugs while rerendering.
        if (dom.querySelector(`note-item[note-index="${index}"]`)) {
          return;
        }
        // Add element to the container if it already doesn't exist.
        const noteComponent = document.createElement("note-item");
        noteComponent.setAttribute("note-index", index); // Pass index to the child component
        notesContainer.appendChild(noteComponent);
      });
    });
  }
}

customElements.define("notes-container", NotesContainerComponent);
