// backend/scripts/createAdmin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },  // ✅ Required
  lastName: { type: String, required: true },   // ✅ Required
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

const adminData = {
  firstName: 'Admin',        // ✅ Added
  lastName: 'Pavone Collection',      // ✅ Added
  email: 'admin@elegance.tn',
  password: 'Admin@123456',
  role: 'super_admin',
};

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elegance');
    
    // Delete existing admin first
    await Admin.deleteOne({ email: adminData.email });
    
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    
    const admin = await Admin.create({
      ...adminData,
      password: hashedPassword,
    });
    
    console.log('\n✅ Admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Name:', `${admin.firstName} ${admin.lastName}`);
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('🎖️  Role:', admin.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Login: http://localhost:5173/dashboard/login');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
