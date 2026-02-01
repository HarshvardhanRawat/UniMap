# Campus Navigation Data Integration Summary

## Overview
This document explains where the campus navigation data (nodes and edges) has been integrated into the UniMap application.

## File Structure

### 1. `/src/app/data/campusData.ts`
**This is the main data file containing all navigation information.**

#### Added Components:

**A. Interface Definitions:**
```typescript
export interface NavigationNode {
  id: string;
  x: number;
  y: number;
}

export interface NavigationEdge {
  from: string;
  to: string;
  weight: number;
}

export interface Location {
  id: string;
  name: string;
  building: string;
  floor: number;
  category: string;
  x?: number;      // Added for coordinate positioning
  y?: number;      // Added for coordinate positioning
}
```

**B. Navigation Data:**
- `navigationNodes` - Array of 83 nodes with their (x, y) coordinates
- `navigationEdges` - Array of edges defining pathways between nodes
- Helper function `parseRoomName()` - Parses node IDs to extract readable names and categories

**C. Campus Locations:**
- `campusLocations` - Automatically generated from navigationNodes
- Filters out generic nodes (those starting with "node_")
- Converts each navigation node into a searchable location with:
  - Readable name
  - Building assignment
  - Floor number
  - Category (Lab, Office, Studio, Classroom, etc.)
  - X, Y coordinates for map positioning

**D. Buildings:**
- Updated to reflect actual campus: "Jabalpur Engineering College"
- Can be expanded to include multiple buildings/floors

## Data Flow

### 1. **User Searches for Location**
   - User types in search box
   - System filters `campusLocations` array
   - Displays matching results with categories

### 2. **Location Selection**
   - Selected location includes x, y coordinates
   - System displays floor plan for that floor
   - Marker positioned using coordinates

### 3. **Navigation Path**
   - Uses `navigationEdges` to build graph
   - Can implement pathfinding algorithms (Dijkstra, A*) using edges
   - Current implementation shows sample navigation steps

## Key Features

### Room Categories Auto-Detected:
- **Labs**: BEEE Lab, Fluid Mechanics Lab, CAD/CAM Lab, etc.
- **Offices**: Dean offices, HOD offices, Department offices
- **Studios**: Studio-1 through Studio-5
- **Classrooms**: LT-1, LT-2 (Lecture Theaters)
- **Facilities**: MOOC Center, Conclave Centre, Faculty Resource Centre
- **Common Areas**: SH-1 through SH-6, PL-1, PL-2, PL-5
- **Washrooms**: Male Washroom (with location variants)

### Coordinate System:
- Floor plan dimensions: ~600x450 units
- Coordinates converted to percentages for responsive positioning
- Markers placed accurately on floor plan images

## Future Enhancements

### 1. **Pathfinding Algorithm**
Implement Dijkstra's or A* algorithm using navigationEdges:
```typescript
function findPath(start: string, end: string): string[] {
  // Use navigationEdges to build graph
  // Calculate shortest path
  // Return array of node IDs representing the path
}
```

### 2. **Multi-Floor Navigation**
- Add floor connections (stairs, elevators)
- Calculate paths across different floors
- Show floor transitions in navigation steps

### 3. **Real-Time Updates**
- Add node status (open/closed)
- Building occupancy information
- Event locations

### 4. **Custom Floor Plans**
Replace Unsplash images with actual JEC floor plans in `getFloorPlanUrl()` function in `/src/app/components/CampusMapPage.tsx`

## Data Usage Example

```typescript
// Search for a location
const searchResults = campusLocations.filter(loc => 
  loc.name.toLowerCase().includes(searchQuery.toLowerCase())
);

// Get location coordinates
const destination = campusLocations.find(loc => loc.id === "LT-2");
console.log(destination?.x, destination?.y); // 512.45, 269.71

// Build navigation graph from edges
const graph = buildGraph(navigationEdges);
const path = findShortestPath(graph, currentLocation.id, destination.id);
```

## Summary

✅ **Navigation nodes** → Stored in `navigationNodes` array with x, y coordinates  
✅ **Navigation edges** → Stored in `navigationEdges` array for pathfinding  
✅ **Campus locations** → Auto-generated searchable list from nodes  
✅ **Coordinate system** → Integrated for accurate marker positioning  
✅ **Room categorization** → Automatic based on naming patterns  

All data is centralized in `/src/app/data/campusData.ts` and consumed by the CampusMapPage component for search, display, and navigation features.
