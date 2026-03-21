import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Star, Award, Send, CheckCircle, Clock, Bell, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';

export interface Connection {
  id: string;
  requesterId: string;
  recipientId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  type: 'FOLLOW' | 'MENTORSHIP' | 'COLLABORATION';
  createdAt: string;
  message?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'uploader' | 'admin';
  badge: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
  uploadsCount: number;
  commentsCount: number;
  avgRating: number;
  isFollowing?: boolean;
  isConnected?: boolean;
}

interface ConnectionSystemProps {
  currentUserId: string;
  targetUserId: string;
  targetUserRole: 'uploader' | 'admin';
  className?: string;
}

const ConnectionSystem: React.FC<ConnectionSystemProps> = ({
  currentUserId,
  targetUserId,
  targetUserRole,
  className = ''
}) => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [connectionType, setConnectionType] = useState<'FOLLOW' | 'MENTORSHIP' | 'COLLABORATION'>('FOLLOW');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUserProfile();
    loadConnections();
  }, [targetUserId]);

  const loadUserProfile = async () => {
    try {
      // Mock user profile data
      const mockProfile: UserProfile = {
        id: targetUserId,
        name: targetUserRole === 'admin' ? 'Admin User' : 'Expert Uploader',
        email: `${targetUserRole}@edushare.com`,
        role: targetUserRole,
        badge: 'Gold',
        uploadsCount: targetUserRole === 'uploader' ? 45 : 0,
        commentsCount: targetUserRole === 'uploader' ? 120 : 50,
        avgRating: 4.8,
        isFollowing: false,
        isConnected: false
      };
      setUserProfile(mockProfile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const loadConnections = async () => {
    try {
      // Mock connections data
      const mockConnections: Connection[] = [
        {
          id: '1',
          requesterId: currentUserId,
          recipientId: targetUserId,
          status: 'PENDING',
          type: 'FOLLOW',
          createdAt: new Date().toISOString()
        }
      ];
      setConnections(mockConnections);
    } catch (error) {
      console.error('Failed to load connections:', error);
    }
  };

  const handleConnectionRequest = async (type: 'FOLLOW' | 'MENTORSHIP' | 'COLLABORATION') => {
    setIsLoading(true);
    try {
      // Create connection request
      const newConnection: Connection = {
        id: Date.now().toString(),
        requesterId: currentUserId,
        recipientId: targetUserId,
        status: 'PENDING',
        type,
        createdAt: new Date().toISOString(),
        message: message.trim()
      };

      // In real app, call API
      // await apiService.createConnection(newConnection);
      
      setConnections(prev => [...prev, newConnection]);
      setMessage('');
      setShowMessageModal(false);
      
      // Create notification for target user
      // await apiService.createNotification({
      //   recipientId: targetUserId,
      //   message: `New ${type.toLowerCase()} request from ${user?.name}`,
      //   type: 'CONNECTION_REQUEST'
      // });

      alert('Connection request sent successfully!');
    } catch (error) {
      console.error('Failed to send connection request:', error);
      alert('Failed to send connection request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptConnection = async (connectionId: string) => {
    try {
      // Update connection status
      setConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId 
            ? { ...conn, status: 'ACCEPTED' }
            : conn
        )
      );
      
      // Create notification for requester
      // await apiService.createNotification({
      //   recipientId: connections.find(c => c.id === connectionId)?.requesterId,
      //   message: `Your connection request was accepted!`,
      //   type: 'CONNECTION_ACCEPTED'
      // });

      alert('Connection accepted!');
    } catch (error) {
      console.error('Failed to accept connection:', error);
    }
  };

  const handleRejectConnection = async (connectionId: string) => {
    try {
      setConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId 
            ? { ...conn, status: 'REJECTED' }
            : conn
        )
      );
      alert('Connection rejected.');
    } catch (error) {
      console.error('Failed to reject connection:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    try {
      // Send direct message
      // await apiService.sendDirectMessage({
      //   senderId: currentUserId,
      //   recipientId: targetUserId,
      //   message: message.trim()
      // });
      
      alert('Message sent successfully!');
      setMessage('');
      setShowMessageModal(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const existingConnection = connections.find(
    conn => (conn.requesterId === currentUserId && conn.recipientId === targetUserId) ||
           (conn.requesterId === targetUserId && conn.recipientId === currentUserId)
  );

  const pendingConnections = connections.filter(
    conn => conn.recipientId === currentUserId && conn.status === 'PENDING'
  );

  if (!userProfile) {
    return <div className={`text-center py-8 ${className}`}>Loading profile...</div>;
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 border border-gray-200 ${className}`}>
      {/* User Profile Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
            <Users className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{userProfile.name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                userProfile.role === 'admin' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {userProfile.role.toUpperCase()}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                {userProfile.badge}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMessageModal(true)}
            className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
            title="Send Message"
          >
            <Mail className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{userProfile.uploadsCount}</div>
          <div className="text-sm text-gray-600">Uploads</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{userProfile.commentsCount}</div>
          <div className="text-sm text-gray-600">Comments</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center">
            <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
            <span className="text-2xl font-bold text-gray-900">{userProfile.avgRating}</span>
          </div>
          <div className="text-sm text-gray-600">Rating</div>
        </div>
      </div>

      {/* Connection Actions */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-semibold text-gray-900 mb-4">Connect with {userProfile.name}</h4>
        
        {existingConnection ? (
          <div className="space-y-3">
            {existingConnection.status === 'PENDING' && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    {existingConnection.type} request pending
                  </span>
                </div>
                <button
                  onClick={() => handleRejectConnection(existingConnection.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Cancel
                </button>
              </div>
            )}
            
            {existingConnection.status === 'ACCEPTED' && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    Connected ({existingConnection.type})
                  </span>
                </div>
                <button className="text-sm text-gray-600 hover:text-gray-800">
                  View Profile
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex space-x-3">
              <button
                onClick={() => setConnectionType('FOLLOW')}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  connectionType === 'FOLLOW'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Users className="h-4 w-4 mr-2 inline" />
                Follow
              </button>
              
              {targetUserRole === 'uploader' && (
                <button
                  onClick={() => setConnectionType('MENTORSHIP')}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    connectionType === 'MENTORSHIP'
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Award className="h-4 w-4 mr-2 inline" />
                  Mentorship
                </button>
              )}
              
              <button
                onClick={() => setConnectionType('COLLABORATION')}
                className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                  connectionType === 'COLLABORATION'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Users className="h-4 w-4 mr-2 inline" />
                Collaborate
              </button>
            </div>
            
            <div className="flex space-x-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Add a message for your ${connectionType.toLowerCase()} request...`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => handleConnectionRequest(connectionType)}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pending Connections (for admin/uploader) */}
      {pendingConnections.length > 0 && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h4 className="font-semibold text-gray-900 mb-4">Pending Connection Requests</h4>
          <div className="space-y-3">
            {pendingConnections.map((connection) => (
              <div key={connection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 capitalize">{connection.type} Request</div>
                  <div className="text-sm text-gray-600">
                    From: User {connection.requesterId.slice(-4)}
                  </div>
                  {connection.message && (
                    <div className="text-sm text-gray-700 mt-1">"{connection.message}"</div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAcceptConnection(connection.id)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectConnection(connection.id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Send Message to {userProfile.name}
            </h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessage('');
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionSystem;
