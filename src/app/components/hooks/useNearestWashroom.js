import { useEffect, useRef, useState } from 'react';
import { dijkstraDistancesAsync } from '../../../utils/dijkstraDistances';

/**
 * Computes nearest washroom asynchronously and cancels stale requests.
 *
 * Separation of concerns:
 * - Hook handles async/cancellation/concurrency.
 * - Selection logic stays here (small, deterministic).
 *
 * @param {object|null} params.currentLocation - node object with `.id`
 * @param {boolean} params.isWashroomSelectionMode
 * @param {Array} params.filteredLocations - candidate location objects with `.id`
 * @param {object} params.graph - global graph for Dijkstra
 * @returns {{ nearestWashroom: any }}
 */
export default function useNearestWashroom({
  currentLocation,
  isWashroomSelectionMode,
  filteredLocations,
  graph,
}) {
  const [nearestWashroom, setNearestWashroom] = useState(null);

  const requestIdRef = useRef(0);
  const distancesCacheRef = useRef(new Map()); // startNodeId -> distances map

  // Bound cache to avoid unbounded growth of large `distances` objects.
  const maxCacheSize = 4;

  useEffect(() => {
    return () => {
      // Release memory held by cached distance maps when the component unmounts.
      distancesCacheRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!currentLocation || !isWashroomSelectionMode || filteredLocations.length === 0) {
      setNearestWashroom(null);
      return;
    }

    const startId = currentLocation.id;
    const requestId = ++requestIdRef.current;
    const controller = new AbortController();

    (async () => {
      try {
        let distances = distancesCacheRef.current.get(startId);
        if (!distances) {
          distances = await dijkstraDistancesAsync(graph, startId, {
            signal: controller.signal,
            yieldEvery: 2000,
          });
          if (controller.signal.aborted || requestId !== requestIdRef.current) return;
          distancesCacheRef.current.set(startId, distances);

          // LRU-ish eviction: remove oldest entry when exceeding max size.
          if (distancesCacheRef.current.size > maxCacheSize) {
            const oldestKey = distancesCacheRef.current.keys().next().value;
            if (oldestKey != null) distancesCacheRef.current.delete(oldestKey);
          }
        } else {
          // Refresh recency on cache hit (delete+set preserves insertion order).
          distancesCacheRef.current.delete(startId);
          distancesCacheRef.current.set(startId, distances);
        }

        let best = null;
        let bestDist = Infinity;
        for (const loc of filteredLocations) {
          const d = distances?.[loc.id];
          if (d != null && d < bestDist) {
            bestDist = d;
            best = loc;
          }
        }

        if (controller.signal.aborted || requestId !== requestIdRef.current) return;
        setNearestWashroom(bestDist < Infinity ? best : null);
      } catch (e) {
        if (!controller.signal.aborted) setNearestWashroom(null);
      }
    })();

    return () => controller.abort();
  }, [currentLocation?.id, isWashroomSelectionMode, filteredLocations, graph]);

  return { nearestWashroom };
}

