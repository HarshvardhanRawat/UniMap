/**
 * Navigation Instructions Generator
 * Converts a path from Dijkstra into human-readable turn-by-turn directions
 */

/**
 * Calculate the angle between two vectors
 * Returns angle in degrees (-180 to 180)
 */
function calculateAngle(p1, p2, p3) {
  // Vector from p1 to p2
  const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
  // Vector from p2 to p3
  const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
  
  // Calculate angles
  const angle1 = Math.atan2(v1.y, v1.x);
  const angle2 = Math.atan2(v2.y, v2.x);
  
  // Difference in angles
  let angle = (angle2 - angle1) * (180 / Math.PI);
  
  // Normalize to -180 to 180
  while (angle > 180) angle -= 360;
  while (angle < -180) angle += 360;
  
  return angle;
}

/**
 * Determine turn direction from angle
 * (Negated for screen/SVG coords where Y increases downward)
 */
function getTurnDirection(angle) {
  const flipped = -angle; // Fix for screen coords: left/right were reversed from user perspective
  const absAngle = Math.abs(flipped);
  
  if (absAngle < 20) {
    return 'straight';
  } else if (absAngle > 160) {
    return 'u-turn';
  } else if (flipped > 0) {
    // Positive = left turn (from user perspective)
    if (absAngle < 60) return 'slight left';
    if (absAngle < 120) return 'left';
    return 'sharp left';
  } else {
    // Negative = right turn (from user perspective)
    if (absAngle < 60) return 'slight right';
    if (absAngle < 120) return 'right';
    return 'sharp right';
  }
}

/**
 * Calculate distance between two nodes
 */
function calculateDistance(node1, node2) {
  const dx = node2.x - node1.x;
  const dy = node2.y - node1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Generate navigation instructions from a path
 * 
 * @param {Array<string>} path - Array of node IDs from Dijkstra
 * @param {Object} nodes - Nodes dataset with coordinates
 * @param {Array} edges - Optional: edges dataset for getting edge types
 * @returns {Array<Object>} Navigation instructions
 */
function generateNavigationInstructions(path, nodes, edges = null) {
  if (!path || path.length < 2) {
    return [{ action: 'error', message: 'Invalid path' }];
  }
  
  const instructions = [];
  
  // Start instruction
  instructions.push({
    action: 'start',
    location: path[0],
    message: `Starting at ${path[0]}`,
    distance: 0
  });
  
  // Process each segment
  let currentDirection = null;
  let accumulatedDistance = 0;
  let segmentStart = 0;
  
  for (let i = 1; i < path.length; i++) {
    const prevNode = nodes[path[i - 1]];
    const currentNode = nodes[path[i]];
    const segmentDistance = calculateDistance(prevNode, currentNode);
    
    // Determine direction for this segment
    let direction = 'straight';
    if (i < path.length - 1) {
      const nextNode = nodes[path[i + 1]];
      const angle = calculateAngle(prevNode, currentNode, nextNode);
      direction = getTurnDirection(angle);
    }
    
    // If direction changes or last segment, create instruction
    if (direction !== currentDirection || i === path.length - 1) {
      if (currentDirection !== null) {
        // Add instruction for accumulated segment
        const totalDist = accumulatedDistance + (i === path.length - 1 ? segmentDistance : 0);
        
        instructions.push({
          action: currentDirection === 'straight' ? 'continue' : 'turn',
          direction: currentDirection,
          distance: Math.round(totalDist * 100) / 100, // Round to 2 decimals
          distanceInMeters: Math.round(totalDist / 10), // Approximate: 10 units = 1 meter
          from: path[segmentStart],
          to: path[i - 1],
          message: formatInstruction(currentDirection, Math.round(totalDist / 10))
        });
        
        accumulatedDistance = 0;
        segmentStart = i;
      }
      
      currentDirection = direction;
    }
    
    accumulatedDistance += segmentDistance;
  }
  
  // Arrival instruction
  instructions.push({
    action: 'arrive',
    location: path[path.length - 1],
    message: `You have arrived at ${path[path.length - 1]}`,
    distance: 0
  });
  
  return instructions;
}

/**
 * Format instruction message
 */
function formatInstruction(direction, distanceInMeters) {
  const directionMap = {
    'straight': 'Go straight',
    'left': 'Turn left',
    'right': 'Turn right',
    'slight left': 'Bear left',
    'slight right': 'Bear right',
    'sharp left': 'Make a sharp left turn',
    'sharp right': 'Make a sharp right turn',
    'u-turn': 'Make a U-turn'
  };
  
  const action = directionMap[direction] || 'Continue';
  
  if (distanceInMeters < 1) {
    return `${action}`;
  } else {
    return `${action} for ${distanceInMeters}m`;
  }
}

/**
 * Enhanced version with edge type information
 */
function generateDetailedNavigationInstructions(path, nodes, edges) {
  const basicInstructions = generateNavigationInstructions(path, nodes, edges);
  
  // Add edge type information
  return basicInstructions.map((instruction, index) => {
    if (instruction.action === 'continue' || instruction.action === 'turn') {
      // Find the edge for this segment
      const fromNode = instruction.from;
      const toNode = instruction.to;
      
      if (edges && fromNode && toNode) {
        const edge = edges.find(e => 
          (e.from_node === fromNode && e.to_node === toNode) ||
          (e.from_node === toNode && e.to_node === fromNode)
        );
        
        if (edge) {
          instruction.edgeType = edge.type;
          instruction.landmark = getEdgeDescription(edge.type, fromNode, toNode);
        }
      }
    }
    
    return instruction;
  });
}

/**
 * Get human-readable edge description
 */
function getEdgeDescription(edgeType, fromNode, toNode) {
  const descriptions = {
    'corridor_to_corridor': 'along the corridor',
    'room_to_corridor': 'entering the corridor',
    'entry_to_corridor': 'from the entrance',
    'corridor_to_intersection': 'to the intersection',
    'entry_to_room': 'entering the room',
    'room_to_room': 'between rooms',
  };
  
  return descriptions[edgeType] || '';
}

/**
 * Format all instructions as a readable string
 */
function formatInstructionsAsText(instructions) {
  let text = '';
  let stepNumber = 1;
  
  instructions.forEach((instruction, index) => {
    if (instruction.action === 'start') {
      text += `📍 ${instruction.message}\n\n`;
    } else if (instruction.action === 'continue' || instruction.action === 'turn') {
      text += `${stepNumber}. ${instruction.message}`;
      if (instruction.landmark) {
        text += ` ${instruction.landmark}`;
      }
      text += '\n';
      stepNumber++;
    } else if (instruction.action === 'arrive') {
      text += `\n🎯 ${instruction.message}\n`;
    }
  });
  
  return text;
}

/**
 * Example Usage
 */
function demonstrateNavigation() {
  // Example with sample data
  const sampleNodes = {
    'ENTRY01': { id: 'ENTRY01', x: 384.5073, y: 428.0715 },
    'corridor01_01': { id: 'corridor01_01', x: 384.5073, y: 394.5587 },
    'intersectionCorridor01_02': { id: 'intersectionCorridor01_02', x: 395.9856, y: 394.5587 },
    'corridor02_01': { id: 'corridor02_01', x: 396.0834, y: 377.4128 },
    'intersectionCorridor02_Director_sOffice': { id: 'intersectionCorridor02_Director_sOffice', x: 396.0834, y: 361.1674 },
    'Director_sOffice': { id: 'Director_sOffice', x: 424.7621, y: 361.1022 },
  };
  
  const samplePath = [
    'ENTRY01',
    'corridor01_01',
    'intersectionCorridor01_02',
    'corridor02_01',
    'intersectionCorridor02_Director_sOffice',
    'Director_sOffice'
  ];
  
  const instructions = generateNavigationInstructions(samplePath, sampleNodes);
  
  console.log('Navigation Instructions:');
  console.log('='.repeat(50));
  console.log(formatInstructionsAsText(instructions));
  
  return instructions;
}

export {
  generateNavigationInstructions,
  generateDetailedNavigationInstructions,
  formatInstructionsAsText,
  calculateAngle,
  getTurnDirection,
  calculateDistance
};
