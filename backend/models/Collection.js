// backend/models/Collection.js

const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom de la collection est requis'],
      unique: true,
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [500, 'La description ne peut pas dépasser 500 caractères'],
    },
    image: {
      type: String,
    },
    // ✅ NEW FIELD - For homepage display
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // ✅ NEW FIELD - To hide/show collections
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

// Indexes (slug already indexed via unique: true)
collectionSchema.index({ isActive: 1 });
collectionSchema.index({ isFeatured: 1, isActive: 1 });

// Generate slug before saving
collectionSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[éèê]/g, 'e')
      .replace(/[àâ]/g, 'a')
      .replace(/[ùû]/g, 'u')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Static method to get featured collections
collectionSchema.statics.getFeatured = function (limit = 6) {
  return this.find({ isActive: true, isFeatured: true })
    .sort({ order: 1, createdAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Collection', collectionSchema);
