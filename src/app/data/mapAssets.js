/**
 * Map asset loading (lazy + cached).
 * Keeps rendering behavior the same while reducing initial bundle cost.
 */
const assetLoaders = {
  Campus_Map: () => import('../../assets/CampusMap.svg'),
  Main_GF: () => import('../../assets/Main_GF.svg'),
  Main_FF: () => import('../../assets/Main_FF.svg'),
  Main_SF: () => import('../../assets/Main_SF.svg'),
  // AI_GF: () => import('../../assets/AI_GF.svg'),
  // AI_FF: () => import('../../assets/AI_FF.svg'),
  // AI_SF: () => import('../../assets/AI_SF.svg'),
  // AI_TF: () => import('../../assets/AI_TF.svg'),
};

const assetCache = new Map();

export async function getMapAsset(mapId) {
  const key = mapId in assetLoaders ? mapId : 'Main_GF';
  if (assetCache.has(key)) return assetCache.get(key);
  const mod = await assetLoaders[key]();
  const url = mod?.default ?? mod;
  assetCache.set(key, url);
  return url;
}

export function preloadMapAsset(mapId) {
  void getMapAsset(mapId);
}

/**
 * Map ID -> SVG viewBox configuration
 * These must match the viewBox attributes in the corresponding SVG files
 * so that node coordinates line up perfectly with the rendered map.
 */
export const mapViewBoxes = {
  Campus_Map: { width: 1088.7814, height: 659.5655 },
  Main_GF: { width: 848.4096, height: 609.5946 },
  Main_FF: { width: 696.4, height: 576.6927 },
  Main_SF: { width: 743.9135, height: 482.3806 },
};


