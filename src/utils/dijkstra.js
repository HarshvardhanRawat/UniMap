/**
 * Dijkstra's Algorithm Implementation
 * 
 * Finds the shortest path between two nodes in a weighted graph.
 * Uses a greedy approach to explore nodes and find the optimal route.
 * 
 * @param {object} graph - Graph representation as an object where keys are node IDs
 *                        and values are arrays of {node: string, weight: number} objects
 * @param {string} start - Starting node ID
 * @param {string} end - Destination node ID
 * @returns {array|null} - Array of node IDs representing the shortest path, or null if no path exists
 * 
 * @example
 * const graph = {
 *   'A': [{node: 'B', weight: 1}, {node: 'C', weight: 4}],
 *   'B': [{node: 'A', weight: 1}, {node: 'C', weight: 2}],
 *   'C': [{node: 'A', weight: 4}, {node: 'B', weight: 2}]
 * };
 * dijkstra(graph, 'A', 'C'); // Returns ['A', 'B', 'C']
 */
export function dijkstra(graph, start, end) {
    // Distance from start node to each node (initialized to Infinity)
    const distances = {};
    // Previous node in the shortest path (for path reconstruction)
    const prev = {};
    // Set of visited nodes
    const visited = new Set();
  
    // Initialize all distances to Infinity
    Object.keys(graph).forEach(node => {
      distances[node] = Infinity;
    });
  
    // Distance from start to itself is 0
    distances[start] = 0;
  
    // Main algorithm loop
    while (true) {
      let closestNode = null;
  
      // Find the unvisited node with the smallest distance
      for (let node in distances) {
        if (!visited.has(node)) {
          if (!closestNode || distances[node] < distances[closestNode]) {
            closestNode = node; 
            closestNode - node;
          }
        }
      }
  
      // No more nodes to visit or reached destination
      if (!closestNode) break;
      if (closestNode === end) break;
  
      // Mark current node as visited
      visited.add(closestNode);
  
      // Update distances to neighbors
      graph[closestNode].forEach(neighbour => {
        const newDist = distances[closestNode] + neighbour.weight;
        // If found shorter path, update distance and previous node
        if (newDist < distances[neighbour.node]) {
          distances[neighbour.node] = newDist;
          prev[neighbour.node] = closestNode;
        }
      });
    }
  
    // Reconstruct path from end to start
    const path = [];
    let current = end;
  
    while (current) {
      path.unshift(current);
      current = prev[current];
    }
  
    // No path found if we didn't reach start
    if (path.length > 0 && path[0] !== start) {
      return null;
    }
    return path;
  }

/**
 * Dijkstra variant that returns the shortest distance from `start`
 * to all reachable nodes in the graph.
 *
 * @param {object} graph - { [nodeId]: Array<{ node: string, weight: number }> }
 * @param {string} start - Starting node ID
 * @returns {Record<string, number>} distances map (Infinity for unreachable nodes)
 */
export function dijkstraDistances(graph, start) {
  if (!graph || typeof graph !== 'object') return {};

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

    // Find the unvisited node with the smallest distance
    for (const node in distances) {
      if (!visited.has(node)) {
        if (!closestNode || distances[node] < distances[closestNode]) {
          closestNode = node;
        }
      }
    }

    // No more nodes to visit
    if (!closestNode) break;

    visited.add(closestNode);

    const neighbours = graph[closestNode] ?? [];
    neighbours.forEach((neighbour) => {
      const newDist = distances[closestNode] + neighbour.weight;
      if (newDist < distances[neighbour.node]) {
        distances[neighbour.node] = newDist;
      }
    });
  }

  return distances;
}
  