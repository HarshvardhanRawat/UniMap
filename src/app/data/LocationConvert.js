import { navigationNodes, maps, buildings } from './campusData';
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
 * - map: Map ID this node belongs to (Campus_Map, Main_GF, etc.)
 * - building: Building name (derived from map metadata when available)
 * - floor: Floor number (derived from map metadata when available)
 * - category: Room category (Lab, Office, Classroom, etc.)
 * - x, y: Coordinates for map display
 */
// Helper: index maps and buildings for quick lookup
const mapsById = Object.fromEntries(maps.map((m) => [m.id, m]));
const buildingsById = Object.fromEntries(buildings.map((b) => [b.id, b]));

export const campusLocations = navigationNodes
  // Exclude internal pathing nodes from search (corridor/intersection)
  // they are used only as waypoints for pathfinding/drawing.
  .filter((n) => n.type !== 'corridor' && n.type !== 'intersection')
  .map((n) => {
    // Parse room name and category from node ID
    const parsed = parseRoomName(n.id);
    const mapMeta = n.map ? mapsById[n.map] : null;
    const buildingMeta =
      mapMeta && mapMeta.building ? buildingsById[mapMeta.building] : null;

    const name = n.name || parsed.name; // Use explicit name if available, otherwise parsed
    const searchName = String(name || '').toLowerCase();

    return {
      id: n.id,
      name,
      searchName,
      map: n.map || null,
      building: buildingMeta?.name || (mapMeta?.type === 'campus' ? 'Campus' : 'MITS - DU'),
      floor: typeof mapMeta?.floor === 'number' ? mapMeta.floor : null,
      category: parsed.category,
      x: n.x,
      y: n.y
    };
  });
