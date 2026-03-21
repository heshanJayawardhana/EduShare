const Resource = require('../models/Resource');
const User = require('../models/User');

/**
 * Get all resources with filters and pagination
 * @route GET /api/resources
 */
const getResources = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      faculty,
      academicYear,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Convert pagination parameters
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Build filters object
    const filters = {
      category,
      faculty,
      academicYear,
      search,
      sortBy,
      sortOrder,
      page: pageNum,
      limit: limitNum
    };

    // Get resources
    const resources = await Resource.findWithFilters(filters);
    
    // Get total count for pagination
    const total = await Resource.countDocuments({
      isApproved: true,
      isPublic: true,
      ...(category && { category }),
      ...(faculty && { faculty }),
      ...(academicYear && { academicYear }),
      ...(search && { $text: { $search: search } })
    });

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
    console.error('Get resources error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Get single resource by ID
 * @route GET /api/resources/:id
 */
const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id)
      .populate('uploaderId', 'name email badge')
      .populate({
        path: 'ratings',
        populate: {
          path: 'userId',
          select: 'name badge'
        }
      });

    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    if (!resource.isApproved || !resource.isPublic) {
      return res.status(403).json({
        error: 'Resource not available'
      });
    }

    res.json({
      resource
    });
  } catch (error) {
    console.error('Get resource error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Create new resource
 * @route POST /api/resources
 */
const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      category,
      faculty,
      academicYear,
      price = 0,
      tags = []
    } = req.body;

    // Create new resource
    const resource = new Resource({
      title,
      description,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      category,
      faculty,
      academicYear,
      price,
      tags,
      uploaderId: req.user._id
    });

    await resource.save();

    // Update user's upload count and badge
    const user = await User.findById(req.user._id);
    user.uploadCount += 1;
    await user.updateBadge();

    // Populate uploader info
    await resource.populate('uploaderId', 'name email badge');

    res.status(201).json({
      message: 'Resource created successfully',
      resource
    });
  } catch (error) {
    console.error('Create resource error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Update resource
 * @route PUT /api/resources/:id
 */
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find resource
    const resource = await Resource.findById(id);
    
    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    // Check if user is the uploader or admin
    if (resource.uploaderId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to update this resource'
      });
    }

    // Update resource
    const updatedResource = await Resource.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('uploaderId', 'name email badge');

    res.json({
      message: 'Resource updated successfully',
      resource: updatedResource
    });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Delete resource
 * @route DELETE /api/resources/:id
 */
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Find resource
    const resource = await Resource.findById(id);
    
    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    // Check if user is the uploader or admin
    if (resource.uploaderId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to delete this resource'
      });
    }

    await Resource.findByIdAndDelete(id);

    res.json({
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Download resource (increment download count)
 * @route POST /api/resources/:id/download
 */
const downloadResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);
    
    if (!resource) {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }

    if (!resource.isApproved || !resource.isPublic) {
      return res.status(403).json({
        error: 'Resource not available'
      });
    }

    // Increment download count
    await resource.incrementDownloads();

    res.json({
      message: 'Download recorded successfully',
      fileUrl: resource.fileUrl,
      fileName: resource.fileName,
      downloads: resource.downloads
    });
  } catch (error) {
    console.error('Download resource error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

/**
 * Get user's resources
 * @route GET /api/resources/my
 */
const getMyResources = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const resources = await Resource.find({ uploaderId: req.user._id })
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Resource.countDocuments({ uploaderId: req.user._id });

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
    console.error('Get my resources error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  downloadResource,
  getMyResources
};
