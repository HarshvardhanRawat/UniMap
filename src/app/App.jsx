import { useState } from 'react';
import LoginPage from './components/LoginPage';
import CampusMapPage from './components/CampusMapPage';

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

  /**
   * Handles user login.
   * Sets the user name and updates login status.
   * 
   * @param {string} name - User's name
   */
  const handleLogin = (name) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

  /**
   * Handles user logout.
   * Clears user name and resets login status.
   */
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <CampusMapPage userName={userName} onLogout={handleLogout} />
      )}
    </div>
  );
}
