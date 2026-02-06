// backend/models/Contact.js

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email invalide',
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
      maxlength: [200, 'Le sujet ne peut pas dépasser 200 caractères'],
    },
    message: {
      type: String,
      required: [true, 'Le message est requis'],
      maxlength: [2000, 'Le message ne peut pas dépasser 2000 caractères'],
    },
    read: {
      type: Boolean,
      default: false,
    },
    replied: {
      type: Boolean,
      default: false,
    },
    replyMessage: {
      type: String,
      maxlength: [2000, 'La réponse ne peut pas dépasser 2000 caractères'],
    },
    repliedAt: {
      type: Date,
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved', 'closed'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    notes: {
      type: String,
      maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
contactSchema.index({ email: 1 });
contactSchema.index({ read: 1, createdAt: -1 });
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ createdAt: -1 });

// Pre-save middleware to set repliedAt
contactSchema.pre('save', function (next) {
  if (this.isModified('replied') && this.replied && !this.repliedAt) {
    this.repliedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Contact', contactSchema);
