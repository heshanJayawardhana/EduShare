import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { Users, Download, DollarSign, TrendingUp, Award, BookOpen, Calendar } from 'lucide-react';
import { Resource, DashboardStats } from '../types';
import Navbar from '../components/Navbar';
import RatingStars from '../components/RatingStars';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [uploadedResources, setUploadedResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock dashboard stats
  const mockStats: DashboardStats = {
    totalUsers: 1250,
    totalDownloads: 8450,
    averageRating: 4.6,
    totalRevenue: 2450.75,
    monthlyDownloads: [
      { month: 'Jan', count: 120 },
      { month: 'Feb', count: 180 },
      { month: 'Mar', count: 240 },
      { month: 'Apr', count: 320 },
      { month: 'May', count: 280 },
      { month: 'Jun', count: 350 },
    ],
    monthlyEarnings: [
      { month: 'Jan', amount: 150 },
      { month: 'Feb', amount: 280 },
      { month: 'Mar', amount: 420 },
      { month: 'Apr', amount: 380 },
      { month: 'May', amount: 520 },
      { month: 'Jun', amount: 650 },
    ],
  };

  // Mock uploaded resources
  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Advanced Calculus Lecture Notes',
      description: 'Comprehensive lecture notes covering differential and integral calculus.',
      uploadedBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@university.edu',
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
      description: 'Complete laboratory manual for undergraduate physics courses.',
      uploadedBy: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@university.edu',
        badge: 'Gold',
        role: 'student',
      },
      rating: 4.5,
      downloadCount: 890,
      price: 12.50,
      category: 'Physics',
      faculty: 'Science',
      academicYear: '2024',
      createdAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z',
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setUploadedResources(mockResources);
      setLoading(false);
    }, 1000);
  }, []);

  const downloadsChartData = {
    labels: stats?.monthlyDownloads.map(item => item.month) || [],
    datasets: [
      {
        label: 'Downloads',
        data: stats?.monthlyDownloads.map(item => item.count) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
      },
    ],
  };

  const earningsChartData = {
    labels: stats?.monthlyEarnings.map(item => item.month) || [],
    datasets: [
      {
        label: 'Earnings ($)',
        data: stats?.monthlyEarnings.map(item => item.amount) || [],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.3,
      },
    ],
  };

  const badgeDistributionData = {
    labels: ['Bronze', 'Silver', 'Gold'],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: [
          'rgba(251, 146, 60, 0.8)',
          'rgba(156, 163, 175, 0.8)',
          'rgba(250, 204, 21, 0.8)',
        ],
        borderColor: [
          'rgba(251, 146, 60, 1)',
          'rgba(156, 163, 175, 1)',
          'rgba(250, 204, 21, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    maintainAspectRatio: false,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Track your academic resource performance and earnings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalDownloads.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats?.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.averageRating.toFixed(1)}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resources Uploaded</p>
                <p className="text-2xl font-bold text-gray-900">{uploadedResources.length}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Downloads Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Downloads Over Time</h3>
            <div className="h-64">
              <Line data={downloadsChartData} options={chartOptions} />
            </div>
          </div>

          {/* Earnings Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h3>
            <div className="h-64">
              <Line data={earningsChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Badge Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Distribution</h3>
            <div className="h-64">
              <Doughnut data={badgeDistributionData} options={chartOptions} />
            </div>
          </div>

          {/* User Badge */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Achievement</h3>
            <div className="flex flex-col items-center">
              <div className="bg-yellow-100 rounded-full p-6 mb-4">
                <Award className="h-12 w-12 text-yellow-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Gold Contributor</h4>
              <p className="text-gray-600 text-center mb-4">
                You've earned the Gold badge for exceptional contributions to the academic community.
              </p>
              <div className="flex items-center space-x-2">
                <RatingStars rating={4.8} size="sm" showValue />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Month</span>
                <span className="font-medium text-green-600">+15%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Resources</span>
                <span className="font-medium">{uploadedResources.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg. Downloads/Resource</span>
                <span className="font-medium">
                  {uploadedResources.length > 0 
                    ? Math.round(uploadedResources.reduce((acc, r) => acc + r.downloadCount, 0) / uploadedResources.length)
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">Jan 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Resources */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Uploaded Resources</h3>
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              View All
            </button>
          </div>

          {uploadedResources.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Resources Yet</h4>
              <p className="text-gray-600 mb-4">
                Start sharing your knowledge by uploading your first resource.
              </p>
              <button className="btn-primary">
                Upload Resource
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedResources.map((resource) => (
                <div key={resource.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{resource.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{resource.category}</span>
                        <span>{resource.downloadCount} downloads</span>
                        <RatingStars rating={resource.rating} size="sm" />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary-600">
                        ${resource.price?.toFixed(2) || 'Free'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(resource.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
