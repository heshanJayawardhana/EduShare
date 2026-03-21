import React, { useState } from 'react';
import { Search, Users, Filter, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ConnectionSystem from '../components/ConnectionSystem';

const ConnectionsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'uploaders' | 'admins' | 'my-connections'>('uploaders');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for uploaders and admins
  const mockUploaders = [
    { id: 'U1', name: 'Prof. Sarah Chen', role: 'uploader' as const, badge: 'Diamond' as const, uploadsCount: 89, avgRating: 4.9 },
    { id: 'U2', name: 'Dr. Michael Kumar', role: 'uploader' as const, badge: 'Platinum' as const, uploadsCount: 67, avgRating: 4.8 },
    { id: 'U3', name: 'Prof. Emily Rodriguez', role: 'uploader' as const, badge: 'Gold' as const, uploadsCount: 45, avgRating: 4.7 },
    { id: 'U4', name: 'Dr. James Wilson', role: 'uploader' as const, badge: 'Gold' as const, uploadsCount: 38, avgRating: 4.6 },
  ];

  const mockAdmins = [
    { id: 'A1', name: 'Admin Support', role: 'admin' as const, badge: 'Diamond' as const, uploadsCount: 0, avgRating: 5.0 },
    { id: 'A2', name: 'System Admin', role: 'admin' as const, badge: 'Diamond' as const, uploadsCount: 0, avgRating: 5.0 },
  ];

  const filteredUploaders = mockUploaders.filter(uploader =>
    uploader.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAdmins = mockAdmins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to connect with uploaders and admins</p>
          <button
            onClick={() => window.location.href = '/auth'}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Connections</h1>
              <p className="text-gray-600">Connect with uploaders and administrators</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1">
          <button
            onClick={() => setActiveTab('uploaders')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'uploaders'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Uploaders ({mockUploaders.length})
          </button>
          <button
            onClick={() => setActiveTab('admins')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'admins'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Admins ({mockAdmins.length})
          </button>
          <button
            onClick={() => setActiveTab('my-connections')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'my-connections'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Connections
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'uploaders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Expert Uploaders</h2>
              <p className="text-gray-600 mb-6">Connect with experienced content creators and educators</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredUploaders.map((uploader) => (
                  <ConnectionSystem
                    key={uploader.id}
                    currentUserId={user.id}
                    targetUserId={uploader.id}
                    targetUserRole="uploader"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admins' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Administrators</h2>
              <p className="text-gray-600 mb-6">Connect with platform administrators for support and guidance</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAdmins.map((admin) => (
                  <ConnectionSystem
                    key={admin.id}
                    currentUserId={user.id}
                    targetUserId={admin.id}
                    targetUserRole="admin"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'my-connections' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">My Connections</h2>
              <p className="text-gray-600 mb-6">Manage your existing connections and conversations</p>
              
              <div className="space-y-4">
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
                  <p className="text-gray-600 mb-4">Start connecting with uploaders and admins to build your network</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setActiveTab('uploaders')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Browse Uploaders
                    </button>
                    <button
                      onClick={() => setActiveTab('admins')}
                      className="px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50"
                    >
                      Browse Admins
                    </button>
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

export default ConnectionsPage;
