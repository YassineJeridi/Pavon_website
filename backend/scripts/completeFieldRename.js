// backend/scripts/completeFieldRename.js
const mongoose = require('mongoose');
require('dotenv').config();

const completeRename = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elegance');
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Check current state
    const withOldField = await productsCollection.countDocuments({ collection: { $exists: true } });
    const withNewField = await productsCollection.countDocuments({ productCollection: { $exists: true } });

    console.log(`📊 Current state:`);
    console.log(`  - Products with 'collection' field: ${withOldField}`);
    console.log(`  - Products with 'productCollection' field: ${withNewField}\n`);

    if (withOldField > 0) {
      console.log('🔄 Renaming field from "collection" to "productCollection"...');
      
      const result = await productsCollection.updateMany(
        { collection: { $exists: true } },
        { $rename: { collection: 'productCollection' } }
      );

      console.log(`✅ Renamed field in ${result.modifiedCount} documents\n`);
    } else {
      console.log('✅ Field already renamed!\n');
    }

    // Verify final state
    const finalCount = await productsCollection.countDocuments({ productCollection: { $exists: true } });
    console.log(`📊 Final state:`);
    console.log(`  - Products with 'productCollection' field: ${finalCount}\n`);

    // Show sample product
    const sampleProduct = await productsCollection.findOne({ productCollection: { $exists: true } });
    if (sampleProduct) {
      console.log(`📋 Sample product:`);
      console.log(`  - Name: ${sampleProduct.name}`);
      console.log(`  - productCollection: ${sampleProduct.productCollection}\n`);
    }

    // Count products per collection
    const Product = require('../models/Product');
    const Collection = require('../models/Collection');
    
    const collections = await Collection.find({});
    console.log('📊 PRODUCTS PER COLLECTION (after fix):');
    console.log('=' .repeat(60));
    
    for (const collection of collections) {
      const count = await productsCollection.countDocuments({ productCollection: collection._id });
      console.log(`  ${collection.name}: ${count} products`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

completeRename();
