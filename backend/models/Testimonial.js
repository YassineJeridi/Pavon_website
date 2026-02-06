// backend/models/Testimonial.js

const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    position: {
      type: String,
      trim: true,
      maxlength: [100, 'Le poste ne peut pas dépasser 100 caractères'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [100, 'L\'entreprise ne peut pas dépasser 100 caractères'],
    },
    avatar: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, 'La note est requise'],
      min: [1, 'La note doit être au moins 1'],
      max: [5, 'La note ne peut pas dépasser 5'],
      default: 5,
    },
    comment: {
      type: String,
      required: [true, 'Le commentaire est requis'],
      maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
testimonialSchema.index({ isActive: 1, isFeatured: 1 });
testimonialSchema.index({ product: 1, isActive: 1 });
testimonialSchema.index({ rating: -1 });
testimonialSchema.index({ createdAt: -1 });

// Static method to get featured testimonials
testimonialSchema.statics.getFeatured = function (limit = 10) {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit)
    .populate('product', 'name slug');
};

// Static method to get average rating
testimonialSchema.statics.getAverageRating = async function (productId = null) {
  const match = { isActive: true, isVerified: true };
  if (productId) {
    match.product = productId;
  }

  const result = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0 ? result[0] : { averageRating: 0, count: 0 };
};

module.exports = mongoose.model('Testimonial', testimonialSchema);
