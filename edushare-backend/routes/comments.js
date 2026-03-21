const express = require('express');
const {
  createComment,
  getResourceComments,
  updateComment,
  deleteComment,
  reportComment,
  replyToComment,
  getCommentHistory
} = require('../controllers/commentController');
const {
  validateComment,
  handleValidationErrors
} = require('../utils/validation');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create new comment (protected)
router.post(
  '/',
  authenticate,
  validateComment,
  handleValidationErrors,
  createComment
);

// Get comments for a resource (public)
router.get(
  '/:resourceId',
  getResourceComments
);

// Update comment (protected)
router.put(
  '/:id',
  authenticate,
  updateComment
);

// Delete comment (protected)
router.delete(
  '/:id',
  authenticate,
  deleteComment
);

// Report comment (protected)
router.post(
  '/:id/report',
  authenticate,
  reportComment
);

// Reply to comment (protected)
router.post(
  '/:id/reply',
  authenticate,
  replyToComment
);

// Get user's comment history (protected)
router.get(
  '/history',
  authenticate,
  getCommentHistory
);

module.exports = router;
