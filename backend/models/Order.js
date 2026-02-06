// backend/models/Order.js

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    customer: {
      firstName: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'L\'email est requis'],
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: [true, 'Le téléphone est requis'],
        trim: true,
      },
    },
    shippingAddress: {
      address: {
        type: String,
        required: [true, 'L\'adresse est requise'],
      },
      city: {
        type: String,
        required: [true, 'La ville est requise'],
      },
      postalCode: {
        type: String,
        required: [true, 'Le code postal est requis'],
      },
      country: {
        type: String,
        default: 'Tunisie',
      },
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'La commande doit contenir au moins un article',
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cash_on_delivery', 'credit_card', 'bank_transfer', 'mobile_payment'],
      default: 'cash_on_delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['en attente', 'on delivery', 'done', 'cancelled'],
      default: 'en attente',
    },
    notes: {
      type: String,
      maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères'],
    },
    trackingNumber: {
      type: String,
      trim: true,
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        comment: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Admin',
        },
      },
    ],
    cancelledAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes (orderNumber already indexed via unique: true)
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderNumber = `EL${year}${month}${random}`;
  }
  next();
});

// Pre-save middleware to add status history
orderSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      updatedAt: new Date(),
    });

    // Set status timestamps
    if (this.status === 'cancelled') {
      this.cancelledAt = new Date();
    } else if (this.status === 'on delivery') {
      this.shippedAt = new Date();
    } else if (this.status === 'done') {
      this.deliveredAt = new Date();
      this.paymentStatus = 'paid';
    }
  }
  next();
});

// Instance method to calculate totals
orderSchema.methods.calculateTotals = function () {
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.total = this.subtotal + this.shippingCost - this.discount;
  return this;
};

// Static method to get order statistics
orderSchema.statics.getStats = async function (startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$total' },
        averageOrderValue: { $avg: '$total' },
      },
    },
  ]);
};

module.exports = mongoose.model('Order', orderSchema);
