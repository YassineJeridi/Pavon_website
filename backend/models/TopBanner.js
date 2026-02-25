// backend/models/TopBanner.js
const mongoose = require('mongoose');

const topBannerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Le texte de la bannière est requis'],
      trim: true,
      maxlength: [200, 'Le texte ne peut pas dépasser 200 caractères'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TopBanner', topBannerSchema);
