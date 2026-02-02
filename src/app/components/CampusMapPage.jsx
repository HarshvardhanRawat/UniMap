import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Search,
  Navigation,
  User,
  LogOut,
  Building2,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ChevronRight,
  Locate,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { campusLocations } from '../data/LocationConvert';
import { buildings, navigationNodes, navigationEdges } from '../data/campusData';

import { dijkstra } from '../../utils/dijkstra';
import { buildWalkableSvgPath, generateTurnByTurnDirections } from '../../utils/pathUtils';
import logo from '../../assets/logo.png';
import mapSvg from '../../assets/GF -Main Building Drawing-Model.svg';

export default function CampusMapPage({ userName, onLogout }) {
  const [destination, setDestination] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCurrentSuggestions, setShowCurrentSuggestions] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [pathPoints, setPathPoints] = useState('');
  const [navigationDirections, setNavigationDirections] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  const nodesMap = useMemo(() =>
    Object.fromEntries(
      navigationNodes.map(node => [node.id, node])
    ), []
  );

  // Graph uses only explicit navigation edges (corridor + room connections).
  // Corridor nodes are used for routing but not shown in directions.
  const graph = useMemo(() => {
    const g = {};

    navigationNodes.forEach(node => {
      g[node.id] = [];
    });

    navigationEdges.forEach(edge => {
      const from = edge.from_node ?? edge.from;
      const to = edge.to_node ?? edge.to;
      const w = edge.distance ?? edge.weight ?? 1;
      if (!from || !to) return;
      if (!g[from]) g[from] = [];
      if (!g[to]) g[to] = [];
      g[from].push({ node: to, weight: w });
      g[to].push({ node: from, weight: w });
    });

    return g;
  }, []);

  const filteredLocations = useMemo(() =>
    searchQuery.trim()
      ? campusLocations.filter((loc) =>
          loc.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [], [searchQuery]
  );

  const filteredCurrentLocations = useMemo(() =>
    currentSearchQuery.trim()
      ? campusLocations.filter((loc) =>
          loc.name.toLowerCase().includes(currentSearchQuery.toLowerCase())
        )
      : [], [currentSearchQuery]
  );

  const handleDestinationSelect = useCallback((location) => {
    setDestination(location);
    setSearchQuery(location.name);
    setShowSuggestions(false);
  }, []);

  const handleCurrentLocationSelect = useCallback((location) => {
    setCurrentLocation(location);
    setCurrentSearchQuery(location.name);
    setShowCurrentSuggestions(false);
  }, []);

  const handleStartNavigation = useCallback(() => {
    if (destination && currentLocation) {
      const startNode = currentLocation.id;
      const endNode = destination.id;

      const path = dijkstra(graph, startNode, endNode);

      if (path && path.length > 0) {
        const pathWithCoordinates = path.filter((nodeId) => nodesMap[nodeId]);

        if (pathWithCoordinates.length > 0) {
          const svgPath = buildWalkableSvgPath(pathWithCoordinates, nodesMap);
          setPathPoints(svgPath);

          const directions = generateTurnByTurnDirections(pathWithCoordinates, nodesMap);
          setNavigationDirections(directions);
          setIsNavigating(true);
        } else {
          setPathPoints('');
          setNavigationDirections([{
            direction: 'straight',
            instruction: 'Path found but coordinates unavailable for display',
            distance: '',
          }]);
          setIsNavigating(true);
        }
      } else {
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

  const handleResetNavigation = useCallback(() => {
    setIsNavigating(false);
    setDestination(null);
    setCurrentLocation(null);
    setSearchQuery('');
    setCurrentSearchQuery('');
    setPathPoints('');
    setNavigationDirections([]);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  }, []);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(5, prev * delta)));
  }, []);

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

  const activeFloor = destination?.floor || currentLocation?.floor || null;
  const showFloorPlan = destination !== null || currentLocation !== null;

  const svgWidth = 840.75;
  const svgHeight = 605.66;

  const getMarkerPosition = useCallback((x, y) => {
    if (!x || !y) return { left: '50%', top: '50%' };
    const leftPercent = (x / svgWidth) * 100;
    const topPercent = (y / svgHeight) * 100;
    return { left: `${leftPercent}%`, top: `${topPercent}%` };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="UniMap Logo" className="h-10 w-auto" />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-3"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm text-gray-700">{userName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                <DropdownMenuItem className="rounded-lg">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="rounded-lg text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100">
              <h2 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Plan Your Route
              </h2>

              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm text-gray-600 mb-2">
                    Where do you want to go?
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                    <Input
                      type="text"
                      placeholder="Search destination..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="pl-10 pr-10 h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setDestination(null);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {showSuggestions && filteredLocations.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-64 overflow-auto"
                      >
                        {filteredLocations.slice(0, 6).map((location) => (
                          <button
                            key={location.id}
                            onClick={() => handleDestinationSelect(location)}
                            className="w-full px-4 py-3 hover:bg-blue-50 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-0 text-left"
                          >
                            <Building2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 truncate">{location.name}</p>
                              <p className="text-xs text-gray-500">
                                {location.building} • Floor {location.floor}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs flex-shrink-0">
                              {location.category}
                            </Badge>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {destination && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="relative"
                    >
                      <label className="block text-sm text-gray-600 mb-2">
                        Where are you currently?
                      </label>
                      <div className="relative">
                        <Locate className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                        <Input
                          type="text"
                          placeholder="Search current location..."
                          value={currentSearchQuery}
                          onChange={(e) => {
                            setCurrentSearchQuery(e.target.value);
                            setShowCurrentSuggestions(true);
                          }}
                          onFocus={() => setShowCurrentSuggestions(true)}
                          className="pl-10 pr-10 h-11 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400/20"
                        />
                        {currentSearchQuery && (
                          <button
                            onClick={() => {
                              setCurrentSearchQuery('');
                              setCurrentLocation(null);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {showCurrentSuggestions && filteredCurrentLocations.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-64 overflow-auto"
                          >
                            {filteredCurrentLocations.slice(0, 6).map((location) => (
                              <button
                                key={location.id}
                                onClick={() => handleCurrentLocationSelect(location)}
                                className="w-full px-4 py-3 hover:bg-green-50 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-0 text-left"
                              >
                                <Building2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-gray-900 truncate">{location.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {location.building} • Floor {location.floor}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="text-xs flex-shrink-0">
                                  {location.category}
                                </Badge>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

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

            <AnimatePresence>
              {isNavigating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg text-gray-900 flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-blue-600" />
                      Navigation Steps
                    </h3>
                    <Button
                      onClick={handleResetNavigation}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      End
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {navigationDirections.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg flex-shrink-0">
                          {step.direction === 'right' && (
                            <ArrowRight className="w-4 h-4 text-blue-600" />
                          )}
                          {step.direction === 'left' && (
                            <ArrowLeft className="w-4 h-4 text-blue-600" />
                          )}
                          {step.direction === 'up' && <ArrowUp className="w-4 h-4 text-blue-600" />}
                          {step.direction === 'down' && (
                            <ArrowDown className="w-4 h-4 text-blue-600" />
                          )}
                          {step.direction === 'straight' && (
                            <ChevronRight className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{step.instruction}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{step.distance}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isNavigating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100"
              >
                <h3 className="text-lg text-gray-900 mb-4">Quick Access</h3>
                <div className="grid grid-cols-2 gap-3">
                  {buildings.slice(0, 4).map((building) => (
                    <button
                      key={building.id}
                      className="p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                    >
                      <Building2 className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm text-gray-900">{building.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{building.floors} floors</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100 h-[600px] lg:h-full lg:min-h-[700px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg text-gray-900">Campus Map</h2>
                <div className="flex items-center gap-2">
                  {destination && (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                      {destination.building}
                    </Badge>
                  )}
                  {(showFloorPlan && activeFloor) || destination || currentLocation ? (
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        onClick={handleZoomOut}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg"
                        disabled={zoom <= 0.5}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={handleResetZoom}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg"
                        title="Reset zoom and pan"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <span className="text-xs text-gray-500 min-w-[3rem] text-center">
                        {Math.round(zoom * 100)}%
                      </span>
                      <Button
                        onClick={handleZoomIn}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg"
                        disabled={zoom >= 5}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="relative w-full h-[calc(100%-3rem)] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200">
                {(showFloorPlan && activeFloor) || destination || currentLocation ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    style={{
                      transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
                      transformOrigin: 'center center',
                    }}
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={mapSvg}
                        alt="Campus Map"
                        className="w-full h-full object-contain"
                      />

                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-10"
                        viewBox="0 0 840.75 605.66"
                        preserveAspectRatio="xMidYMid meet"
                        style={{ mixBlendMode: 'normal' }}
                      >
                      {isNavigating && pathPoints && (
                        <motion.g
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{ transform: `scale(${1/zoom}) translate(0px, -10px)`, transformOrigin: 'center center' }}
                        >
                          <path
                            d={pathPoints}
                            stroke="#93c5fd"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="butt"
                            strokeLinejoin="miter"
                            opacity={0.4}
                          />
                          <motion.path
                            d={pathPoints}
                            stroke="#3b82f6"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="butt"
                            strokeLinejoin="miter"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </motion.g>
                      )}

                      {destination && destination.x !== undefined && destination.y !== undefined && (
                        <motion.g
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{ transform: `scale(${1/zoom})`, transformOrigin: `${destination.x}px ${destination.y - 10}px` }}
                        >
                          <circle
                            cx={destination.x}
                            cy={destination.y}
                            r="8"
                            fill="#3b82f6"
                            opacity="0.3"
                          />
                          <motion.circle
                            cx={destination.x}
                            cy={destination.y}
                            r="8"
                            fill="#3b82f6"
                            opacity="0.3"
                            animate={{
                              r: [8, 16, 8],
                              opacity: [0.3, 0, 0.3]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 2
                            }}
                          />
                          <circle
                            cx={destination.x}
                            cy={destination.y}
                            r="3"
                            fill="#3b82f6"
                          />
                          <text
                            x={destination.x}
                            y={destination.y - 25}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#1e40af"
                            fontWeight="bold"
                            className="pointer-events-auto"
                          >
                            {destination.name}
                          </text>
                        </motion.g>
                      )}

                      {currentLocation && currentLocation.x !== undefined && currentLocation.y !== undefined && (
                        <motion.g
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{ transform: `scale(${1/zoom})`, transformOrigin: `${currentLocation.x}px ${currentLocation.y - 10}px` }}
                        >
                          <circle
                            cx={currentLocation.x}
                            cy={currentLocation.y}
                            r="8"
                            fill="#10b981"
                            opacity="0.3"
                          />
                          <motion.circle
                            cx={currentLocation.x}
                            cy={currentLocation.y}
                            r="8"
                            fill="#10b981"
                            opacity="0.3"
                            animate={{
                              r: [8, 16, 8],
                              opacity: [0.3, 0, 0.3]
                            }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5
                            }}
                          />
                          <circle
                            cx={currentLocation.x}
                            cy={currentLocation.y}
                            r="3"
                            fill="#10b981"
                          />
                          <text
                            x={currentLocation.x}
                            y={currentLocation.y - 25}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#059669"
                            fontWeight="bold"
                            className="pointer-events-auto"
                          >
                            You are here
                          </text>
                        </motion.g>
                      )}
                    </svg>
                    </div>
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 p-8">
                    <div className="grid grid-cols-3 gap-4 h-full">
                      {buildings.map((building, idx) => (
                        <motion.div
                          key={building.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * idx }}
                          className="relative rounded-lg border-2 bg-white border-gray-300 hover:border-gray-400 transition-all"
                        >
                          <div className="absolute top-2 left-2">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-xs text-gray-700 truncate">{building.name}</p>
                            <p className="text-xs text-gray-500">{building.floors} floors</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
