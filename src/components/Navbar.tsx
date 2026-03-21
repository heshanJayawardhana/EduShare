import React, { useState } from 'react';
import { Search, Bell, ShoppingCart, Users, ChevronDown } from 'lucide-react';

interface NavbarProps {
  cartItemCount?: number;
  notificationCount?: number;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: { faculty: string; academicYear: string }) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  cartItemCount = 0,
  notificationCount = 0,
  onSearch,
  onFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [faculty, setFaculty] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleFacultyChange = (value: string) => {
    setFaculty(value);
    onFilterChange?.({ faculty: value, academicYear });
  };

  const handleAcademicYearChange = (value: string) => {
    setAcademicYear(value);
    onFilterChange?.({ faculty, academicYear: value });
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">EduShare</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </form>
          </div>

          {/* Filters and Actions */}
          <div className="flex items-center space-x-4">
            {/* Faculty Filter */}
            <select
              value={faculty}
              onChange={(e) => handleFacultyChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Faculties</option>
              <option value="engineering">Engineering</option>
              <option value="medicine">Medicine</option>
              <option value="business">Business</option>
              <option value="arts">Arts</option>
              <option value="science">Science</option>
            </select>

            {/* Academic Year Filter */}
            <select
              value={academicYear}
              onChange={(e) => handleAcademicYearChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <Bell className="h-6 w-6" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                  <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Profile
                  </a>
                  <a href="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Dashboard
                  </a>
                  <a href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Settings
                  </a>
                  <hr className="my-2" />
                  <a href="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
