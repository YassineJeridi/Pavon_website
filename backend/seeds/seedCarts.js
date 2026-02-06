// backend/seeds/seedCarts.js
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Product Schema (needed for reference)
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  // ... minimal schema just for reference
}, { collection: 'products' });

// Cart Schema (inline for independence)
const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    size: String,
    color: String,
    price: Number,
  }],
  totalAmount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 7*24*60*60*1000), // 7 days
  },
});

// Register models
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);

const generateCarts = (productIds) => {
  if (productIds.length === 0) return [];

  return [
    {
      sessionId: 'guest_session_001',
      items: [
        {
          product: productIds[0],
          quantity: 2,
          size: 'M',
          color: 'Rose',
          price: 129.90,
        },
        {
          product: productIds[5],
          quantity: 1,
          size: 'Unique',
          color: 'Noir',
          price: 189.90,
        },
      ],
      totalAmount: 449.70,
    },
    {
      sessionId: 'guest_session_002',
      items: [
        {
          product: productIds[1],
          quantity: 1,
          size: 'L',
          color: 'Blanc',
          price: 89.90,
        },
      ],
      totalAmount: 89.90,
    },
    {
      sessionId: 'guest_session_003',
      items: [
        {
          product: productIds[3],
          quantity: 1,
          size: 'M',
          color: 'Rouge',
          price: 249.90,
        },
        {
          product: productIds[8],
          quantity: 1,
          size: '38',
          color: 'Noir',
          price: 139.90,
        },
      ],
      totalAmount: 389.80,
    },
  ];
};

const seedCarts = async () => {
  try {
    // Get MongoDB URI with fallback
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elegance';
    
    console.log('🔌 Connecting to MongoDB...');
    console.log(`   URI: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Fetch product IDs
    const products = await Product.find({}).limit(15);
    
    if (products.length === 0) {
      console.log('\n⚠️  No products found! Please run seed:products first.\n');
      process.exit(1);
    }

    const productIds = products.map(p => p._id);
    const carts = generateCarts(productIds);

    // Clear existing carts
    await Cart.deleteMany({});
    console.log('🗑️  Cleared existing carts');

    // Insert new carts
    const created = await Cart.insertMany(carts);
    console.log(`✅ ${created.length} carts created successfully!`);

    console.log('\n📊 Carts Summary:');
    console.log(`   - Total Carts: ${created.length}`);
    console.log(`   - Total Items: ${created.reduce((sum, c) => sum + c.items.length, 0)}`);
    console.log(`   - Total Value: ${created.reduce((sum, c) => sum + c.totalAmount, 0).toFixed(2)} TND`);
    
    console.log('\n📋 Created Carts:');
    created.forEach((cart, i) => {
      console.log(`   ${i + 1}. Session: ${cart.sessionId}`);
      console.log(`      Items: ${cart.items.length} | Total: ${cart.totalAmount} TND`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding carts:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedCarts();
