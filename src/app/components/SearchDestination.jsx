import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Building2, X, Check } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { campusLocations } from '../data/LocationConvert';
import { navigationEdges } from '../data/campusData';
import { buildGlobalGraph } from '../../utils/multiMapNavigation';
import useDebouncedValue from './hooks/useDebouncedValue';
import useNearestWashroom from './hooks/useNearestWashroom';

/**
 * SearchDestination Component
 * 
 * Provides a searchable input field for selecting a destination location.
 * Displays filtered suggestions as the user types and handles selection.
 * 
 * @param {object} destination - Currently selected destination location
 * @param {function} onDestinationSelect - Callback when a destination is selected
 * @param {function} onDestinationClear - Callback to clear the selected destination
 * @param {object|null} currentLocation - Currently selected current location (used for "nearest washroom" default selection)
 */
export default function SearchDestination({
  destination,
  onDestinationSelect,
  onDestinationClear,
  currentLocation,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 120);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter locations based on search query (case-insensitive)
  const filteredLocations = useMemo(() =>
    debouncedQuery.trim()
      ? campusLocations.filter((loc) =>
          (loc.searchName ?? loc.name.toLowerCase()).includes(debouncedQuery.toLowerCase())
        )
      : [], [debouncedQuery]
  );

  const isWashroomSelectionMode =
    filteredLocations.length > 0 && filteredLocations.every((loc) => loc.category === 'Washroom');

  const resultsToShow = isWashroomSelectionMode ? filteredLocations : filteredLocations.slice(0, 6);

  // Build global routing graph once for distance calculations.
  const graph = useMemo(() => buildGlobalGraph(navigationEdges), []);

  // Find the nearest washroom by shortest-path distance from the current location.
  const { nearestWashroom } = useNearestWashroom({
    currentLocation,
    isWashroomSelectionMode,
    filteredLocations,
    graph,
  });

  // Default behavior: auto-select the nearest washroom (but do not override if the user
  // already selected one of the current dropdown results).
  useEffect(() => {
    if (!currentLocation || !isWashroomSelectionMode) return;
    if (!nearestWashroom) return;

    const destinationInResults =
      destination && filteredLocations.some((loc) => loc.id === destination.id);

    if (!destinationInResults) {
      onDestinationSelect(nearestWashroom);
    }
  }, [currentLocation?.id, isWashroomSelectionMode, nearestWashroom?.id, destination?.id, filteredLocations, onDestinationSelect]);

  /**
   * Handles destination selection from suggestions
   */
  const handleSelect = (location) => {
    onDestinationSelect(location);
    setSearchQuery(location.name);
    setShowSuggestions(false);
  };

  /**
   * Handles clearing the destination search
   */
  const handleClear = () => {
    setSearchQuery('');
    onDestinationClear();
  };

  return (
    <div className="relative">
      <label className="block text-sm text-gray-600 mb-2">
        Where do you want to go?
      </label>
      <div className="relative">
        {/* Search Icon */}
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
        
        {/* Search Input */}
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
        
        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredLocations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-64 overflow-auto overscroll-contain"
          >
            {resultsToShow.map((location) => {
              const isSelected = destination?.id === location.id;
              return (
              <button
                key={location.id}
                onClick={() => handleSelect(location)}
                className={`w-full px-4 py-3 hover:bg-blue-50 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-0 text-left ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{location.name}</p>
                  <p className="text-xs text-gray-500">
                    {location.building} • Floor {location.floor}
                  </p>
                </div>
                {isSelected ? (
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                ) : null}
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {location.category}
                </Badge>
              </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
