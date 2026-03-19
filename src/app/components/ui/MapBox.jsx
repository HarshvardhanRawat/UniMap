import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ZoomIn, ZoomOut, RotateCcw, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { buildings } from '../../data/campusData';
import { getMapAsset, preloadMapAsset, mapViewBoxes } from '../../data/mapAssets';

function parsePoints(pointsString) {
  if (!pointsString || typeof pointsString !== 'string') return [];
  return pointsString
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [xStr, yStr] = pair.split(',');
      const x = Number(xStr);
      const y = Number(yStr);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      return { x, y };
    })
    .filter(Boolean);
}

function computeBbox(points) {
  if (!points || points.length === 0) return null;
  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

/**
 * MapBox Component
 * 
 * Displays the interactive campus map with zoom, pan, and navigation features.
 * Shows the floor plan when a destination or current location is selected,
 * displays navigation path when navigating, and shows building overview when no location is selected.
 * 
 * @param {string} mapId - Active map ID whose SVG should be displayed
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
  mapId,
  destination,
  currentLocation,
  isNavigating,
  pathPoints,
  autoFitNonce,
  onRequestView,
  stepCount = 0,
  activeStepIndex = 0,
  onPrevStep,
  onNextStep,
  zoom,
  panX,
  panY,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  handleWheel,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handlePointerCancel,
}) {
  const prefersReducedMotion = useReducedMotion();
  const [mapSrc, setMapSrc] = useState('');
  const containerRef = useRef(null);
  const lastAutoFitRef = useRef(null);
  // Determine if floor plan should be shown
  const activeFloor = destination?.floor || currentLocation?.floor || null;
  const showFloorPlan = !!mapId && (destination !== null || currentLocation !== null);
  const shouldShowDestination = !!destination && destination.map === mapId;
  const shouldShowCurrentLocation =
    !!currentLocation && currentLocation.map === mapId;

  useEffect(() => {
    let cancelled = false;
    getMapAsset(mapId).then((url) => {
      if (!cancelled) setMapSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [mapId]);

  useEffect(() => {
    // Best-effort prefetch likely-next floor maps.
    if (mapId === 'Main_GF') preloadMapAsset('Main_FF');
    if (mapId === 'Main_FF') preloadMapAsset('Main_SF');
  }, [mapId]);

  // SVG viewBox must match node coordinate system per map
  const viewBoxConfig = mapViewBoxes[mapId] ?? mapViewBoxes.Main_GF;
  const svgWidth = viewBoxConfig.width;
  const svgHeight = viewBoxConfig.height;

  const pathBbox = useMemo(() => {
    if (!isNavigating || !pathPoints) return null;
    const pts = parsePoints(pathPoints);
    return computeBbox(pts);
  }, [isNavigating, pathPoints]);

  useEffect(() => {
    if (!isNavigating) return;
    if (!pathBbox) return;
    if (!onRequestView) return;
    if (autoFitNonce == null) return;
    if (lastAutoFitRef.current === autoFitNonce) return;

    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    if (!(w > 0 && h > 0)) return;

    // Map SVG coords -> screen coords (zoom=1, pan=0) with preserveAspectRatio="meet".
    const baseScale = Math.min(w / svgWidth, h / svgHeight) || 1;
    const offsetX = (w - svgWidth * baseScale) / 2;
    const offsetY = (h - svgHeight * baseScale) / 2;

    const minX = pathBbox.minX * baseScale + offsetX;
    const maxX = pathBbox.maxX * baseScale + offsetX;
    const minY = pathBbox.minY * baseScale + offsetY;
    const maxY = pathBbox.maxY * baseScale + offsetY;

    const bboxW = Math.max(1, maxX - minX);
    const bboxH = Math.max(1, maxY - minY);
    const pad = Math.max(24, Math.min(w, h) * 0.06);
    const availW = Math.max(1, w - 2 * pad);
    const availH = Math.max(1, h - 2 * pad);

    const nextZoom = Math.max(0.5, Math.min(5, Math.min(availW / bboxW, availH / bboxH)));

    const bboxCenterX = (minX + maxX) / 2;
    const bboxCenterY = (minY + maxY) / 2;
    const centerX = w / 2;
    const centerY = h / 2;

    // With transformOrigin center and scale+translate, this pan centers the route.
    const nextPanX = -nextZoom * (bboxCenterX - centerX);
    const nextPanY = -nextZoom * (bboxCenterY - centerY);

    lastAutoFitRef.current = autoFitNonce;
    onRequestView({ zoom: nextZoom, panX: nextPanX, panY: nextPanY });
  }, [autoFitNonce, isNavigating, onRequestView, pathBbox, svgHeight, svgWidth]);

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="lg:col-span-2"
    >
      <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-3 sm:p-5 border border-gray-100 min-h-[360px] h-[66svh] sm:h-[600px] lg:h-full lg:min-h-[700px] flex flex-col">
        {/* Map Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <h2 className="text-lg text-gray-900">Campus Map</h2>
          <div className="flex flex-wrap items-center gap-2">
            {/* Destination Badge */}
            {shouldShowDestination && (
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                {destination.building}
              </Badge>
            )}

            {/* Step controls (for multi-step navigation across floors/maps) */}
            {isNavigating && stepCount > 1 ? (
              <div className="flex flex-wrap items-center gap-1">
                <Badge variant="secondary" className="text-xs">
                  Step {activeStepIndex + 1}/{stepCount}
                </Badge>
                <Button
                  onClick={onPrevStep}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg"
                  disabled={!onPrevStep || activeStepIndex <= 0}
                  aria-label="Previous step"
                  title="Previous step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={onNextStep}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-lg"
                  disabled={!onNextStep || activeStepIndex >= stepCount - 1}
                  aria-label="Next step"
                  title="Next step"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ) : null}
            
            {/* Zoom Controls */}
            {(showFloorPlan && activeFloor) || destination || currentLocation ? (
              <div className="flex flex-wrap items-center gap-1 sm:ml-2">
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
        <div
          ref={containerRef}
          className="relative w-full flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200"
        >
          {showFloorPlan ? (
            // Floor Plan View with Navigation
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none"
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              style={{
                transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
                transformOrigin: 'center center',
              }}
            >
              <div className="relative w-full h-full">
                {/* Base Map Image */}
                <img
                  src={mapSrc}
                  alt={mapId || 'Map'}
                  className="w-full h-full object-contain"
                  decoding="async"
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
                      {prefersReducedMotion ? (
                        <polyline
                          points={pathPoints}
                          stroke="#3b82f6"
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : (
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
                      )}
                    </motion.g>
                  )}

                  {/* Destination Marker */}
                  {shouldShowDestination && destination.x !== undefined && destination.y !== undefined && (
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
                      {!prefersReducedMotion ? (
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
                      ) : null}
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
                  {shouldShowCurrentLocation && currentLocation.x !== undefined && currentLocation.y !== undefined && (
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
                      {!prefersReducedMotion ? (
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
                      ) : null}
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
            <div className="absolute inset-0 p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-full">
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
