import { motion } from 'motion/react';
import { Building2 } from 'lucide-react';
import { buildings } from '../data/campusData';

/**
 * QuickAccess Component
 * 
 * Displays quick access buttons for popular buildings.
 * Shows the first 4 buildings with their floor count for quick navigation.
 * 
 * @param {boolean} isNavigating - Whether navigation is currently active (hides this component)
 */
export default function QuickAccess({ isNavigating }) {
  if (isNavigating) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="surface-card"
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
  );
}
