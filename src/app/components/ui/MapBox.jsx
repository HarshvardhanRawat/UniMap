import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, ZoomOut, RotateCcw, Building2 } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { buildings } from '../../data/campusData';
import mapSvg from '../../../assets/GF -Main Building Drawing-Model.svg';

/**
 * MapBox Component
 * 
 * Displays the interactive campus map with zoom, pan, and navigation features.
 * Shows the floor plan when a destination or current location is selected,
 * displays navigation path when navigating, and shows building overview when no location is selected.
 * 
 * @param {object} destination - Selected destination location with x, y coordinates
 * @param {object} currentLocation - Selected current location with x, y coordinates
 * @param {boolean} isNavigating - Whether navigation is currently active
 * @param {string} pathPoints - Space-separated "x,y" pairs for polyline (from buildPolylinePoints)
 * @param {number} zoom - Current zoom level (0.5 to 5)
 * @param {number} panX - Current pan offset on X axis
 * @param {number} panY - Current pan offset on Y axis
 * @param {function} handleZoomIn - Callback to zoom in
 * @param {function} handleZoomOut - Callback to zoom out
 * @param {function} handleResetZoom - Callback to reset zoom and pan
 * @param {function} handleWheel - Callback for mouse wheel zoom
 * @param {function} handleMouseDown - Callback for mouse drag pan
 */
export default function MapBox({
  destination,
  currentLocation,
  isNavigating,
  pathPoints,
  zoom,
  panX,
  panY,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  handleWheel,
  handleMouseDown,
}) {
  // Determine if floor plan should be shown
  const activeFloor = destination?.floor || currentLocation?.floor || null;
  const showFloorPlan = destination !== null || currentLocation !== null;

  // SVG viewBox must match node coordinate system (campusDataNodes x,y)
  // Floor plan SVG and nodes use the same space: viewBox="0 0 840.75 605.66"
  const svgWidth = 840.75;
  const svgHeight = 605.66;

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="lg:col-span-2"
    >
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 border border-gray-100 h-[600px] lg:h-full lg:min-h-[700px]">
        {/* Map Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-gray-900">Campus Map</h2>
          <div className="flex items-center gap-2">
            {/* Destination Badge */}
            {destination && (
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                {destination.building}
              </Badge>
            )}
            
            {/* Zoom Controls */}
            {(showFloorPlan && activeFloor) || destination || currentLocation ? (
              <div className="flex items-center gap-1 ml-2">
                <Button
                  onClick={handleZoomOut}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg"
                  disabled={zoom <= 0.5}
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleResetZoom}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg"
                  title="Reset zoom and pan"
                  aria-label="Reset zoom"
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
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-[calc(100%-3rem)] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200">
          {showFloorPlan ? (
            // Floor Plan View with Navigation
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
                {/* Base Map Image */}
                <img
                  src={mapSvg}
                  alt="Campus Map"
                  className="w-full h-full object-contain"
                />

                {/* SVG Overlay for Markers and Path */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  preserveAspectRatio="xMidYMid meet"
                  style={{ mixBlendMode: 'normal' }}
                >
                  {/* Navigation Path - polyline with exact node coords, strictly on graph edges */}
                  {isNavigating && pathPoints && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Path Background (lighter blue) */}
                      <polyline
                        points={pathPoints}
                        stroke="#93c5fd"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.4}
                      />
                      {/* Animated Path (darker blue) */}
                      <motion.polyline
                        points={pathPoints}
                        stroke="#3b82f6"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </motion.g>
                  )}

                  {/* Destination Marker */}
                  {destination && destination.x !== undefined && destination.y !== undefined && (
                    <motion.g
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ 
                        transform: `scale(${1/zoom})`, 
                        transformOrigin: `${destination.x}px ${destination.y - 10}px` 
                      }}
                    >
                      {/* Outer Pulsing Circle */}
                      <circle
                        cx={destination.x}
                        cy={destination.y}
                        r="8"
                        fill="#3b82f6"
                        opacity="0.3"
                      />
                      {/* Animated Pulsing Circle */}
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
                      {/* Center Dot */}
                      <circle
                        cx={destination.x}
                        cy={destination.y}
                        r="3"
                        fill="#3b82f6"
                      />
                      {/* Destination Label */}
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

                  {/* Current Location Marker */}
                  {currentLocation && currentLocation.x !== undefined && currentLocation.y !== undefined && (
                    <motion.g
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{ 
                        transform: `scale(${1/zoom})`, 
                        transformOrigin: `${currentLocation.x}px ${currentLocation.y - 10}px` 
                      }}
                    >
                      {/* Outer Pulsing Circle */}
                      <circle
                        cx={currentLocation.x}
                        cy={currentLocation.y}
                        r="8"
                        fill="#10b981"
                        opacity="0.3"
                      />
                      {/* Animated Pulsing Circle */}
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
                      {/* Center Dot */}
                      <circle
                        cx={currentLocation.x}
                        cy={currentLocation.y}
                        r="3"
                        fill="#10b981"
                      />
                      {/* Current Location Label */}
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
            // Building Overview Grid (when no location selected)
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
  );
}
