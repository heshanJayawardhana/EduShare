const Rating = require('../models/Rating');
const Resource = require('../models/Resource');

/**
 * Create or update rating for a resource
 * @route POST /api/ratings
 */
const createRating = async (req, res) => {
  try {
    const { resourceId, rating } = req.body;
    const userId = req.user._id;

    // Check if resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    // Check if user has already rated this resource
    const existingRating = await Rating.getUserRating(userId, resourceId);
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      await existingRating.save();
      
      res.json({
        message: 'Rating updated successfully',
        rating: existingRating
      });
    } else {
      // Create new rating
      const newRating = new Rating({
        userId,
        resourceId,
        rating
      });

      await newRating.save();

      res.status(201).json({
        message: 'Rating created successfully',
        rating: newRating
      });
    }
  } catch (error) {
    console.error('Create rating error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'You have already rated this resource'
      });
    }
    
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Get ratings for a resource
 * @route GET /api/ratings/:resourceId
 */
const getResourceRatings = async (req, res) => {
  try {
    const { resourceId } = req.params;

    // Check if resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    // Get rating statistics
    const stats = await Rating.getResourceStats(resourceId);
    
    // Get individual ratings with pagination
    const {
      page = 1,
      limit = 10
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const ratings = await Rating.find({ resourceId })
      .populate('userId', 'name badge')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Rating.countDocuments({ resourceId });

    res.json({
      stats,
      ratings,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get resource ratings error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Get user's rating for a resource
 * @route GET /api/ratings/user/:resourceId
 */
const getUserRating = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user._id;

    const rating = await Rating.getUserRating(userId, resourceId);
    
    if (!rating) {
      return res.json({
        rating: null,
        message: 'User has not rated this resource'
      });
    }

    res.json({
      rating
    });
  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Update user's rating for a resource
 * @route PUT /api/ratings/:resourceId
 */
const updateRating = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { rating } = req.body;
    const userId = req.user._id;

    // Check if resource exists
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    // Update or create rating
    const updatedRating = await Rating.updateUserRating(userId, resourceId, rating);

    res.json({
      message: 'Rating updated successfully',
      rating: updatedRating
    });
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Delete user's rating for a resource
 * @route DELETE /api/ratings/:resourceId
 */
const deleteRating = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const userId = req.user._id;

    const deletedRating = await Rating.removeUserRating(userId, resourceId);
    
    if (!deletedRating) {
      return res.status(404).json({
        error: 'Rating not found'
      });
    }

    res.json({
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Get user's rating history
 * @route GET /api/ratings/history
 */
const getRatingHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      page = 1,
      limit = 10
    } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const ratings = await Rating.find({ userId })
      .populate('resourceId', 'title category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Rating.countDocuments({ userId });

    res.json({
      ratings,
      pagination: {
        current: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
        limit: limitNum
      }
    });
  } catch (error) {
    console.error('Get rating history error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  createRating,
  getResourceRatings,
  getUserRating,
  updateRating,
  deleteRating,
  getRatingHistory
};
