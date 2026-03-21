import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Navigation, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import Header from './Header';
import SearchDestination from './SearchDestination';
import SearchCurrentLocation from './SearchCurrentLocation';
import NavigationPanel from './NavigationPanel';
import QuickAccess from './QuickAccess';
import MapBox from './ui/MapBox';
import { campusLocations } from '../data/LocationConvert';
import { buildings, navigationNodes, navigationEdges } from '../data/campusData';
import { computeMultiMapRouteAsync, buildNodesMap, buildGlobalGraph } from '../../utils/multiMapNavigation';
import { buildUndirectedEdgeIndex } from '../../utils/navigation_instructions';

import { buildNavigationStepViewModel } from './services/navigationStepService';

/**
 * CampusMapPage Component
 * 
 * Main page component for the campus navigation system.
 * Handles location search, pathfinding, navigation, and map display.
 * Manages state for destination, current location, navigation path, and map controls.
 * 
 * @param {string} userName - The current logged-in user's name
 * @param {function} onLogout - Callback function to handle user logout
 * @param {function} onOpenDeveloperPage - Callback function to open developer page
 */
export default function CampusMapPage({ userName, onLogout, onOpenDeveloperPage }) {
  // Navigation state
  const [destination, setDestination] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isComputingRoute, setIsComputingRoute] = useState(false);
  const [pathPoints, setPathPoints] = useState('');
  const [navigationDirections, setNavigationDirections] = useState([]);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [autoFitNonce, setAutoFitNonce] = useState(0);

  const unmountedRef = useRef(false);

  // Map control state
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const zoomRef = useRef(zoom);
  const panRef = useRef({ x: panX, y: panY });
  const gestureRef = useRef({
    pointers: new Map(),
    dragStart: null,
    pinchStart: null,
    rafId: 0,
    pending: null,
  });
  const routeAbortRef = useRef(null);
  const routeRequestIdRef = useRef(0);

  // Cleanup: abort any in-flight route computation and cancel pending rAF updates.
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
      routeAbortRef.current?.abort();
      routeAbortRef.current = null;
      if (gestureRef.current.rafId) {
        cancelAnimationFrame(gestureRef.current.rafId);
      }
      gestureRef.current.rafId = 0;
      gestureRef.current.pending = null;
      gestureRef.current.pointers.clear();
      gestureRef.current.dragStart = null;
      gestureRef.current.pinchStart = null;
    };
  }, []);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    panRef.current = { x: panX, y: panY };
  }, [panX, panY]);

  /**
   * Creates a map of node IDs to node objects for quick lookup
   */
  const nodesMap = useMemo(
    () => buildNodesMap(navigationNodes),
    [],
  );

  /**
   * Builds a graph structure from navigation nodes and edges.
   * Graph uses only explicit navigation edges (corridor + room connections).
   * Corridor nodes are used for routing but not shown in directions.
   */
  const graph = useMemo(
    () => buildGlobalGraph(navigationEdges),
    [],
  );
  const edgeIndex = useMemo(
    () => buildUndirectedEdgeIndex(navigationEdges),
    [],
  );

  /**
   * Handles destination selection
   *
   * If navigation is currently active, changing the destination will:
   * - stop navigation
   * - clear the existing path and directions
   * - reset the map view (zoom and pan) to defaults
   */
  const handleDestinationSelect = useCallback((location) => {
    if (isNavigating || isComputingRoute) {
      routeAbortRef.current?.abort();
      setIsNavigating(false);
      setIsComputingRoute(false);
      setPathPoints('');
      setNavigationDirections([]);
      setZoom(1);
      setPanX(0);
      setPanY(0);
    }
    setDestination(location);
  }, [isNavigating, isComputingRoute]);

  /**
   * Handles destination clearing
   */
  const handleDestinationClear = useCallback(() => {
    setDestination(null);
    if (isNavigating || isComputingRoute) {
      handleResetNavigation();
    }
  }, [isNavigating, isComputingRoute]);

  /**
   * Handles current location selection
   *
   * If navigation is currently active, changing the current location will:
   * - stop navigation
   * - clear the existing path and directions
   * - reset the map view (zoom and pan) to defaults
   */
  const handleCurrentLocationSelect = useCallback((location) => {
    if (isNavigating || isComputingRoute) {
      routeAbortRef.current?.abort();
      setIsNavigating(false);
      setIsComputingRoute(false);
      setPathPoints('');
      setNavigationDirections([]);
      setZoom(1);
      setPanX(0);
      setPanY(0);
    }
    setCurrentLocation(location);
  }, [isNavigating, isComputingRoute]);

  /**
   * Handles current location clearing
   */
  const handleCurrentLocationClear = useCallback(() => {
    setCurrentLocation(null);
    setDestination(null);
    if (isNavigating || isComputingRoute) {
      handleResetNavigation();
    }
  }, [isNavigating, isComputingRoute]);

  /**
   * Rebuilds polyline + instructions for a single step.
   * This keeps rendering strictly per‑map.
   */
  const activateStep = useCallback(
    (step) => {
      const { pathPoints, navigationDirections } = buildNavigationStepViewModel(
        step,
        nodesMap,
        edgeIndex,
      );
      setPathPoints(pathPoints);
      setNavigationDirections(navigationDirections);
    },
    [nodesMap, edgeIndex],
  );

  /**
   * Starts navigation by calculating a global shortest path, then
   * segmenting it into per‑map steps.
   */
  const handleStartNavigation = useCallback(async () => {
    if (!destination || !currentLocation) return;

    setIsComputingRoute(true);
    const requestId = ++routeRequestIdRef.current;
    routeAbortRef.current?.abort();
    const controller = new AbortController();
    routeAbortRef.current = controller;

    try {
      const result = await computeMultiMapRouteAsync(
        navigationNodes,
        navigationEdges,
        currentLocation.id,
        destination.id,
      { signal: controller.signal, yieldEvery: 2000, includeFullPath: false },
      );

      if (controller.signal.aborted || requestId !== routeRequestIdRef.current) return;

      if (!result || !result.steps || result.steps.length === 0) {
        setPathPoints('');
        setNavigationDirections([
          {
            direction: 'straight',
            instruction: 'No path found between these locations',
            distance: '',
          },
        ]);
        setNavigationSteps([]);
        setIsNavigating(true);
        return;
      }

      setNavigationSteps(result.steps);
      setActiveStepIndex(0);
      setIsNavigating(true);
      activateStep(result.steps[0]);
      setAutoFitNonce((n) => n + 1);
    } finally {
      if (requestId === routeRequestIdRef.current) {
        setIsComputingRoute(false);
      }
    }
  }, [destination, currentLocation, activateStep]);

  /**
   * Resets navigation state, clears all selections, and resets map to default zoom/pan
   */
  const handleResetNavigation = useCallback(() => {
    routeAbortRef.current?.abort();
    routeAbortRef.current = null;
    setIsNavigating(false);
    setIsComputingRoute(false);
    setDestination(null);
    setCurrentLocation(null);
    setPathPoints('');
    setNavigationDirections([]);
    setNavigationSteps([]);
    setActiveStepIndex(0);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setAutoFitNonce((n) => n + 1);
  }, []);

  /**
   * Jump between segmented navigation steps (e.g., floor transitions).
   */
  const jumpToStep = useCallback((nextIndex) => {
    setActiveStepIndex((prevIndex) => {
      const clampedIndex = Math.max(0, Math.min(nextIndex, navigationSteps.length - 1));
      if (clampedIndex === prevIndex) return prevIndex;

      const nextStep = navigationSteps[clampedIndex];
      if (nextStep) {
        setZoom(1);
        setPanX(0);
        setPanY(0);
        activateStep(nextStep);
        setAutoFitNonce((n) => n + 1);
      }
      return clampedIndex;
    });
  }, [activateStep, navigationSteps]);

  const handlePrevStep = useCallback(() => {
    jumpToStep(activeStepIndex - 1);
  }, [activeStepIndex, jumpToStep]);

  const handleNextStep = useCallback(() => {
    jumpToStep(activeStepIndex + 1);
  }, [activeStepIndex, jumpToStep]);

  /**
   * Zoom in handler (max zoom: 5x)
   */
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  }, []);

  /**
   * Zoom out handler (min zoom: 0.5x)
   */
  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  }, []);

  /**
   * Resets zoom and pan to default values
   */
  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  /**
   * Handles mouse wheel zoom (avoid scroll-jacking).
   */
  const handleWheel = useCallback((e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(5, prev * delta)));
  }, []);

  /**
   * Pointer-based pan + pinch-zoom with rAF throttling.
   */
  const commitGestureUpdate = useCallback((next) => {
    gestureRef.current.pending = next;
    if (gestureRef.current.rafId) return;
    gestureRef.current.rafId = requestAnimationFrame(() => {
      if (unmountedRef.current) return;
      const pending = gestureRef.current.pending;
      gestureRef.current.pending = null;
      gestureRef.current.rafId = 0;
      if (!pending) return;

      if (pending.zoom != null) setZoom(pending.zoom);
      if (pending.panX != null) setPanX(pending.panX);
      if (pending.panY != null) setPanY(pending.panY);
    });
  }, []);

  const handlePointerDown = useCallback((e) => {
    const el = e.currentTarget;
    if (el?.setPointerCapture) el.setPointerCapture(e.pointerId);

    const pointers = gestureRef.current.pointers;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 1) {
      gestureRef.current.dragStart = {
        pointerId: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        panX: panRef.current.x,
        panY: panRef.current.y,
      };
      gestureRef.current.pinchStart = null;
      return;
    }

    if (pointers.size === 2) {
      const [a, b] = Array.from(pointers.values());
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 1;
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      gestureRef.current.pinchStart = {
        dist,
        zoom: zoomRef.current,
        panX: panRef.current.x,
        panY: panRef.current.y,
        midX,
        midY,
      };
      gestureRef.current.dragStart = null;
    }
  }, []);

  const handlePointerMove = useCallback((e) => {
    const pointers = gestureRef.current.pointers;
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size >= 2 && gestureRef.current.pinchStart) {
      const [a, b] = Array.from(pointers.values());
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 1;
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;

      const start = gestureRef.current.pinchStart;
      const ratio = dist / start.dist;
      const nextZoom = Math.max(0.5, Math.min(5, start.zoom * ratio));
      const scaleRatio = nextZoom / start.zoom;

      // Keep pinch midpoint stable in screen space:
      const nextPanX = start.panX * scaleRatio + midX * (1 - scaleRatio);
      const nextPanY = start.panY * scaleRatio + midY * (1 - scaleRatio);

      commitGestureUpdate({ zoom: nextZoom, panX: nextPanX, panY: nextPanY });
      return;
    }

    if (pointers.size === 1 && gestureRef.current.dragStart) {
      const start = gestureRef.current.dragStart;
      if (start.pointerId !== e.pointerId) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      commitGestureUpdate({ panX: start.panX + dx, panY: start.panY + dy });
    }
  }, [commitGestureUpdate]);

  const handlePointerUpOrCancel = useCallback((e) => {
    const pointers = gestureRef.current.pointers;
    if (pointers.has(e.pointerId)) pointers.delete(e.pointerId);

    if (pointers.size === 1) {
      const remainingId = Array.from(pointers.keys())[0];
      const remaining = pointers.get(remainingId);
      if (remaining) {
        gestureRef.current.dragStart = {
          pointerId: remainingId,
          x: remaining.x,
          y: remaining.y,
          panX: panRef.current.x,
          panY: panRef.current.y,
        };
      }
      gestureRef.current.pinchStart = null;
    } else if (pointers.size === 0) {
      gestureRef.current.dragStart = null;
      gestureRef.current.pinchStart = null;
    }
  }, []);

  const activeStep = navigationSteps[activeStepIndex] || null;
  const activeMapId =
    (isNavigating && activeStep?.map) ||
    currentLocation?.map ||
    destination?.map ||
    'Main_GF';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        userName={userName}
        onLogout={onLogout}
        onOpenDeveloperPage={onOpenDeveloperPage}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Sidebar - Search and Navigation */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-4 lg:space-y-6"
          >
            {/* Route Planning Card */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
              <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Plan Your Route
              </h2>

              <div className="space-y-4">
                {/* Current Location first (FROM) - matches natural "from → to" flow */}
                <SearchCurrentLocation
                  currentLocation={currentLocation}
                  onCurrentLocationSelect={handleCurrentLocationSelect}
                  onCurrentLocationClear={handleCurrentLocationClear}
                />

                {/* Destination second (TO) - only after current location is set */}
                <AnimatePresence initial={false} mode="popLayout">
                  {currentLocation ? (
                    <motion.div
                      key="destination-search"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SearchDestination
                        destination={destination}
                        onDestinationSelect={handleDestinationSelect}
                        onDestinationClear={handleDestinationClear}
                        currentLocation={currentLocation}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="destination-hint"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3"
                    >
                      <p className="text-sm text-gray-600">
                        Set your current location to unlock destination search.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Start Navigation Button */}
                <AnimatePresence>
                  {destination && currentLocation && !isNavigating && !isComputingRoute && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <Button
                        onClick={handleStartNavigation}
                        className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-xl group"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Start Navigation
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation Directions Panel */}
            <NavigationPanel
              isNavigating={isNavigating}
              navigationDirections={navigationDirections}
              onResetNavigation={handleResetNavigation}
            />

            {/* Quick Access Panel */}
            <QuickAccess isNavigating={isNavigating} />
          </motion.div>

          {/* Right Side - Maps */}
          {destination && currentLocation && !isNavigating ? (
            // Pre‑navigation search view:
            // - same floor/map: show a single combined map with both markers
            // - different floors/maps: show current map (left) and destination map (right)
            currentLocation.map === destination.map ? (
              <MapBox
                mapId={destination.map}
                destination={destination}
                currentLocation={currentLocation}
                isNavigating={false}
                pathPoints=""
                autoFitNonce={autoFitNonce}
                onRequestView={({ zoom: nextZoom, panX: nextPanX, panY: nextPanY }) => {
                  setZoom(nextZoom);
                  setPanX(nextPanX);
                  setPanY(nextPanY);
                }}
                zoom={zoom}
                panX={panX}
                panY={panY}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
                handleResetZoom={handleResetZoom}
                handleWheel={handleWheel}
                handlePointerDown={handlePointerDown}
                handlePointerMove={handlePointerMove}
                handlePointerUp={handlePointerUpOrCancel}
                handlePointerCancel={handlePointerUpOrCancel}
              />
            ) : (
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <MapBox
                  mapId={currentLocation.map}
                  destination={null}
                  currentLocation={currentLocation}
                  isNavigating={false}
                  pathPoints=""
                  autoFitNonce={autoFitNonce}
                  onRequestView={({ zoom: nextZoom, panX: nextPanX, panY: nextPanY }) => {
                    setZoom(nextZoom);
                    setPanX(nextPanX);
                    setPanY(nextPanY);
                  }}
                  zoom={zoom}
                  panX={panX}
                  panY={panY}
                  handleZoomIn={handleZoomIn}
                  handleZoomOut={handleZoomOut}
                  handleResetZoom={handleResetZoom}
                  handleWheel={handleWheel}
                  handlePointerDown={handlePointerDown}
                  handlePointerMove={handlePointerMove}
                  handlePointerUp={handlePointerUpOrCancel}
                  handlePointerCancel={handlePointerUpOrCancel}
                />
                <MapBox
                  mapId={destination.map}
                  destination={destination}
                  currentLocation={null}
                  isNavigating={false}
                  pathPoints=""
                  autoFitNonce={autoFitNonce}
                  onRequestView={({ zoom: nextZoom, panX: nextPanX, panY: nextPanY }) => {
                    setZoom(nextZoom);
                    setPanX(nextPanX);
                    setPanY(nextPanY);
                  }}
                  zoom={zoom}
                  panX={panX}
                  panY={panY}
                  handleZoomIn={handleZoomIn}
                  handleZoomOut={handleZoomOut}
                  handleResetZoom={handleResetZoom}
                  handleWheel={handleWheel}
                  handlePointerDown={handlePointerDown}
                  handlePointerMove={handlePointerMove}
                  handlePointerUp={handlePointerUpOrCancel}
                  handlePointerCancel={handlePointerUpOrCancel}
                />
              </div>
            )
          ) : (
            // Navigation / default view: single active map
            <MapBox
              mapId={activeMapId}
              destination={destination}
              currentLocation={currentLocation}
              isNavigating={isNavigating}
              pathPoints={pathPoints}
              stepCount={navigationSteps.length}
              activeStepIndex={activeStepIndex}
              onPrevStep={handlePrevStep}
              onNextStep={handleNextStep}
              autoFitNonce={autoFitNonce}
              onRequestView={({ zoom: nextZoom, panX: nextPanX, panY: nextPanY }) => {
                setZoom(nextZoom);
                setPanX(nextPanX);
                setPanY(nextPanY);
              }}
              zoom={zoom}
              panX={panX}
              panY={panY}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              handleResetZoom={handleResetZoom}
              handleWheel={handleWheel}
              handlePointerDown={handlePointerDown}
              handlePointerMove={handlePointerMove}
              handlePointerUp={handlePointerUpOrCancel}
              handlePointerCancel={handlePointerUpOrCancel}
            />
          )}
        </div>
      </main>
    </div>
  );
}
