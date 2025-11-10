import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
);


const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-light/80 dark:bg-dark/80 backdrop-blur-lg border-b border-light-border dark:border-dark-border">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold font-heading tracking-wide text-light-text dark:text-dark-text">
          PG AI IMAGE
        </Link>
        <div className="flex items-center space-x-2 md:space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600 dark:text-gray-300">
            {user && (
                <>
                    <Link to="/generate" className="hover:text-light-text dark:hover:text-dark-text transition-colors">Generator</Link>
                    <Link to="/credits" className="hover:text-light-text dark:hover:text-dark-text transition-colors">Buy Credits</Link>
                    {user.isAdmin && <Link to="/admin" className="font-semibold text-yellow-500 hover:text-yellow-400 transition-colors">Admin</Link>}
                </>
            )}
          </nav>
          {user ? (
            <div className="flex items-center space-x-3 md:space-x-4">
              <span className="font-semibold bg-light-secondary dark:bg-dark-secondary px-3 py-1.5 rounded-full text-xs border border-light-border dark:border-dark-border">{user.credits >= 99999 ? 'Unlimited' : user.credits} Credits</span>
              <button onClick={handleLogout} className="bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-accent-dark text-accent dark:bg-accent dark:text-accent-dark px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          )}
          <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 rounded-full hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;