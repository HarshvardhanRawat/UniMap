# UniMap

UniMap is a graph-based campus navigation system designed to simplify movement inside large university environments. Instead of treating a campus map as a static image, UniMap converts it into structured data and computes intelligent routes between locations.

This project focuses on clarity, control, and scalability — avoiding heavy third-party navigation SDKs and keeping the routing logic fully transparent.

---

## Overview

Navigating a large campus can be frustrating, especially for:

- First-year students
- Visitors
- Students moving between tight lecture schedules
- Anyone unfamiliar with building codes or room numbers

UniMap transforms a visual campus layout into a structured graph, enabling shortest-path calculation and route visualization.

---

## Core Concept

The entire campus is modeled as a graph:

- **Nodes** → Rooms, turns, junction points
- **Edges** → Walkable connections between nodes
- **Weights** → Distance between connected nodes

With this structure, the system calculates the shortest route between a source and a destination using pathfinding logic.

---

## How It Works

### 1. SVG Map Foundation

The campus layout is created in SVG format.  
Walkable paths and important points are manually defined and named.

### 2. Graph Data Modeling

The SVG layout is translated into structured JavaScript data:

- Nodes with unique IDs and coordinates
- Edges connecting nodes
- Automatically or manually calculated weights

This creates an adjacency representation of the campus.

### 3. Pathfinding Logic

When a user selects a source and destination:

- The graph is traversed
- The shortest path is computed
- The route is visually highlighted on the map

### 4. React-Based Interface

The frontend is built with React to ensure:

- Modular component structure
- Clean state management
- Dynamic rendering
- Zoom and scaling support

---

## Features

- Indoor campus navigation
- Graph-based routing
- Structured node and edge modeling
- SVG-based scalable map rendering
- Expandable architecture for multiple floors or blocks
- Clean and modular React structure

---

## Tech Stack

- React
- JavaScript (ES6+)
- SVG
- Graph data structures
- Custom pathfinding implementation

No external navigation SDK is used — all routing logic is implemented within the project.

---

## Design Principles

- Data-driven architecture
- Full control over routing logic
- Simplicity over unnecessary abstraction
- Scalability for future expansion

The system is designed to be understandable, maintainable, and extendable.

---

## Future Scope

- Multi-floor support
- Mobile optimization
- Admin interface for visual node editing
- Search suggestions and filtering

---

## Current Status

- Walkable paths mapped
- Nodes and edges structured
- Pathfinding logic implemented
- UI refinement in progress

---

## Potential Applications

The architecture can be adapted for:

- University campuses
- Hospitals
- Office buildings
- Shopping complexes
- Event venues

---

UniMap is not just a visual map — it is a structured navigation system built on graph theory and practical frontend engineering.
