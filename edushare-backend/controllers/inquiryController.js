const Inquiry = require('../models/Inquiry');
const Resource = require('../models/Resource');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create new inquiry
const createInquiry = async (req, res) => {
  try {
    const { resourceId, name, email, subject, message } = req.body;
    const userId = req.user?.id || null;

    // Verify resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    // Create inquiry
    const inquiry = new Inquiry({
      resourceId,
      userId,
      name,
      email,
      subject,
      message
    });

    await inquiry.save();

    // Find uploader
    const uploader = await User.findById(resource.uploaderId);
    if (!uploader) {
      return res.status(404).json({ error: 'Uploader not found' });
    }

    // Create notification for uploader
    const uploaderNotification = new Notification({
      userId: uploader._id,
      type: 'inquiry',
      title: 'New Inquiry on Your Resource',
      message: `${name} has asked: "${subject}" about your resource "${resource.title}"`,
      relatedId: inquiry._id
    });
    await uploaderNotification.save();

    // Create notification for admin
    const adminUsers = await User.find({ role: 'admin' });
    for (const admin of adminUsers) {
      const adminNotification = new Notification({
        userId: admin._id,
        type: 'inquiry',
        title: 'New Resource Inquiry',
        message: `${name} (${email}) inquired about "${resource.title}"`,
        relatedId: inquiry._id
      });
      await adminNotification.save();
    }

    // Mark notifications as sent
    inquiry.uploaderNotified = true;
    inquiry.adminNotified = true;
    await inquiry.save();

    res.status(201).json({
      message: 'Inquiry submitted successfully',
      inquiry
    });
  } catch (error) {
    console.error('Create inquiry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get inquiries for a resource
const getResourceInquiries = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { status = 'all' } = req.query;

    let query = { resourceId };
    if (status !== 'all') {
      query.status = status;
    }

    const inquiries = await Inquiry.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    console.error('Get resource inquiries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user's inquiries
const getUserInquiries = async (req, res) => {
  try {
    const userId = req.user.id;
    const inquiries = await Inquiry.find({ userId })
      .populate('resourceId', 'title')
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (error) {
    console.error('Get user inquiries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all inquiries (admin)
const getAllInquiries = async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status !== 'all') {
      query.status = status;
    }

    const inquiries = await Inquiry.find(query)
      .populate('resourceId', 'title')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Inquiry.countDocuments(query);

    res.json({
      inquiries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all inquiries error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Answer inquiry
const answerInquiry = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { answer } = req.body;

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    inquiry.answer = answer;
    inquiry.status = 'Answered';
    inquiry.answeredAt = new Date();
    await inquiry.save();

    // Notify the user who made the inquiry
    if (inquiry.userId) {
      const resource = await Resource.findById(inquiry.resourceId);
      const userNotification = new Notification({
        userId: inquiry.userId,
        type: 'inquiry',
        title: 'Your Inquiry Has Been Answered',
        message: `Your inquiry about "${resource.title}" has been answered`,
        relatedId: inquiry._id
      });
      await userNotification.save();
    }

    res.json({
      message: 'Inquiry answered successfully',
      inquiry
    });
  } catch (error) {
    console.error('Answer inquiry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update inquiry status
const updateInquiryStatus = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { status } = req.body;

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    inquiry.status = status;
    if (status === 'Answered' && !inquiry.answeredAt) {
      inquiry.answeredAt = new Date();
    }
    await inquiry.save();

    res.json({
      message: 'Inquiry status updated successfully',
      inquiry
    });
  } catch (error) {
    console.error('Update inquiry status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createInquiry,
  getResourceInquiries,
  getUserInquiries,
  getAllInquiries,
  answerInquiry,
  updateInquiryStatus
};
