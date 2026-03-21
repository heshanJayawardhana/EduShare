export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  badge: 'Bronze' | 'Silver' | 'Gold';
  role: 'student' | 'admin';
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  uploadedBy: User;
  rating: number;
  downloadCount: number;
  price?: number;
  category: string;
  faculty: string;
  academicYear: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  resourceId: string;
  userId: string;
  userName: string;
  content: string;
  rating: number;
  createdAt: string;
  isPositive: boolean;
}

export interface CartItem {
  resource: Resource;
  quantity: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalDownloads: number;
  averageRating: number;
  totalRevenue: number;
  monthlyDownloads: { month: string; count: number }[];
  monthlyEarnings: { month: string; amount: number }[];
}
