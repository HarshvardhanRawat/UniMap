import { navigationNodes } from './campusData';
import { parseRoomName } from './parseRoomName';

/**
 * Campus Locations Data
 * 
 * Converts navigation nodes into searchable location objects.
 * Filters out corridor nodes (used only for pathfinding) and formats
 * room names and categories for display in the UI.
 * 
 * Each location includes:
 * - id: Unique node identifier
 * - name: Human-readable room name
 * - building: Building name (currently hardcoded)
 * - floor: Floor number
 * - category: Room category (Lab, Office, Classroom, etc.)
 * - x, y: Coordinates for map display
 */
export const campusLocations = navigationNodes
  // Exclude corridor nodes from search — they are used only by Dijkstra for pathfinding
  .filter((n) => n.type !== 'corridor')
  .map((n) => {
    // Parse room name and category from node ID
    const parsed = parseRoomName(n.id);
    return {
      id: n.id,
      name: n.name || parsed.name, // Use explicit name if available, otherwise parsed
      building: 'MITS - DU', // TODO: Extract from node data if available
      floor: 1, // TODO: Extract from node data if available
      category: parsed.category,
      x: n.x,
      y: n.y
    };
  });
