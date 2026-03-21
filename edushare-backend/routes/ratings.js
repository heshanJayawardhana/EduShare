const express = require('express');
const {
  createRating,
  getResourceRatings,
  getUserRating,
  updateRating,
  deleteRating,
  getRatingHistory
} = require('../controllers/ratingController');
const {
  validateRating,
  handleValidationErrors
} = require('../utils/validation');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create or update rating (protected)
router.post(
  '/',
  authenticate,
  validateRating,
  handleValidationErrors,
  createRating
);

// Get ratings for a resource (public)
router.get(
  '/:resourceId',
  getResourceRatings
);

// Get user's rating for a resource (protected)
router.get(
  '/user/:resourceId',
  authenticate,
  getUserRating
);

// Update user's rating for a resource (protected)
router.put(
  '/:resourceId',
  authenticate,
  updateRating
);

// Delete user's rating for a resource (protected)
router.delete(
  '/:resourceId',
  authenticate,
  deleteRating
);

// Get user's rating history (protected)
router.get(
  '/history',
  authenticate,
  getRatingHistory
);

module.exports = router;
