/**
 * Builds a smooth SVG path using cubic Bezier curves.
 * Creates curved paths between points for a more natural appearance.
 * 
 * @param {array} points - Array of {x: number, y: number} coordinate objects
 * @returns {string} - SVG path string with cubic Bezier curves
 */
export function buildSmoothPath(points) {
  // Handle edge cases
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  if (points.length === 2) {
    return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
  }

  const path = [];
  const tension = 0.3; // Controls curve smoothness (0 = straight, 1 = very curved)

  // Move to first point
  path.push(`M ${points[0].x},${points[0].y}`);

  // Create cubic Bezier curves between points
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]; // Previous point (or first if at start)
    const p1 = points[i];                   // Current point
    const p2 = points[i + 1];               // Next point
    const p3 = points[Math.min(points.length - 1, i + 2)]; // Point after next (or last if near end)

    // Calculate control points for smooth curve
    const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
    const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
    const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
    const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

    // Add cubic Bezier curve segment
    path.push(`C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x},${p2.y}`);
  }

  return path.join(' ');
}

/**
 * Converts a path of node IDs to a smooth SVG path string.
 * Filters out nodes that don't exist in the nodes map.
 * 
 * @param {array} path - Array of node ID strings
 * @param {object} nodesMap - Map of node IDs to node objects with x, y coordinates
 * @returns {string} - Smooth SVG path string
 */
export function buildSmoothSvgPath(path, nodesMap) {
  const points = path
    .filter((id) => nodesMap[id])
    .map((id) => ({ x: nodesMap[id].x, y: nodesMap[id].y }));
  return buildSmoothPath(points);
}

/**
 * Builds an SVG path that follows the exact node sequence (polyline).
 * Uses corridor nodes and every path node to draw a perfect walkable line
 * with straight segments between consecutive nodes.
 *
 * @deprecated Prefer buildPolylinePoints for pixel-perfect rendering.
 *
 * @param {array} path - Array of node ID strings
 * @param {object} nodesMap - Map of node IDs to node objects with x, y coordinates
 * @returns {string} - SVG path string with straight line segments (M...L...L...)
 */
export function buildWalkableSvgPath(path, nodesMap) {
  const points = path
    .filter((id) => nodesMap[id])
    .map((id) => {
      const n = nodesMap[id];
      return { x: Number(Number(n.x).toFixed(2)), y: Number(Number(n.y).toFixed(2)) };
    });
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  const segments = [`M ${points[0].x},${points[0].y}`];
  for (let i = 1; i < points.length; i++) {
    segments.push(`L ${points[i].x},${points[i].y}`);
  }
  return segments.join(' ');
}

/**
 * Builds a polyline points string from Dijkstra path for pixel-perfect rendering.
 * Uses ONLY exact node coordinates from the nodes map—no rounding, no smoothing.
 * Coordinates must be in the same system as the SVG viewBox (e.g. "0 0 840.75 605.66").
 *
 * @param {string[]} shortestPathNodes - Ordered array of node IDs from Dijkstra
 * @param {object} nodes - Map of node IDs to {x, y} objects (viewBox coordinates)
 * @returns {string} - Space-separated "x,y" pairs for SVG polyline points attribute
 */
export function buildPolylinePoints(shortestPathNodes, nodes) {
  return shortestPathNodes
    .filter((nodeId) => nodes[nodeId] && nodes[nodeId].x != null && nodes[nodeId].y != null)
    .map((nodeId) => {
      const node = nodes[nodeId];
      return `${node.x},${node.y}`;
    })
    .join(' ');
}

/**
 * Determines the turn direction at a waypoint based on incoming and outgoing vectors.
 * Uses cross product to determine left/right and dot product for angle calculation.
 * 
 * @param {object} prev - Previous point {x, y}
 * @param {object} curr - Current point {x, y}
 * @param {object} next - Next point {x, y}
 * @returns {string} - Turn direction: 'left', 'right', or 'straight'
 */
function getTurnDirection(prev, curr, next) {
  // Calculate incoming and outgoing vectors
  const incomingX = curr.x - prev.x;
  const incomingY = curr.y - prev.y;
  const outgoingX = next.x - curr.x;
  const outgoingY = next.y - curr.y;

  // Cross product: positive = right turn, negative = left turn
  const cross = incomingX * outgoingY - incomingY * outgoingX;
  // Dot product: used to calculate angle between vectors
  const dot = incomingX * outgoingX + incomingY * outgoingY;
  const lenIn = Math.hypot(incomingX, incomingY);
  const lenOut = Math.hypot(outgoingX, outgoingY);

  // Handle very short segments (likely same point)
  if (lenIn < 1 || lenOut < 1) return 'straight';
  
  // Calculate cosine of angle between vectors
  const cosAngle = dot / (lenIn * lenOut);
  const angleThreshold = 0.95; // ~18 degrees threshold for "straight"
  
  // If angle is close to 0 (cosine close to 1), consider it straight
  if (cosAngle > angleThreshold) return 'straight';

  // Determine turn direction using cross product
  if (cross > 0) return 'right';
  if (cross < 0) return 'left';
  return 'straight';
}

/**
 * Calculates Euclidean distance between two points.
 * 
 * @param {object} p1 - First point {x, y}
 * @param {object} p2 - Second point {x, y}
 * @returns {number} - Distance in pixels
 */
function distance(p1, p2) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

/**
 * Formats distance from pixels to meters with human-readable text.
 * Assumes 1 pixel ≈ 0.15 meters (scale factor).
 * 
 * @param {number} pixels - Distance in pixels
 * @returns {string} - Formatted distance string (e.g., "5m", "a few steps")
 */
function formatDistance(pixels) {
  const meters = Math.round(pixels * 0.15);
  if (meters < 1) return 'a few steps';
  if (meters < 50) return `${meters}m`;
  return `${meters}m`;
}

/**
 * Formats a node ID into a human-readable name.
 * Removes prefix patterns and replaces underscores with spaces.
 * 
 * @param {string} id - Node ID (e.g., "GF_101_Lab")
 * @returns {string} - Formatted name (e.g., "101 Lab")
 */
function formatNodeName(id) {
  return id.replace(/_/g, ' ').replace(/^[A-Z0-9]+_/, '');
}

/**
 * Checks if a node is a corridor node.
 * Corridor nodes are used for routing but not shown in directions.
 * 
 * @param {object} node - Node object with type property
 * @returns {boolean} - True if node is a corridor
 */
function isCorridorNode(node) {
  return node && node.type === 'corridor';
}

/**
 * Generates a turn instruction string based on turn direction and target.
 * 
 * @param {string} turn - Turn direction: 'left', 'right', or 'straight'
 * @param {string} currId - Current node ID
 * @param {string} nextId - Next node ID
 * @returns {string} - Formatted instruction string
 */
function getTurnInstruction(turn, currId, nextId) {
  const nextName = formatNodeName(nextId);
  switch (turn) {
    case 'left':
      return `Turn left towards ${nextName}`;
    case 'right':
      return `Turn right towards ${nextName}`;
    case 'straight':
    default:
      return `Continue straight to ${nextName}`;
  }
}

/**
 * Finds the next non-corridor node index in the points array.
 * Used to skip corridor nodes in navigation directions.
 * 
 * @param {array} points - Array of point objects with type property
 * @param {number} fromIndex - Starting index to search from
 * @returns {number} - Index of next non-corridor node, or last index if none found
 */
function nextNonCorridorIndex(points, fromIndex) {
  for (let j = fromIndex + 1; j < points.length; j++) {
    if (!isCorridorNode(points[j])) return j;
  }
  return points.length - 1;
}

/**
 * Calculates the total distance along a segment of points.
 * Sums distances between consecutive points from startIdx to endIdx.
 * 
 * @param {array} points - Array of point objects with x, y coordinates
 * @param {number} startIdx - Starting index (inclusive)
 * @param {number} endIdx - Ending index (exclusive)
 * @returns {number} - Total distance in pixels
 */
function segmentDistance(points, startIdx, endIdx) {
  let d = 0;
  for (let k = startIdx; k < endIdx && k + 1 < points.length; k++) {
    d += distance(points[k], points[k + 1]);
  }
  return d;
}

/**
 * Generates turn-by-turn navigation directions from a path.
 * Filters out corridor nodes and creates human-readable instructions.
 * 
 * @param {array} path - Array of node ID strings representing the route
 * @param {object} nodesMap - Map of node IDs to node objects with x, y, type properties
 * @returns {array} - Array of direction objects with:
 *                    - direction: 'left' | 'right' | 'straight'
 *                    - instruction: Human-readable instruction string
 *                    - distance: Formatted distance string
 *                    - nodeId: Current node ID
 */
export function generateTurnByTurnDirections(path, nodesMap) {
  const directions = [];

  // Convert node IDs to point objects with coordinates
  const points = [];
  for (const id of path) {
    const node = nodesMap[id];
    if (node) points.push({ ...node, id });
  }

  // Handle edge cases
  if (points.length < 2) {
    if (points.length === 1) {
      directions.push({
        direction: 'straight',
        instruction: `You have arrived at ${formatNodeName(points[0].id)}`,
        distance: '0m',
        nodeId: points[0].id,
      });
    }
    return directions;
  }

  // Generate directions for each waypoint
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    // Only show navigation steps at non-corridor waypoints, at destination, or first step
    const atDestination = !next;
    const isFirstStep = i === 1;
    const isWaypoint = isFirstStep || !isCorridorNode(curr) || atDestination;
    if (!isWaypoint) continue; // Skip corridor nodes

    const nextWaypointIdx = nextNonCorridorIndex(points, i);
    const nextWaypoint = points[nextWaypointIdx];
    const distToNextWaypoint = segmentDistance(points, i, nextWaypointIdx);

    // First step: heading instruction
    if (i === 1) {
      const targetName = isCorridorNode(nextWaypoint)
        ? 'the corridor'
        : formatNodeName(nextWaypoint.id);
      directions.push({
        direction: 'straight',
        instruction: `Head towards ${targetName}`,
        distance: formatDistance(segmentDistance(points, 0, nextWaypointIdx)),
        nodeId: curr.id,
      });
      continue;
    }

    // Last step: arrival instruction
    if (atDestination) {
      directions.push({
        direction: 'straight',
        instruction: `Arrive at ${formatNodeName(curr.id)}`,
        distance: formatDistance(distance(prev, curr)),
        nodeId: curr.id,
      });
      continue;
    }

    // Intermediate steps: turn instructions
    const turn = getTurnDirection(prev, curr, next);
    const instructionTarget =
      nextWaypointIdx > i + 1
        ? (isCorridorNode(nextWaypoint) ? 'the corridor' : formatNodeName(nextWaypoint.id))
        : formatNodeName(next.id);
    const instruction =
      turn === 'straight'
        ? `Continue straight to ${instructionTarget}`
        : turn === 'left'
          ? `Turn left towards ${instructionTarget}`
          : `Turn right towards ${instructionTarget}`;

    directions.push({
      direction: turn,
      instruction,
      distance: formatDistance(distToNextWaypoint),
      nodeId: curr.id,
    });
  }

  return directions;
}
