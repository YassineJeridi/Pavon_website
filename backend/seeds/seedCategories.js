// backend/seeds/seedCategories.js
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Category Schema (inline for independence)
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  image: String,
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model('Category', categorySchema);

const categories = [
  // Main Categories
  {
    name: 'Femmes',
    slug: 'femmes',
    description: 'Mode féminine - Vêtements et accessoires pour femmes',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    parent: null,
    active: true,
    order: 1,
  },
  {
    name: 'Hommes',
    slug: 'hommes',
    description: 'Mode masculine - Vêtements et accessoires pour hommes',
    image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&q=80',
    parent: null,
    active: true,
    order: 2,
  },
  {
    name: 'Accessoires',
    slug: 'accessoires',
    description: 'Sacs, bijoux, lunettes et autres accessoires',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&q=80',
    parent: null,
    active: true,
    order: 3,
  },
  {
    name: 'Chaussures',
    slug: 'chaussures',
    description: 'Chaussures pour tous les styles et occasions',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    parent: null,
    active: true,
    order: 4,
  },
  {
    name: 'Sport & Loisirs',
    slug: 'sport-loisirs',
    description: 'Vêtements et accessoires sportswear',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80',
    parent: null,
    active: true,
    order: 5,
  },
];

const seedCategories = async () => {
  try {
    // Get MongoDB URI with fallback
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elegance';
    
    console.log('🔌 Connecting to MongoDB...');
    console.log(`   URI: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // Insert new categories
    const created = await Category.insertMany(categories);
    console.log(`✅ ${created.length} categories created successfully!`);

    console.log('\n📊 Categories Summary:');
    console.log(`   - Total: ${created.length}`);
    console.log(`   - Active: ${created.filter(c => c.active).length}`);
    console.log(`   - Main Categories: ${created.filter(c => !c.parent).length}`);
    
    console.log('\n📋 Created Categories:');
    created
      .sort((a, b) => a.order - b.order)
      .forEach((cat, i) => {
        console.log(`   ${cat.order}. ${cat.name} (${cat.slug})`);
        console.log(`      ID: ${cat._id}`);
      });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedCategories();
