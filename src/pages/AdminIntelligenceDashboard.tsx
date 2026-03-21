import React, { useState, useEffect } from 'react';
import { 
  Users, Download, Star, TrendingUp, Shield, Database, Clock, 
  AlertCircle, CheckCircle, MessageSquare, Settings, BookOpen, DollarSign, 
  Upload, Bell, Eye, EyeOff, Trash2, Send 
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

// Chart.js registration
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);

interface DashboardStats {
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
    inquiries: number;
    registrations: number;
  }>;
  notifications: {
    totalNotifications: number;
    unreadNotifications: number;
    resolvedNotifications: number;
    pendingInquiries: number;
  };
}

const AdminIntelligenceDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'inquiries'>('overview');
  const [comments, setComments] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [answerText, setAnswerText] = useState<{ [key: string]: string }>({});

  // Mock data for demo
  const mockStats: DashboardStats = {
    users: {
      totalUsers: 2847,
      bronzeUsers: 1523,
      silverUsers: 892,
      goldUsers: 432,
      totalUploads: 1234,
      totalDownloads: 15234,
      totalEarnings: 12450.75,
      avgRating: 4.6
    },
    resources: {
      totalResources: 756,
      totalDownloads: 15234,
      averageRating: 4.6,
      totalRatingCount: 1892
    },
    comments: {
      totalComments: 1245,
      positiveComments: 996,
      negativeComments: 249,
      reportedComments: 12,
      positivePercentage: 80
    },
    ratings: {
      totalRatings: 1892,
      averageRating: 4.6,
      ratingDistribution: { 1: 45, 2: 120, 3: 380, 4: 520, 5: 827 }
    },
    monthlyStats: [
      { month: 'Jan', year: 2024, resources: 45, downloads: 1200, inquiries: 23, registrations: 156 },
      { month: 'Feb', year: 2024, resources: 52, downloads: 1400, inquiries: 31, registrations: 203 },
      { month: 'Mar', year: 2024, resources: 48, downloads: 1600, inquiries: 28, registrations: 178 },
      { month: 'Apr', year: 2024, resources: 55, downloads: 1800, inquiries: 35, registrations: 212 },
      { month: 'May', year: 2024, resources: 58, downloads: 1950, inquiries: 42, registrations: 234 },
      { month: 'Jun', year: 2024, resources: 62, downloads: 2100, inquiries: 38, registrations: 267 }
    ],
    notifications: {
      totalNotifications: 156,
      unreadNotifications: 23,
      resolvedNotifications: 133,
      pendingInquiries: 42
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
      loadAdminData();
    }, 1000);
  }, []);

  const loadAdminData = async () => {
    try {
      // Load comments and inquiries for admin management
      const mockComments = [
        { id: '1', userName: 'John Doe', message: 'Great resource!', status: 'ACTIVE', createdAt: '2024-01-15', resourceId: 'R1' },
        { id: '2', userName: 'Jane Smith', message: 'Very helpful, thanks!', status: 'ACTIVE', createdAt: '2024-01-14', resourceId: 'R2' },
        { id: '3', userName: 'Bob Wilson', message: 'Could be better', status: 'ACTIVE', createdAt: '2024-01-13', resourceId: 'R1' }
      ];

      const mockInquiries = [
        { id: '1', userName: 'Alice Brown', subject: 'Need help with chapter 3', message: 'Can you explain the algorithms?', status: 'PENDING', createdAt: '2024-01-15', resourceId: 'R1' },
        { id: '2', userName: 'Charlie Davis', subject: 'Question about examples', message: 'Are there more practice problems?', status: 'ANSWERED', createdAt: '2024-01-14', resourceId: 'R2', answer: 'Yes, check the appendix.' }
      ];

      setComments(mockComments);
      setInquiries(mockInquiries);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  const handleHideComment = async (commentId: string) => {
    try {
      await apiService.hideComment(commentId);
      setComments(prev => prev.map(c => 
        c.id === commentId ? { ...c, status: 'HIDDEN' } : c
      ));
    } catch (error) {
      console.error('Failed to hide comment:', error);
    }
  };

  const handleAnswerInquiry = async (inquiryId: string) => {
    const answer = answerText[inquiryId];
    if (!answer || answer.trim().length < 10) {
      alert('Please provide a meaningful answer (at least 10 characters)');
      return;
    }

    try {
      await apiService.answerInquiry(inquiryId, answer.trim());
      setInquiries(prev => prev.map(i => 
        i.id === inquiryId ? { ...i, status: 'ANSWERED', answer: answer.trim() } : i
      ));
      setAnswerText(prev => ({ ...prev, [inquiryId]: '' }));
      alert('Inquiry answered successfully!');
    } catch (error) {
      console.error('Failed to answer inquiry:', error);
      alert('Failed to answer inquiry. Please try again.');
    }
  };

  const chartColors = {
    primary: 'rgb(99, 102, 241)',
    secondary: 'rgb(139, 92, 246)',
    success: 'rgb(34, 197, 94)',
    warning: 'rgb(245, 158, 11)',
    info: 'rgb(59, 130, 246)',
    purple: 'rgb(147, 51, 234)',
    pink: 'rgb(236, 72, 153)'
  };

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [156, 203, 178, 212, 267],
        borderColor: chartColors.primary,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Active Users',
        data: [1420, 1523, 1489, 1567, 1642],
        borderColor: chartColors.secondary,
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
    datasets: [
      {
        label: 'Page Views',
        data: [1200, 1450, 1380, 1650, 1820],
        borderColor: chartColors.info,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Downloads',
        data: [450, 520, 480, 620, 580],
        borderColor: chartColors.success,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const contentPerformanceData = {
    labels: ['Videos', 'Documents', 'Presentations', 'Quizzes'],
    datasets: [
      {
        label: 'Content Views',
        data: [2340, 1890, 1450, 890],
        borderColor: chartColors.purple,
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Downloads',
        data: [890, 1200, 980, 1567],
        borderColor: chartColors.success,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            if (label) {
              return `${label}: ${context.parsed.y}`;
            }
            return '';
          }
        }
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to access the admin dashboard.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Admin Dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Database className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Intelligence Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                <CheckCircle className="h-4 w-4 mr-1" />
                System Healthy
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Bell className="h-4 w-4 mr-2" />
              <span className="text-sm">Notifications</span>
              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                {stats?.notifications?.unreadNotifications || 0}
              </span>
            </button>
            
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="h-4 w-4 mr-2" />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'comments'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Comments ({comments.filter(c => c.status === 'ACTIVE').length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'inquiries'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Inquiries ({inquiries.filter(i => i.status === 'PENDING').length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                  <p className="text-sm text-gray-500">All registered users</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{stats?.users?.totalUsers || 0}</span>
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Bronze: {stats?.users?.bronzeUsers || 0}</span>
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Silver: {stats?.users?.silverUsers || 0}</span>
                </span>
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  <span>Gold: {stats?.users?.goldUsers || 0}</span>
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Active: {Math.round((stats?.users?.totalUsers || 0) * 0.85)}%
              </div>
            </div>
          </div>

          {/* Total Resources Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Total Resources</h3>
                  <p className="text-sm text-gray-500">All uploaded resources</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">{stats?.resources?.totalResources || 0}</span>
                <span className="text-sm text-green-600">+8.2%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <Download className="h-4 w-4 text-gray-400" />
                <span>{stats?.resources?.totalDownloads || 0} downloads</span>
              </div>
              <div className="text-sm text-gray-500">
                Average Rating: {stats?.resources?.averageRating || 0} ⭐
              </div>
            </div>
          </div>

          {/* Total Earnings Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Total Earnings</h3>
                  <p className="text-sm text-gray-500">All revenue generated</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-900">LKR {stats?.users?.totalEarnings?.toLocaleString() || '0'}</span>
                <span className="text-sm text-green-600">+15.3%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 text-gray-400" />
                <span>{Math.round((stats?.users?.totalEarnings || 0) / (stats?.resources?.totalDownloads || 1) * 100)}% conversion rate</span>
              </div>
            </div>
          </div>

          {/* Comments Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{stats?.comments?.totalComments || 0}</h3>
                  <p className="text-sm text-gray-500">All comments</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{stats?.comments?.positiveComments || 0} positive</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-red-500">{stats?.comments?.negativeComments || 0} negative</span>
                </div>
                <div className="text-sm text-gray-500">
                  {stats?.comments?.positivePercentage || 0}% positive
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
            <div className="h-64">
              <Line data={userGrowthData} options={revenueChartOptions} />
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
            <div className="h-64">
              <Line data={engagementData} options={revenueChartOptions} />
            </div>
          </div>
        </div>

        {/* Content Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Content Views */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h3>
            <div className="h-64">
              <Bar data={contentPerformanceData} options={revenueChartOptions} />
            </div>
          </div>

          {/* Downloads by Type */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Downloads by Type</h3>
            <div className="h-64">
              <Doughnut 
                data={{
                  labels: contentPerformanceData.labels,
                  datasets: [{
                    ...contentPerformanceData.datasets[0],
                    backgroundColor: [
                      'rgba(147, 51, 234, 0.8)',
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(245, 158, 11, 0.8)',
                      'rgba(59, 130, 246, 0.8)'
                    ],
                    borderWidth: 2,
                    borderColor: [
                      'rgba(147, 51, 234, 1)',
                      'rgba(34, 197, 94, 1)',
                      'rgba(245, 158, 11, 1)',
                      'rgba(59, 130, 246, 1)'
                    ]
                  }]
                }}
              />
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">New user registered</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-green-600">John Doe</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Upload className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Resource uploaded</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-purple-600">Prof. Chen</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">New inquiry</p>
                    <p className="text-xs text-gray-500">1 minute ago</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-yellow-600">Sarah Lee</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Database connection</p>
                    <p className="text-xs text-gray-500">Healthy</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-green-600">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">API response time</p>
                    <p className="text-xs text-gray-500">Slow</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-yellow-600">Warning</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Inquiries */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Inquiries</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-sm text-gray-900">#124</td>
                    <td className="p-3 text-sm text-gray-900">Database Design Help</td>
                    <td><span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span></td>
                    <td className="p-3 text-sm text-gray-900">John Doe</td>
                    <td className="p-3 text-sm text-gray-600">2 hours ago</td>
                    <td className="p-3 text-sm text-gray-900">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-sm text-gray-900">#125</td>
                    <td className="p-3 text-sm text-gray-900">Java Programming Issues</td>
                    <td><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Answered</span></td>
                    <td className="p-3 text-sm text-gray-900">Jane Smith</td>
                    <td className="p-3 text-sm text-gray-600">5 hours ago</td>
                    <td className="p-3 text-sm text-gray-900">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 text-sm text-gray-900">#126</td>
                    <td className="p-3 text-sm text-gray-900">Network Configuration</td>
                    <td><span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span></td>
                    <td className="p-3 text-sm text-gray-900">Mike Wilson</td>
                    <td className="p-3 text-sm text-gray-600">1 day ago</td>
                    <td className="p-3 text-sm text-gray-900">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Resources */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Resources</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-purple-900">5.0</span>
                  <span className="text-xs text-gray-500">(312 ratings)</span>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="text-purple-600">Web Development</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">Prof. Michael Chen</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Download className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">2,340 downloads</span>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="text-blue-600">Computer Networks</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">Dr. Ananda Weerakoon</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Admin Intelligence Dashboard</h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Monitor, analyze, and optimize your educational platform with AI-powered insights
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/admin/analytics'}
                className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-700 transition-colors"
              >
                Database Analytics
              </button>
              <button 
                onClick={() => window.location.href = '/admin/users'}
                className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-700 transition-colors"
              >
                User Management
              </button>
              <button 
                onClick={() => window.location.href = '/admin/inquiries'}
                className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-700 transition-colors"
              >
                Inquiry Management
              </button>
              <button 
                onClick={() => window.location.href = '/admin/settings'}
                className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-700 transition-colors"
              >
                System Settings
              </button>
            </div>
          </div>
        </section>

        {/* Comments Management Tab */}
        {activeTab === 'comments' && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Comments Management</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">User</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Comment</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Resource</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comments.map((comment) => (
                      <tr key={comment.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 text-xs font-medium">
                                {comment.userName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{comment.userName}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-900 max-w-xs truncate">{comment.message}</p>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{comment.resourceId}</td>
                        <td className="p-4 text-sm text-gray-600">{comment.createdAt}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            comment.status === 'ACTIVE' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {comment.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            {comment.status === 'ACTIVE' && (
                              <button
                                onClick={() => handleHideComment(comment.id)}
                                className="text-red-600 hover:text-red-800 text-sm flex items-center"
                              >
                                <EyeOff className="h-4 w-4 mr-1" />
                                Hide
                              </button>
                            )}
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Inquiries Management Tab */}
        {activeTab === 'inquiries' && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Inquiries Management</h2>
            <div className="space-y-6">
              {inquiries.map((inquiry) => (
                <div key={inquiry.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{inquiry.subject}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          inquiry.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {inquiry.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">From: {inquiry.userName}</p>
                      <p className="text-sm text-gray-500 mb-3">Resource: {inquiry.resourceId} • {inquiry.createdAt}</p>
                      <p className="text-gray-900 mb-4">{inquiry.message}</p>
                      
                      {inquiry.status === 'ANSWERED' && inquiry.answer && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h4 className="font-medium text-green-900 mb-2">Your Answer:</h4>
                          <p className="text-green-800">{inquiry.answer}</p>
                        </div>
                      )}
                      
                      {inquiry.status === 'PENDING' && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-900 mb-2">Respond to Inquiry:</h4>
                          <textarea
                            value={answerText[inquiry.id] || ''}
                            onChange={(e) => setAnswerText(prev => ({ ...prev, [inquiry.id]: e.target.value }))}
                            placeholder="Type your response here..."
                            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows={3}
                          />
                          <div className="mt-2 flex justify-end">
                            <button
                              onClick={() => handleAnswerInquiry(inquiry.id)}
                              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send Response
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminIntelligenceDashboard;
