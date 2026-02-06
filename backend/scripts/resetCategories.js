// backend/scripts/resetCategories.js
const mongoose = require('mongoose');
const Category = require('../models/Category');
require('dotenv').config();

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elegance-db');
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// New Categories Data
const categories = [
  {
    name: 'Robes',
    slug: 'robes',
    description: 'Collection élégante de robes pour toutes les occasions',
    isActive: true,
    order: 0,
  },
  {
    name: 'Hauts',
    slug: 'hauts',
    description: 'Tops et chemisiers tendance pour un style raffiné',
    isActive: true,
    order: 1,
  },
  {
    name: 'Pantalons',
    slug: 'pantalons',
    description: 'Pantalons confortables et stylés pour toutes les morphologies',
    isActive: true,
    order: 2,
  },
  {
    name: 'Jupes',
    slug: 'jupes',
    description: 'Jupes modernes et élégantes pour un look chic',
    isActive: true,
    order: 3,
  },
  {
    name: 'Vestes & Manteaux',
    slug: 'vestes-manteaux',
    description: 'Collection de vestes et manteaux pour compléter votre garde-robe',
    isActive: true,
    order: 4,
  },
  {
    name: 'Accessoires',
    slug: 'accessoires',
    description: 'Accessoires de mode pour sublimer vos tenues',
    isActive: true,
    order: 5,
  },
  {
    name: 'Chaussures',
    slug: 'chaussures',
    description: 'Chaussures élégantes et confortables pour chaque occasion',
    isActive: true,
    order: 6,
  },
  {
    name: 'Ensembles',
    slug: 'ensembles',
    description: 'Ensembles coordonnés pour un look harmonieux',
    isActive: true,
    order: 7,
  },
];

// Reset Categories
const resetCategories = async () => {
  try {
    await connectDB();

    console.log('🗑️  Deleting all existing categories...');
    const deleteResult = await Category.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} categories`);

    console.log('📦 Creating new categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories:`);
    
    createdCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (${cat.slug})`);
    });

    console.log('\n✨ Categories reset successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting categories:', error);
    process.exit(1);
  }
};

// Run the script
resetCategories();
