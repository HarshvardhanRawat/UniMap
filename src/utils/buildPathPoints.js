export function buildPathPoints(path, nodes) {
    return path.map(id => `${nodes[id].x},${nodes[id].y}`).join(" ");
  }
  