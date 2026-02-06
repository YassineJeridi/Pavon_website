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

// Only one banner can be active at a time
topBannerSchema.pre('save', async function(next) {
  if (this.isActive) {
    await this.constructor.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isActive: false } }
    );
  }
  next();
});

module.exports = mongoose.model('TopBanner', topBannerSchema);
