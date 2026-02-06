// backend/scripts/convertToObjectIds.js
const mongoose = require('mongoose');
require('dotenv').config();

const convertToObjectIds = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elegance');
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    const products = await productsCollection.find({}).toArray();
    console.log(`📦 Found ${products.length} products to fix\n`);

    let fixedCount = 0;

    for (const product of products) {
      const updates = {};
      let needsUpdate = false;

      // Convert productCollection to ObjectId if it's a string
      if (product.productCollection && typeof product.productCollection === 'string') {
        updates.productCollection = new mongoose.Types.ObjectId(product.productCollection);
        needsUpdate = true;
        console.log(`🔧 Converting productCollection for "${product.name}"`);
      }

      // Convert categories to ObjectId array if they're strings
      if (product.categories && Array.isArray(product.categories)) {
        const hasStringIds = product.categories.some(cat => typeof cat === 'string');
        if (hasStringIds) {
          updates.categories = product.categories.map(cat => 
            typeof cat === 'string' ? new mongoose.Types.ObjectId(cat) : cat
          );
          needsUpdate = true;
          console.log(`🔧 Converting categories for "${product.name}"`);
        }
      }

      if (needsUpdate) {
        await productsCollection.updateOne(
          { _id: product._id },
          { $set: updates }
        );
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

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

convertToObjectIds();
