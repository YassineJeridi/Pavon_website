// backend/models/Banner.js

const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
      maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères'],
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Le sous-titre ne peut pas dépasser 200 caractères'],
    },
    description: {
      type: String,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },
    image: {
      type: String,
      required: [true, 'L\'image est requise'],
    },
    mobileImage: {
      type: String,
    },
    link: {
      type: String,
      trim: true,
    },
    buttonText: {
      type: String,
      trim: true,
      default: 'Découvrir',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    position: {
      type: String,
      enum: ['hero', 'promotional', 'category', 'footer'],
      default: 'hero',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bannerSchema.index({ isActive: 1, order: 1 });
bannerSchema.index({ position: 1, isActive: 1 });
bannerSchema.index({ startDate: 1, endDate: 1 });

// Virtual to check if banner is currently active
bannerSchema.virtual('isCurrentlyActive').get(function () {
  if (!this.isActive) return false;

  const now = new Date();

  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;

  return true;
});

// Instance method to increment clicks
bannerSchema.methods.incrementClicks = function () {
  this.clicks += 1;
  return this.save();
};

// Instance method to increment views
bannerSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Static method to get active banners
bannerSchema.statics.getActiveBanners = function (position = null) {
  const now = new Date();
  const query = {
    isActive: true,
    $or: [
      { startDate: { $exists: false } },
      { startDate: { $lte: now } },
    ],
    $or: [
      { endDate: { $exists: false } },
      { endDate: { $gte: now } },
    ],
  };

  if (position) {
    query.position = position;
  }

  return this.find(query).sort({ order: 1 });
};

module.exports = mongoose.model('Banner', bannerSchema);
