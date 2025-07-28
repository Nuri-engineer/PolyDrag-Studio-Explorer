const MAX_ATTEMPTS_MULTIPLIER = 10;

export function generateRandomPolygon(id) {
  const vertexCount = Math.floor(Math.random() * 4) + 3;
  const baseRadius = Math.floor(Math.random() * 40) + 30;
  const centerX = 50,
    centerY = 50;
  const points = [];
  for (let i = 0; i < vertexCount; i++) {
    const angle = (2 * Math.PI * i) / vertexCount;
    let radius;
    if (i % 2 === 0) {
      radius =
        baseRadius * (0.7 + Math.random() * 1) * (Math.random() > 0.5 ? 1 : 1);
    } else {
      radius = baseRadius * (1 + Math.random() * 1);
    }

    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  const color = "#9d3a60ff";
  const svg = `<svg width="100" height="100"><polygon points="${points.join(" ")}" fill="${color}" stroke="#333" stroke-width="2"/></svg>`;
  return { id, svg };
}

export function generateUniquePolygons(count) {
  const uniquePolygons = [];
  const signatures = new Set();
  let attempts = 0;
  const maxAttempts = count * MAX_ATTEMPTS_MULTIPLIER;

  while (uniquePolygons.length < count && attempts < maxAttempts) {
    const poly = generateRandomPolygon(`poly${uniquePolygons.length}`);
    const signature = poly.svg.match(/points="([^"]+)"/)?.[1] || "";

    if (!signatures.has(signature)) {
      signatures.add(signature);
      uniquePolygons.push(poly);
    }
    attempts++;
  }
  return uniquePolygons;
}
