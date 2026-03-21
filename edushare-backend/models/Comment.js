const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: [true, 'Resource ID is required']
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    minlength: [1, 'Comment cannot be empty'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  isPositive: {
    type: Boolean,
    default: true
  },
  isReported: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better performance
commentSchema.index({ resourceId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ isReported: 1 });
commentSchema.index({ isDeleted: 1 });
commentSchema.index({ parentCommentId: 1 });

// Virtual for commenter info
commentSchema.virtual('commenter', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual for replies
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentCommentId'
});

// Pre-save middleware to analyze sentiment and set isPositive
commentSchema.pre('save', function(next) {
  if (this.isModified('content') && this.rating) {
    // Simple sentiment analysis based on rating
    this.isPositive = this.rating >= 3;
  }
  next();
});

// Static method to get comments for a resource
commentSchema.statics.getResourceComments = function(resourceId, options = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  // Build query
  const query = {
    resourceId: mongoose.Types.ObjectId(resourceId),
    isDeleted: false,
    parentCommentId: null // Only get top-level comments
  };

  // Build sort options
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  return this.find(query)
    .populate('userId', 'name email badge')
    .populate({
      path: 'replies',
      match: { isDeleted: false },
      populate: {
        path: 'userId',
        select: 'name email badge'
      },
      options: { sort: { createdAt: 1 } }
    })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .exec();
};

// Static method to get comment statistics
commentSchema.statics.getResourceStats = async function(resourceId) {
  const stats = await this.aggregate([
    { $match: { 
      resourceId: mongoose.Types.ObjectId(resourceId),
      isDeleted: false 
    }},
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
        averageRating: { $avg: '$rating' },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalComments: 1,
        positiveComments: 1,
        negativeComments: 1,
        positivePercentage: {
          $multiply: [
            { $divide: ['$positiveComments', '$totalComments'] },
            100
          ]
        },
        averageRating: { $round: ['$averageRating', 1] },
        ratingDistribution: {
          $reduce: {
            input: '$ratingDistribution',
            initialValue: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            in: {
              $mergeObjects: [
                '$$value',
                {
                  $arrayToObject: {
                    $map: {
                      input: ['$ratingDistribution'],
                      as: 'rating',
                      in: {
                        k: { $toString: '$$rating' },
                        v: {
                          $add: [
                            { $ifNull: [{ $getField: { field: { $toString: '$$rating' }, input: '$$value' } }, 0] },
                            1
                          ]
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      }
    }
  ]);

  const result = stats[0] || {
    totalComments: 0,
    positiveComments: 0,
    negativeComments: 0,
    positivePercentage: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };

  // Round percentage to nearest integer
  result.positivePercentage = Math.round(result.positivePercentage);

  return result;
};

// Static method to get reported comments
commentSchema.statics.getReportedComments = function(options = {}) {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  return this.find({ isReported: true, isDeleted: false })
    .populate('userId', 'name email')
    .populate('resourceId', 'title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

// Static method to soft delete comment
commentSchema.statics.softDelete = function(commentId) {
  return this.findByIdAndUpdate(commentId, { isDeleted: true });
};

// Static method to report comment
commentSchema.statics.reportComment = function(commentId) {
  return this.findByIdAndUpdate(commentId, { isReported: true });
};

// Instance method to add reply
commentSchema.methods.addReply = async function(userId, content, rating) {
  const Reply = this.constructor;
  
  const reply = await Reply.create({
    userId,
    resourceId: this.resourceId,
    content,
    rating,
    parentCommentId: this._id
  });

  return reply.populate('userId', 'name email badge');
};

module.exports = mongoose.model('Comment', commentSchema);
