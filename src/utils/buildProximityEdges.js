const MAX_DISTANCE = 95;

function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function buildProximityEdges(nodes) {
  const edges = [];
  const seen = new Set();

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];
      const dist = distance(a, b);

      if (dist <= MAX_DISTANCE && dist > 0) {
        const key = a.id < b.id ? `${a.id}--${b.id}` : `${b.id}--${a.id}`;
        if (!seen.has(key)) {
          seen.add(key);
          const weight = Math.round(dist * 10) / 10;
          edges.push({ from: a.id, to: b.id, weight });
        }
      }
    }
  }

  return edges;
}
