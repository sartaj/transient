import {
  encryptData,
  decryptData,
  getPublicKey,
  getPrivateKey,
} from "../encrypted-web-storage/encryption.js";

class NoteComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      const url = new URL("note-component.html", import.meta.url);
      const html = await fetch(url).then((response) => response.text());

      this.shadowRoot.innerHTML = html;
      this.shadowRoot
        .querySelector("#saveButton")
        .addEventListener("click", this.saveNote.bind(this));
      await this.loadNote();
    } catch (e) {
      alert("Failed loading note component.");
      console.error(new Error(e));
    }
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#saveButton")
      .removeEventListener("click", this.saveNote.bind(this));
  }

  async saveNote() {
    try {
      const note = this.shadowRoot.querySelector("#noteInput").value;
      const publicKey = await getPublicKey();
      console.log("publicKey", publicKey);
      const encryptedNote = await encryptData(note, publicKey);
      console.log("encryptedNote", publicKey);
      localStorage.setItem("encryptedNote", encryptedNote);
      alert("Note saved!");
    } catch (e) {
      alert("Failed saving note.");
      console.error(new Error(e));
    }
  }

  async loadNote() {
    const encryptedNote = localStorage.getItem("encryptedNote");
    if (encryptedNote) {
      const privateKey = await getPrivateKey();
      const decryptedNote = await decryptData(encryptedNote, privateKey);
      this.shadowRoot.querySelector("#noteInput").value = decryptedNote;
    }
  }
}

customElements.define("note-component", NoteComponent);
