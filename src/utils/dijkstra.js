export function dijkstra(graph, start, end) {
    const distances = {};
    const prev = {};
    const visited = new Set();
  
    Object.keys(graph).forEach(node => {
      distances[node] = Infinity;
    });
  
    distances[start] = 0;
  
    while (true) {
      let closestNode = null;
  
      for (let node in distances) {
        if (!visited.has(node)) {
          if (!closestNode || distances[node] < distances[closestNode]) {
            closestNode = node;
          }
        }
      }
  
      if (!closestNode) break;
      if (closestNode === end) break;
  
      visited.add(closestNode);
  
      graph[closestNode].forEach(neighbour => {
        const newDist = distances[closestNode] + neighbour.weight;
        if (newDist < distances[neighbour.node]) {
          distances[neighbour.node] = newDist;
          prev[neighbour.node] = closestNode;
        }
      });
    }
  
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
  