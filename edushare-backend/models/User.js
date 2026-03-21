const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  badge: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold'],
    default: 'Bronze'
  },
  uploadCount: {
    type: Number,
    default: 0,
    min: 0
  },
  totalDownloads: {
    type: Number,
    default: 0,
    min: 0
  },
  totalEarnings: {
    type: Number,
    default: 0,
    min: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ badge: 1 });

// Virtual for user's resources
userSchema.virtual('resources', {
  ref: 'Resource',
  localField: '_id',
  foreignField: 'uploaderId'
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to update badge based on upload count
userSchema.methods.updateBadge = function() {
  const uploadCount = this.uploadCount;
  
  if (uploadCount >= 50) {
    this.badge = 'Gold';
  } else if (uploadCount >= 25) {
    this.badge = 'Silver';
  } else {
    this.badge = 'Bronze';
  }
  
  return this.save();
};

// Static method to get user statistics
userSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        bronzeUsers: {
          $sum: { $cond: [{ $eq: ['$badge', 'Bronze'] }, 1, 0] }
        },
        silverUsers: {
          $sum: { $cond: [{ $eq: ['$badge', 'Silver'] }, 1, 0] }
        },
        goldUsers: {
          $sum: { $cond: [{ $eq: ['$badge', 'Gold'] }, 1, 0] }
        },
        totalUploads: { $sum: '$uploadCount' },
        totalDownloads: { $sum: '$totalDownloads' },
        totalEarnings: { $sum: '$totalEarnings' },
        avgRating: { $avg: '$averageRating' }
      }
    }
  ]);
  
  return stats[0] || {
    totalUsers: 0,
    bronzeUsers: 0,
    silverUsers: 0,
    goldUsers: 0,
    totalUploads: 0,
    totalDownloads: 0,
    totalEarnings: 0,
    avgRating: 0
  };
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
