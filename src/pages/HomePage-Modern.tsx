import React, { useState, useEffect } from 'react';
import { Search, Star, Download, Heart, Share, Play, FileText, Upload, ShoppingCart, Filter, BookOpen, Users, TrendingUp, Clock, DollarSign, Award, Briefcase, Calculator, Microscope, Palette, Laptop, Eye } from 'lucide-react';
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
  badge?: string;
}

const HomePageModern: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [resources, setResources] = useState<Resource[]>([]);

  // SLIIT Course Web sample data
  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Web Development Fundamentals - Complete Course',
      description: 'Master HTML5, CSS3, JavaScript, and responsive design with practical projects and real-world applications.',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/300x200/6C4CF1/FFFFFF?text=WebDev',
      module: 'Web Development',
      rating: 4.6,
      ratingCount: 89,
      price: 0,
      currency: 'LKR',
      isFree: true,
      downloads: 1567,
      uploader: 'Prof. Michael Chen',
      uploaderBadge: 'Silver',
      badge: 'Bestseller'
    },
    {
      id: '2',
      title: 'Database Management Systems',
      description: 'Learn SQL, database design, normalization, and practical database implementation with MySQL.',
      type: 'document',
      thumbnail: 'https://via.placeholder.com/300x200/6C4CF1/FFFFFF?text=Database',
      module: 'Database Systems',
      rating: 4.5,
      ratingCount: 156,
      price: 0,
      currency: 'LKR',
      isFree: true,
      downloads: 2340,
      uploader: 'Dr. Priyantha Silva',
      uploaderBadge: 'Gold',
      badge: 'Popular'
    },
    {
      id: '3',
      title: 'Software Engineering Principles',
      description: 'Comprehensive guide to software development lifecycle, design patterns, and best practices.',
      type: 'document',
      thumbnail: 'https://via.placeholder.com/300x200/6C4CF1/FFFFFF?text=Software',
      module: 'Software Engineering',
      rating: 4.7,
      ratingCount: 234,
      price: 1500,
      currency: 'LKR',
      isFree: false,
      downloads: 892,
      uploader: 'Prof. Nimal Perera',
      uploaderBadge: 'Gold',
      badge: 'Premium'
    },
    {
      id: '4',
      title: 'Computer Networks Fundamentals',
      description: 'Learn networking concepts, protocols, TCP/IP, and practical network configuration.',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/300x200/6C4CF1/FFFFFF?text=Networks',
      module: 'Computer Networks',
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
      module: 'Programming',
      rating: 4.8,
      ratingCount: 312,
      price: 2500,
      currency: 'LKR',
      isFree: false,
      downloads: 2100,
      uploader: 'Prof. Kalinga Fernando',
      uploaderBadge: 'Gold',
      badge: 'Bestseller'
    },
    {
      id: '6',
      title: 'Data Structures and Algorithms',
      description: 'Essential data structures, algorithms, and problem-solving techniques for programming interviews.',
      type: 'document',
      thumbnail: 'https://via.placeholder.com/300x200/6C4CF1/FFFFFF?text=DSA',
      module: 'Algorithms',
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

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen },
    { id: 'it', name: 'IT', icon: Laptop },
    { id: 'business', name: 'Business', icon: Briefcase },
    { id: 'engineering', name: 'Engineering', icon: Calculator },
    { id: 'science', name: 'Science', icon: Microscope },
    { id: 'medicine', name: 'Medicine', icon: Palette }
  ];

  useEffect(() => {
    setResources(mockResources);
  }, []);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           resource.module.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
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
      faculty: resource.module,
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
        onFacultyFilter={setSelectedCategory}
        onYearFilter={() => {}}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Discover Resources</h1>
              <p className="text-gray-600 mt-2">Browse and download educational resources from our collection</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources..."
                  className="w-80 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              {/* Upload Button */}
              <button 
                onClick={() => window.location.href = '/upload'}
                className="flex items-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Upload className="h-5 w-5 mr-2" />
                Upload Resource
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1 border-b border-gray-200">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-3 border-b-2 transition-colors ${
                    isSelected 
                      ? 'border-purple-600 text-purple-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Resources</p>
                  <p className="text-xs text-gray-500">156 available</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Active Users</p>
                  <p className="text-xs text-gray-500">2,341 students</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Downloads</p>
                  <p className="text-xs text-gray-500">8,234 this month</p>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Showing {filteredResources.length} of {resources.length} resources
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <div 
              key={resource.id}
              className="bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
              onClick={() => handleResourceClick(resource.id)}
            >
              {/* Resource Header */}
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-purple-100 to-lavender-100 flex items-center justify-center">
                  {resource.type === 'video' ? (
                    <Play className="h-12 w-12 text-purple-600" />
                  ) : (
                    <FileText className="h-12 w-12 text-purple-600" />
                  )}
                </div>
                
                {/* Badge */}
                {resource.badge && (
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      resource.badge === 'Bestseller' ? 'bg-yellow-100 text-yellow-800' :
                      resource.badge === 'Popular' ? 'bg-blue-100 text-blue-800' :
                      resource.badge === 'Premium' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {resource.badge}
                    </span>
                  </div>
                )}
                
                {/* Price Badge */}
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur text-xs font-medium rounded">
                    {resource.isFree ? 'Free' : `${resource.currency} ${resource.price}`}
                  </span>
                </div>
              </div>

              {/* Resource Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                    {resource.module}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{resource.rating}</span>
                    <span className="text-xs text-gray-400">({resource.ratingCount})</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {resource.description}
                </p>

                {/* Resource Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(resource);
                      }}
                      className="flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle save/wishlist
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Download className="h-3 w-3 mr-1" />
                    {resource.downloads}
                  </div>
                </div>

                {/* Uploader Info */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="h-3 w-3 text-purple-600" />
                      </div>
                      <span className="text-xs text-gray-600">{resource.uploader}</span>
                    </div>
                    {resource.uploaderBadge && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resource.uploaderBadge === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                        resource.uploaderBadge === 'Silver' ? 'bg-gray-100 text-gray-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {resource.uploaderBadge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {filteredResources.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Load More Resources
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePageModern;
