const Comment = require('../models/Comment');
const Resource = require('../models/Resource');

/**
 * Create a new comment
 * @route POST /api/comments
 */
const createComment = async (req, res) => {
  try {
    const { resourceId, content, rating, parentCommentId } = req.body;
    const userId = req.user._id;

    // Check if resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    // Create new comment
    const comment = new Comment({
      userId,
      resourceId,
      content,
      rating,
      parentCommentId
    });

    await comment.save();

    // Populate user info
    await comment.populate('userId', 'name email badge');

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Get comments for a resource
 * @route GET /api/comments/:resourceId
 */
const getResourceComments = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Check if resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    // Get comments with pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder
    };

    const comments = await Comment.getResourceComments(resourceId, options);
    
    // Get total count for pagination
    const total = await Comment.countDocuments({
      resourceId,
      isDeleted: false,
      parentCommentId: null
    });

    // Get comment statistics
    const stats = await Comment.getResourceStats(resourceId);

    res.json({
      comments,
      stats,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get resource comments error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Update a comment
 * @route PUT /api/comments/:id
 */
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, rating } = req.body;
    const userId = req.user._id;

    // Find comment
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({
        error: 'Comment not found'
      });
    }

    // Check if user is the commenter
    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        error: 'Not authorized to update this comment'
      });
    }

    // Update comment
    const updateData = {};
    if (content) updateData.content = content;
    if (rating) updateData.rating = rating;

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email badge');

    res.json({
      message: 'Comment updated successfully',
      comment: updatedComment
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Delete a comment (soft delete)
 * @route DELETE /api/comments/:id
 */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find comment
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({
        error: 'Comment not found'
      });
    }

    // Check if user is the commenter or admin
    if (comment.userId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to delete this comment'
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
 * Report a comment
 * @route POST /api/comments/:id/report
 */
const reportComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Find comment
    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({
        error: 'Comment not found'
      });
    }

    // Report comment
    await Comment.reportComment(id);

    res.json({
      message: 'Comment reported successfully'
    });
  } catch (error) {
    console.error('Report comment error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Reply to a comment
 * @route POST /api/comments/:id/reply
 */
const replyToComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, rating } = req.body;
    const userId = req.user._id;

    // Find parent comment
    const parentComment = await Comment.findById(id);
    
    if (!parentComment) {
      return res.status(404).json({
        error: 'Parent comment not found'
      });
    }

    // Create reply
    const reply = await parentComment.addReply(userId, content, rating);

    res.status(201).json({
      message: 'Reply created successfully',
      comment: reply
    });
  } catch (error) {
    console.error('Reply to comment error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Get user's comment history
 * @route GET /api/comments/history
 */
const getCommentHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      page = 1,
      limit = 10
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const comments = await Comment.find({ 
      userId,
      isDeleted: false,
      parentCommentId: null
    })
      .populate('resourceId', 'title category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Comment.countDocuments({
      userId,
      isDeleted: false,
      parentCommentId: null
    });

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
    console.error('Get comment history error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  createComment,
  getResourceComments,
  updateComment,
  deleteComment,
  reportComment,
  replyToComment,
  getCommentHistory
};
