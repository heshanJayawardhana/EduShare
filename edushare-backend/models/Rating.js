const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate ratings
ratingSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

// Indexes for better performance
ratingSchema.index({ resourceId: 1 });
ratingSchema.index({ userId: 1 });
ratingSchema.index({ rating: -1 });

// Pre-save middleware to validate unique rating
ratingSchema.pre('save', async function(next) {
  // Check if user has already rated this resource
  const existingRating = await this.constructor.findOne({
    userId: this.userId,
    resourceId: this.resourceId,
    _id: { $ne: this._id } // Exclude current document if updating
  });

  if (existingRating) {
    const error = new Error('User has already rated this resource');
    error.code = 11000; // Duplicate key error code
    return next(error);
  }

  next();
});

// Post-save middleware to update resource average rating
ratingSchema.post('save', async function() {
  try {
    const Resource = mongoose.model('Resource');
    const resource = await Resource.findById(this.resourceId);
    if (resource) {
      await resource.updateRating();
    }
  } catch (error) {
    console.error('Error updating resource rating:', error);
  }
});

// Post-remove middleware to update resource average rating
ratingSchema.post('remove', async function() {
  try {
    const Resource = mongoose.model('Resource');
    const resource = await Resource.findById(this.resourceId);
    if (resource) {
      await resource.updateRating();
    }
  } catch (error) {
    console.error('Error updating resource rating after removal:', error);
  }
});

// Static method to get rating statistics for a resource
ratingSchema.statics.getResourceStats = async function(resourceId) {
  const stats = await this.aggregate([
    { $match: { resourceId: mongoose.Types.ObjectId(resourceId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    },
    {
      $project: {
        _id: 0,
        averageRating: { $round: ['$averageRating', 1] },
        totalRatings: 1,
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

  return stats[0] || {
    averageRating: 0,
    totalRatings: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  };
};

// Static method to get user's rating for a resource
ratingSchema.statics.getUserRating = async function(userId, resourceId) {
  return await this.findOne({ userId, resourceId });
};

// Static method to update user rating
ratingSchema.statics.updateUserRating = async function(userId, resourceId, newRating) {
  const existingRating = await this.findOne({ userId, resourceId });
  
  if (existingRating) {
    existingRating.rating = newRating;
    return await existingRating.save();
  } else {
    return await this.create({ userId, resourceId, rating: newRating });
  }
};

// Static method to remove user rating
ratingSchema.statics.removeUserRating = async function(userId, resourceId) {
  return await this.findOneAndDelete({ userId, resourceId });
};

module.exports = mongoose.model('Rating', ratingSchema);
