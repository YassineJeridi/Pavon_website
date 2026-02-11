// backend/models/Expense.js

const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: [true, "Le libellé de la charge est requis"],
      trim: true,
      maxlength: [200, 'Le libellé ne peut pas dépasser 200 caractères'],
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
    category: {
      type: String,
      enum: {
        values: ['Matières premières', 'Livraison', 'Marketing', 'Loyer', 'Salaires', 'Autre'],
        message: 'Catégorie invalide: {VALUE}',
      },
      default: 'Autre',
    },
    customCategory: {
      type: String,
      trim: true,
      maxlength: [100, 'Le nom de catégorie ne peut pas dépasser 100 caractères'],
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
