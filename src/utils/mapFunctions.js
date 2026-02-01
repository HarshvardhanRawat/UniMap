// Simple example of the two core functions you need

import {
  buildGraph,
  findShortestPath,
  generateDirections,
  generateSVGPath
} from './pathfinding';

/**
 * FUNCTION 1: Draw path lines on SVG map
 * 
 * Usage:
 * const pathElement = drawPathOnMap(startNodeId, endNodeId, nodes, edges, svgElement);
 */
export function drawPathOnMap(startId, endId, nodes, edges, svgElement, options = {}) {
  // Default options
  const {
    strokeColor = '#007bff',
    strokeWidth = 4,
    animated = true,
    smooth = true
  } = options;

  // 1. Build the graph
  const graph = buildGraph(nodes, edges);

  // 2. Find shortest path
  const result = findShortestPath(graph, startId, endId);

  if (!result.found) {
    console.warn('No path found between', startId, 'and', endId);
    return null;
  }

  // 3. Generate SVG path string
  const pathString = generateSVGPath(result.path, nodes, { smooth });

  // 4. Create SVG path element
  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathElement.setAttribute('d', pathString);
  pathElement.setAttribute('fill', 'none');
  pathElement.setAttribute('stroke', strokeColor);
  pathElement.setAttribute('stroke-width', strokeWidth);
  pathElement.setAttribute('stroke-linecap', 'round');
  pathElement.setAttribute('stroke-linejoin', 'round');

  // Add animation if requested
  if (animated) {
    pathElement.setAttribute('stroke-dasharray', '10,10');
    const animateElement = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
    animateElement.setAttribute('attributeName', 'stroke-dashoffset');
    animateElement.setAttribute('from', '20');
    animateElement.setAttribute('to', '0');
    animateElement.setAttribute('dur', '1s');
    animateElement.setAttribute('repeatCount', 'indefinite');
    pathElement.appendChild(animateElement);
  }

  // 5. Add to SVG
  svgElement.appendChild(pathElement);

  return {
    pathElement,
    path: result.path,
    distance: result.distance
  };
}

/**
 * FUNCTION 2: Get navigation directions (shortest path with guide)
 * 
 * Usage:
 * const navigation = getNavigationDirections(startNodeId, endNodeId, nodes, edges);
 * console.log(navigation.directions); // Array of turn-by-turn instructions
 */
export function getNavigationDirections(startId, endId, nodes, edges) {
  // 1. Build the graph
  const graph = buildGraph(nodes, edges);

  // 2. Find shortest path
  const result = findShortestPath(graph, startId, endId);

  if (!result.found) {
    return {
      found: false,
      message: 'No path found',
      directions: [],
      path: [],
      distance: 0
    };
  }

  // 3. Generate turn-by-turn directions
  const directions = generateDirections(result.path, nodes);

  return {
    found: true,
    path: result.path,
    distance: result.distance,
    directions: directions,
    summary: {
      totalSteps: directions.length,
      estimatedTime: Math.ceil(result.distance / 1.4 / 60), // minutes
      startLocation: nodes[startId].name,
      endLocation: nodes[endId].name
    }
  };
}

// ============================================
// EXAMPLE USAGE WITH YOUR REACT COMPONENT
// ============================================

/*
// In your React component:

import React, { useRef, useEffect, useState } from 'react';
import { drawPathOnMap, getNavigationDirections } from './mapFunctions';

function YourMapComponent() {
  const svgRef = useRef(null);
  const [navigation, setNavigation] = useState(null);

  // Your nodes data
  const nodes = {
    'room101': { x: 100, y: 100, name: 'Room 101' },
    'hallway': { x: 200, y: 100, name: 'Main Hallway' },
    'room102': { x: 300, y: 100, name: 'Room 102' },
    // ... more nodes
  };

  // Your edges (connections)
  const edges = [
    { from: 'room101', to: 'hallway' },
    { from: 'hallway', to: 'room102' },
    // ... more edges
  ];

  const handleNavigate = (startId, endId) => {
    // Clear previous path
    const oldPaths = svgRef.current.querySelectorAll('.route-path');
    oldPaths.forEach(p => p.remove());

    // FUNCTION 1: Draw the path
    const pathResult = drawPathOnMap(
      startId,
      endId,
      nodes,
      edges,
      svgRef.current,
      {
        strokeColor: '#007bff',
        strokeWidth: 4,
        animated: true,
        smooth: true
      }
    );

    if (pathResult) {
      pathResult.pathElement.classList.add('route-path');
    }

    // FUNCTION 2: Get directions
    const navResult = getNavigationDirections(startId, endId, nodes, edges);
    setNavigation(navResult);
  };

  return (
    <div>
      <svg ref={svgRef} viewBox="0 0 800 600">
        // Your map SVG content here
      </svg>

      {navigation && navigation.found && (
        <div className="directions-panel">
          <h3>Directions</h3>
          <p>From {navigation.summary.startLocation} to {navigation.summary.endLocation}</p>
          <p>Distance: {navigation.distance.toFixed(0)}m</p>
          <p>Estimated time: {navigation.summary.estimatedTime} min</p>
          
          <ol>
            {navigation.directions.map((step, index) => (
              <li key={index}>
                {step.description}
                {step.distance && ` (${step.distance}m)`}
              </li>
            ))}
          </ol>
        </div>
      )}

      <button onClick={() => handleNavigate('room101', 'room102')}>
        Navigate
      </button>
    </div>
  );
}
*/
