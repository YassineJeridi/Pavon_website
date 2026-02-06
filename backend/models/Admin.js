// backend/models/Admin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  avatar: String,
  phone: String,
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  passwordChangedAt: Date, // ✅ ADDED: Track when password was changed
  passwordResetToken: String,
  passwordResetExpires: Date,
}, {
  timestamps: true,
});

// Hash password before save
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  
  // ✅ ADDED: Set passwordChangedAt when password is modified
  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure token is created after password change
  }
  
  next();
});

// Compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ✅ ADDED: Check if password was changed after JWT was issued
adminSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  
  // Password was never changed
  return false;
};

// Static method to find by credentials
adminSchema.statics.findByCredentials = async function(email, password) {
  const admin = await this.findOne({ email });
  
  if (!admin || !admin.isActive) {
    throw new Error('Email ou mot de passe incorrect');
  }
  
  const isMatch = await admin.comparePassword(password);
  
  if (!isMatch) {
    throw new Error('Email ou mot de passe incorrect');
  }
  
  return admin;
};

// Update last login
adminSchema.methods.updateLastLogin = async function() {
  this.lastLogin = new Date();
  await this.save({ validateBeforeSave: false }); // ✅ Skip validation for this update
};

module.exports = mongoose.model('Admin', adminSchema);
