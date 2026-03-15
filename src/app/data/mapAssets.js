import campusSvg from '../../assets/CampusMap.svg';
import mainGfSvg from '../../assets/Main_GF.svg';
import mainFfSvg from '../../assets/Main_FF.svg';
import mainSfSvg from '../../assets/Main_SF.svg';

// AI building SVGs can be added here when available:
// import aiGfSvg from '../../assets/AI_GF.svg';
// ...

/**
 * Map ID -> imported SVG asset
 * Central place to wire map identifiers to their visual representation.
 */
export const mapAssets = {
  Campus_Map: campusSvg,
  Main_GF: mainGfSvg,
  Main_FF: mainFfSvg,
  Main_SF: mainSfSvg,
  // AI_GF: aiGfSvg,
  // AI_FF: aiFfSvg,
  // AI_SF: aiSfSvg,
  // AI_TF: aiTfSvg,
};

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


