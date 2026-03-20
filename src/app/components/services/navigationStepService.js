import { buildPolylinePoints } from '../../../utils/pathUtils';
import { generateDetailedNavigationInstructions } from '../../../utils/navigation_instructions';

/**
 * Maps navigation direction labels to the icon key used by the UI.
 * Kept in the service layer so the view stays thin.
 */
export function mapDirectionForIcon(direction) {
  if (!direction) return 'straight';
  const leftVariants = ['slight left', 'sharp left', 'u-turn'];
  const rightVariants = ['slight right', 'sharp right'];
  if (leftVariants.includes(direction)) return 'left';
  if (rightVariants.includes(direction)) return 'right';
  return direction;
}

/**
 * Builds the view-model for a single navigation step.
 * View-model = { pathPoints, navigationDirections }.
 *
 * @param {object} step
 * @param {Record<string, any>} nodesMap
 * @param {Map<string, any>|object} edgeIndex
 */
export function buildNavigationStepViewModel(step, nodesMap, edgeIndex) {
  if (!step || !step.path_nodes || step.path_nodes.length === 0) {
    return { pathPoints: '', navigationDirections: [] };
  }

  const stepPathWithCoords = step.path_nodes.filter((id) => nodesMap[id]);
  if (stepPathWithCoords.length === 0) {
    return { pathPoints: '', navigationDirections: [] };
  }

  const pathPoints = buildPolylinePoints(stepPathWithCoords, nodesMap);

  const rawInstructions = generateDetailedNavigationInstructions(
    stepPathWithCoords,
    nodesMap,
    edgeIndex,
  );

  const navigationDirections = rawInstructions
    .filter((i) => i.action !== 'error')
    .map((i) => ({
      direction: mapDirectionForIcon(i.direction),
      instruction: [i.message, i.landmark].filter(Boolean).join(' '),
      distance:
        i.distanceInMeters != null ? `${i.distanceInMeters}m` : '',
    }));

  return { pathPoints, navigationDirections };
}

