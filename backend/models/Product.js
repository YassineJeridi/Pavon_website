// backend/models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du produit est requis'],
      trim: true,
      maxlength: [200, 'Le nom ne peut pas dépasser 200 caractères'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La description est requise'],
      maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères'],
    },
    price: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    comparePrice: {
      type: Number,
      min: [0, 'Le prix de comparaison ne peut pas être négatif'],
      default: null,
    },
    images: {
      type: [String],
      required: false,
      default: [],
    },
    // ✅ CHANGED: Multiple categories (array)
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    // ✅ CHANGED: Single collection (not array)
      productCollection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection',
        default: null,
      },
    sizes: {
      type: [String],
      required: [true, 'Au moins une taille est requise'],
      enum: {
        values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', 
                 '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '52', '54'],
        message: "{VALUE} n'est pas une taille valide",
      },
    },
    colors: {
      type: [String],
      required: [true, 'Au moins une couleur est requise'],
    },
    stock: {
      type: Number,
      required: [true, 'Le stock est requis'],
      min: [0, 'Le stock ne peut pas être négatif'],
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    materials: [
      {
        type: String,
        trim: true,
      },
    ],
    careInstructions: {
      type: String,
      maxlength: [500, "Les instructions d'entretien ne peuvent pas dépasser 500 caractères"],
    },
    weight: {
      type: Number,
      min: [0, 'Le poids ne peut pas être négatif'],
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: [0, 'La note ne peut pas être négative'],
        max: [5, 'La note ne peut pas dépasser 5'],
      },
      count: {
        type: Number,
        default: 0,
        min: [0, "Le nombre d'avis ne peut pas être négatif"],
      },
    },
    views: {
      type: Number,
      default: 0,
      min: [0, 'Le nombre de vues ne peut pas être négatif'],
    },
    soldCount: {
      type: Number,
      default: 0,
      min: [0, 'Le nombre de ventes ne peut pas être négatif'],
    },
    seo: {
      metaTitle: {
        type: String,
        maxlength: [60, 'Le meta titre ne peut pas dépasser 60 caractères'],
      },
      metaDescription: {
        type: String,
        maxlength: [160, 'La meta description ne peut pas dépasser 160 caractères'],
      },
      metaKeywords: [String],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ✅ UPDATED: Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ categories: 1, isActive: 1 }); // Changed from category to categories
productSchema.index({ productCollection: 1, isActive: 1 }); // Changed from collections to collection
productSchema.index({ featured: 1, isActive: 1 });
productSchema.index({ bestseller: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ soldCount: -1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0) return 'out_of_stock';
  if (this.stock <= 5) return 'low_stock';
  return 'in_stock';
});

// Pre-save middleware to generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Static method to search products
productSchema.statics.searchProducts = function (query) {
  return this.find({ $text: { $search: query }, isActive: true });
};

// Instance method to increment views
productSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Instance method to check availability
productSchema.methods.isAvailable = function (quantity = 1) {
  return this.isActive && this.stock >= quantity;
};

module.exports = mongoose.model('Product', productSchema);
