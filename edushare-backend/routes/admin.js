const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  getAllResources,
  getAllComments,
  deleteComment,
  approveResource,
  updateUserBadge,
  getAnalytics
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize('admin'));

// Get dashboard statistics
router.get(
  '/dashboard',
  getDashboardStats
);

// Get all users
router.get(
  '/users',
  getAllUsers
);

// Get all resources
router.get(
  '/resources',
  getAllResources
);

// Get all comments
router.get(
  '/comments',
  getAllComments
);

// Delete comment
router.delete(
  '/comment/:id',
  deleteComment
);

// Approve/reject resource
router.put(
  '/resource/:id/approve',
  approveResource
);

// Update user badge
router.put(
  '/user/:id/badge',
  updateUserBadge
);

// Get system analytics
router.get(
  '/analytics',
  getAnalytics
);

module.exports = router;
