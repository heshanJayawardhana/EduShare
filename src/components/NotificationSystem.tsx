import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, MessageCircle, Star, Upload, AlertCircle } from 'lucide-react';

export type NotificationType = 'INQUIRY' | 'COMMENT' | 'RATING' | 'UPLOAD' | 'SYSTEM';

export interface Notification {
  id: string;
  recipientId: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  resourceId?: string;
  userId?: string;
}

interface NotificationSystemProps {
  userId: string;
  userRole: 'student' | 'uploader' | 'admin';
  className?: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ 
  userId, 
  userRole, 
  className = '' 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications - in real app, this would come from API
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        recipientId: userId,
        message: 'New inquiry received for "Data Structures"',
        type: 'INQUIRY',
        isRead: false,
        createdAt: new Date().toISOString(),
        resourceId: 'R1',
        userId: 'U1'
      },
      {
        id: '2',
        recipientId: userId,
        message: 'Someone rated your resource 5 stars',
        type: 'RATING',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        resourceId: 'R1',
        userId: 'U2'
      },
      {
        id: '3',
        recipientId: userId,
        message: 'New comment on your upload',
        type: 'COMMENT',
        isRead: true,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        resourceId: 'R1',
        userId: 'U3'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length);
  }, [userId]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'INQUIRY':
        return <MessageCircle className="h-4 w-4 text-blue-600" />;
      case 'COMMENT':
        return <MessageCircle className="h-4 w-4 text-green-600" />;
      case 'RATING':
        return <Star className="h-4 w-4 text-yellow-600" />;
      case 'UPLOAD':
        return <Upload className="h-4 w-4 text-purple-600" />;
      case 'SYSTEM':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'INQUIRY':
        return 'bg-blue-50 border-blue-200';
      case 'COMMENT':
        return 'bg-green-50 border-green-200';
      case 'RATING':
        return 'bg-yellow-50 border-yellow-200';
      case 'UPLOAD':
        return 'bg-purple-50 border-purple-200';
      case 'SYSTEM':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
    setUnreadCount(0);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-purple-600 hover:text-purple-700"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-purple-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full border ${getNotificationColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.isRead ? 'font-semibold' : ''} text-gray-900`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <button className="w-full text-center text-sm text-purple-600 hover:text-purple-700">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationSystem;
