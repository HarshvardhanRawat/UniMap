import { motion } from 'motion/react';
import { User } from 'lucide-react';
import { Button } from './ui/button';
import logoWebp from '../../assets/logo.webp';
import clgLogo from '../../assets/clg_logo.webp';

/**
 * Header Component
 * 
 * Displays the application header with logo and user menu dropdown.
 * Provides access to user profile and logout functionality.
 * 
 * @param {string} userName - The current logged-in user's name
 * @param {function} onLogout - Callback function to handle user logout
 * @param {function} onOpenDeveloperPage - Callback function to open developer page
 */
export default function Header({ onOpenDeveloperPage }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img src={clgLogo} alt="College Logo" className="h-12 w-auto" decoding="async" />
            <span className="text-gray-400 text-xl font-light">×</span>
            <picture>
              <source srcSet={logoWebp} type="image/webp" />
              <img src={logoWebp} alt="UniMap Logo" className="h-12 w-auto" decoding="async" />
            </picture>
          </div>

          {/* Developer & Feedback Button */}
          <Button
            variant="ghost"
            onClick={onOpenDeveloperPage}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-xl px-4"
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-medium text-gray-700">Developer & Feedback</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
