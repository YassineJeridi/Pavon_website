// backend/seeds/seedTopBanners.js
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// TopBanner Schema (inline for independence)
const topBannerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const TopBanner = mongoose.model('TopBanner', topBannerSchema);

const topBanners = [
  {
    text: '🚚 Livraison gratuite dès 200 TND d\'achat !',
    isActive: true,
    link: '/produits',
  },
  {
    text: '🔥 Soldes d\'hiver : Jusqu\'à -50% sur une sélection d\'articles',
    isActive: true,
    link: '/produits',
  },
  {
    text: '✨ Nouvelle collection Printemps 2026 disponible !',
    isActive: true,
    link: '/produits',
  },
  {
    text: '🎁 Offre spéciale : Un accessoire offert pour tout achat supérieur à 150 TND',
    isActive: true,
  },
  {
    text: '📦 Retours gratuits sous 30 jours — Satisfaction garantie',
    isActive: true,
  },
  {
    text: '💳 Paiement sécurisé — Chèque, TPE ou Espèce à la livraison',
    isActive: true,
  },
];

const seedTopBanners = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elegance';

    console.log('🔌 Connecting to MongoDB...');
    console.log(`   URI: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);

    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing top banners
    await TopBanner.deleteMany({});
    console.log('🗑️  Cleared existing top banners');

    // Insert new top banners
    const created = await TopBanner.insertMany(topBanners);
    console.log(`✅ ${created.length} top banners created successfully!`);

    console.log('\n📊 Top Banners Summary:');
    console.log(`   - Total: ${created.length}`);
    console.log(`   - Active: ${created.filter(b => b.isActive).length}`);
    console.log(`   - With links: ${created.filter(b => b.link).length}`);

    created.forEach((b, i) => {
      console.log(`   ${i + 1}. [${b.isActive ? '✅' : '❌'}] ${b.text}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding top banners:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedTopBanners();
