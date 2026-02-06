// backend/scripts/linkProductsToCollections.js
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');
const Collection = require('../models/Collection');
const Category = require('../models/Category');

const linkProductsToCollections = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elegance');
    console.log('✅ Connected to MongoDB');

    // Get all collections and categories
    const collections = await Collection.find({});
    const categories = await Category.find({});

    console.log(`📦 Found ${collections.length} collections`);
    console.log(`📂 Found ${categories.length} categories`);

    // Create lookup maps by name
    const collectionMap = {};
    collections.forEach(col => {
      collectionMap[col.name.toLowerCase()] = col._id;
    });

    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name.toLowerCase()] = cat._id;
    });

    console.log('\n📋 Collection mapping:');
    Object.keys(collectionMap).forEach(name => {
      console.log(`  - "${name}" → ${collectionMap[name]}`);
    });

    console.log('\n📋 Category mapping:');
    Object.keys(categoryMap).forEach(name => {
      console.log(`  - "${name}" → ${categoryMap[name]}`);
    });

    // Collection name mappings (from JSON to actual DB names)
    const collectionNameMap = {
      'nouvelle collection printemps': 'Nouvelle Collection Printemps',
      'élégance classique': 'Élégance Classique',
      'elegance classique': 'Élégance Classique',
      'tendances été 2026': 'Tendances Été 2026eee', // Your actual name
      'soirée & événements': 'Soirée & Événements',
      'soiree & evenements': 'Soirée & Événements',
      'bureau & professionnel': 'Bureau & Professionnel',
      'accessoires tendance': 'Accessoires Tendance',
    };

    const categoryNameMap = {
      'femmes': 'Femmes',
      'hommes': 'Hommes',
      'accessoires': 'Accessoires',
      'chaussures': 'Chaussures',
      'sport & loisirs': 'Sport & Loisirs',
    };

    // Get all products
    const products = await Product.find({});
    console.log(`\n🛍️ Found ${products.length} products to update`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        const updates = {};
        let needsUpdate = false;

        // Fix collection (if it's an invalid ObjectId or doesn't exist)
        if (product.collection) {
          const collectionExists = await Collection.findById(product.collection);
          if (!collectionExists) {
            console.log(`⚠️  Product "${product.name}": Invalid collection ID, will try to match by name`);
            needsUpdate = true;
          }
        }

        // Fix categories (if any are invalid)
        if (product.categories && product.categories.length > 0) {
          const validCategories = [];
          for (const catId of product.categories) {
            const categoryExists = await Category.findById(catId);
            if (!categoryExists) {
              console.log(`⚠️  Product "${product.name}": Invalid category ID`);
              needsUpdate = true;
            } else {
              validCategories.push(catId);
            }
          }
          if (validCategories.length !== product.categories.length) {
            updates.categories = validCategories;
            needsUpdate = true;
          }
        }

        // If product needs update, try to infer collection/categories from name
        if (needsUpdate) {
          // Try to match collection by product characteristics
          const productName = product.name.toLowerCase();
          
          // Collection matching logic
          if (productName.includes('été') || productName.includes('sport') || productName.includes('jogging') || productName.includes('short')) {
            updates.collection = collectionMap['tendances été 2026eee'];
          } else if (productName.includes('soirée') || productName.includes('soiree') || productName.includes('robe de soirée') || productName.includes('escarpin')) {
            updates.collection = collectionMap['soirée & événements'];
          } else if (productName.includes('bureau') || productName.includes('professionnel') || productName.includes('costume') || productName.includes('blazer') || productName.includes('pantalon chino')) {
            updates.collection = collectionMap['bureau & professionnel'];
          } else if (productName.includes('accessoire') || productName.includes('sac') || productName.includes('lunette') || productName.includes('montre') || productName.includes('écharpe') || productName.includes('ceinture')) {
            updates.collection = collectionMap['accessoires tendance'];
          } else if (productName.includes('classique') || productName.includes('veste cuir') || productName.includes('jupe')) {
            updates.collection = collectionMap['élégance classique'];
          } else {
            // Default to Nouvelle Collection Printemps
            updates.collection = collectionMap['nouvelle collection printemps'];
          }

          // Category matching logic
          const newCategories = [];
          
          if (productName.includes('femme') || productName.includes('robe') || productName.includes('jupe') || productName.includes('blazer femme')) {
            newCategories.push(categoryMap['femmes']);
          }
          
          if (productName.includes('homme') || productName.includes('costume') || productName.includes('chemise') || productName.includes('polo')) {
            newCategories.push(categoryMap['hommes']);
          }
          
          if (productName.includes('sac') || productName.includes('lunette') || productName.includes('montre') || productName.includes('écharpe') || productName.includes('ceinture') || productName.includes('accessoire')) {
            newCategories.push(categoryMap['accessoires']);
          }
          
          if (productName.includes('chaussure') || productName.includes('basket') || productName.includes('escarpin')) {
            newCategories.push(categoryMap['chaussures']);
          }
          
          if (productName.includes('sport') || productName.includes('jogging') || productName.includes('short')) {
            newCategories.push(categoryMap['sport & loisirs']);
          }

          // Remove duplicates
          updates.categories = [...new Set(newCategories)];

          // Ensure at least one category
          if (updates.categories.length === 0) {
            updates.categories = [categoryMap['femmes']]; // Default
          }
        }

        // Update product if needed
        if (Object.keys(updates).length > 0) {
          await Product.findByIdAndUpdate(product._id, updates);
          console.log(`✅ Updated "${product.name}"`);
          console.log(`   Collection: ${updates.collection}`);
          console.log(`   Categories: ${updates.categories}`);
          updatedCount++;
        }

      } catch (err) {
        console.error(`❌ Error updating product "${product.name}":`, err.message);
        errorCount++;
      }
    }

    console.log('\n🎉 Migration complete!');
    console.log(`✅ Updated: ${updatedCount} products`);
    console.log(`❌ Errors: ${errorCount} products`);

    // Show product counts per collection
    console.log('\n📊 Products per collection:');
    for (const collection of collections) {
      const count = await Product.countDocuments({ collection: collection._id });
      console.log(`  - ${collection.name}: ${count} products`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

linkProductsToCollections();
