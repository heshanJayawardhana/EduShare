const express = require('express');
const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  downloadResource,
  getMyResources
} = require('../controllers/resourceController');
const {
  validateResourceCreation,
  handleValidationErrors
} = require('../utils/validation');
const { authenticate, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all resources (public)
router.get(
  '/',
  optionalAuth,
  getResources
);

// Get single resource by ID (public)
router.get(
  '/:id',
  optionalAuth,
  getResourceById
);

// Create new resource (protected)
router.post(
  '/',
  authenticate,
  validateResourceCreation,
  handleValidationErrors,
  createResource
);

// Update resource (protected)
router.put(
  '/:id',
  authenticate,
  updateResource
);

// Delete resource (protected)
router.delete(
  '/:id',
  authenticate,
  deleteResource
);

// Download resource (protected)
router.post(
  '/:id/download',
  authenticate,
  downloadResource
);

// Get user's resources (protected)
router.get(
  '/my',
  authenticate,
  getMyResources
);

module.exports = router;
