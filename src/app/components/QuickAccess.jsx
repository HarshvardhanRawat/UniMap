import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

/**
 * QuickAccess Component
 * 
 * Displays quick access buttons for popular locations.
 * Shows 4 frequently accessed locations for quick navigation.
 * 
 * @param {boolean} isNavigating - Whether navigation is currently active (hides this component)
 * @param {function} onDestinationSelect - Callback when a quick access location is selected
 */
export default function QuickAccess({ isNavigating, onDestinationSelect }) {
  if (isNavigating) return null;

  // Define quick access locations
  const quickLocations = [
    { id: 'room_J101', name: 'Colloquium', map: 'Main_FF', x: 341.3025, y: 489.9517 },
    { id: 'room_J001', name: 'Conclave', map: 'Main_GF', x: 406.8033, y: 487.5583 },
    { id: 'room_J102', name: 'SH-7', map: 'Main_FF', x: 156.9493, y: 469.9952 },
    { id: 'Jubilee_Gate', name: 'Jubilee Gate', map: 'Campus_Map', x: 749.9669, y: 127.5277 }
  ];

  const handleLocationClick = (location) => {
    onDestinationSelect(location);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="surface-card"
    >
      <h3 className="text-lg text-gray-900 mb-4">Quick Access</h3>
      <div className="grid grid-cols-2 gap-3">
        {quickLocations.map((location) => (
          <button
            key={location.id}
            onClick={() => handleLocationClick(location)}
            className="p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
          >
            <MapPin className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-gray-900">{location.name}</p>
            <p className="text-xs text-gray-500 mt-1">{location.map.replace('_', ' ')}</p>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
