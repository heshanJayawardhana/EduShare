const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getResourceInquiries,
  getUserInquiries,
  getAllInquiries,
  answerInquiry,
  updateInquiryStatus
} = require('../controllers/inquiryController');

// Public routes
router.post('/', createInquiry); // Anyone can submit inquiry
router.get('/resource/:resourceId', getResourceInquiries);

// Protected routes (temporarily public for demo)
router.get('/my-inquiries', getUserInquiries);
router.get('/all', getAllInquiries); // Admin only
router.put('/:inquiryId/answer', answerInquiry);
router.put('/:inquiryId/status', updateInquiryStatus);

module.exports = router;
