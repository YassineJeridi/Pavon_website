// backend/seeds/seedOrdersFixed.js
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Import actual models
const Order = require('../models/Order');
const Product = require('../models/Product');

const generateOrders = (products) => {
    if (products.length === 0) return [];

    const getRandomProducts = (count) => {
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    return [
        {
            orderNumber: 'ORD-2026-001',
            customer: {
                firstName: 'Amira',
                lastName: 'Ben Salah',
                email: 'amira.bensalah@gmail.com',
                phone: '+216 98 123 456',
            },
            shippingAddress: {
                address: '15 Avenue Habib Bourguiba',
                city: 'Tunis',
                postalCode: '1000',
                country: 'Tunisie',
            },
            items: getRandomProducts(2).map(p => ({
                product: p._id,
                name: p.name,
                image: p.images?.[0] || '/placeholder.jpg',
                price: p.price,
                quantity: 1,
                size: p.sizes?.[0] || 'M',
                color: p.colors?.[0] || 'Noir',
                subtotal: p.price,
            })),
            subtotal: 0,
            shippingCost: 7.0,
            tax: 0,
            total: 0,
            status: 'delivered',
            paymentMethod: 'cash_on_delivery',
            paymentStatus: 'paid',
            trackingNumber: 'TN2026001234',
            createdAt: new Date('2026-01-15'),
        },
        {
            orderNumber: 'ORD-2026-002',
            customer: {
                firstName: 'Yasmine',
                lastName: 'Trabelsi',
                email: 'yasmine.trabelsi@yahoo.fr',
                phone: '+216 22 345 678',
            },
            shippingAddress: {
                address: '42 Rue de la République',
                city: 'Sfax',
                postalCode: '3000',
                country: 'Tunisie',
            },
            items: getRandomProducts(2).map(p => ({
                product: p._id,
                name: p.name,
                image: p.images?.[0] || '/placeholder.jpg',
                price: p.price,
                quantity: 1,
                size: p.sizes?.[0] || 'S',
                color: p.colors?.[0] || 'Noir',
                subtotal: p.price,
            })),
            subtotal: 0,
            shippingCost: 10.0,
            tax: 0,
            total: 0,
            status: 'shipped',
            paymentMethod: 'cash_on_delivery',
            paymentStatus: 'pending',
            trackingNumber: 'TN2026001235',
            createdAt: new Date('2026-01-20'),
        },
        {
            orderNumber: 'ORD-2026-003',
            customer: {
                firstName: 'Leila',
                lastName: 'Hamdi',
                email: 'leila.hamdi@gmail.com',
                phone: '+216 55 789 012',
            },
            shippingAddress: {
                address: '28 Avenue Mohamed V',
                city: 'Sousse',
                postalCode: '4000',
                country: 'Tunisie',
            },
            items: getRandomProducts(3).map(p => ({
                product: p._id,
                name: p.name,
                image: p.images?.[0] || '/placeholder.jpg',
                price: p.price,
                quantity: Math.floor(Math.random() * 2) + 1,
                size: p.sizes?.[0] || 'M',
                color: p.colors?.[0] || 'Blanc',
                subtotal: p.price * (Math.floor(Math.random() * 2) + 1),
            })),
            subtotal: 0,
            shippingCost: 7.0,
            tax: 0,
            total: 0,
            status: 'processing',
            paymentMethod: 'cash_on_delivery',
            paymentStatus: 'pending',
            createdAt: new Date('2026-01-22'),
        },
        {
            orderNumber: 'ORD-2026-004',
            customer: {
                firstName: 'Sarra',
                lastName: 'Mejri',
                email: 'sarra.mejri@outlook.com',
                phone: '+216 94 567 890',
            },
            shippingAddress: {
                address: '12 Rue Ibn Khaldoun',
                city: 'Ariana',
                postalCode: '2080',
                country: 'Tunisie',
            },
            items: getRandomProducts(2).map(p => ({
                product: p._id,
                name: p.name,
                image: p.images?.[0] || '/placeholder.jpg',
                price: p.price,
                quantity: 1,
                size: p.sizes?.[0] || 'L',
                color: p.colors?.[0] || 'Blanc',
                subtotal: p.price,
            })),
            subtotal: 0,
            shippingCost: 7.0,
            tax: 0,
            total: 0,
            status: 'delivered',
            paymentMethod: 'cash_on_delivery',
            paymentStatus: 'paid',
            trackingNumber: 'TN2026001236',
            createdAt: new Date('2026-01-18'),
        },
        {
            orderNumber: 'ORD-2026-005',
            customer: {
                firstName: 'Nour',
                lastName: 'Gharbi',
                email: 'nour.gharbi@gmail.com',
                phone: '+216 26 432 109',
            },
            shippingAddress: {
                address: '67 Avenue de Carthage',
                city: 'Tunis',
                postalCode: '1000',
                country: 'Tunisie',
            },
            items: getRandomProducts(2).map(p => ({
                product: p._id,
                name: p.name,
                image: p.images?.[0] || '/placeholder.jpg',
                price: p.price,
                quantity: 1,
                size: p.sizes?.[0] || 'M',
                color: p.colors?.[0] || 'Noir',
                subtotal: p.price,
            })),
            subtotal: 0,
            shippingCost: 0,
            tax: 0,
            total: 0,
            status: 'pending',
            paymentMethod: 'cash_on_delivery',
            paymentStatus: 'pending',
            notes: 'Livraison express demandée',
            createdAt: new Date('2026-01-24'),
        },
        {
            orderNumber: 'ORD-2026-006',
            customer: {
                firstName: 'Mariem',
                lastName: 'Kacem',
                email: 'mariem.kacem@gmail.com',
                phone: '+216 98 765 432',
            },
            shippingAddress: {
                address: '33 Rue de France',
                city: 'Bizerte',
                postalCode: '7000',
                country: 'Tunisie',
            },
            items: getRandomProducts(2).map(p => ({
                product: p._id,
                name: p.name,
                image: p.images?.[0] || '/placeholder.jpg',
                price: p.price,
                quantity: 2,
                size: p.sizes?.[0] || '90x90cm',
                color: p.colors?.[0] || 'Multicolore',
                subtotal: p.price * 2,
            })),
            subtotal: 0,
            shippingCost: 10.0,
            tax: 0,
            total: 0,
            status: 'processing',
            paymentMethod: 'cash_on_delivery',
            paymentStatus: 'pending',
            createdAt: new Date('2026-01-23'),
        },
        {
            orderNumber: 'ORD-2026-007',
            customer: {
                firstName: 'Ines',
                lastName: 'Bouazizi',
                email: 'ines.bouazizi@gmail.com',
                phone: '+216 27 654 321',
            },
            shippingAddress: {
                address: '89 Boulevard 7 Novembre',
                city: 'Tunis',
                postalCode: '1002',
                country: 'Tunisie',
            },
            items: getRandomProducts(3).map((p, i) => ({
                product: p._id,
                name: p.name,
                image: p.images?.[0] || '/placeholder.jpg',
                price: p.price,
                quantity: i === 0 ? 2 : 1,
                size: p.sizes?.[0] || 'M',
                color: p.colors?.[0] || 'Rose',
                subtotal: p.price * (i === 0 ? 2 : 1),
            })),
            subtotal: 0,
            shippingCost: 0,
            tax: 0,
            total: 0,
            status: 'shipped',
            paymentMethod: 'credit_card',
            paymentStatus: 'paid',
            trackingNumber: 'TN2026001237',
            createdAt: new Date('2026-01-21'),
        },
        {
            orderNumber: 'ORD-2026-008',
            customer: {
                firstName: 'Salma',
                lastName: 'Jendoubi',
                email: 'salma.jendoubi@yahoo.fr',
                phone: '+216 99 876 543',
            },
            shippingAddress: {
                address: '44 Rue de Marseille',
                city: 'Nabeul',
                postalCode: '8000',
                country: 'Tunisie',
            },
            items: getRandomProducts(1).map(p => ({
                product: p._id,
                name: p.name,
                image: p.images?.[0] || '/placeholder.jpg',
                price: p.price,
                quantity: 1,
                size: p.sizes?.[0] || 'S',
                color: p.colors?.[0] || 'Bleu',
                subtotal: p.price,
            })),
            subtotal: 0,
            shippingCost: 10.0,
            tax: 0,
            total: 0,
            status: 'cancelled',
            paymentMethod: 'cash_on_delivery',
            paymentStatus: 'pending',
            notes: 'Client a annulé',
            createdAt: new Date('2026-01-19'),
        },
    ].map(order => {
        // Calculate totals
        const subtotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);
        order.subtotal = subtotal;
        order.total = subtotal + order.shippingCost + order.tax;
        return order;
    });
};

const seedOrders = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elegance';

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected');

        // Fetch products
        const products = await Product.find({}).limit(20);

        if (products.length === 0) {
            console.log('\n⚠️  No products found! Please run seedProducts first.\n');
            process.exit(1);
        }

        console.log(`📦 Found ${products.length} products`);

        const orders = generateOrders(products);

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
        console.log(`   - Cancelled: ${created.filter(o => o.status === 'cancelled').length}`);
        console.log(`   - Total Revenue: ${created.reduce((sum, o) => sum + o.total, 0).toFixed(2)} TND`);

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
