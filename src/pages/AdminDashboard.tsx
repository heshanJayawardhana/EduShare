import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Users, Download, Star, MessageSquare, Trash2, TrendingUp, AlertCircle, BookOpen, Settings, FileText, DollarSign, Activity, UserCheck, Shield, Database, BarChart3, PieChart, Calendar, Clock, CheckCircle, XCircle, Eye, Edit, MoreVertical, Search, Filter, ChevronDown } from 'lucide-react';
import { Resource, Comment, DashboardStats } from '../types';
import Navbar from '../components/Navbar';
import CommentBox from '../components/CommentBox';
import api from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);

interface AdminStats {
  users: {
    totalUsers: number;
    bronzeUsers: number;
    silverUsers: number;
    goldUsers: number;
    totalUploads: number;
    totalDownloads: number;
    totalEarnings: number;
    avgRating: number;
  };
  resources: {
    totalResources: number;
    totalDownloads: number;
    averageRating: number;
    totalRatingCount: number;
  };
  comments: {
    totalComments: number;
    positiveComments: number;
    negativeComments: number;
    reportedComments: number;
    positivePercentage: number;
  };
  ratings: {
    totalRatings: number;
    averageRating: number;
    ratingDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  };
  monthlyStats: Array<{
    month: string;
    year: number;
    resources: number;
    downloads: number;
  }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'comments' | 'users' | 'analytics'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock admin stats
  const mockStats: DashboardStats = {
    totalUsers: 1250,
    totalDownloads: 8450,
    averageRating: 4.6,
    totalRevenue: 12450.75,
    monthlyDownloads: [
      { month: 'Jan', count: 1200 },
      { month: 'Feb', count: 1400 },
      { month: 'Mar', count: 1600 },
      { month: 'Apr', count: 1800 },
      { month: 'May', count: 1700 },
      { month: 'Jun', count: 1950 },
    ],
    monthlyEarnings: [
      { month: 'Jan', amount: 1800 },
      { month: 'Feb', amount: 2100 },
      { month: 'Mar', amount: 2400 },
      { month: 'Apr', amount: 2200 },
      { month: 'May', amount: 2600 },
      { month: 'Jun', amount: 3350 },
    ],
  };

  // Mock resources for admin view
  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Advanced Calculus Lecture Notes',
      description: 'Comprehensive lecture notes covering differential and integral calculus.',
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
      description: 'Complete laboratory manual for undergraduate physics courses.',
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
      academicYear: '2024',
      createdAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z',
    },
  ];

  // Mock comments for admin management
  const mockComments: Comment[] = [
    {
      id: '1',
      resourceId: '1',
      userId: '2',
      userName: 'Michael Chen',
      content: 'Excellent notes! Very clear explanations and plenty of examples.',
      rating: 5,
      createdAt: '2024-01-20T14:30:00Z',
      isPositive: true,
    },
    {
      id: '2',
      resourceId: '1',
      userId: '3',
      userName: 'Emily Rodriguez',
      content: 'This is inappropriate content that should be removed.',
      rating: 1,
      createdAt: '2024-01-18T09:15:00Z',
      isPositive: false,
    },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No admin token found');
        setLoading(false);
        return;
      }

      // Fetch dashboard stats
      if (activeTab === 'overview') {
        const statsResponse = await api.get('/admin/dashboard');
        setStats(statsResponse.data);
      }

      // Fetch resources
      if (activeTab === 'resources') {
        const resourcesResponse = await api.get('/admin/resources');
        setResources(resourcesResponse.data.resources || []);
      }

      // Fetch comments
      if (activeTab === 'comments') {
        const commentsResponse = await api.get('/admin/comments');
        setComments(commentsResponse.data.comments || []);
      }

      // Fetch users
      if (activeTab === 'users') {
        const usersResponse = await api.get('/admin/users');
        setUsers(usersResponse.data.users || []);
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
      // Fallback to mock data with correct structure
      const fallbackStats: AdminStats = {
        users: {
          totalUsers: 1250,
          bronzeUsers: 800,
          silverUsers: 300,
          goldUsers: 150,
          totalUploads: 2500,
          totalDownloads: 8450,
          totalEarnings: 12450.75,
          avgRating: 4.6
        },
        resources: {
          totalResources: 500,
          totalDownloads: 8450,
          averageRating: 4.6,
          totalRatingCount: 1200
        },
        comments: {
          totalComments: 750,
          positiveComments: 600,
          negativeComments: 150,
          reportedComments: 5,
          positivePercentage: 80
        },
        ratings: {
          totalRatings: 1200,
          averageRating: 4.6,
          ratingDistribution: { 1: 50, 2: 80, 3: 200, 4: 370, 5: 500 }
        },
        monthlyStats: [
          { month: 'Jan', year: 2024, resources: 45, downloads: 1200 },
          { month: 'Feb', year: 2024, resources: 52, downloads: 1400 },
          { month: 'Mar', year: 2024, resources: 48, downloads: 1600 },
          { month: 'Apr', year: 2024, resources: 55, downloads: 1800 },
          { month: 'May', year: 2024, resources: 50, downloads: 1700 },
          { month: 'Jun', year: 2024, resources: 58, downloads: 1950 }
        ]
      };
      setStats(fallbackStats);
      setResources(mockResources);
      setComments(mockComments);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter(comment => comment.id !== commentId));
    // In a real app, this would call API to delete comment
  };

  const downloadsChartData = {
    labels: stats?.monthlyStats?.map(item => item.month) || [],
    datasets: [
      {
        label: 'Downloads',
        data: stats?.monthlyStats?.map(item => item.downloads) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
      },
    ],
  };

  const ratingsChartData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: 'Number of Ratings',
        data: [12, 8, 45, 120, 180],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage resources, users, and monitor platform performance</p>
        </div>

        {/* Enhanced Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                activeTab === 'users'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Users</span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                activeTab === 'resources'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Resources</span>
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                activeTab === 'comments'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Comments</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                activeTab === 'analytics'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <PieChart className="h-4 w-4" />
              <span>Analytics</span>
            </button>
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.users.totalUsers.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Downloads</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.users.totalDownloads.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <Download className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.ratings.averageRating.toFixed(1)}</p>
                  </div>
                  <div className="bg-yellow-100 rounded-full p-3">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats?.users.totalEarnings.toFixed(2)}</p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Downloads Trend</h3>
                <div className="h-64">
                  <Line data={downloadsChartData} options={chartOptions} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                <div className="h-64">
                  <Bar data={ratingsChartData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-100 rounded-full p-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New resource uploaded</p>
                    <p className="text-xs text-gray-600">Advanced Calculus Notes by Dr. Sarah Johnson</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-yellow-100 rounded-full p-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New 5-star rating</p>
                    <p className="text-xs text-gray-600">Physics Lab Manual received a perfect rating</p>
                  </div>
                  <span className="text-xs text-gray-500">4 hours ago</span>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <div className="bg-red-100 rounded-full p-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Inappropriate comment reported</p>
                    <p className="text-xs text-gray-600">Comment on Business Strategy resource flagged</p>
                  </div>
                  <span className="text-xs text-gray-500">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Resources</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploader
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resources.map((resource) => (
                    <tr key={resource.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                          <div className="text-sm text-gray-500">{resource.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{resource.uploadedBy.name}</div>
                        <div className="text-sm text-gray-500">{resource.uploadedBy.badge}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{resource.rating.toFixed(1)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {resource.downloadCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${resource.price?.toFixed(2) || 'Free'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <CommentBox
            resourceId="admin"
            comments={comments}
            onDeleteComment={handleDeleteComment}
            canDelete={true}
            showAddComment={false}
          />
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Users Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.users.totalUsers.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Active Today</p>
                    <p className="text-2xl font-bold text-gray-900">142</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">New This Week</p>
                    <p className="text-2xl font-bold text-gray-900">28</p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-3">
                    <UserCheck className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
                  <div className="flex space-x-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Users</option>
                      <option value="student">Students</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Badge
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Uploads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Downloads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.badge === 'Gold' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : user.badge === 'Silver'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {user.badge}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.uploadCount || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.totalDownloads || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-3">View</button>
                          <button className="text-red-600 hover:text-red-900">Suspend</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Growth Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                <div className="h-64">
                  <Line 
                    data={{
                      labels: stats?.monthlyStats?.map(item => item.month) || [],
                      datasets: [{
                        label: 'New Users',
                        data: [45, 52, 48, 55, 50, 58],
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.3,
                      }]
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>

              {/* Badge Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Badge Distribution</h3>
                <div className="h-64">
                  <Doughnut 
                    data={{
                      labels: ['Bronze', 'Silver', 'Gold'],
                      datasets: [{
                        data: [
                          stats?.users.bronzeUsers || 0,
                          stats?.users.silverUsers || 0,
                          stats?.users.goldUsers || 0
                        ],
                        backgroundColor: [
                          'rgba(251, 146, 60, 0.8)',
                          'rgba(156, 163, 175, 0.8)',
                          'rgba(250, 204, 21, 0.8)'
                        ],
                        borderColor: [
                          'rgba(251, 146, 60, 1)',
                          'rgba(156, 163, 175, 1)',
                          'rgba(250, 204, 21, 1)'
                        ],
                        borderWidth: 1,
                      }]
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats?.resources.averageRating.toFixed(1) || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Avg Resource Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats?.comments.positivePercentage || 0}%</div>
                  <div className="text-sm text-gray-600 mt-1">Positive Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats?.users.totalUploads || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Uploads</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">{stats?.comments.reportedComments || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Reported Comments</div>
                </div>
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 rounded-full p-2 mt-1">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New resource uploaded</p>
                    <p className="text-xs text-gray-600">Advanced Calculus Notes by Dr. Sarah Johnson</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 rounded-full p-2 mt-1">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">New user registered</p>
                    <p className="text-xs text-gray-600">John Doe joined as student</p>
                    <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-yellow-100 rounded-full p-2 mt-1">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">5-star rating received</p>
                    <p className="text-xs text-gray-600">Physics Lab Manual received perfect rating</p>
                    <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 rounded-full p-2 mt-1">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Comment reported</p>
                    <p className="text-xs text-gray-600">Inappropriate comment flagged for review</p>
                    <p className="text-xs text-gray-500 mt-1">6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
