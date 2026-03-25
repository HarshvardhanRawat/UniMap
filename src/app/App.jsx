import { lazy, Suspense, useState, useEffect } from 'react';
import { Analytics } from "@vercel/analytics/react"

const LoginPage = lazy(() => import('./components/LoginPage'));
const CampusMapPage = lazy(() => import('./components/CampusMapPage'));
const DevPage = lazy(() => import('./components/DevPage'));

/**
 * App Component
 * 
 * Root component of the UniMap application.
 * Manages authentication state and renders either the login page
 * or the main campus map page based on login status.
 */
export default function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [activePage, setActivePage] = useState('map');
  const [searchCount, setSearchCount] = useState(() => {
    // Load search count from localStorage on initialization
    const saved = localStorage.getItem('unimap_search_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Persist search count to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('unimap_search_count', searchCount.toString());
  }, [searchCount]);

  /**
   * Handles user login.
   * Sets the user name and updates login status.
   * 
   * @param {string} name - User's name
   */
  const handleLogin = (name) => {
    setUserName(name);
    setIsLoggedIn(true);
    setActivePage('map');
  };

  /**
   * Handles user logout.
   * Clears user name and resets login status.
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setActivePage('map');
  };

  /**
   * Increments the search counter when a location is searched.
   */
  const handleSearchMade = () => {
    setSearchCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Suspense fallback={<div className="min-h-screen" />}>
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} searchCount={searchCount} />
        ) : activePage === 'dev' ? (
          <DevPage onBackToMap={() => setActivePage('map')} />
        ) : (
          <CampusMapPage
            userName={userName}
            onLogout={handleLogout}
            onOpenDeveloperPage={() => setActivePage('dev')}
            onSearchMade={handleSearchMade}
          />
        )}
      </Suspense>
      <Analytics />
    </div>
  );
}
