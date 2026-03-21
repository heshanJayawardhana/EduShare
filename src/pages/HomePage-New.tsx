import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Download, Heart, Share, Play, FileText, Upload, ShoppingCart, BookOpen, Users, TrendingUp, Clock, DollarSign, Award, Briefcase, Calculator, Microscope, Palette, Laptop, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

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

const HomePage: React.FC = () => {
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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to EduShare
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Your Gateway to Academic Excellence - Share, Learn, and Succeed Together
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
              >
                Browse Resources
              </button>
              <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl border-2 border-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Resource
              </button>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for courses, notes, videos..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources Grid */}
      <section id="resources" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div 
                key={resource.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
                onClick={() => handleResourceClick(resource.id)}
              >
                {/* Resource Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-lavender-100 flex items-center justify-center">
                  {resource.type === 'video' ? (
                    <Play className="h-12 w-12 text-purple-600" />
                  ) : (
                    <Eye className="h-12 w-12 text-purple-600" />
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium">
                    {resource.isFree ? 'Free' : `${resource.currency} ${resource.price}`}
                  </div>
                </div>

                {/* Resource Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                      {resource.module}
                    </span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{resource.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {resource.description}
                  </p>

                  {/* Resource Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {resource.downloads}
                      </div>
                      <span>{resource.module.split(' - ')[0]}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(resource);
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle save
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Save Resource"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Trending Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Rated</h3>
              <div className="space-y-4">
                {resources.slice(0, 3).map((resource, index) => (
                  <div key={resource.id} className="flex items-center space-x-4 p-4 bg-lavender-50 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{resource.title}</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                        {resource.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Downloaded</h3>
              <div className="space-y-4">
                {resources.sort((a, b) => b.downloads - a.downloads).slice(0, 3).map((resource, index) => (
                  <div key={resource.id} className="flex items-center space-x-4 p-4 bg-lavender-50 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{resource.title}</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <Download className="h-3 w-3 mr-1" />
                        {resource.downloads.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
              <div className="space-y-4">
                {resources.slice(0, 3).map((resource, index) => (
                  <div key={resource.id} className="flex items-center space-x-4 p-4 bg-lavender-50 rounded-xl">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{resource.title}</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <Upload className="h-3 w-3 mr-1" />
                        {resource.module}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Faculty</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {faculties.map((faculty) => (
              <div
                key={faculty.name}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 text-center cursor-pointer group"
              >
                <div className={`w-16 h-16 ${faculty.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <faculty.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{faculty.name}</h3>
                <p className="text-sm text-gray-600 mt-1">Explore resources</p>
              </div>
            ))}
          </div>

          {/* Academic Year Filters */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Academic Year</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {['Year 1', 'Year 2', 'Year 3', 'Year 4'].map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                    selectedYear === year
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-purple-50'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why EduShare Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose EduShare?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Earn from Your Knowledge</h3>
              <p className="text-gray-600">
                Monetize your study materials and earn from your expertise. Set your own prices and build your educational brand.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Learn from the Best</h3>
              <p className="text-gray-600">
                Access high-quality study materials from top students and educators. Get insights that help you excel in your studies.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Build Your Reputation</h3>
              <p className="text-gray-600">
                Earn badges and recognition for your contributions. Build your academic profile and connect with peers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
                EduShare
              </h3>
              <p className="text-gray-400">
                Empowering students to share knowledge and succeed together.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Browse Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Upload Materials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Become a Contributor</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
