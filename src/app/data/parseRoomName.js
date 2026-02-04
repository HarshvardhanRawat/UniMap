/**
 * Room Name Parser
 * 
 * Parses node IDs to extract human-readable names and categories.
 * Uses regex patterns to identify room types and formats names.
 */

/**
 * Category patterns: [regex, categoryName]
 * Patterns are tested in order, first match wins.
 */
const CATEGORIES = [
  [/Lab/i, 'Lab'],                                    // Laboratory rooms
  [/Office|Dean|HOD|Department|Dr\.|Prof\.|Ar\./i, 'Office'], // Office spaces
  [/Studio/i, 'Studio'],                              // Studio spaces
  [/LT-|Lecture/i, 'Classroom'],                      // Lecture theaters and classrooms
  [/Washroom/i, 'Washroom'],                          // Restrooms
  [/SH-|^PL-/, 'Common'],                             // Common/shared spaces
  [/Centre|Center/i, 'Facility']                      // Facilities and centers
];

/**
 * Parses a node ID to extract name and category.
 * 
 * @param {string} nodeId - Node identifier (e.g., "GF_101_Lab", "LT_201")
 * @returns {object} - Object with:
 *                     - name: Formatted room name (e.g., "101 Lab")
 *                     - category: Room category (e.g., "Lab", "Office")
 * 
 * @example
 * parseRoomName("GF_101_Lab") // { name: "101 Lab", category: "Lab" }
 * parseRoomName("LT_201") // { name: "201", category: "Classroom" }
 */
export const parseRoomName = (nodeId) => ({
  // Remove prefix (e.g., "GF_") and replace underscores with spaces
  name: nodeId.replace(/^[A-Z0-9]+_/, '').replace(/_/g, ' '),
  // Find matching category or default to 'Room'
  category: CATEGORIES.find(([re]) => re.test(nodeId))?.[1] ?? 'Room'
});
