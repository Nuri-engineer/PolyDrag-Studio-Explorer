export class TransformController {
  constructor() {
    this.scale = 1;
    this.minScale = 0.2;
    this.maxScale = 5;
    this.translateX = 0;
    this.translateY = 0;

    this.isPanning = false;
    this.panStart = { x: 0, y: 0 };
    this.panTranslateStart = { x: 0, y: 0 };
  }

  setScale(newScale, centerX, centerY) {
    const clamped = Math.min(this.maxScale, Math.max(this.minScale, newScale));

    this.translateX =
      centerX - ((centerX - this.translateX) * clamped) / this.scale;
    this.translateY =
      centerY - ((centerY - this.translateY) * clamped) / this.scale;

    this.scale = clamped;
  }

  startPan(x, y) {
    this.isPanning = true;
    this.panStart = { x, y };
    this.panTranslateStart = { x: this.translateX, y: this.translateY };
  }

  panTo(x, y) {
    if (!this.isPanning) return;

    const dx = x - this.panStart.x;
    const dy = y - this.panStart.y;

    this.translateX = this.panTranslateStart.x + dx;
    this.translateY = this.panTranslateStart.y + dy;
  }

  endPan() {
    this.isPanning = false;
  }

  startPan(x, y) {
    this.isPanning = true;
    this.panStart = { x, y };
    this.panTranslateStart = { x: this.translateX, y: this.translateY };
  }

  panTo(x, y) {
    if (!this.isPanning) return;

    const dx = x - this.panStart.x;
    const dy = y - this.panStart.y;

    this.translateX = this.panTranslateStart.x + dx;
    this.translateY = this.panTranslateStart.y + dy;
  }

  endPan() {
    this.isPanning = false;
  }
}
