import "./components/zone-buffer/Zone-buffer.js";
import "./components/zone-work/Zone-work.js";
import { generateUniquePolygons } from "./utils/polygon-utils.js";
import { HelpModal } from "./components/HelpModal.js";
import "./styles.css";
import "../webcomp-boilerplate.js";

const STORAGE_KEY = "polygons";
const MAX_POLYGONS = 20;
const MIN_POLYGONS = 5;
const POLYGON_RANGE = MAX_POLYGONS - MIN_POLYGONS + 1;

class PolygonManager {
  constructor() {
    this.bufferItems = [];
    this.workItems = [];
    this.elements = {
      bufferZone: document.getElementById("bufferZone"),
      workZone: document.getElementById("workZone"),
      saveBtn: document.getElementById("saveBtn"),
      resetBtn: document.getElementById("resetBtn"),
      createBtn: document.getElementById("createBtn"),
    };
  }

  init() {
    this.loadPolygons();
    this.setupEventListeners();
    this.updateComponents();
  }

  loadPolygons() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const { work = [] } = JSON.parse(saved);
      this.workItems = Array.isArray(work) ? work : [];
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  }

  savePolygons() {
    try {
      const data = { work: this.workItems };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.showFeedback("Сохранено!");
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      this.showFeedback("Ошибка сохранения!", true);
    }
  }

  resetPolygons() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      this.workItems = [];
      this.updateComponents();
      this.showFeedback("Данные сброшены!");
    } catch (error) {
      console.error("Ошибка при сбросе:", error);
      this.showFeedback("Ошибка сброса!", true);
    }
  }

  generateNewPolygons() {
    const count = Math.floor(Math.random() * POLYGON_RANGE) + MIN_POLYGONS;
    this.bufferItems = generateUniquePolygons(count);
    this.updateComponents();
  }

  updateComponents() {
    const { bufferZone, workZone } = this.elements;

    if (bufferZone.data !== this.bufferItems) {
      bufferZone.data = this.bufferItems;
    }

    if (workZone.data !== this.workItems) {
      workZone.data = this.workItems;
    }

    workZone.availablePolygons = [...this.bufferItems, ...this.workItems];
  }

  setupEventListeners() {
    const { createBtn, saveBtn, resetBtn } = this.elements;

    createBtn.addEventListener("click", () => this.generateNewPolygons());
    saveBtn.addEventListener("click", () => this.savePolygons());
    resetBtn.addEventListener("click", () => this.resetPolygons());
  }

  showFeedback(message, isError = false) {
    alert(message);
    if (isError) {
      console.error(message);
    } else {
      console.log(message);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const requiredElements = [
    "bufferZone",
    "workZone",
    "saveBtn",
    "resetBtn",
    "createBtn",
  ];
  const elementsExist = requiredElements.every((id) =>
    document.getElementById(id)
  );

  if (!elementsExist) {
    console.error("Не все необходимые элементы найдены в DOM");
    return;
  }

  const polygonManager = new PolygonManager();
  polygonManager.init();

  const helpModal = new HelpModal();
  helpModal.init();
});
