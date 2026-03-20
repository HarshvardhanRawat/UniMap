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

  // Initialize all distances to Infinity
  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
  });

  // If start isn't in the graph, return an empty map.
  if (!(start in distances)) return {};

  distances[start] = 0;

  class MinHeap {
    constructor() {
      this.heap = [];
    }
    push(item) {
      this.heap.push(item);
      this.bubbleUp(this.heap.length - 1);
    }
    pop() {
      if (this.heap.length === 0) return null;
      const min = this.heap[0];
      const last = this.heap.pop();
      if (this.heap.length > 0) {
        this.heap[0] = last;
        this.bubbleDown(0);
      }
      return min;
    }
    get size() {
      return this.heap.length;
    }
    bubbleUp(i) {
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (this.heap[p][0] <= this.heap[i][0]) return;
        [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
        i = p;
      }
    }
    bubbleDown(i) {
      const n = this.heap.length;
      while (true) {
        const l = i * 2 + 1;
        const r = l + 1;
        let smallest = i;
        if (l < n && this.heap[l][0] < this.heap[smallest][0]) smallest = l;
        if (r < n && this.heap[r][0] < this.heap[smallest][0]) smallest = r;
        if (smallest === i) return;
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      }
    }
  }

  const heap = new MinHeap();
  heap.push([0, start]);

  while (heap.size > 0) {
    const popped = heap.pop();
    if (!popped) break;
    const [d, u] = popped;
    if (d !== distances[u]) continue; // stale entry

    const neighbours = graph?.[u] ?? [];
    for (const neighbour of neighbours) {
      if (!neighbour || typeof neighbour.node !== 'string' || typeof neighbour.weight !== 'number') continue;
      const v = neighbour.node;
      if (!(v in distances)) distances[v] = Infinity;

      const newDist = distances[u] + neighbour.weight;
      if (newDist < distances[v]) {
        distances[v] = newDist;
        heap.push([newDist, v]);
      }
    }
  }

  return distances;
}
