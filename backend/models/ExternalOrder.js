// backend/models/ExternalOrder.js

const mongoose = require('mongoose');

const externalOrderSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: [true, 'La source de la commande est requise'],
      enum: {
        values: ['Facebook', 'Instagram', 'WhatsApp', 'Direct Contact', 'Other'],
        message: 'Source invalide: {VALUE}',
      },
    },
    amount: {
      type: Number,
      required: [true, 'Le montant est requis'],
      min: [0, 'Le montant doit être positif'],
    },
    date: {
      type: Date,
      required: [true, 'La date est requise'],
      default: Date.now,
    },
    customerName: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
externalOrderSchema.index({ date: -1 });
externalOrderSchema.index({ source: 1 });
externalOrderSchema.index({ customerName: 1 });

module.exports = mongoose.model('ExternalOrder', externalOrderSchema);
