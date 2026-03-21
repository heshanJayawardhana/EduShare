import React, { useState, useEffect } from 'react';
import { Search, Star, Download, Heart, Share, Play, FileText, Upload, ShoppingCart, Filter, BookOpen, Users, TrendingUp, Clock, DollarSign, Award, Briefcase, Calculator, Microscope, Palette, Laptop, Eye, Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'document' | 'presentation' | 'quiz';
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
  duration?: string;
  level?: string;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  count: number;
  color: string;
}

const HomePageHub: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [resources, setResources] = useState<Resource[]>([]);

  // SLIIT Course Web sample data
  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Web Development Fundamentals',
      description: 'Master HTML5, CSS3, JavaScript, and responsive design with practical projects and real-world applications.',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/400x250/6C4CF1/FFFFFF?text=WebDev',
      module: 'Web Development',
      rating: 4.6,
      ratingCount: 89,
      price: 0,
      currency: 'LKR',
      isFree: true,
      downloads: 1567,
      uploader: 'Prof. Michael Chen',
      uploaderBadge: 'Silver',
      badge: 'Bestseller',
      duration: '12h 30m',
      level: 'Beginner'
    },
    {
      id: '2',
      title: 'Database Management Systems',
      description: 'Learn SQL, database design, normalization, and practical database implementation with MySQL.',
      type: 'document',
      thumbnail: 'https://via.placeholder.com/400x250/6C4CF1/FFFFFF?text=Database',
      module: 'Database Systems',
      rating: 4.5,
      ratingCount: 156,
      price: 0,
      currency: 'LKR',
      isFree: true,
      downloads: 2340,
      uploader: 'Dr. Priyantha Silva',
      uploaderBadge: 'Gold',
      badge: 'Popular',
      level: 'Intermediate'
    },
    {
      id: '3',
      title: 'Software Engineering Principles',
      description: 'Comprehensive guide to software development lifecycle, design patterns, and best practices.',
      type: 'presentation',
      thumbnail: 'https://via.placeholder.com/400x250/6C4CF1/FFFFFF?text=Software',
      module: 'Software Engineering',
      rating: 4.7,
      ratingCount: 234,
      price: 1500,
      currency: 'LKR',
      isFree: false,
      downloads: 892,
      uploader: 'Prof. Nimal Perera',
      uploaderBadge: 'Gold',
      badge: 'Premium',
      duration: '8h 15m',
      level: 'Advanced'
    },
    {
      id: '4',
      title: 'Computer Networks Fundamentals',
      description: 'Learn networking concepts, protocols, TCP/IP, and practical network configuration.',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/400x250/6C4CF1/FFFFFF?text=Networks',
      module: 'Computer Networks',
      rating: 4.4,
      ratingCount: 178,
      price: 0,
      currency: 'LKR',
      isFree: true,
      downloads: 3456,
      uploader: 'Dr. Ananda Weerakoon',
      uploaderBadge: 'Silver',
      duration: '10h 45m',
      level: 'Intermediate'
    },
    {
      id: '5',
      title: 'Object-Oriented Programming with Java',
      description: 'Master OOP concepts, Java programming, and develop enterprise applications.',
      type: 'video',
      thumbnail: 'https://via.placeholder.com/400x250/6C4CF1/FFFFFF?text=Java',
      module: 'Programming',
      rating: 4.8,
      ratingCount: 312,
      price: 2500,
      currency: 'LKR',
      isFree: false,
      downloads: 2100,
      uploader: 'Prof. Kalinga Fernando',
      uploaderBadge: 'Gold',
      badge: 'Bestseller',
      duration: '15h 20m',
      level: 'Intermediate'
    },
    {
      id: '6',
      title: 'Data Structures and Algorithms',
      description: 'Essential data structures, algorithms, and problem-solving techniques for programming interviews.',
      type: 'quiz',
      thumbnail: 'https://via.placeholder.com/400x250/6C4CF1/FFFFFF?text=DSA',
      module: 'Algorithms',
      rating: 4.6,
      ratingCount: 267,
      price: 1800,
      currency: 'LKR',
      isFree: false,
      downloads: 1567,
      uploader: 'Dr. Ruwan Perera',
      uploaderBadge: 'Silver',
      duration: '6h 30m',
      level: 'Advanced'
    }
  ];

  const categories: Category[] = [
    { id: 'all', name: 'All Resources', icon: BookOpen, count: 156, color: 'bg-purple-500' },
    { id: 'it', name: 'IT & Software', icon: Laptop, count: 45, color: 'bg-blue-500' },
    { id: 'business', name: 'Business', icon: Briefcase, count: 32, color: 'bg-green-500' },
    { id: 'engineering', name: 'Engineering', icon: Calculator, count: 28, color: 'bg-orange-500' },
    { id: 'science', name: 'Science', icon: Microscope, count: 25, color: 'bg-red-500' },
    { id: 'medicine', name: 'Medicine', icon: Palette, count: 18, color: 'bg-pink-500' }
  ];

  useEffect(() => {
    setResources(mockResources);
  }, []);

  const filteredResources = resources.filter(resource => {
    const searchLower = searchQuery.toLowerCase().trim();
    
    // If no search query, show all resources in selected category
    if (!searchLower) {
      return selectedCategory === 'all' || 
             resource.module.toLowerCase().includes(selectedCategory.toLowerCase());
    }
    
    // Enhanced search filtering
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchLower) ||
      resource.description.toLowerCase().includes(searchLower) ||
      resource.module.toLowerCase().includes(searchLower) ||
      resource.type.toLowerCase().includes(searchLower) ||
      resource.uploader.toLowerCase().includes(searchLower) ||
      (resource.level && resource.level.toLowerCase().includes(searchLower));
    
    const matchesCategory = selectedCategory === 'all' || 
                           resource.module.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id.localeCompare(a.id);
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'presentation': return <FileText className="h-4 w-4" />;
      case 'quiz': return <Award className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Academic Resource Hub
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Discover, share, and excel with comprehensive educational resources from SLIIT's finest minds
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for courses, notes, videos, modules, uploaders..."
                  className="w-full pl-12 pr-20 py-4 text-lg border-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 text-gray-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-16 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Search
                </button>
              </div>
              
              {/* Search Results Summary */}
              {searchQuery && (
                <div className="mt-2 text-center text-sm text-gray-600">
                  Found <span className="font-semibold text-purple-600">{filteredResources.length}</span> resources matching "{searchQuery}"
                  {selectedCategory !== 'all' && (
                    <span> in {categories.find(c => c.id === selectedCategory)?.name}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                    selectedCategory === category.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} resources</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {searchQuery ? (
                  <>Filtering by "{searchQuery}" - </> 
                ) : selectedCategory !== 'all' ? (
                  <>Filtering by {categories.find(c => c.id === selectedCategory)?.name} - </>
                ) : (
                  <>All Resources - </>
                )}
                <span className="font-semibold text-purple-600">{sortedResources.length} resources found</span>
              </span>
              
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <div className="h-5 w-5 grid grid-cols-2 gap-1">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <div className="h-5 w-5 space-y-1">
                  <div className="bg-current h-1 rounded"></div>
                  <div className="bg-current h-1 rounded"></div>
                  <div className="bg-current h-1 rounded"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedResources.map((resource) => (
                <div 
                  key={resource.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
                  onClick={() => handleResourceClick(resource.id)}
                >
                  {/* Resource Header */}
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                      {resource.type === 'video' ? (
                        <Play className="h-12 w-12 text-purple-600" />
                      ) : resource.type === 'document' ? (
                        <FileText className="h-12 w-12 text-purple-600" />
                      ) : resource.type === 'presentation' ? (
                        <FileText className="h-12 w-12 text-purple-600" />
                      ) : (
                        <Award className="h-12 w-12 text-purple-600" />
                      )}
                    </div>
                    
                    {/* Badge */}
                    {resource.badge && (
                      <div className="absolute top-3 left-3">
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
                    
                    {/* Type Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-white/90 backdrop-blur text-xs font-medium rounded flex items-center">
                        {getTypeIcon(resource.type)}
                        <span className="ml-1 capitalize">{resource.type}</span>
                      </span>
                    </div>
                    
                    {/* Duration Badge */}
                    {resource.duration && (
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
                          {resource.duration}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Resource Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        {resource.module}
                      </span>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {resource.level}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {resource.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {resource.description}
                    </p>

                    {/* Rating and Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{resource.rating}</span>
                        <span className="text-sm text-gray-500">({resource.ratingCount})</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Download className="h-4 w-4 mr-1" />
                        {resource.downloads}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(resource);
                          }}
                          className="flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          {resource.isFree ? 'Get' : `${resource.currency} ${resource.price}`}
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="h-3 w-3 text-purple-600" />
                        </div>
                        <span className="text-xs text-gray-600">{resource.uploader}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {sortedResources.map((resource) => (
                <div 
                  key={resource.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer p-6"
                  onClick={() => handleResourceClick(resource.id)}
                >
                  <div className="flex items-center space-x-6">
                    {/* Thumbnail */}
                    <div className="w-32 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {resource.type === 'video' ? (
                        <Play className="h-8 w-8 text-purple-600" />
                      ) : resource.type === 'document' ? (
                        <FileText className="h-8 w-8 text-purple-600" />
                      ) : resource.type === 'presentation' ? (
                        <FileText className="h-8 w-8 text-purple-600" />
                      ) : (
                        <Award className="h-8 w-8 text-purple-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                          {resource.module}
                        </span>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {resource.level}
                        </span>
                        {resource.badge && (
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            resource.badge === 'Bestseller' ? 'bg-yellow-100 text-yellow-800' :
                            resource.badge === 'Popular' ? 'bg-blue-100 text-blue-800' :
                            resource.badge === 'Premium' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {resource.badge}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                        {resource.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {resource.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-900">{resource.rating}</span>
                            <span className="text-sm text-gray-500">({resource.ratingCount})</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Download className="h-4 w-4 mr-1" />
                            {resource.downloads}
                          </div>
                          {resource.duration && (
                            <span className="text-sm text-gray-500">{resource.duration}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(resource);
                            }}
                            className="flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {resource.isFree ? 'Get' : `${resource.currency} ${resource.price}`}
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Share Your Knowledge</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join our community of educators and students. Upload your resources and help others learn.
          </p>
          <button 
            onClick={() => window.location.href = '/upload'}
            className="inline-flex items-center px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-5 w-5 mr-2" />
            Start Uploading
            <Share className="h-5 w-5 ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePageHub;
