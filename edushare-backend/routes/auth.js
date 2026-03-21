const express = require('express');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const {
  validateUserRegistration,
  validateUserLogin,
  handleValidationErrors
} = require('../utils/validation');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Register user
router.post(
  '/register',
  validateUserRegistration,
  handleValidationErrors,
  register
);

// Login user
router.post(
  '/login',
  validateUserLogin,
  handleValidationErrors,
  login
);

// Get current user profile (protected)
router.get(
  '/profile',
  authenticate,
  getProfile
);

// Update user profile (protected)
router.put(
  '/profile',
  authenticate,
  updateProfile
);

// Change password (protected)
router.put(
  '/change-password',
  authenticate,
  changePassword
);

module.exports = router;
