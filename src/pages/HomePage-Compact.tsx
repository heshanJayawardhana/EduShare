import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Download, Heart, Share, Play, FileText, Award, GraduationCap, Briefcase, Calculator, Microscope, Palette, Laptop, Eye, Upload, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import EnhancedNavbar from '../components/EnhancedNavbar';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document';
  thumbnail: string;
  module: string;
  rating: number;
  ratingCount: number;
  price: number;
  currency: string;
  isFree: boolean;
  downloads: number;
  uploader: string;
  uploaderBadge?: 'Bronze' | 'Silver' | 'Gold';
}

const HomePageCompact: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [resources, setResources] = useState<Resource[]>([]);

  // SLIIT Course Web sample data
  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Web Development Fundamentals - Complete Course',
      description: 'Master HTML5, CSS3, JavaScript, and responsive design with practical projects and real-world applications.',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/300x200/6C4CF1/FFFFFF?text=WebDev',
      module: 'Web Development - Year 1',
      rating: 4.6,
      ratingCount: 89,
      price: 0,
      currency: 'LKR',
      isFree: true,
      downloads: 1567,
      uploader: 'Prof. Michael Chen',
      uploaderBadge: 'Silver'
    },
    {
      id: '2',
      title: 'Database Management Systems',
      description: 'Learn SQL, database design, normalization, and practical database implementation with MySQL.',
      type: 'document',
      thumbnail: 'https://via.placeholder.com/300x200/6C4CF1/FFFFFF?text=Database',
      module: 'Database Systems - Year 2',
      rating: 4.5,
      ratingCount: 156,
      price: 0,
      currency: 'LKR',
      isFree: true,
      downloads: 2340,
      uploader: 'Dr. Priyantha Silva',
      uploaderBadge: 'Gold'
    },
    {
      id: '3',
      title: 'Software Engineering Principles',
      description: 'Comprehensive guide to software development lifecycle, design patterns, and best practices.',
      type: 'document',
      thumbnail: 'https://via.placeholder.com/300x200/6C4CF1/FFFFFF?text=Software',
      module: 'Software Engineering - Year 3',
      rating: 4.7,
      ratingCount: 234,
      price: 1500,
      currency: 'LKR',
      isFree: false,
      downloads: 892,
      uploader: 'Prof. Nimal Perera',
      uploaderBadge: 'Gold'
    },
    {
      id: '4',
      title: 'Computer Networks Fundamentals',
      description: 'Learn networking concepts, protocols, TCP/IP, and practical network configuration.',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/300x200/6C4CF1/FFFFFF?text=Networks',
      module: 'Computer Networks - Year 2',
      rating: 4.4,
      ratingCount: 178,
      price: 0,
      currency: 'LKR',
      isFree: true,
      downloads: 3456,
      uploader: 'Dr. Ananda Weerakoon',
      uploaderBadge: 'Silver'
    },
    {
      id: '5',
      title: 'Object-Oriented Programming with Java',
      description: 'Master OOP concepts, Java programming, and develop enterprise applications.',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/300x200/6C4CF1/FFFFFF?text=Java',
      module: 'Programming - Year 1',
      rating: 4.8,
      ratingCount: 312,
      price: 2500,
      currency: 'LKR',
      isFree: false,
      downloads: 2100,
      uploader: 'Prof. Kalinga Fernando',
      uploaderBadge: 'Gold'
    },
    {
      id: '6',
      title: 'Data Structures and Algorithms',
      description: 'Essential data structures, algorithms, and problem-solving techniques for programming interviews.',
      type: 'document',
      thumbnail: 'https://via.placeholder.com/300x200/6C4CF1/FFFFFF?text=DSA',
      module: 'Algorithms - Year 2',
      rating: 4.6,
      ratingCount: 267,
      price: 1800,
      currency: 'LKR',
      isFree: false,
      downloads: 1567,
      uploader: 'Dr. Ruwan Perera',
      uploaderBadge: 'Silver'
    }
  ];

  const faculties = [
    { name: 'IT', icon: Laptop, color: 'bg-blue-500' },
    { name: 'Business', icon: Briefcase, color: 'bg-green-500' },
    { name: 'Engineering', icon: Calculator, color: 'bg-orange-500' },
    { name: 'Medicine', icon: Microscope, color: 'bg-red-500' },
    { name: 'Science', icon: Palette, color: 'bg-purple-500' },
    { name: 'Arts', icon: Palette, color: 'bg-pink-500' }
  ];

  useEffect(() => {
    setResources(mockResources);
  }, []);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaculty = selectedFaculty === 'All' || resource.module.includes(selectedFaculty);
    const matchesYear = selectedYear === 'All' || resource.module.includes(selectedYear);
    return matchesSearch && matchesFaculty && matchesYear;
  });

  const handleAddToCart = (resource: Resource) => {
    addToCart({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      type: resource.type,
      price: resource.price,
      currency: resource.currency,
      isFree: resource.isFree,
      thumbnail: resource.thumbnail,
      module: resource.module,
      faculty: resource.module.split(' - ')[1] || resource.module,
      uploader: resource.uploader,
      uploaderBadge: resource.uploaderBadge
    });
  };

  const handleResourceClick = (resourceId: string) => {
    navigate(`/resource/${resourceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedNavbar 
        onSearch={setSearchQuery}
        onFacultyFilter={setSelectedFaculty}
        onYearFilter={setSelectedYear}
      />

      {/* Header Section - Compact Design */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left Side - Title and Search */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Discover Resources</h1>
              
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Right Side - Upload Button */}
            <button 
              onClick={() => window.location.href = '/upload'}
              className="flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-6">
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            
            {/* Faculty Filter */}
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="All">All Faculties</option>
              {faculties.map((faculty) => (
                <option key={faculty.name} value={faculty.name}>
                  {faculty.name}
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="All">All Years</option>
              {['Year 1', 'Year 2', 'Year 3', 'Year 4'].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Stats */}
            <div className="ml-auto text-sm text-gray-600">
              {filteredResources.length} resources found
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid - Compact Cards */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredResources.map((resource) => (
              <div 
                key={resource.id}
                className="bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer overflow-hidden"
                onClick={() => handleResourceClick(resource.id)}
              >
                {/* Resource Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                      {resource.module.split(' - ')[0] || resource.module}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{resource.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                    {resource.title}
                  </h3>
                  
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {resource.description}
                  </p>
                </div>

                {/* Resource Actions */}
                <div className="p-3 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(resource);
                      }}
                      className="flex items-center px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors"
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      Add
                    </button>
                    
                    <div className="text-xs font-medium text-gray-700">
                      {resource.isFree ? 'Free' : `${resource.currency} ${resource.price}`}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Download className="h-3 w-3 mr-1" />
                    {resource.downloads}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePageCompact;
