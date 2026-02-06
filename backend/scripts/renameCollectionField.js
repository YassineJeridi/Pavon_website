// backend/scripts/renameCollectionField.js
const mongoose = require('mongoose');
require('dotenv').config();

const renameField = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elegance');
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    // Rename field from 'collection' to 'productCollection'
    const result = await productsCollection.updateMany(
      { collection: { $exists: true } },
      { $rename: { collection: 'productCollection' } }
    );

    console.log(`✅ Renamed field in ${result.modifiedCount} documents`);

    // Verify
    const count = await productsCollection.countDocuments({ productCollection: { $exists: true } });
    console.log(`✅ ${count} products now have 'productCollection' field`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

renameField();
