<div align='center'>

<img src='https://github.com/dotrwt/UniMap/blob/main/src/assets/logo.webp' alt='LOGO' height='200'>

# UniMap

</div>

**Graph-based campus navigation for large university environments.**

UniMap converts a static campus layout into a structured, traversable graph enabling shortest-path routing and real-time route visualisation, without relying on any third-party navigation SDK.

🔗 **Live demo:** [unimap-lemon.vercel.app](https://unimap-lemon.vercel.app)

<img src='https://github.com/dotrwt/UniMap/blob/main/UM__UI.png' alt='UI Preview'>

---

## The problem

Large university campuses are genuinely difficult to navigate especially for first-year students, visitors, or anyone moving between buildings on a tight schedule. Room codes are cryptic, signage is inconsistent, and static floor plans don't tell you the fastest way to get from A to B.

UniMap treats the campus as a network, not an image, and computes the answer.

---

## How it works

### 1. SVG map foundation

The campus layout is authored as a scalable SVG. Walkable paths, corridors, junctions, and named rooms are manually traced and labelled — giving the system a precise spatial model of the environment.

### 2. Graph data model

The SVG is translated into structured JavaScript:

- **Nodes** — rooms, corridors, junctions, landmarks
- **Edges** — walkable connections between nodes
- **Weights** — distances between connected nodes

This produces a full adjacency representation of the campus.

### 3. Pathfinding

When a user selects a source and destination, the graph is traversed and the shortest route is computed. The result is highlighted directly on the SVG map.

### 4. React interface

The frontend is built with React for modular components, clean state management, and smooth dynamic rendering. The SVG map scales cleanly at any zoom level.

---

## Features

- Indoor campus navigation with visual route highlighting
- Graph-based shortest-path routing (no external maps SDK)
- Search by room name, building, floor, or landmark
- SVG map — scalable, lightweight, overlayable
- Google OAuth login (via Passport.js)
- Expandable architecture for multiple floors or blocks

---

## Tech stack

| Layer         | Technology                         |
| ------------- | ---------------------------------- |
| Frontend      | React 18, Vite 6, Tailwind CSS v4  |
| UI components | Radix UI, Lucide icons, Motion     |
| Routing logic | Custom JS graph + pathfinding      |
| Map           | Authored SVG                       |
| Auth          | Passport.js, Google OAuth 2.0, JWT |
| Sessions      | Express 5, express-session, SQLite |
| Deployment    | Vercel (static)                    |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm run preview
```

The `dist/` folder can be served from any static host — Vercel, Netlify, GitHub Pages, or an Nginx container.

---

## Project structure

```
UniMap/
├── src/
│   ├── components/     # React UI components
│   ├── data/           # Graph node/edge definitions
│   └── utils/          # Pathfinding logic
├── dist/               # Production build output
├── index.html
├── vite.config.js
└── package.json
```

---

## Potential applications

The graph architecture is adaptable beyond university campuses:

- Hospitals and medical centres
- Office complexes
- Shopping malls and event venues
- Any large indoor environment requiring wayfinding

---

## Contributing

Contributions are welcome. If you'd like to add support for a new building, improve the pathfinding algorithm, or work on one of the roadmap items, open an issue or pull request.

---

## License

MIT

---

<div align='center'>

developed by <a href='http://github.com/dotrwt'>dotrwt</a>

</div>
