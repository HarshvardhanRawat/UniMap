/**
 * Multi‑Map Navigation Utilities
 *
 * High‑level route computation for the UniMap project.
 * Works on the full node + edge datasets and produces
 * map‑segmented navigation steps that the UI can render
 * per SVG map.
 */

import { dijkstra } from './dijkstra';

/**
 * Builds an adjacency graph from a flat list of edges.
 * The graph is map‑agnostic; segmentation happens later.
 *
 * @param {Array} navigationEdges
 * @returns {Record<string, Array<{node: string, weight: number}>>}
 */
export function buildGlobalGraph(navigationEdges) {
  const graph = {};

  navigationEdges.forEach((edge) => {
    const from = edge.from_node ?? edge.from;
    const to = edge.to_node ?? edge.to;
    const w = edge.distance ?? edge.weight ?? 1;
    if (!from || !to) return;

    if (!graph[from]) graph[from] = [];
    if (!graph[to]) graph[to] = [];

    // Bidirectional edges
    graph[from].push({ node: to, weight: w });
    graph[to].push({ node: from, weight: w });
  });

  return graph;
}

/**
 * Builds a quick lookup map from node ID to node object.
 *
 * @param {Array} navigationNodes
 * @returns {Record<string, any>}
 */
export function buildNodesMap(navigationNodes) {
  return Object.fromEntries(navigationNodes.map((n) => [n.id, n]));
}

/**
 * Splits a global Dijkstra path into per‑map steps.
 *
 * Each step is a contiguous sequence of nodes that all belong to
 * the same map (based on node.map). Whenever the map changes in the
 * path, a new step is started.
 *
 * Example step shape:
 * {
 *   step: 1,
 *   map: "Campus_Map",
 *   start_node: "Main_Gate",
 *   end_node: "ENTRY01",
 *   path_nodes: [...] // ordered node IDs
 * }
 *
 * @param {string[]} path - ordered node IDs from Dijkstra
 * @param {Record<string, any>} nodesMap - nodeId -> node (with .map)
 * @returns {Array} navigationSteps
 */
export function segmentPathByMap(path, nodesMap) {
  if (!path || path.length === 0) return [];

  const steps = [];

  let currentMap = nodesMap[path[0]]?.map ?? null;
  let stepStartIndex = 0;
  let stepNumber = 1;

  for (let i = 1; i < path.length; i++) {
    const nodeId = path[i];
    const node = nodesMap[nodeId];
    const nodeMap = node?.map ?? null;

    if (nodeMap !== currentMap) {
      // Map boundary at index i:
      // - previous node (i-1) is the end of the current step
      // - current node (i) starts the new step
      const prevIndex = i - 1;
      const prevNodeId = path[prevIndex];

      steps.push({
        step: stepNumber++,
        map: currentMap,
        start_node: path[stepStartIndex],
        end_node: prevNodeId,
        path_nodes: path.slice(stepStartIndex, prevIndex + 1),
      });

      currentMap = nodeMap;
      stepStartIndex = i;
    }
  }

  // Final step
  if (stepStartIndex < path.length) {
    steps.push({
      step: stepNumber,
      map: currentMap,
      start_node: path[stepStartIndex],
      end_node: path[path.length - 1],
      path_nodes: path.slice(stepStartIndex),
    });
  }

  return steps;
}

/**
 * Computes a multi‑map route between two nodes.
 *
 * 1. Builds a global graph from edges
 * 2. Runs Dijkstra across the entire graph
 * 3. Segments the resulting path into per‑map steps
 *
 * @param {Array} navigationNodes
 * @param {Array} navigationEdges
 * @param {string} startNodeId
 * @param {string} endNodeId
 * @returns {{ steps: Array, fullPath: string[] } | null}
 */
export function computeMultiMapRoute(
  navigationNodes,
  navigationEdges,
  startNodeId,
  endNodeId,
) {
  const nodesMap = buildNodesMap(navigationNodes);
  const graph = buildGlobalGraph(navigationEdges);

  if (!nodesMap[startNodeId] || !nodesMap[endNodeId]) {
    return null;
  }

  const path = dijkstra(graph, startNodeId, endNodeId);
  if (!path || path.length === 0) {
    return null;
  }

  const steps = segmentPathByMap(path, nodesMap);
  return { steps, fullPath: path };
}

