import { GridRenderer } from "./GridRenderer.js";
import { PolygonManager } from "./PolygonManager.js";
import { TransformController } from "./TransformController.js";

export class ZoneWork extends HTMLElement {
  constructor() {
    super();
    this.items = [];
    this._availablePolygons = [];

    this.gridStep = 50;

    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border: 1px solid #ccc;
          user-select: none;
          overflow: hidden;
          position: relative;
          height: 300px;
        }
        svg {
          width: 100%;
          height: 100%;
          background: #fafafa;
          cursor: grab;
        }
        svg:active {
          cursor: grabbing;
        }
        .polygon {
          cursor: grab;
        }
        text.axis-label {
          font-size: 10px;
          fill: #666;
          user-select: none;
        }
        line.grid-line {
          stroke: #ddd;
          stroke-width: 1;
        }
        line.axis-line {
          stroke: #333;
          stroke-width: 2;
        }
      </style>
      <svg tabindex="0">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" 
                  orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#333" />
          </marker>
        </defs>
        <g class="grid"></g>
        <g class="axes"></g>
        <g class="content" transform="translate(0,0) scale(1)"></g>
      </svg>
    `;

    this.svg = this.shadowRoot.querySelector("svg");
    this.gridGroup = this.svg.querySelector("g.grid");
    this.axesGroup = this.svg.querySelector("g.axes");
    this.contentGroup = this.svg.querySelector("g.content");

    this.transformController = new TransformController();
    this.gridRenderer = new GridRenderer(
      this.svg,
      this.gridGroup,
      this.axesGroup,
      this.gridStep
    );
    this.polygonManager = new PolygonManager(this.contentGroup);

    this.svg.addEventListener("wheel", this.onWheel.bind(this), {
      passive: false,
    });
    this.svg.addEventListener("mousedown", this.onMouseDown.bind(this));
    window.addEventListener("mouseup", this.onMouseUp.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));

    this.svg.addEventListener("dragover", this.onDragOver.bind(this));
    this.svg.addEventListener("drop", this.onDrop.bind(this));

    this.render();
  }

  set data(items) {
    this.items = Array.isArray(items) ? items : [];
    this.polygonManager.setItems(this.items);
    this.render();
  }

  set availablePolygons(polygons) {
    this._availablePolygons = Array.isArray(polygons) ? polygons : [];
  }

  get availablePolygons() {
    return this._availablePolygons || [];
  }

  render() {
    this.polygonManager.render();
    this.updateTransform();
    this.gridRenderer.render(
      this.transformController.scale,
      this.transformController.translateX,
      this.transformController.translateY
    );
  }

  updateTransform() {
    const { translateX, translateY, scale } = this.transformController;
    this.contentGroup.setAttribute(
      "transform",
      `translate(${translateX},${translateY}) scale(${scale})`
    );
  }

  onWheel(e) {
    e.preventDefault();
    const rect = this.svg.getBoundingClientRect();
    const svgX = e.clientX - rect.left;
    const svgY = e.clientY - rect.top;

    const scaleAmount = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = this.transformController.scale * scaleAmount;

    this.transformController.setScale(newScale, svgX, svgY);
    this.render();
  }

  onMouseDown(e) {
    if (e.button !== 0) return;
    this.transformController.startPan(e.clientX, e.clientY);
    this.svg.style.cursor = "grabbing";
  }

  onMouseMove(e) {
    if (!this.transformController.isPanning) return;
    this.transformController.panTo(e.clientX, e.clientY);
    this.render();
  }

  onMouseUp(e) {
    if (e.button !== 0) return;
    this.transformController.endPan();
    this.svg.style.cursor = "grab";
  }

  onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  onDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;

    if (this.items.find((item) => item.id === id)) return;

    const polygon = this.availablePolygons.find((p) => p.id === id);
    if (!polygon) return;

    // Удаляем полигон из других зон
    document.querySelectorAll("zone-work").forEach((zone) => {
      if (zone === this) return;
      const index = zone.items.findIndex((item) => item.id === id);
      if (index !== -1) {
        zone.items.splice(index, 1);
        zone.render();
      }
    });

    const scenePoint = this.getScenePoint(e.clientX, e.clientY);

    const positionedPolygon = {
      ...polygon,
      x: scenePoint.x,
      y: scenePoint.y,
      svg: polygon.svg.replace(
        "<g ",
        `<g transform="translate(${scenePoint.x},${scenePoint.y})" `
      ),
    };

    this.items.push(positionedPolygon);
    this.polygonManager.setItems(this.items);
    this.render();
  }

  getScenePoint(screenX, screenY) {
    const rect = this.svg.getBoundingClientRect();
    const svgHeight = this.svg.clientHeight;
    const { translateX, translateY, scale } = this.transformController;
    return {
      x: (screenX - rect.left - translateX) / scale,
      y: (svgHeight - (screenY - rect.top) - translateY) / scale,
    };
  }
}

customElements.define("zone-work", ZoneWork);
