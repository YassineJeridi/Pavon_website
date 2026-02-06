// backend/seeds/seedCollections.js
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Collection Schema (inline for independence)
const collectionSchema = new mongoose.Schema({
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
  active: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Collection = mongoose.model('Collection', collectionSchema);

const collections = [
  {
    name: 'Nouvelle Collection Printemps',
    slug: 'nouvelle-collection-printemps',
    description: 'Découvrez notre nouvelle collection printemps-été avec des pièces légères et colorées parfaites pour la saison.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    active: true,
    featured: true,
  },
  {
    name: 'Élégance Classique',
    slug: 'elegance-classique',
    description: 'Des pièces intemporelles pour un style élégant et sophistiqué en toute occasion.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    active: true,
    featured: true,
  },
  {
    name: 'Tendances Été 2026',
    slug: 'tendances-ete-2026',
    description: 'Les dernières tendances mode pour un été stylé et confortable.',
    image: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=800&q=80',
    active: true,
    featured: true,
  },
  {
    name: 'Collection Casual',
    slug: 'collection-casual',
    description: 'Confort et style au quotidien avec notre sélection casual chic.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    active: true,
    featured: false,
  },
  {
    name: 'Soirée & Événements',
    slug: 'soiree-evenements',
    description: 'Brillez lors de vos événements spéciaux avec notre collection soirée.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
    active: true,
    featured: true,
  },
  {
    name: 'Bureau & Professionnel',
    slug: 'bureau-professionnel',
    description: 'Look professionnel et élégant pour vos journées de travail.',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80',
    active: true,
    featured: false,
  },
  {
    name: 'Accessoires Tendance',
    slug: 'accessoires-tendance',
    description: 'Complétez votre look avec nos accessoires tendance et élégants.',
    image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&q=80',
    active: true,
    featured: false,
  },
];

const seedCollections = async () => {
  try {
    // Get MongoDB URI with fallback
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elegance';
    
    console.log('🔌 Connecting to MongoDB...');
    console.log(`   URI: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing collections
    await Collection.deleteMany({});
    console.log('🗑️  Cleared existing collections');

    // Insert new collections
    const created = await Collection.insertMany(collections);
    console.log(`✅ ${created.length} collections created successfully!`);

    console.log('\n📊 Collections Summary:');
    console.log(`   - Total: ${created.length}`);
    console.log(`   - Active: ${created.filter(c => c.active).length}`);
    console.log(`   - Featured: ${created.filter(c => c.featured).length}`);
    
    console.log('\n📋 Created Collections:');
    created.forEach((col, i) => {
      console.log(`   ${i + 1}. ${col.name} (${col.slug})`);
      console.log(`      ID: ${col._id}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding collections:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedCollections();
