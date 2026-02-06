// backend/scripts/debugProducts.js
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');
const Collection = require('../models/Collection');

const debugProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elegance');
    console.log('✅ Connected to MongoDB\n');

    // Get all collections
    const collections = await Collection.find({});
    console.log('📦 COLLECTIONS IN DATABASE:');
    console.log('=' .repeat(60));
    collections.forEach(col => {
      console.log(`ID: ${col._id}`);
      console.log(`Name: ${col.name}`);
      console.log(`Slug: ${col.slug}\n`);
    });

    // Get all products
    const products = await Product.find({});
    console.log('\n🛍️ PRODUCTS IN DATABASE:');
    console.log('=' .repeat(60));
    console.log(`Total products: ${products.length}\n`);

    // Check collection field
    const productsWithCollection = products.filter(p => p.collection);
    const productsWithoutCollection = products.filter(p => !p.collection);

    console.log(`✅ Products WITH collection: ${productsWithCollection.length}`);
    console.log(`❌ Products WITHOUT collection: ${productsWithoutCollection.length}\n`);

    // Show sample products
    console.log('📋 SAMPLE PRODUCTS:');
    console.log('=' .repeat(60));
    products.slice(0, 5).forEach(product => {
      console.log(`Product: ${product.name}`);
      console.log(`  Collection field: ${product.collection || 'NULL'}`);
      console.log(`  Categories: ${product.categories || 'NULL'}\n`);
    });

    // Count products per collection
    console.log('\n📊 PRODUCTS PER COLLECTION (using countDocuments):');
    console.log('=' .repeat(60));
    for (const collection of collections) {
      const count = await Product.countDocuments({ collection: collection._id });
      console.log(`${collection.name}: ${count} products`);
    }

    // Check for invalid collection IDs
    console.log('\n⚠️ CHECKING FOR INVALID COLLECTION IDS:');
    console.log('=' .repeat(60));
    const collectionIds = collections.map(c => c._id.toString());
    
    for (const product of products) {
      if (product.collection && !collectionIds.includes(product.collection.toString())) {
        console.log(`❌ Product "${product.name}" has invalid collection ID: ${product.collection}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

debugProducts();
