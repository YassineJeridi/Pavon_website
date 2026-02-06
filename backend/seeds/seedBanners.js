// backend/seeds/seedBanners.js
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Banner Schema (inline for independence)
const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  description: String,
  image: {
    type: String,
    required: true,
  },
  link: String,
  buttonText: String,
  active: {
    type: Boolean,
    default: true,
  },
  position: {
    type: String,
    enum: ['hero', 'top', 'middle', 'bottom', 'sidebar'],
    default: 'hero',
  },
  order: {
    type: Number,
    default: 0,
  },
  startDate: Date,
  endDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Banner = mongoose.model('Banner', bannerSchema);

const banners = [
  {
    title: 'Nouvelle Collection Printemps 2026',
    subtitle: 'Élégance & Fraîcheur',
    description: 'Découvrez notre nouvelle collection printemps-été avec des pièces légères et colorées',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80',
    link: '/collections/nouvelle-collection-printemps',
    buttonText: 'Découvrir',
    active: true,
    position: 'hero',
    order: 1,
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-06-30'),
  },
  {
    title: 'Soldes d\'Hiver',
    subtitle: 'Jusqu\'à -50%',
    description: 'Profitez de réductions exceptionnelles sur une sélection d\'articles',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80',
    link: '/promotions',
    buttonText: 'Voir les offres',
    active: true,
    position: 'hero',
    order: 2,
    startDate: new Date('2026-01-15'),
    endDate: new Date('2026-02-28'),
  },
  {
    title: 'Collection Soirée',
    subtitle: 'Brillez en Toute Occasion',
    description: 'Des robes élégantes pour vos événements spéciaux',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1920&q=80',
    link: '/collections/soiree-evenements',
    buttonText: 'Voir la collection',
    active: true,
    position: 'hero',
    order: 3,
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
  },
  {
    title: 'Livraison Gratuite',
    subtitle: 'Dès 150 TND d\'achat',
    description: 'Profitez de la livraison gratuite sur tout le territoire tunisien',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea24f83c?w=800&q=80',
    link: '/info/livraison',
    buttonText: 'En savoir plus',
    active: true,
    position: 'top',
    order: 1,
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-12-31'),
  },
  {
    title: 'Nouveautés Chaque Semaine',
    subtitle: 'Restez Tendance',
    description: 'De nouvelles pièces ajoutées régulièrement',
    image: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=800&q=80',
    link: '/nouveautes',
    buttonText: 'Découvrir',
    active: true,
    position: 'middle',
    order: 1,
  },
];

const seedBanners = async () => {
  try {
    // Get MongoDB URI with fallback
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elegance';
    
    console.log('🔌 Connecting to MongoDB...');
    console.log(`   URI: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing banners
    await Banner.deleteMany({});
    console.log('🗑️  Cleared existing banners');

    // Insert new banners
    const created = await Banner.insertMany(banners);
    console.log(`✅ ${created.length} banners created successfully!`);

    console.log('\n📊 Banners Summary:');
    console.log(`   - Total: ${created.length}`);
    console.log(`   - Active: ${created.filter(b => b.active).length}`);
    console.log(`   - Hero: ${created.filter(b => b.position === 'hero').length}`);
    console.log(`   - Other positions: ${created.filter(b => b.position !== 'hero').length}`);
    
    console.log('\n📋 Created Banners:');
    created.forEach((banner, i) => {
      console.log(`   ${i + 1}. ${banner.title} (${banner.position})`);
      console.log(`      ID: ${banner._id}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding banners:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedBanners();
