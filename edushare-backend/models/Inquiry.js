const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Answered', 'Closed'],
    default: 'Pending'
  },
  answer: {
    type: String,
    default: null
  },
  uploaderNotified: {
    type: Boolean,
    default: false
  },
  adminNotified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  answeredAt: {
    type: Date,
    default: null
  }
});

// Index for faster queries
inquirySchema.index({ resourceId: 1, status: 1 });
inquirySchema.index({ userId: 1 });
inquirySchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
