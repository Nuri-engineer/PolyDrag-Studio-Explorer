class ZoneBuffer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.items = [];
    this.container = document.createElement("div");
    this.shadowRoot.appendChild(this.container);

    this.container.addEventListener("dragstart", (e) => {
      const polygon = e.target.closest(".polygon");
      if (polygon) {
        e.dataTransfer.setData("text/plain", polygon.dataset.id);
      }
    });

    const style = document.createElement("style");
    style.textContent = `
      .polygon {
          margin: 8px;
          cursor: grab;
          display: inline-block;
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  set data(items) {
    if (!Array.isArray(items)) return;
    this.items = items;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.items.length) {
      this.container.innerHTML = `<p>Нет полигонов</p>`;
      return;
    }

    const fragment = document.createDocumentFragment();

    this.items.forEach((item) => {
      const div = document.createElement("div");
      div.className = "polygon";
      div.draggable = true;
      div.dataset.id = item.id;
      div.innerHTML = item.svg;
      fragment.appendChild(div);
    });

    this.container.innerHTML = "";
    this.container.appendChild(fragment);
  }
}

customElements.define("zone-buffer", ZoneBuffer);
