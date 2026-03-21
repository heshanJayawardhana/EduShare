import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ShoppingCart, ArrowLeft, Users, Calendar, Eye } from 'lucide-react';
import { Resource, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import RatingStars from '../components/RatingStars';
import CommentBox from '../components/CommentBox';

const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [resource, setResource] = useState<Resource | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);

  // Mock resource data
  const mockResource: Resource = {
    id: id || '1',
    title: 'Advanced Calculus Lecture Notes',
    description: 'Comprehensive lecture notes covering differential and integral calculus with detailed examples and solutions. This resource includes:\n\n• Limits and Continuity\n• Derivatives and Applications\n• Integration Techniques\n• Series and Sequences\n• Multivariable Calculus\n\nPerfect for undergraduate students studying calculus or preparing for advanced mathematics courses.',
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
  };

  // Mock comments data
  const mockComments: Comment[] = [
    {
      id: '1',
      resourceId: id || '1',
      userId: '2',
      userName: 'Michael Chen',
      content: 'Excellent notes! Very clear explanations and plenty of examples. Helped me understand calculus much better.',
      rating: 5,
      createdAt: '2024-01-20T14:30:00Z',
      isPositive: true,
    },
    {
      id: '2',
      resourceId: id || '1',
      userId: '3',
      userName: 'Emily Rodriguez',
      content: 'Good comprehensive notes, but some sections could use more detailed explanations.',
      rating: 4,
      createdAt: '2024-01-18T09:15:00Z',
      isPositive: true,
    },
    {
      id: '3',
      resourceId: id || '1',
      userId: '4',
      userName: 'James Wilson',
      content: 'Very helpful for exam preparation. The examples are particularly useful.',
      rating: 5,
      createdAt: '2024-01-16T16:45:00Z',
      isPositive: true,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setResource(mockResource);
      setComments(mockComments);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Silver':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'Bronze':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleDownload = () => {
    if (resource) {
      alert(`Downloading "${resource.title}"...`);
      // In a real app, this would initiate file download
    }
  };

  const handleAddToCart = () => {
    if (resource) {
      alert(`Added "${resource.title}" to cart!`);
      // In a real app, this would add to cart state or API
    }
  };

  const handleRatingChange = (rating: number) => {
    setUserRating(rating);
    // In a real app, this would submit rating to API
  };

  const handleAddComment = (comment: { content: string; rating: number }) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      resourceId: id || '1',
      userId: 'current-user',
      userName: 'Current User',
      content: comment.content,
      rating: comment.rating,
      createdAt: new Date().toISOString(),
      isPositive: comment.rating >= 3,
    };
    setComments([newComment, ...comments]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resource Not Found</h2>
            <p className="text-gray-600 mb-6">The resource you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Back to Resources
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Resources</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resource Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {resource.title}
              </h1>
              
              {/* Uploader Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{resource.uploadedBy.name}</p>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getBadgeColor(
                          resource.uploadedBy.badge
                        )}`}
                      >
                        {resource.uploadedBy.badge}
                      </span>
                      <span className="text-sm text-gray-500">
                        Uploaded on {formatDate(resource.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <RatingStars rating={resource.rating} size="md" showValue />
                  <p className="text-sm text-gray-500 mt-1">
                    {resource.downloadCount} downloads
                  </p>
                </div>
              </div>

              {/* Resource Description */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {resource.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{resource.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Faculty</p>
                  <p className="font-medium text-gray-900">{resource.faculty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Academic Year</p>
                  <p className="font-medium text-gray-900">{resource.academicYear}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-primary-600">
                    {resource.price ? `$${resource.price.toFixed(2)}` : 'Free'}
                  </p>
                </div>
              </div>
            </div>

            {/* User Rating Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate This Resource</h3>
              <div className="flex items-center space-x-4">
                <RatingStars
                  rating={userRating}
                  interactive={true}
                  onRatingChange={handleRatingChange}
                  size="lg"
                />
                {userRating > 0 && (
                  <span className="text-green-600 font-medium">
                    Thank you for your rating!
                  </span>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <CommentBox
              resourceId={id || ''}
              userId={user?.id}
              userName={user?.name}
              comments={comments}
              onAddComment={handleAddComment}
              showAddComment={true}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Download Now</span>
                </button>
                
                {resource.price && (
                  <button
                    onClick={handleAddToCart}
                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart - ${resource.price.toFixed(2)}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Resource Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Downloads</span>
                  </span>
                  <span className="font-medium">{resource.downloadCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Views</span>
                  </span>
                  <span className="font-medium">{resource.downloadCount * 2.5}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Uploaded</span>
                  </span>
                  <span className="font-medium">{formatDate(resource.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Related Resources */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Linear Algebra Essentials
                  </h4>
                  <p className="text-xs text-gray-600">Mathematics • 4.6★ • $12.99</p>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Statistics Problem Set
                  </h4>
                  <p className="text-xs text-gray-600">Mathematics • 4.4★ • $8.99</p>
                </div>
                <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    Differential Equations Guide
                  </h4>
                  <p className="text-xs text-gray-600">Mathematics • 4.7★ • $14.99</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
