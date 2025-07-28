export class PolygonManager {
  constructor(contentGroup) {
    this.contentGroup = contentGroup;
    this.items = [];
  }

  setItems(items) {
    this.items = Array.isArray(items) ? items : [];
    this.render();
  }

  render() {
    if (!this.contentGroup) return;

    const existing = new Map();
    this.contentGroup.querySelectorAll(".polygon").forEach((el) => {
      existing.set(el.dataset.id, el);
    });

    this.items.forEach((item) => {
      let el = existing.get(item.id);
      if (!el) {
        el = document.createElementNS("http://www.w3.org/2000/svg", "g");
        el.classList.add("polygon");
        el.setAttribute("draggable", "true");
        el.dataset.id = item.id;
        el.innerHTML = item.svg;
        this.contentGroup.appendChild(el);

        el.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", el.dataset.id);
          e.dataTransfer.effectAllowed = "move";

          this.contentGroup.appendChild(el);

          const id = el.dataset.id;
          const index = this.items.findIndex((i) => i.id === id);
          if (index !== -1) {
            const [it] = this.items.splice(index, 1);
            this.items.push(it);
          }
        });
      }

      if (item.x != null && item.y != null) {
        el.setAttribute("transform", `translate(${item.x},${item.y})`);
      } else {
        el.removeAttribute("transform");
      }

      existing.delete(item.id);
    });

    existing.forEach((el) => el.remove());
  }
}
