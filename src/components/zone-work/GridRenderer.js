export class GridRenderer {
  constructor(svg, gridGroup, axesGroup, gridStep) {
    this.svg = svg;
    this.gridGroup = gridGroup;
    this.axesGroup = axesGroup;
    this.gridStep = gridStep;
  }

  render(scale, translateX, translateY) {
    if (!this.svg) return;

    const width = this.svg.clientWidth;
    const height = this.svg.clientHeight;

    this.gridGroup.innerHTML = "";
    this.axesGroup.innerHTML = "";

    let step = this.gridStep;
    let rawStep = step / scale;
    const niceSteps = [1, 2, 5, 10];
    let magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    let normalized = rawStep / magnitude;
    let niceStep = niceSteps.find((s) => normalized <= s) || 10;
    step = niceStep * magnitude * scale;

    const offsetX = translateX % step;
    const offsetY = translateY % step;

    const logicalOffsetX = -translateX / scale;
    const startValX = Math.floor(logicalOffsetX / 10) * 10;

    const logicalOffsetY = -translateY / scale;
    const startValY = Math.floor(logicalOffsetY / 10) * 10;

    for (let x = offsetX; x <= width; x += step) {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", x);
      line.setAttribute("y1", 0);
      line.setAttribute("x2", x);
      line.setAttribute("y2", height);
      line.classList.add("grid-line");
      this.gridGroup.appendChild(line);

      const i = Math.round((x - offsetX) / step);
      const val = startValX + i * 10;
      if (val >= 0) {
        const text = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        text.setAttribute("x", x);
        text.setAttribute("y", height - 5);
        text.setAttribute("text-anchor", "middle");
        text.classList.add("axis-label");
        text.textContent = val;
        this.gridGroup.appendChild(text);
      }
    }

    for (let y = offsetY; y <= height; y += step) {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      line.setAttribute("x1", 0);
      line.setAttribute("y1", y);
      line.setAttribute("x2", width);
      line.setAttribute("y2", y);
      line.classList.add("grid-line");
      this.gridGroup.appendChild(line);

      const i = Math.round((height - y - offsetY) / step);
      const valY = startValY + i * 10;

      if (valY === 0) continue;
      if (valY >= 0) {
        const textY = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        textY.setAttribute("x", 0);
        textY.setAttribute("y", y);
        textY.classList.add("axis-label");
        textY.textContent = valY;
        this.gridGroup.appendChild(textY);
      }
    }
  }
}
