/**
 * Dijkstra variant that returns the shortest distance from `start`
 * to all reachable nodes in the graph.
 *
 * @param {object} graph - { [nodeId]: Array<{ node: string, weight: number }> }
 * @param {string} start - Starting node ID
 * @returns {Record<string, number>} distances map (Infinity for unreachable nodes)
 */
export function dijkstraDistances(graph, start) {
  if (!graph || typeof graph !== 'object' || start == null) return {};

  const distances = {};
  const visited = new Set();

  // Initialize all distances to Infinity
  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
  });

  // If start isn't in the graph, return an empty map.
  if (!(start in distances)) return {};

  distances[start] = 0;

  while (true) {
    let closestNode = null;
    let closestDistance = Infinity;

    // Find the unvisited node with the smallest distance
    for (const node in distances) {
      if (!visited.has(node) && distances[node] < closestDistance) {
        closestDistance = distances[node];
        closestNode = node;
      }
    }

    // No more nodes to visit
    if (closestNode === null) break;

    visited.add(closestNode);

    const neighbours = graph[closestNode] ?? [];
    for (const neighbour of neighbours) {
      if (!neighbour || typeof neighbour.node !== 'string' || typeof neighbour.weight !== 'number') continue;
      if (!(neighbour.node in distances)) {
        distances[neighbour.node] = Infinity;
      }
      const newDist = distances[closestNode] + neighbour.weight;
      if (newDist < distances[neighbour.node]) {
        distances[neighbour.node] = newDist;
      }
    }
  }

  return distances;
}
