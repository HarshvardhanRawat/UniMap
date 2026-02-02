export function buildSmoothPath(points) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  if (points.length === 2) {
    return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;
  }

  const path = [];
  const tension = 0.3;

  path.push(`M ${points[0].x},${points[0].y}`);

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
    const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
    const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
    const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

    path.push(`C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x},${p2.y}`);
  }

  return path.join(' ');
}

export function buildSmoothSvgPath(path, nodesMap) {
  const points = path
    .filter((id) => nodesMap[id])
    .map((id) => ({ x: nodesMap[id].x, y: nodesMap[id].y }));
  return buildSmoothPath(points);
}

/**
 * Build an SVG path that follows the exact node sequence (polyline).
 * Uses corridor nodes and every path node to draw a perfect walkable line
 * with straight segments between consecutive nodes.
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

function getTurnDirection(prev, curr, next) {
  const incomingX = curr.x - prev.x;
  const incomingY = curr.y - prev.y;
  const outgoingX = next.x - curr.x;
  const outgoingY = next.y - curr.y;

  const cross = incomingX * outgoingY - incomingY * outgoingX;
  const dot = incomingX * outgoingX + incomingY * outgoingY;
  const lenIn = Math.hypot(incomingX, incomingY);
  const lenOut = Math.hypot(outgoingX, outgoingY);

  if (lenIn < 1 || lenOut < 1) return 'straight';
  const cosAngle = dot / (lenIn * lenOut);
  const angleThreshold = 0.95;
  if (cosAngle > angleThreshold) return 'straight';

  if (cross > 0) return 'right';
  if (cross < 0) return 'left';
  return 'straight';
}

function distance(p1, p2) {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function formatDistance(pixels) {
  const meters = Math.round(pixels * 0.15);
  if (meters < 1) return 'a few steps';
  if (meters < 50) return `${meters}m`;
  return `${meters}m`;
}

function formatNodeName(id) {
  return id.replace(/_/g, ' ').replace(/^[A-Z0-9]+_/, '');
}

function isCorridorNode(node) {
  return node && node.type === 'corridor';
}

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

/** Find the next non-corridor node index in points, or points.length - 1 (destination). */
function nextNonCorridorIndex(points, fromIndex) {
  for (let j = fromIndex + 1; j < points.length; j++) {
    if (!isCorridorNode(points[j])) return j;
  }
  return points.length - 1;
}

/** Sum distance along points from start to end index (inclusive of segment ends). */
function segmentDistance(points, startIdx, endIdx) {
  let d = 0;
  for (let k = startIdx; k < endIdx && k + 1 < points.length; k++) {
    d += distance(points[k], points[k + 1]);
  }
  return d;
}

export function generateTurnByTurnDirections(path, nodesMap) {
  const directions = [];

  const points = [];
  for (const id of path) {
    const node = nodesMap[id];
    if (node) points.push({ ...node, id });
  }

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

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    // Only show navigation steps at non-corridor waypoints, at destination, or first step
    const atDestination = !next;
    const isFirstStep = i === 1;
    const isWaypoint = isFirstStep || !isCorridorNode(curr) || atDestination;
    if (!isWaypoint) continue;

    const nextWaypointIdx = nextNonCorridorIndex(points, i);
    const nextWaypoint = points[nextWaypointIdx];
    const distToNextWaypoint = segmentDistance(points, i, nextWaypointIdx);

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

    if (atDestination) {
      directions.push({
        direction: 'straight',
        instruction: `Arrive at ${formatNodeName(curr.id)}`,
        distance: formatDistance(distance(prev, curr)),
        nodeId: curr.id,
      });
      continue;
    }

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
