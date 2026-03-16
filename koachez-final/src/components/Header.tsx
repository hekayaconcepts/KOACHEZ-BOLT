import React, { useState } from 'react';
import { coachProfile } from '../data/coachData';
import { Menu, X, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isLoggedIn: boolean;
  userRole: 'public' | 'client' | 'coach';
  onLoginClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  isLoggedIn,
  userRole,
  onLoginClick,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const publicNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'articles', label: 'Articles' },
    { id: 'podcast', label: 'Podcast' },
    { id: 'courses', label: 'Courses' },
    { id: 'services', label: 'Services' },
  ];

  const clientNavItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my-sessions', label: 'My Sessions' },
    { id: 'my-courses', label: 'My Courses' },
  ];

  const coachNavItems = [
    { id: 'admin-dashboard', label: 'Dashboard' },
    { id: 'admin-content', label: 'Content' },
    { id: 'admin-bookings', label: 'Bookings' },
    { id: 'admin-clients', label: 'Clients' },
    { id: 'admin-settings', label: 'Settings' },
  ];

  const getNavItems = () => {
    if (userRole === 'coach') return coachNavItems;
    if (userRole === 'client') return [...publicNavItems.slice(0, 4), ...clientNavItems];
    return publicNavItems;
  };

  const navItems = getNavItems();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => setCurrentView(userRole === 'coach' ? 'admin-dashboard' : 'home')}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {coachProfile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span className="ml-3 text-lg font-semibold text-sky-900 hidden sm:block">
              {coachProfile.name}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-sky-100 text-sky-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setCurrentView('booking')}
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                >
                  Book Session
                </button>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 transition-colors"
                >
                  Sign In
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-sky-600" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {userRole === 'coach' ? 'Admin' : 'Account'}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                    {userRole === 'client' && (
                      <button
                        onClick={() => {
                          setCurrentView('dashboard');
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3" />
                        Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setCurrentView('account');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Account Settings
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        onLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-sky-100 text-sky-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {!isLoggedIn && (
                <button
                  onClick={() => {
                    setCurrentView('booking');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 rounded-lg text-left font-medium text-sky-600 hover:bg-sky-50"
                >
                  Book Session
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
