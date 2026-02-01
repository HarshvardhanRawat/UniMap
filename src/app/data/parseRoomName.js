const CATEGORIES = [
  [/Lab/i, 'Lab'], [/Office|Dean|HOD|Department|Dr\.|Prof\.|Ar\./i, 'Office'],
  [/Studio/i, 'Studio'], [/LT-|Lecture/i, 'Classroom'], [/Washroom/i, 'Washroom'],
  [/SH-|^PL-/, 'Common'], [/Centre|Center/i, 'Facility']
];

export const parseRoomName = (nodeId) => ({
  name: nodeId.replace(/^[A-Z0-9]+_/, '').replace(/_/g, ' '),
  category: CATEGORIES.find(([re]) => re.test(nodeId))?.[1] ?? 'Room'
});
