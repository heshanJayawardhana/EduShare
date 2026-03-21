// API Service for Resource Interaction System

export interface Connection {
  id: string;
  requesterId: string;
  recipientId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  type: 'FOLLOW' | 'MENTORSHIP' | 'COLLABORATION';
  createdAt: string;
  message?: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'uploader' | 'admin';
  commentsCount: number;
  uploadsCount: number;
  badge: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
}

export interface Resource {
  _id: string;
  title: string;
  description: string;
  uploaderId: string;
  avgRating: number;
  ratingCount: number;
  downloadsCount: number;
  price: number;
  currency: string;
  module: string;
  type: 'pdf' | 'video' | 'document' | 'other';
  createdAt: string;
}

export interface Rating {
  resourceId: string;
  userId: string;
  stars: number;
  createdAt: string;
}

export interface Comment {
  _id: string;
  resourceId: string;
  userId: string;
  userName: string;
  message: string;
  status: 'ACTIVE' | 'HIDDEN';
  createdAt: string;
  userBadge?: string;
}

export interface Inquiry {
  _id: string;
  resourceId: string;
  userId: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'ANSWERED';
  createdAt: string;
  answer?: string;
}

export interface Notification {
  _id: string;
  recipientId: string;
  message: string;
  type: 'INQUIRY' | 'COMMENT' | 'RATING' | 'UPLOAD' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
  resourceId?: string;
  userId?: string;
}

export interface ResourceDetails {
  resource: Resource;
  comments: Comment[];
  summary: string;
  avgRating: number;
  ratingCount: number;
  uploader: User;
}

class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  // Rating APIs
  async submitRating(data: { resourceId: string; userId: string; stars: number }): Promise<void> {
    const response = await fetch(`${this.baseUrl}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit rating');
    }
  }

  async getResourceRating(resourceId: string, userId?: string): Promise<number | null> {
    if (!userId) return null;
    
    const response = await fetch(`${this.baseUrl}/ratings/${resourceId}/${userId}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.stars;
  }

  // Comment APIs
  async submitComment(data: { 
    resourceId: string; 
    userId: string; 
    message: string;
    userName: string;
  }): Promise<Comment> {
    const response = await fetch(`${this.baseUrl}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit comment');
    }

    return response.json();
  }

  async getResourceComments(resourceId: string): Promise<Comment[]> {
    const response = await fetch(`${this.baseUrl}/comments/${resourceId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    return response.json();
  }

  async hideComment(commentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/comments/${commentId}/hide`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to hide comment');
    }
  }

  // Inquiry APIs
  async submitInquiry(data: {
    resourceId: string;
    userId: string;
    subject: string;
    message: string;
    userName?: string;
    userEmail?: string;
  }): Promise<Inquiry> {
    const response = await fetch(`${this.baseUrl}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit inquiry');
    }

    return response.json();
  }

  async getResourceInquiries(resourceId: string): Promise<Inquiry[]> {
    const response = await fetch(`${this.baseUrl}/inquiries/${resourceId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch inquiries');
    }

    return response.json();
  }

  // Resource APIs
  async getResourceDetails(resourceId: string): Promise<ResourceDetails> {
    const response = await fetch(`${this.baseUrl}/resources/${resourceId}/details`);
    if (!response.ok) {
      throw new Error('Failed to fetch resource details');
    }

    return response.json();
  }

  async updateUserBadge(userId: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/users/${userId}/update-badge`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to update badge');
    }

    return response.json();
  }

  // Connection APIs
  async createConnection(data: {
    requesterId: string;
    recipientId: string;
    type: 'FOLLOW' | 'MENTORSHIP' | 'COLLABORATION';
    message?: string;
  }): Promise<Connection> {
    const response = await fetch(`${this.baseUrl}/connections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create connection');
    }

    return response.json();
  }

  async getConnections(userId: string): Promise<Connection[]> {
    const response = await fetch(`${this.baseUrl}/connections/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch connections');
    }

    return response.json();
  }

  async updateConnectionStatus(connectionId: string, status: 'ACCEPTED' | 'REJECTED'): Promise<void> {
    const response = await fetch(`${this.baseUrl}/connections/${connectionId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update connection status');
    }
  }

  async sendDirectMessage(data: {
    senderId: string;
    recipientId: string;
    message: string;
  }): Promise<DirectMessage> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  }

  async getMessages(userId: string): Promise<DirectMessage[]> {
    const response = await fetch(`${this.baseUrl}/messages/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/messages/${messageId}/read`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to mark message as read');
    }
  }

  // Notification APIs
  async getNotifications(userId: string): Promise<Notification[]> {
    const response = await fetch(`${this.baseUrl}/notifications/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return response.json();
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/notifications/${userId}/read-all`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
  }

  // Admin APIs
  async getAdminStats(): Promise<{
    totalUsers: number;
    totalResources: number;
    totalComments: number;
    totalInquiries: number;
    pendingInquiries: number;
  }> {
    const response = await fetch(`${this.baseUrl}/admin/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch admin stats');
    }

    return response.json();
  }

  async getAllComments(): Promise<Comment[]> {
    const response = await fetch(`${this.baseUrl}/admin/comments`);
    if (!response.ok) {
      throw new Error('Failed to fetch all comments');
    }

    return response.json();
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    const response = await fetch(`${this.baseUrl}/admin/inquiries`);
    if (!response.ok) {
      throw new Error('Failed to fetch all inquiries');
    }

    return response.json();
  }

  async answerInquiry(inquiryId: string, answer: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/admin/inquiries/${inquiryId}/answer`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answer }),
    });

    if (!response.ok) {
      throw new Error('Failed to answer inquiry');
    }
  }
}

export const apiService = new ApiService();
export default apiService;
