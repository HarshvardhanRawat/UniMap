/**
 * Campus Data Module (Multi‑Map)
 *
 * Unified, scalable access to:
 * - maps: high‑level map metadata (campus + all floors)
 * - buildings: building metadata and floor relationships
 * - mapDatasets: per‑map nodes + edges
 * - navigationNodes / navigationEdges: flattened views across all maps
 *
 * New maps/floors can be added by:
 *  1) creating nodes/edges files
 *  2) registering them in mapDatasets below
 *  3) adding entries to maps.js / buildings.js
 */

import { maps } from './maps';
import { buildings } from './buildings';

// Per‑map node datasets
import { navigationNodes as campus_nodes } from './nodes/campus_nodes';
import { navigationNodes as main_gf_nodes } from './nodes/main_gf_nodes';
import { navigationNodes as main_ff_nodes } from './nodes/main_ff_nodes';
import { navigationNodes as main_sf_nodes } from './nodes/main_sf_nodes';
// AI building floors – keep imports optional/extendable
// If these files are added later, they can simply be imported and registered.

// Per‑map edge datasets
import { navigationEdges as campus_edges } from './edges/campus_edges';
import { navigationEdges as main_gf_edges } from './edges/main_gf_edges';
import { navigationEdges as main_ff_edges } from './edges/main_ff_edges';
import { navigationEdges as main_sf_edges } from './edges/main_sf_edges';

export { maps, buildings };

/**
 * Central registry for all map datasets.
 * Each entry is keyed by map ID and contains its node and edge arrays.
 */
export const mapDatasets = {
  Campus_Map: {
    id: 'Campus_Map',
    nodes: campus_nodes,
    edges: campus_edges,
  },
  Main_GF: {
    id: 'Main_GF',
    nodes: main_gf_nodes,
    edges: main_gf_edges,
  },
  Main_FF: {
    id: 'Main_FF',
    nodes: main_ff_nodes,
    edges: main_ff_edges,
  },
  Main_SF: {
    id: 'Main_SF',
    nodes: main_sf_nodes,
    edges: main_sf_edges,
  },
  // AI building floors will be registered here as soon as their
  // nodes/edges datasets and SVGs are available (AI_GF, AI_FF, AI_SF, AI_TF).
};

/**
 * Flattened view of all navigation nodes across every map.
 * Backwards‑compatible replacement for the previous single‑map navigationNodes.
 */
export const navigationNodes = Object.values(mapDatasets).flatMap(
  (dataset) => dataset.nodes,
);

/**
 * Flattened view of all navigation edges across every map.
 * Includes special transition edges (stairs_to_stairs, entry connectors, etc.).
 */
export const navigationEdges = Object.values(mapDatasets).flatMap(
  (dataset) => dataset.edges,
);

/**
 * Convenience helper: get dataset (nodes + edges) for a specific map.
 * Returns null if the map is not registered.
 *
 * @param {string} mapId
 * @returns {{id: string, nodes: Array, edges: Array} | null}
 */
export function getDatasetForMap(mapId) {
  return mapDatasets[mapId] ?? null;
}
