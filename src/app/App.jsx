import { useState } from 'react';
import LoginPage from './components/LoginPage';
import CampusMapPage from './components/CampusMapPage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = (name) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

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
