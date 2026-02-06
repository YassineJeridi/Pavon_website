// backend/seeds/seedOrdersEnhanced.js
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Product Schema (needed for reference)
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
}, { collection: 'products' });

// Order Schema (inline for independence - matches actual Order model)
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  size: { type: String, required: true },
  color: { type: String, required: true },
  subtotal: { type: Number, required: true, min: 0 },
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'Tunisie' },
  },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true, min: 0 },
  shippingCost: { type: Number, required: true, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  total: { type: Number, required: true, min: 0 },
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
  notes: String,
  trackingNumber: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// Customer names pool (split into first and last names)
const customers = [
  { firstName: 'Amira', lastName: 'Ben Salah', email: 'amira.bensalah@gmail.com', phone: '+216 98 123 456' },
  { firstName: 'Yasmine', lastName: 'Trabelsi', email: 'yasmine.trabelsi@yahoo.fr', phone: '+216 22 345 678' },
  { firstName: 'Leila', lastName: 'Hamdi', email: 'leila.hamdi@gmail.com', phone: '+216 55 789 012' },
  { firstName: 'Sarra', lastName: 'Mejri', email: 'sarra.mejri@hotmail.com', phone: '+216 98 234 567' },
  { firstName: 'Nour', lastName: 'Gharbi', email: 'nour.gharbi@gmail.com', phone: '+216 50 456 789' },
  { firstName: 'Mariem', lastName: 'Kacem', email: 'mariem.kacem@yahoo.fr', phone: '+216 22 567 890' },
  { firstName: 'Ines', lastName: 'Bouaziz', email: 'ines.bouaziz@gmail.com', phone: '+216 98 678 901' },
  { firstName: 'Rim', lastName: 'Slimani', email: 'rim.slimani@hotmail.com', phone: '+216 55 890 123' },
  { firstName: 'Salma', lastName: 'Khedher', email: 'salma.khedher@gmail.com', phone: '+216 22 901 234' },
  { firstName: 'Dorra', lastName: 'Jemli', email: 'dorra.jemli@yahoo.fr', phone: '+216 98 012 345' },
];

// Cities pool
const cities = [
  { city: 'Tunis', postalCode: '1000', address: 'Avenue Habib Bourguiba' },
  { city: 'Sfax', postalCode: '3000', address: 'Rue de la République' },
  { city: 'Sousse', postalCode: '4000', address: 'Avenue Mohamed V' },
  { city: 'Bizerte', postalCode: '7000', address: 'Boulevard Habib Thameur' },
  { city: 'Gabès', postalCode: '6000', address: 'Rue Farhat Hached' },
  { city: 'Ariana', postalCode: '2080', address: 'Avenue de la Liberté' },
  { city: 'La Marsa', postalCode: '2070', address: 'Corniche de la Marsa' },
];

// Statuses with weights for realistic distribution (using actual Order model statuses)
const statuses = [
  { status: 'done', weight: 0.4 },
  { status: 'on delivery', weight: 0.25 },
  { status: 'en attente', weight: 0.3 },
  { status: 'cancelled', weight: 0.05 },
];

const getRandomStatus = () => {
  const rand = Math.random();
  let cumulative = 0;
  for (const item of statuses) {
    cumulative += item.weight;
    if (rand < cumulative) return item.status;
  }
  return 'delivered';
};

const generateOrders = (products, count = 150) => {
  if (products.length === 0) return [];

  const orders = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    // Distribute orders over last 90 days (weighted towards recent dates)
    const daysAgo = Math.floor(Math.random() * Math.random() * 90);
    const orderDate = new Date(today);
    orderDate.setDate(orderDate.getDate() - daysAgo);
    
    // Random customer
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const location = cities[Math.floor(Math.random() * cities.length)];
    
    // Random 1-3 items
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let subtotal = 0;
    
    for (let j = 0; j < itemCount; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 2) + 1;
      const price = product.price || (Math.random() * 200 + 50);
      const itemSubtotal = price * quantity;
      
      items.push({
        product: product._id,
        name: product.name,
        image: product.images && product.images[0] ? product.images[0] : '/default-product.jpg',
        quantity,
        size: ['XS', 'S', 'M', 'L', 'XL'][Math.floor(Math.random() * 5)],
        color: ['Noir', 'Blanc', 'Rouge', 'Bleu', 'Rose'][Math.floor(Math.random() * 5)],
        price: parseFloat(price.toFixed(2)),
        subtotal: parseFloat(itemSubtotal.toFixed(2)),
      });
      
      subtotal += itemSubtotal;
    }
    
    const shippingCost = location.city === 'Tunis' ? 7.0 : 10.0;
    const discount = 0;
    const total = subtotal + shippingCost - discount;
    
    const status = getRandomStatus();
    const paymentStatus = status === 'done' ? 'paid' : 
                         status === 'cancelled' ? 'failed' : 'pending';
    
    orders.push({
      orderNumber: `ORD-2026-${String(i + 1).padStart(4, '0')}`,
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      },
      shippingAddress: {
        address: `${Math.floor(Math.random() * 100) + 1} ${location.address}`,
        city: location.city,
        postalCode: location.postalCode,
        country: 'Tunisie',
      },
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shippingCost,
      discount,
      total: parseFloat(total.toFixed(2)),
      status,
      paymentMethod: ['cash_on_delivery', 'credit_card', 'bank_transfer', 'mobile_payment'][Math.floor(Math.random() * 4)],
      paymentStatus,
      trackingNumber: (status === 'on delivery' || status === 'done')
        ? `TN2026${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}` 
        : undefined,
      createdAt: orderDate,
      updatedAt: orderDate,
    });
  }
  
  return orders.sort((a, b) => a.createdAt - b.createdAt);
};

const seedOrders = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elegance';
    
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Fetch products
    const products = await Product.find({});
    
    if (products.length === 0) {
      console.log('\n⚠️  No products found! Please run seed:products first.\n');
      process.exit(1);
    }

    console.log(`📦 Found ${products.length} products`);

    // Generate 150 orders spanning 90 days
    const orders = generateOrders(products, 150);

    // Clear existing orders
    await Order.deleteMany({});
    console.log('🗑️  Cleared existing orders');

    // Insert new orders
    const created = await Order.insertMany(orders);
    console.log(`✅ ${created.length} orders created successfully!`);

    // Calculate stats
    const statusCounts = {};
    statuses.forEach(s => statusCounts[s.status] = 0);
    created.forEach(o => statusCounts[o.status]++);
    
    const totalRevenue = created
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    console.log('\n📊 Orders Summary:');
    console.log(`   - Total Orders: ${created.length}`);
    console.log(`   - En attente: ${statusCounts['en attente']}`);
    console.log(`   - On delivery: ${statusCounts['on delivery']}`);
    console.log(`   - Done: ${statusCounts.done}`);
    console.log(`   - Cancelled: ${statusCounts.cancelled}`);
    console.log(`   - Total Revenue: ${totalRevenue.toFixed(2)} TND`);
    console.log(`   - Average Order: ${(totalRevenue / (created.length - statusCounts.cancelled)).toFixed(2)} TND`);
    
    // Show last 7 days revenue
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = created.filter(o => o.createdAt >= sevenDaysAgo && o.status !== 'cancelled');
    const recentRevenue = recentOrders.reduce((sum, o) => sum + o.total, 0);
    
    console.log('\n📈 Last 7 Days:');
    console.log(`   - Orders: ${recentOrders.length}`);
    console.log(`   - Revenue: ${recentRevenue.toFixed(2)} TND`);

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
