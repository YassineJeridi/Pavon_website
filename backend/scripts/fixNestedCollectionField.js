// backend/scripts/fixNestedCollectionField.js
const mongoose = require('mongoose');
require('dotenv').config();

const fixNestedField = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elegance');
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Get all products
    const products = await productsCollection.find({}).toArray();
    console.log(`📦 Found ${products.length} products\n`);

    let fixedCount = 0;

    for (const product of products) {
      let needsUpdate = false;
      const updates = {};

      // Check productCollection field
      if (product.productCollection) {
        // If it's an object (not a string/ObjectId), extract the _id
        if (typeof product.productCollection === 'object' && product.productCollection._id) {
          console.log(`🔧 Fixing "${product.name}": ${JSON.stringify(product.productCollection)} → ${product.productCollection._id}`);
          updates.productCollection = product.productCollection._id;
          needsUpdate = true;
        }
      }

      // Also check if old 'collection' field still exists
      if (product.collection) {
        if (typeof product.collection === 'object' && product.collection._id) {
          console.log(`🔧 Migrating old 'collection' field for "${product.name}"`);
          updates.productCollection = product.collection._id;
          updates.$unset = { collection: '' };
          needsUpdate = true;
        } else if (typeof product.collection === 'string' || mongoose.Types.ObjectId.isValid(product.collection)) {
          console.log(`🔧 Moving 'collection' to 'productCollection' for "${product.name}"`);
          updates.productCollection = product.collection;
          updates.$unset = { collection: '' };
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        if (updates.$unset) {
          await productsCollection.updateOne(
            { _id: product._id },
            { $set: { productCollection: updates.productCollection }, $unset: updates.$unset }
          );
        } else {
          await productsCollection.updateOne(
            { _id: product._id },
            { $set: updates }
          );
        }
        fixedCount++;
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} products!\n`);

    // Verify
    const Product = require('../models/Product');
    const Collection = require('../models/Collection');
    
    const collections = await Collection.find({});
    console.log('📊 PRODUCTS PER COLLECTION (after fix):');
    console.log('=' .repeat(60));
    
    for (const collection of collections) {
      const count = await Product.countDocuments({ productCollection: collection._id });
      console.log(`  ${collection.name}: ${count} products`);
    }

    // Show sample
    const sampleProducts = await productsCollection.find({}).limit(3).toArray();
    console.log('\n📋 SAMPLE PRODUCTS (after fix):');
    console.log('=' .repeat(60));
    sampleProducts.forEach(p => {
      console.log(`Product: ${p.name}`);
      console.log(`  productCollection: ${p.productCollection} (type: ${typeof p.productCollection})`);
      console.log(`  collection field exists: ${!!p.collection}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixNestedField();
