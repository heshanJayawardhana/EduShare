import React, { useState, useEffect } from 'react';
import { Resource } from '../types';
import ResourceCard from '../components/ResourceCard';
import Navbar from '../components/Navbar';

const HomePage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [filters, setFilters] = useState({ faculty: '', academicYear: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Advanced Calculus Lecture Notes',
      description: 'Comprehensive lecture notes covering differential and integral calculus with detailed examples and solutions.',
      uploadedBy: {
        id: '1',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.j@university.edu',
        badge: 'Gold',
        role: 'student',
      },
      rating: 4.8,
      downloadCount: 1250,
      price: 15.99,
      category: 'Mathematics',
      faculty: 'Science',
      academicYear: '2024',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Physics Lab Manual',
      description: 'Complete laboratory manual for undergraduate physics courses with experiment procedures and data analysis.',
      uploadedBy: {
        id: '2',
        name: 'Prof. Michael Chen',
        email: 'm.chen@university.edu',
        badge: 'Silver',
        role: 'student',
      },
      rating: 4.5,
      downloadCount: 890,
      price: 12.50,
      category: 'Physics',
      faculty: 'Science',
      academicYear: '2023',
      createdAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z',
    },
    {
      id: '3',
      title: 'Business Strategy Case Studies',
      description: 'Collection of real-world business case studies with analysis frameworks and strategic insights.',
      uploadedBy: {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily.r@university.edu',
        badge: 'Bronze',
        role: 'student',
      },
      rating: 4.2,
      downloadCount: 567,
      category: 'Business',
      faculty: 'Business',
      academicYear: '2024',
      createdAt: '2024-01-08T09:15:00Z',
      updatedAt: '2024-01-08T09:15:00Z',
    },
    {
      id: '4',
      title: 'Engineering Mathematics Handbook',
      description: 'Essential mathematical formulas and methods for engineering students with practical applications.',
      uploadedBy: {
        id: '4',
        name: 'Dr. James Wilson',
        email: 'j.wilson@university.edu',
        badge: 'Gold',
        role: 'student',
      },
      rating: 4.9,
      downloadCount: 2100,
      price: 18.75,
      category: 'Engineering',
      faculty: 'Engineering',
      academicYear: '2024',
      createdAt: '2024-01-05T16:45:00Z',
      updatedAt: '2024-01-05T16:45:00Z',
    },
    {
      id: '5',
      title: 'Art History Timeline',
      description: 'Visual timeline of major art movements and influential artists throughout history.',
      uploadedBy: {
        id: '5',
        name: 'Sophia Martinez',
        email: 'sophia.m@university.edu',
        badge: 'Silver',
        role: 'student',
      },
      rating: 4.6,
      downloadCount: 445,
      category: 'Arts',
      faculty: 'Arts',
      academicYear: '2023',
      createdAt: '2024-01-03T11:20:00Z',
      updatedAt: '2024-01-03T11:20:00Z',
    },
    {
      id: '6',
      title: 'Medical Terminology Guide',
      description: 'Comprehensive guide to medical terminology with prefixes, suffixes, and root words.',
      uploadedBy: {
        id: '6',
        name: 'Dr. Lisa Anderson',
        email: 'lisa.a@university.edu',
        badge: 'Gold',
        role: 'student',
      },
      rating: 4.7,
      downloadCount: 1567,
      price: 22.00,
      category: 'Medicine',
      faculty: 'Medicine',
      academicYear: '2024',
      createdAt: '2024-01-01T13:00:00Z',
      updatedAt: '2024-01-01T13:00:00Z',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setResources(mockResources);
      setFilteredResources(mockResources);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = resources;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply faculty filter
    if (filters.faculty) {
      filtered = filtered.filter(resource => resource.faculty === filters.faculty);
    }

    // Apply academic year filter
    if (filters.academicYear) {
      filtered = filtered.filter(resource => resource.academicYear === filters.academicYear);
    }

    setFilteredResources(filtered);
  }, [resources, filters, searchQuery]);

  const handleAddToCart = (resource: Resource) => {
    setCartCount(prev => prev + 1);
    // In a real app, this would add to cart state or API
    alert(`Added "${resource.title}" to cart!`);
  };

  const handleViewDetails = (resource: Resource) => {
    // In a real app, this would navigate to resource detail page
    alert(`Viewing details for "${resource.title}"`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: { faculty: string; academicYear: string }) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar cartItemCount={cartCount} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        cartItemCount={cartCount} 
        notificationCount={3}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Academic Resources
          </h1>
          <p className="text-gray-600">
            Discover and download high-quality educational materials from your peers
          </p>
        </div>

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredResources.length} of {resources.length} resources
          </p>
          
          {/* Sort Options */}
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="downloads">Most Downloaded</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Resource Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No resources found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
