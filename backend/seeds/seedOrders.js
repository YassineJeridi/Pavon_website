// backend/seeds/seedOrders.js
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

// Order Schema (inline for independence)
const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: {
      type: String,
      default: 'Tunisie',
    },
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    name: String,
    quantity: Number,
    size: String,
    color: String,
    price: Number,
  }],
  subtotal: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    default: 7.0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'card', 'transfer'],
    default: 'cash_on_delivery',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  notes: String,
  trackingNumber: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Register models
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

const generateOrders = (productIds) => {
  if (productIds.length === 0) return [];

  return [
    {
      orderNumber: 'ORD-2026-001',
      customer: {
        name: 'Amira Ben Salah',
        email: 'amira.bensalah@gmail.com',
        phone: '+216 98 123 456',
      },
      shippingAddress: {
        address: '15 Avenue Habib Bourguiba',
        city: 'Tunis',
        postalCode: '1000',
        country: 'Tunisie',
      },
      items: [
        {
          product: productIds[0],
          name: 'Robe Fleurie Printemps',
          quantity: 1,
          size: 'M',
          color: 'Rose',
          price: 129.90,
        },
        {
          product: productIds[5],
          name: 'Sac à Main Cuir Premium',
          quantity: 1,
          size: 'Unique',
          color: 'Noir',
          price: 189.90,
        },
      ],
      subtotal: 319.80,
      shippingCost: 7.0,
      tax: 0,
      totalAmount: 326.80,
      status: 'delivered',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'paid',
      trackingNumber: 'TN2026001234',
      createdAt: new Date('2026-01-15'),
    },
    {
      orderNumber: 'ORD-2026-002',
      customer: {
        name: 'Yasmine Trabelsi',
        email: 'yasmine.trabelsi@yahoo.fr',
        phone: '+216 22 345 678',
      },
      shippingAddress: {
        address: '42 Rue de la République',
        city: 'Sfax',
        postalCode: '3000',
        country: 'Tunisie',
      },
      items: [
        {
          product: productIds[3],
          name: 'Robe de Soirée Longue',
          quantity: 1,
          size: 'S',
          color: 'Noir',
          price: 249.90,
        },
        {
          product: productIds[8],
          name: 'Escarpins Classiques',
          quantity: 1,
          size: '37',
          color: 'Noir',
          price: 139.90,
        },
      ],
      subtotal: 389.80,
      shippingCost: 10.0,
      tax: 0,
      totalAmount: 399.80,
      status: 'shipped',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending',
      trackingNumber: 'TN2026001235',
      createdAt: new Date('2026-01-20'),
    },
    {
      orderNumber: 'ORD-2026-003',
      customer: {
        name: 'Leila Hamdi',
        email: 'leila.hamdi@gmail.com',
        phone: '+216 55 789 012',
      },
      shippingAddress: {
        address: '28 Avenue Mohamed V',
        city: 'Sousse',
        postalCode: '4000',
        country: 'Tunisie',
      },
      items: [
        {
          product: productIds[1],
          name: 'Blouse Élégante Dentelle',
          quantity: 2,
          size: 'M',
          color: 'Blanc',
          price: 89.90,
        },
        {
          product: productIds[2],
          name: 'Jupe Midi Plissée',
          quantity: 1,
          size: 'M',
          color: 'Noir',
          price: 79.90,
        },
      ],
      subtotal: 259.70,
      shippingCost: 7.0,
      tax: 0,
      totalAmount: 266.70,
      status: 'processing',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending',
      createdAt: new Date('2026-01-22'),
    },
    {
      orderNumber: 'ORD-2026-004',
      customer: {
        name: 'Sarra Mejri',
        email: 'sarra.mejri@outlook.com',
        phone: '+216 94 567 890',
      },
      shippingAddress: {
        address: '12 Rue Ibn Khaldoun',
        city: 'Ariana',
        postalCode: '2080',
        country: 'Tunisie',
      },
      items: [
        {
          product: productIds[4],
          name: 'Top Casual Été',
          quantity: 3,
          size: 'L',
          color: 'Blanc',
          price: 49.90,
        },
        {
          product: productIds[9],
          name: 'Sandales Été Confort',
          quantity: 1,
          size: '38',
          color: 'Beige',
          price: 69.90,
        },
      ],
      subtotal: 219.60,
      shippingCost: 7.0,
      tax: 0,
      totalAmount: 226.60,
      status: 'delivered',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'paid',
      trackingNumber: 'TN2026001236',
      createdAt: new Date('2026-01-18'),
    },
    {
      orderNumber: 'ORD-2026-005',
      customer: {
        name: 'Nour Gharbi',
        email: 'nour.gharbi@gmail.com',
        phone: '+216 26 432 109',
      },
      shippingAddress: {
        address: '67 Avenue de Carthage',
        city: 'Tunis',
        postalCode: '1000',
        country: 'Tunisie',
      },
      items: [
        {
          product: productIds[10],
          name: 'Ensemble Sport Femme',
          quantity: 1,
          size: 'M',
          color: 'Noir',
          price: 99.90,
        },
        {
          product: productIds[11],
          name: 'Baskets Running Femme',
          quantity: 1,
          size: '39',
          color: 'Blanc/Rose',
          price: 119.90,
        },
      ],
      subtotal: 219.80,
      shippingCost: 0, // Free shipping
      tax: 0,
      totalAmount: 219.80,
      status: 'pending',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending',
      notes: 'Livraison express demandée',
      createdAt: new Date('2026-01-24'),
    },
    {
      orderNumber: 'ORD-2026-006',
      customer: {
        name: 'Mariem Kacem',
        email: 'mariem.kacem@gmail.com',
        phone: '+216 98 765 432',
      },
      shippingAddress: {
        address: '33 Rue de France',
        city: 'Bizerte',
        postalCode: '7000',
        country: 'Tunisie',
      },
      items: [
        {
          product: productIds[6],
          name: 'Foulard Soie Imprimé',
          quantity: 2,
          size: '90x90cm',
          color: 'Multicolore',
          price: 39.90,
        },
        {
          product: productIds[7],
          name: 'Ceinture Cuir Élégante',
          quantity: 1,
          size: '85cm',
          color: 'Noir',
          price: 59.90,
        },
      ],
      subtotal: 139.70,
      shippingCost: 10.0,
      tax: 0,
      totalAmount: 149.70,
      status: 'processing',
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending',
      createdAt: new Date('2026-01-23'),
    },
  ];
};

const seedOrders = async () => {
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
    const orders = generateOrders(productIds);

    // Clear existing orders
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing orders');

    // Insert new orders
    const created = await Order.insertMany(orders);
    console.log(`✅ ${created.length} orders created successfully!`);

    console.log('\n📊 Orders Summary:');
    console.log(`   - Total Orders: ${created.length}`);
    console.log(`   - Pending: ${created.filter(o => o.status === 'pending').length}`);
    console.log(`   - Processing: ${created.filter(o => o.status === 'processing').length}`);
    console.log(`   - Shipped: ${created.filter(o => o.status === 'shipped').length}`);
    console.log(`   - Delivered: ${created.filter(o => o.status === 'delivered').length}`);
    console.log(`   - Total Revenue: ${created.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)} TND`);
    
    console.log('\n📋 Created Orders:');
    created.forEach((order, i) => {
      console.log(`   ${i + 1}. ${order.orderNumber} - ${order.customer.name}`);
      console.log(`      Status: ${order.status} | Total: ${order.totalAmount} TND`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding orders:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedOrders();
