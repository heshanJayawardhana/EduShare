const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const ratingRoutes = require('./routes/ratings');
const commentRoutes = require('./routes/comments');
const adminRoutes = require('./routes/admin');
const inquiryRoutes = require('./routes/inquiries');
const notificationRoutes = require('./routes/notifications');
const orderRoutes = require('./routes/orders');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection with fallback
let dbConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');
    dbConnected = true;
  } catch (err) {
    console.log('⚠️  MongoDB connection failed, running in demo mode');
    console.log('📊 Demo mode: Using mock data for API responses');
    dbConnected = false;
  }
};

// Connect to database
connectDB();

// Mock data for demo mode
const mockUsers = [
  { _id: '1', name: 'Admin User', email: 'admin@edushare.com', role: 'admin', badge: 'Gold', uploadCount: 50, totalDownloads: 1000, totalEarnings: 500, averageRating: 4.8, createdAt: new Date() },
  { _id: '2', name: 'John Doe', email: 'john@example.com', role: 'student', badge: 'Silver', uploadCount: 15, totalDownloads: 300, totalEarnings: 150, averageRating: 4.2, createdAt: new Date() },
  { _id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'student', badge: 'Bronze', uploadCount: 5, totalDownloads: 100, totalEarnings: 50, averageRating: 3.8, createdAt: new Date() }
];

const mockResources = [
  { _id: '1', title: 'Advanced Calculus Notes', description: 'Comprehensive calculus notes', category: 'Mathematics', faculty: 'Science', academicYear: '2024', price: 15.99, downloads: 250, averageRating: 4.5, ratingCount: 45, uploaderId: '1', createdAt: new Date() },
  { _id: '2', title: 'Physics Lab Manual', description: 'Complete laboratory manual', category: 'Physics', faculty: 'Science', academicYear: '2024', price: 12.50, downloads: 180, averageRating: 4.2, ratingCount: 32, uploaderId: '2', createdAt: new Date() }
];

const mockComments = [
  { _id: '1', userId: '2', resourceId: '1', content: 'Excellent notes!', rating: 5, isPositive: true, createdAt: new Date() },
  { _id: '2', userId: '3', resourceId: '1', content: 'Very helpful', rating: 4, isPositive: true, createdAt: new Date() }
];

// Demo middleware to provide mock data when DB is not connected
const demoMiddleware = (req, res, next) => {
  if (dbConnected) {
    return next();
  }

  // Handle demo routes
  if (req.path.includes('/auth/login')) {
    return res.json({
      message: 'Login successful (demo mode)',
      token: 'demo-jwt-token',
      user: mockUsers[0]
    });
  }

  if (req.path.includes('/auth/register')) {
    return res.json({
      message: 'User registered successfully (demo mode)',
      token: 'demo-jwt-token',
      user: mockUsers[1]
    });
  }

  if (req.path.includes('/admin/dashboard')) {
    return res.json({
      users: {
        totalUsers: mockUsers.length,
        bronzeUsers: 1,
        silverUsers: 1,
        goldUsers: 1,
        totalUploads: 70,
        totalDownloads: 1400,
        totalEarnings: 700,
        avgRating: 4.3
      },
      resources: {
        totalResources: mockResources.length,
        totalDownloads: 430,
        averageRating: 4.35,
        totalRatingCount: 77
      },
      comments: {
        totalComments: mockComments.length,
        positiveComments: 2,
        negativeComments: 0,
        reportedComments: 0,
        positivePercentage: 100
      },
      ratings: {
        totalRatings: 77,
        averageRating: 4.35,
        ratingDistribution: { 1: 5, 2: 8, 3: 15, 4: 25, 5: 24 }
      },
      monthlyStats: [
        { month: 'Jan', year: 2024, resources: 10, downloads: 200 },
        { month: 'Feb', year: 2024, resources: 15, downloads: 230 }
      ]
    });
  }

  if (req.path.includes('/admin/users')) {
    return res.json({
      users: mockUsers,
      pagination: { current: 1, pages: 1, total: mockUsers.length, limit: 10 }
    });
  }

  if (req.path.includes('/admin/resources')) {
    return res.json({
      resources: mockResources,
      pagination: { current: 1, pages: 1, total: mockResources.length, limit: 10 }
    });
  }

  if (req.path.includes('/admin/comments')) {
    return res.json({
      comments: mockComments,
      pagination: { current: 1, pages: 1, total: mockComments.length, limit: 10 }
    });
  }

  if (req.path.includes('/resources')) {
    return res.json({
      resources: mockResources,
      pagination: { current: 1, pages: 1, total: mockResources.length, limit: 10 }
    });
  }

  next();
};

// Apply demo middleware to all API routes
app.use('/api', demoMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'EduShare API is running',
    database: dbConnected ? 'Connected' : 'Demo Mode',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: 'Duplicate Error',
      message: `${field} already exists`
    });
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }
  
  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔌 Database: ${dbConnected ? 'Connected' : 'Demo Mode'}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`💚 Health: http://localhost:${PORT}/api/health`);
});
