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
import { dijkstra } from '../../utils/dijkstra';
import { buildWalkableSvgPath } from '../../utils/pathUtils';
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

  // Map control state
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  /**
   * Creates a map of node IDs to node objects for quick lookup
   */
  const nodesMap = useMemo(() =>
    Object.fromEntries(
      navigationNodes.map(node => [node.id, node])
    ), []
  );

  /**
   * Builds a graph structure from navigation nodes and edges.
   * Graph uses only explicit navigation edges (corridor + room connections).
   * Corridor nodes are used for routing but not shown in directions.
   */
  const graph = useMemo(() => {
    const g = {};

    // Initialize graph with all nodes
    navigationNodes.forEach(node => {
      g[node.id] = [];
    });

    // Add edges (bidirectional)
    navigationEdges.forEach(edge => {
      const from = edge.from_node ?? edge.from;
      const to = edge.to_node ?? edge.to;
      const w = edge.distance ?? edge.weight ?? 1;
      
      if (!from || !to) return;
      
      // Ensure nodes exist in graph
      if (!g[from]) g[from] = [];
      if (!g[to]) g[to] = [];
      
      // Add bidirectional edges
      g[from].push({ node: to, weight: w });
      g[to].push({ node: from, weight: w });
    });

    return g;
  }, []);

  /**
   * Handles destination selection
   */
  const handleDestinationSelect = useCallback((location) => {
    setDestination(location);
  }, []);

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
   */
  const handleCurrentLocationSelect = useCallback((location) => {
    setCurrentLocation(location);
  }, []);

  /**
   * Handles current location clearing
   */
  const handleCurrentLocationClear = useCallback(() => {
    setCurrentLocation(null);
    if (isNavigating) {
      handleResetNavigation();
    }
  }, [isNavigating]);

  /**
   * Starts navigation by calculating the shortest path between current location and destination.
   * Uses Dijkstra's algorithm to find the path and generates turn-by-turn directions.
   */
  const handleStartNavigation = useCallback(() => {
    if (destination && currentLocation) {
      // Path: FROM current location (where you are) TO destination (where you want to go)
      const startNode = currentLocation.id;
      const endNode = destination.id;
      const path = dijkstra(graph, startNode, endNode);

      if (path && path.length > 0) {
        // Filter path to only include nodes with coordinates
        const pathWithCoordinates = path.filter((nodeId) => nodesMap[nodeId]);

        if (pathWithCoordinates.length > 0) {
          // Build SVG path for visualization
          const svgPath = buildWalkableSvgPath(pathWithCoordinates, nodesMap);
          setPathPoints(svgPath);

          // Generate navigation instructions (angle-based turns, edge types)
          const rawInstructions = generateDetailedNavigationInstructions(
            pathWithCoordinates,
            nodesMap,
            navigationEdges
          );
          const directions = rawInstructions
            .filter((i) => i.action !== 'error')
            .map((i) => ({
              direction: mapDirectionForIcon(i.direction),
              instruction: [i.message, i.landmark].filter(Boolean).join(' '),
              distance: i.distanceInMeters != null ? `${i.distanceInMeters}m` : '',
            }));
          setNavigationDirections(directions);
          setIsNavigating(true);
        } else {
          // Path found but no coordinates available
          setPathPoints('');
          setNavigationDirections([{
            direction: 'straight',
            instruction: 'Path found but coordinates unavailable for display',
            distance: '',
          }]);
          setIsNavigating(true);
        }
      } else {
        // No path found
        setPathPoints('');
        setNavigationDirections([{
          direction: 'straight',
          instruction: 'No path found between these locations',
          distance: '',
        }]);
        setIsNavigating(true);
      }
    }
  }, [destination, currentLocation, graph, nodesMap]);

  /**
   * Resets navigation state and clears all selections
   */
  const handleResetNavigation = useCallback(() => {
    setIsNavigating(false);
    setDestination(null);
    setCurrentLocation(null);
    setPathPoints('');
    setNavigationDirections([]);
  }, []);

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

                {/* Destination second (TO) */}
                <SearchDestination
                  destination={destination}
                  onDestinationSelect={handleDestinationSelect}
                  onDestinationClear={handleDestinationClear}
                />

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

          {/* Right Side - Map */}
          <MapBox
            destination={destination}
            currentLocation={currentLocation}
            isNavigating={isNavigating}
            pathPoints={pathPoints}
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
      </main>
    </div>
  );
}
