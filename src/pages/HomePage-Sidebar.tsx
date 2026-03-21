import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Download, Heart, Share, Play, FileText, Award, GraduationCap, Briefcase, Calculator, Microscope, Palette, Laptop, Eye, Upload, ShoppingCart, X, BookOpen, Users, TrendingUp, Clock, DollarSign } from 'lucide-react';
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

interface Category {
  id: string;
  name: string;
  icon: any;
  count: number;
  subcategories?: { name: string; count: number }[];
}

const HomePageSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const categories: Category[] = [
    {
      id: 'all',
      name: 'All Resources',
      icon: BookOpen,
      count: 156,
      subcategories: [
        { name: 'Free Resources', count: 89 },
        { name: 'Premium Resources', count: 67 }
      ]
    },
    {
      id: 'it',
      name: 'Information Technology',
      icon: Laptop,
      count: 45,
      subcategories: [
        { name: 'Web Development', count: 12 },
        { name: 'Database Systems', count: 8 },
        { name: 'Software Engineering', count: 10 },
        { name: 'Computer Networks', count: 7 },
        { name: 'Programming', count: 8 }
      ]
    },
    {
      id: 'business',
      name: 'Business',
      icon: Briefcase,
      count: 32,
      subcategories: [
        { name: 'Marketing', count: 10 },
        { name: 'Finance', count: 8 },
        { name: 'Management', count: 7 },
        { name: 'Accounting', count: 7 }
      ]
    },
    {
      id: 'engineering',
      name: 'Engineering',
      icon: Calculator,
      count: 28,
      subcategories: [
        { name: 'Civil Engineering', count: 8 },
        { name: 'Mechanical Engineering', count: 7 },
        { name: 'Electrical Engineering', count: 6 },
        { name: 'Computer Engineering', count: 7 }
      ]
    },
    {
      id: 'science',
      name: 'Science',
      icon: Microscope,
      count: 25,
      subcategories: [
        { name: 'Physics', count: 8 },
        { name: 'Chemistry', count: 7 },
        { name: 'Biology', count: 6 },
        { name: 'Mathematics', count: 4 }
      ]
    },
    {
      id: 'medicine',
      name: 'Medicine',
      icon: Palette,
      count: 18,
      subcategories: [
        { name: 'Anatomy', count: 5 },
        { name: 'Pharmacology', count: 4 },
        { name: 'Physiology', count: 4 },
        { name: 'Pathology', count: 5 }
      ]
    },
    {
      id: 'arts',
      name: 'Arts',
      icon: Palette,
      count: 8,
      subcategories: [
        { name: 'Literature', count: 3 },
        { name: 'History', count: 2 },
        { name: 'Philosophy', count: 3 }
      ]
    }
  ];

  useEffect(() => {
    setResources(mockResources);
  }, []);

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      matchesCategory = resource.module.toLowerCase().includes(selectedCategory.toLowerCase());
    }
    
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
      faculty: resource.module.split(' - ')[1] || resource.module,
      uploader: resource.uploader,
      uploaderBadge: resource.uploaderBadge
    });
  };

  const handleResourceClick = (resourceId: string) => {
    navigate(`/resource/${resourceId}`);
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <EnhancedNavbar 
        onSearch={setSearchQuery}
        onFacultyFilter={setSelectedCategory}
        onYearFilter={() => {}}
      />

      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-20 z-40 p-2 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50"
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Filter className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-full bg-white border-r border-gray-200 transition-all duration-300 z-30 ${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <div className="p-4 h-full overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
          
          <div className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <div key={category.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedSubcategory('');
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isSelected ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-3" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{category.count}</span>
                  </button>
                  
                  {/* Subcategories */}
                  {isSelected && category.subcategories && (
                    <div className="ml-7 mt-1 space-y-1">
                      {category.subcategories.map((subcategory, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedSubcategory(subcategory.name)}
                          className={`w-full flex items-center justify-between p-2 rounded text-xs transition-colors ${
                            selectedSubcategory === subcategory.name
                              ? 'bg-purple-100 text-purple-700'
                              : 'hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          <span>{subcategory.name}</span>
                          <span className="text-gray-400">{subcategory.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-gray-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </div>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-gray-600">
                  <Clock className="h-3 w-3 mr-1" />
                  Recent
                </div>
                <span className="font-medium">8</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Premium
                </div>
                <span className="font-medium">67</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} mt-16`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedCategoryData?.name || 'All Resources'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {selectedSubcategory ? selectedSubcategory : 'Browse and download educational resources'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm w-64"
                  />
                </div>
                
                {/* Upload Button */}
                <button 
                  onClick={() => window.location.href = '/upload'}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            Found {filteredResources.length} resources
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div 
                key={resource.id}
                className="bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
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
                  
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {resource.description}
                  </p>
                </div>

                {/* Resource Footer */}
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(resource);
                        }}
                        className="flex items-center px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded hover:bg-purple-700 transition-colors"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
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

                  {/* Uploader Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{resource.uploader}</span>
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
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePageSidebar;
