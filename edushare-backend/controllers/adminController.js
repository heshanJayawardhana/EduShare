const User = require('../models/User');
const Resource = require('../models/Resource');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');

/**
 * Get dashboard statistics
 * @route GET /api/admin/dashboard
 */
const getDashboardStats = async (req, res) => {
  try {
    // Get user statistics
    const userStats = await User.getStats();
    
    // Get resource statistics
    const resourceStats = await Resource.getStats();
    
    // Get comment statistics
    const commentStats = await Comment.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalComments: { $sum: 1 },
          positiveComments: {
            $sum: { $cond: ['$isPositive', 1, 0] }
          },
          negativeComments: {
            $sum: { $cond: ['$isPositive', 0, 1] }
          },
          reportedComments: {
            $sum: { $cond: ['$isReported', 1, 0] }
          }
        }
      }
    ]);

    // Get rating statistics
    const ratingStats = await Rating.aggregate([
      {
        $group: {
          _id: null,
          totalRatings: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    // Get monthly statistics (last 6 months)
    const monthlyStats = await Resource.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          resources: { $sum: 1 },
          downloads: { $sum: '$downloads' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                months: [
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                ]
              },
              in: {
                $arrayElemAt: [
                  '$$months',
                  { $subtract: ['$_id.month', 1] }
                ]
              }
            }
          },
          year: '$_id.year',
          resources: 1,
          downloads: 1
        }
      }
    ]);

    const commentData = commentStats[0] || {
      totalComments: 0,
      positiveComments: 0,
      negativeComments: 0,
      reportedComments: 0
    };

    const ratingData = ratingStats[0] || {
      totalRatings: 0,
      averageRating: 0
    };

    res.json({
      users: userStats,
      resources: resourceStats,
      comments: {
        ...commentData,
        positivePercentage: commentData.totalComments > 0 
          ? Math.round((commentData.positiveComments / commentData.totalComments) * 100)
          : 0
      },
      ratings: ratingData,
      monthlyStats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Get all users (admin only)
 * @route GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      badge,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};
    
    if (role) query.role = role;
    if (badge) query.badge = badge;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Get all resources (admin only)
 * @route GET /api/admin/resources
 */
const getAllResources = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      faculty,
      academicYear,
      isApproved,
      uploaderId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = {};
    
    if (category) query.category = category;
    if (faculty) query.faculty = faculty;
    if (academicYear) query.academicYear = academicYear;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    if (uploaderId) query.uploaderId = uploaderId;
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const resources = await Resource.find(query)
      .populate('uploaderId', 'name email badge')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Resource.countDocuments(query);

    res.json({
      resources,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get all resources error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Get all comments (admin only)
 * @route GET /api/admin/comments
 */
const getAllComments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      isReported,
      resourceId,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { isDeleted: false };
    
    if (isReported !== undefined) query.isReported = isReported === 'true';
    if (resourceId) query.resourceId = resourceId;
    if (userId) query.userId = userId;

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const comments = await Comment.find(query)
      .populate('userId', 'name email badge')
      .populate('resourceId', 'title')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    const total = await Comment.countDocuments(query);

    res.json({
      comments,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get all comments error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Delete comment (admin only)
 * @route DELETE /api/admin/comment/:id
 */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({
        error: 'Comment not found'
      });
    }

    // Soft delete comment
    await Comment.softDelete(id);

    res.json({
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Approve/Reject resource (admin only)
 * @route PUT /api/admin/resource/:id/approve
 */
const approveResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const resource = await Resource.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    res.json({
      message: `Resource ${isApproved ? 'approved' : 'rejected'} successfully`,
      resource
    });
  } catch (error) {
    console.error('Approve resource error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Update user badge (admin only)
 * @route PUT /api/admin/user/:id/badge
 */
const updateUserBadge = async (req, res) => {
  try {
    const { id } = req.params;
    const { badge } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { badge },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      message: 'User badge updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user badge error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Get system analytics
 * @route GET /api/admin/analytics
 */
const getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // Default to last 30 days
    
    const daysAgo = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    // User analytics
    const userAnalytics = await User.aggregate([
      { $match: { createdAt: { $gte: daysAgo } } },
      {
        $group: {
          _id: null,
          newUsers: { $sum: 1 },
          userGrowth: { $sum: 1 }
        }
      }
    ]);

    // Resource analytics
    const resourceAnalytics = await Resource.aggregate([
      { $match: { createdAt: { $gte: daysAgo } } },
      {
        $group: {
          _id: null,
          newResources: { $sum: 1 },
          totalDownloads: { $sum: '$downloads' },
          averageRating: { $avg: '$averageRating' }
        }
      }
    ]);

    // Comment analytics
    const commentAnalytics = await Comment.aggregate([
      { $match: { createdAt: { $gte: daysAgo }, isDeleted: false } },
      {
        $group: {
          _id: null,
          newComments: { $sum: 1 },
          reportedComments: {
            $sum: { $cond: ['$isReported', 1, 0] }
          }
        }
      }
    ]);

    const userData = userAnalytics[0] || { newUsers: 0, userGrowth: 0 };
    const resourceData = resourceAnalytics[0] || { newResources: 0, totalDownloads: 0, averageRating: 0 };
    const commentData = commentAnalytics[0] || { newComments: 0, reportedComments: 0 };

    res.json({
      period: `${period} days`,
      users: userData,
      resources: resourceData,
      comments: commentData
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllResources,
  getAllComments,
  deleteComment,
  approveResource,
  updateUserBadge,
  getAnalytics
};
