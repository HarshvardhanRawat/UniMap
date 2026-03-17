import { useState, useMemo, useCallback } from 'react';
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
import { computeMultiMapRoute, buildNodesMap, buildGlobalGraph } from '../../utils/multiMapNavigation';
import { buildPolylinePoints } from '../../utils/pathUtils';
import { generateDetailedNavigationInstructions } from '../../utils/navigation_instructions';

/** Maps navigation direction to icon key (left, right, straight) */
function mapDirectionForIcon(direction) {
  if (!direction) return 'straight';
  const leftVariants = ['slight left', 'sharp left', 'u-turn'];
  const rightVariants = ['slight right', 'sharp right'];
  if (leftVariants.includes(direction)) return 'left';
  if (rightVariants.includes(direction)) return 'right';
  return direction;
}

/**
 * CampusMapPage Component
 * 
 * Main page component for the campus navigation system.
 * Handles location search, pathfinding, navigation, and map display.
 * Manages state for destination, current location, navigation path, and map controls.
 * 
 * @param {string} userName - The current logged-in user's name
 * @param {function} onLogout - Callback function to handle user logout
 */
export default function CampusMapPage({ userName, onLogout }) {
  // Navigation state
  const [destination, setDestination] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [pathPoints, setPathPoints] = useState('');
  const [navigationDirections, setNavigationDirections] = useState([]);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Map control state
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

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

  /**
   * Handles destination selection
   *
   * If navigation is currently active, changing the destination will:
   * - stop navigation
   * - clear the existing path and directions
   * - reset the map view (zoom and pan) to defaults
   */
  const handleDestinationSelect = useCallback((location) => {
    if (isNavigating) {
      setIsNavigating(false);
      setPathPoints('');
      setNavigationDirections([]);
      setZoom(1);
      setPanX(0);
      setPanY(0);
    }
    setDestination(location);
  }, [isNavigating]);

  /**
   * Handles destination clearing
   */
  const handleDestinationClear = useCallback(() => {
    setDestination(null);
    if (isNavigating) {
      handleResetNavigation();
    }
  }, [isNavigating]);

  /**
   * Handles current location selection
   *
   * If navigation is currently active, changing the current location will:
   * - stop navigation
   * - clear the existing path and directions
   * - reset the map view (zoom and pan) to defaults
   */
  const handleCurrentLocationSelect = useCallback((location) => {
    if (isNavigating) {
      setIsNavigating(false);
      setPathPoints('');
      setNavigationDirections([]);
      setZoom(1);
      setPanX(0);
      setPanY(0);
    }
    setCurrentLocation(location);
  }, [isNavigating]);

  /**
   * Handles current location clearing
   */
  const handleCurrentLocationClear = useCallback(() => {
    setCurrentLocation(null);
    setDestination(null);
    if (isNavigating) {
      handleResetNavigation();
    }
  }, [isNavigating]);

  /**
   * Rebuilds polyline + instructions for a single step.
   * This keeps rendering strictly per‑map.
   */
  const activateStep = useCallback(
    (step) => {
      if (!step || !step.path_nodes || step.path_nodes.length === 0) {
        setPathPoints('');
        setNavigationDirections([]);
        return;
      }

      const stepPathWithCoords = step.path_nodes.filter((id) => nodesMap[id]);
      if (stepPathWithCoords.length === 0) {
        setPathPoints('');
        setNavigationDirections([]);
        return;
      }

      const points = buildPolylinePoints(stepPathWithCoords, nodesMap);
      setPathPoints(points);

      const rawInstructions = generateDetailedNavigationInstructions(
        stepPathWithCoords,
        nodesMap,
        navigationEdges,
      );
      const directions = rawInstructions
        .filter((i) => i.action !== 'error')
        .map((i) => ({
          direction: mapDirectionForIcon(i.direction),
          instruction: [i.message, i.landmark].filter(Boolean).join(' '),
          distance:
            i.distanceInMeters != null ? `${i.distanceInMeters}m` : '',
        }));
      setNavigationDirections(directions);
    },
    [nodesMap],
  );

  /**
   * Starts navigation by calculating a global shortest path, then
   * segmenting it into per‑map steps.
   */
  const handleStartNavigation = useCallback(() => {
    if (!destination || !currentLocation) return;

    const result = computeMultiMapRoute(
      navigationNodes,
      navigationEdges,
      currentLocation.id,
      destination.id,
    );

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
  }, [destination, currentLocation, activateStep]);

  /**
   * Resets navigation state, clears all selections, and resets map to default zoom/pan
   */
  const handleResetNavigation = useCallback(() => {
    setIsNavigating(false);
    setDestination(null);
    setCurrentLocation(null);
    setPathPoints('');
    setNavigationDirections([]);
    setNavigationSteps([]);
    setActiveStepIndex(0);
    setZoom(1);
    setPanX(0);
    setPanY(0);
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
   * Handles mouse wheel zoom
   */
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(5, prev * delta)));
  }, []);

  /**
   * Handles mouse drag for panning the map
   */
  const handleMouseDown = useCallback((e) => {
    const startX = e.clientX - panX;
    const startY = e.clientY - panY;

    const handleMouseMove = (ev) => {
      setPanX(ev.clientX - startX);
      setPanY(ev.clientY - startY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [panX, panY]);

  const activeStep = navigationSteps[activeStepIndex] || null;
  const activeMapId =
    (isNavigating && activeStep?.map) ||
    currentLocation?.map ||
    destination?.map ||
    'Main_GF';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header userName={userName} onLogout={onLogout} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Search and Navigation */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
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
                  {destination && currentLocation && !isNavigating && (
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
                zoom={zoom}
                panX={panX}
                panY={panY}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
                handleResetZoom={handleResetZoom}
                handleWheel={handleWheel}
                handleMouseDown={handleMouseDown}
              />
            ) : (
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <MapBox
                  mapId={currentLocation.map}
                  destination={null}
                  currentLocation={currentLocation}
                  isNavigating={false}
                  pathPoints=""
                  zoom={zoom}
                  panX={panX}
                  panY={panY}
                  handleZoomIn={handleZoomIn}
                  handleZoomOut={handleZoomOut}
                  handleResetZoom={handleResetZoom}
                  handleWheel={handleWheel}
                  handleMouseDown={handleMouseDown}
                />
                <MapBox
                  mapId={destination.map}
                  destination={destination}
                  currentLocation={null}
                  isNavigating={false}
                  pathPoints=""
                  zoom={zoom}
                  panX={panX}
                  panY={panY}
                  handleZoomIn={handleZoomIn}
                  handleZoomOut={handleZoomOut}
                  handleResetZoom={handleResetZoom}
                  handleWheel={handleWheel}
                  handleMouseDown={handleMouseDown}
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
              zoom={zoom}
              panX={panX}
              panY={panY}
              handleZoomIn={handleZoomIn}
              handleZoomOut={handleZoomOut}
              handleResetZoom={handleResetZoom}
              handleWheel={handleWheel}
              handleMouseDown={handleMouseDown}
            />
          )}
        </div>
      </main>
    </div>
  );
}
