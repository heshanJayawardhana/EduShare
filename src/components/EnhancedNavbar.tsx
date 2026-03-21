import React, { useState, useEffect } from 'react';
import { Search, Bell, ShoppingCart, Users, ChevronDown, Filter, LogOut, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import NotificationDropdown from './NotificationDropdown';
import NotificationSystem from './NotificationSystem';
import CartDropdown from './CartDropdown';

interface NavbarProps {
  onSearch?: (query: string) => void;
  onFacultyFilter?: (faculty: string) => void;
  onYearFilter?: (year: string) => void;
}

const EnhancedNavbar: React.FC<NavbarProps> = ({ onSearch, onFacultyFilter, onYearFilter }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  useEffect(() => {
    const handleOpenAuthModal = () => setShowAuthModal(true);
    window.addEventListener('openAuthModal', handleOpenAuthModal);
    return () => window.removeEventListener('openAuthModal', handleOpenAuthModal);
  }, []);

  const faculties = ['All', 'IT', 'Business', 'Engineering', 'Medicine', 'Science', 'Arts'];
  const years = ['All', 'Year 1', 'Year 2', 'Year 3', 'Year 4'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const handleFacultySelect = (faculty: string) => {
    setSelectedFaculty(faculty);
    setShowFacultyDropdown(false);
    if (onFacultyFilter) onFacultyFilter(faculty);
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setShowYearDropdown(false);
    if (onYearFilter) onYearFilter(year);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                EduShare
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Search resources..."
              />
            </form>
          </div>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Faculty Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFacultyDropdown(!showFacultyDropdown)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                {selectedFaculty}
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              
              {showFacultyDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {faculties.map((faculty) => (
                      <button
                        key={faculty}
                        onClick={() => handleFacultySelect(faculty)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        {faculty}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Academic Year Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowYearDropdown(!showYearDropdown)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {selectedYear}
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              
              {showYearDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            {isAuthenticated && user && (
              <NotificationSystem 
                userId={user.id} 
                userRole={user.role || 'student'} 
              />
            )}

            {/* Connections */}
            {isAuthenticated && (
              <button
                onClick={() => window.location.href = '/connections'}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors"
              >
                <Users className="h-4 w-4 mr-2" />
                Connections
              </button>
            )}

            {/* Cart */}
            <CartDropdown />

            {/* Upload Button */}
            <button
              onClick={() => window.location.href = '/upload'}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-purple-600 rounded-xl hover:bg-purple-50"
                >
                  <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center p-2 text-gray-600 hover:text-purple-600 rounded-xl hover:bg-purple-50"
                >
                  <Users className="h-5 w-5" />
                </button>
              )}
              
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          {user?.badge && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                              {user.badge} Badge
                            </span>
                          )}
                        </div>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700">
                          My Profile
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700">
                          My Resources
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700">
                          Settings
                        </button>
                        <hr className="my-1 border-gray-200" />
                        <button
                          onClick={() => {
                            logout();
                            setShowProfileDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700">
                          Sign In
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700">
                          Sign Up
                        </button>
                        <hr className="my-1 border-gray-200" />
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700">
                          Help
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const EnhancedNavbarWithAuth: React.FC<NavbarProps> = (props) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { login } = useAuth();

  return (
    <>
      <EnhancedNavbar {...props} />
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={(userData) => {
            login(userData, 'mock-jwt-token');
          }}
        />
      )}
    </>
  );
};

export default EnhancedNavbarWithAuth;
