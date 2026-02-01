import { navigationNodes } from './campusData';
import { parseRoomName } from './parseRoomName';

// Exclude corridor nodes from search — they are used only by Dijkstra for pathfinding
export const campusLocations = navigationNodes
  .filter((n) => n.type !== 'corridor')
  .map((n) => {
    const parsed = parseRoomName(n.id);
    return {
      id: n.id,
      name: n.name || parsed.name,
      building: 'MITS - DU',
      floor: 1,
      category: parsed.category,
      x: n.x,
      y: n.y
    };
  });
