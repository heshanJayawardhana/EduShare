const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
    trim: true
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: [0, 'File size must be positive']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    enum: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'zip']
  },
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader ID is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Mathematics', 'Physics', 'Chemistry', 'Biology',
      'Computer Science', 'Engineering', 'Medicine',
      'Business', 'Economics', 'Arts', 'History',
      'Literature', 'Psychology', 'Sociology', 'Other'
    ]
  },
  faculty: {
    type: String,
    required: [true, 'Faculty is required'],
    enum: [
      'Science', 'Engineering', 'Medicine', 'Business',
      'Arts', 'Humanities', 'Social Sciences', 'Other'
    ]
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    enum: ['2020', '2021', '2022', '2023', '2024', '2025', '2026']
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  downloads: {
    type: Number,
    default: 0,
    min: [0, 'Downloads cannot be negative']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  ratingCount: {
    type: Number,
    default: 0,
    min: [0, 'Rating count cannot be negative']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot exceed 30 characters']
  }],
  isApproved: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
resourceSchema.index({ uploaderId: 1 });
resourceSchema.index({ category: 1 });
resourceSchema.index({ faculty: 1 });
resourceSchema.index({ academicYear: 1 });
resourceSchema.index({ averageRating: -1 });
resourceSchema.index({ downloads: -1 });
resourceSchema.index({ createdAt: -1 });
resourceSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for uploader info
resourceSchema.virtual('uploader', {
  ref: 'User',
  localField: 'uploaderId',
  foreignField: '_id',
  justOne: true
});

// Virtual for ratings
resourceSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'resourceId'
});

// Virtual for comments
resourceSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'resourceId'
});

// Pre-save middleware to update search index
resourceSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('description')) {
    this.searchText = `${this.title} ${this.description} ${this.tags.join(' ')}`;
  }
  next();
});

// Static method to get resources with filters
resourceSchema.statics.findWithFilters = function(filters = {}, options = {}) {
  const {
    category,
    faculty,
    academicYear,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10
  } = filters;

  // Build query
  let query = { isApproved: true, isPublic: true };

  if (category) query.category = category;
  if (faculty) query.faculty = faculty;
  if (academicYear) query.academicYear = academicYear;
  if (search) {
    query.$text = { $search: search };
  }

  // Build sort options
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  return this.find(query)
    .populate('uploaderId', 'name email badge')
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .exec();
};

// Static method to get resource statistics
resourceSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalResources: { $sum: 1 },
        totalDownloads: { $sum: '$downloads' },
        averageRating: { $avg: '$averageRating' },
        totalRatingCount: { $sum: '$ratingCount' },
        categoryStats: {
          $push: {
            category: '$category',
            downloads: '$downloads'
          }
        },
        facultyStats: {
          $push: {
            faculty: '$faculty',
            downloads: '$downloads'
          }
        }
      }
    }
  ]);

  return stats[0] || {
    totalResources: 0,
    totalDownloads: 0,
    averageRating: 0,
    totalRatingCount: 0,
    categoryStats: [],
    facultyStats: []
  };
};

// Instance method to update rating
resourceSchema.methods.updateRating = async function() {
  const Rating = mongoose.model('Rating');
  
  const ratingStats = await Rating.aggregate([
    { $match: { resourceId: this._id } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        ratingCount: { $sum: 1 }
      }
    }
  ]);

  const stats = ratingStats[0] || { averageRating: 0, ratingCount: 0 };
  
  this.averageRating = Math.round(stats.averageRating * 10) / 10; // Round to 1 decimal
  this.ratingCount = stats.ratingCount;
  
  return this.save();
};

// Instance method to increment downloads
resourceSchema.methods.incrementDownloads = async function() {
  this.downloads += 1;
  
  // Update uploader's total downloads
  const User = mongoose.model('User');
  await User.findByIdAndUpdate(this.uploaderId, {
    $inc: { totalDownloads: 1 }
  });
  
  return this.save();
};

module.exports = mongoose.model('Resource', resourceSchema);
