/**
 * Campus Data Module
 * 
 * Unified export for all campus navigation data.
 * Provides access to:
 * - navigationNodes: All nodes (rooms, corridors, waypoints) with coordinates
 * - navigationEdges: Connections between nodes for pathfinding
 * - buildings: Building information and metadata
 */
export { navigationNodes } from './campusDataNodes';
export { navigationEdges } from './campusDataEdges';
export { buildings } from './campusDataBuildings';
