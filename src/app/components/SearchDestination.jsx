import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Building2, X } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { campusLocations } from '../data/LocationConvert';

/**
 * SearchDestination Component
 * 
 * Provides a searchable input field for selecting a destination location.
 * Displays filtered suggestions as the user types and handles selection.
 * 
 * @param {object} destination - Currently selected destination location
 * @param {function} onDestinationSelect - Callback when a destination is selected
 * @param {function} onDestinationClear - Callback to clear the selected destination
 */
export default function SearchDestination({ destination, onDestinationSelect, onDestinationClear }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 120);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Filter locations based on search query (case-insensitive)
  const filteredLocations = useMemo(() =>
    debouncedQuery.trim()
      ? campusLocations.filter((loc) =>
          (loc.searchName ?? loc.name.toLowerCase()).includes(debouncedQuery.toLowerCase())
        )
      : [], [debouncedQuery]
  );

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
            {filteredLocations.slice(0, 6).map((location) => (
              <button
                key={location.id}
                onClick={() => handleSelect(location)}
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
  );
}
