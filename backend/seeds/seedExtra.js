// backend/seeds/seedExtra.js
const mongoose = require('mongoose');
const path = require('path');
const colors = require('colors');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Testimonial = require('../models/Testimonial');
const Collection = require('../models/Collection');
const Category = require('../models/Category');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  console.log('🔗 Connecting to MongoDB...'.cyan);
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB'.green);
};

// ── 7 Testimonials ──────────────────────────────────────────
const testimonials = [
  {
    name: 'Amira Ben Salah',
    rating: 5,
    comment: 'J\'adore cette boutique ! La qualité des vêtements est exceptionnelle et les tailles sont parfaitement adaptées. Livraison rapide et emballage soigné.',
    avatar: '/uploads/testimonials/testimonials (1).jpg',
    isVerified: true,
    isFeatured: true,
    isActive: true,
    order: 1,
  },
  {
    name: 'Nour El Houda',
    rating: 5,
    comment: 'Un service client remarquable et des produits haut de gamme. J\'ai commandé plusieurs robes et elles sont toutes magnifiques. Je recommande à 100% !',
    avatar: '/uploads/testimonials/testimonials (2).jpg',
    isVerified: true,
    isFeatured: true,
    isActive: true,
    order: 2,
  },
  {
    name: 'Yasmine Trabelsi',
    rating: 4,
    comment: 'Très bonne expérience d\'achat en ligne. Les photos correspondent parfaitement aux produits reçus. Seul petit bémol : le délai de livraison un peu long.',
    avatar: '/uploads/testimonials/testimonials (3).jpg',
    isVerified: true,
    isFeatured: true,
    isActive: true,
    order: 3,
  },
  {
    name: 'Fatma Gharbi',
    rating: 5,
    comment: 'Ma boutique préférée pour les vêtements tendance ! Le rapport qualité-prix est imbattable. J\'ai reçu beaucoup de compliments sur ma robe de soirée.',
    avatar: '/uploads/testimonials/testimonials (4).jpg',
    isVerified: true,
    isFeatured: true,
    isActive: true,
    order: 4,
  },
  {
    name: 'Hajer Mrad',
    rating: 5,
    comment: 'Des pièces uniques et élégantes que je ne trouve nulle part ailleurs. Le tissu est de très bonne qualité et les finitions sont impeccables.',
    avatar: '/uploads/testimonials/testimonials (5).jpg',
    isVerified: true,
    isFeatured: false,
    isActive: true,
    order: 5,
  },
  {
    name: 'Ines Bouaziz',
    rating: 4,
    comment: 'Collection variée et prix raisonnables. J\'apprécie particulièrement la section accessoires. Le site est facile à naviguer et la commande se fait en quelques clics.',
    avatar: '/uploads/testimonials/testimonials (6).jpg',
    isVerified: true,
    isFeatured: true,
    isActive: true,
    order: 6,
  },
  {
    name: 'Rania Chaabane',
    rating: 5,
    comment: 'Fidèle cliente depuis plus d\'un an ! Chaque nouvelle collection me surprend. Les ensembles casual sont parfaits pour le quotidien et très confortables.',
    avatar: '/uploads/testimonials/testimonials (7).jpg',
    isVerified: true,
    isFeatured: true,
    isActive: true,
    order: 7,
  },
];

// ── 7 Collections ───────────────────────────────────────────
const newCollections = [
  {
    name: 'Urban Chic',
    slug: 'urban-chic',
    description: 'Style urbain et moderne pour la femme active. Des pièces polyvalentes du bureau à l\'afterwork.',
    image: '/uploads/collections/collection-urban-chic_1769726613676.jpg',
    isFeatured: true,
    isActive: true,
    order: 4,
  },
  {
    name: 'Minimaliste Essentiel',
    slug: 'minimaliste-essentiel',
    description: 'L\'art de la simplicité élégante. Des basiques intemporels aux lignes épurées et aux couleurs neutres.',
    image: '/uploads/collections/collection-minimaliste_1769726624453.jpg',
    isFeatured: true,
    isActive: true,
    order: 5,
  },
  {
    name: 'Glamour Soirée',
    slug: 'glamour-soiree',
    description: 'Brillez de mille feux avec notre collection soirée. Robes, paillettes et accessoires pour vos événements.',
    image: '/uploads/collections/collection-glamour-soiree_1769726632667.jpg',
    isFeatured: true,
    isActive: true,
    order: 6,
  },
  {
    name: 'Sport & Style',
    slug: 'sport-style',
    description: 'Allier performance et tendance. Des ensembles sportswear chic pour le fitness et le quotidien.',
    image: '/uploads/collections/collection-sport-style_1769726638987.jpg',
    isFeatured: false,
    isActive: true,
    order: 7,
  },
  {
    name: 'Romantic Dreams',
    slug: 'romantic-dreams',
    description: 'Dentelles, volants et imprimés floraux. Une collection douce et romantique pour les âmes rêveuses.',
    image: '/uploads/collections/collection-romantic-dreams_1769726644521.jpg',
    isFeatured: true,
    isActive: true,
    order: 8,
  },
  {
    name: 'Été Méditerranéen',
    slug: 'ete-mediterraneen',
    description: 'Inspirée par les côtes méditerranéennes. Des pièces légères et colorées pour un été inoubliable.',
    image: '/uploads/collections/collection-ete-mediterraneen_1769726654637.jpg',
    isFeatured: true,
    isActive: true,
    order: 9,
  },
  {
    name: 'Vintage Renaissance',
    slug: 'vintage-renaissance',
    description: 'Revisitez les classiques avec une touche contemporaine. Des coupes rétro remises au goût du jour.',
    image: '/uploads/collections/collection-vintage-renaissance_1769726658845.jpg',
    isFeatured: true,
    isActive: true,
    order: 10,
  },
];

// ── 7 Categories (3 images reused) ─────────────────────────
const newCategories = [
  {
    name: 'Robes & Jupes',
    slug: 'robes-jupes',
    description: 'Robes élégantes et jupes tendance pour toutes les occasions, du quotidien aux soirées.',
    image: '/uploads/categories/123 (1).jpg',
    isActive: true,
    order: 6,
  },
  {
    name: 'Tops & Blouses',
    slug: 'tops-blouses',
    description: 'Tops, blouses et chemises pour compléter vos tenues avec style et élégance.',
    image: '/uploads/categories/123 (2).jpg',
    isActive: true,
    order: 7,
  },
  {
    name: 'Pantalons & Shorts',
    slug: 'pantalons-shorts',
    description: 'Pantalons, jeans et shorts pour un confort quotidien avec une touche de mode.',
    image: '/uploads/categories/123 (3).jpg',
    isActive: true,
    order: 8,
  },
  {
    name: 'Manteaux & Vestes',
    slug: 'manteaux-vestes',
    description: 'Manteaux, blazers et vestes pour affronter toutes les saisons avec élégance.',
    image: '/uploads/categories/123 (1).jpg',
    isActive: true,
    order: 9,
  },
  {
    name: 'Ensembles Complets',
    slug: 'ensembles-complets',
    description: 'Ensembles coordonnés prêts à porter pour un look parfait en un instant.',
    image: '/uploads/categories/123 (2).jpg',
    isActive: true,
    order: 10,
  },
  {
    name: 'Tenues de Sport',
    slug: 'tenues-sport',
    description: 'Vêtements de sport confortables et stylés pour vos séances d\'entraînement.',
    image: '/uploads/categories/123 (3).jpg',
    isActive: true,
    order: 11,
  },
  {
    name: 'Lingerie & Nuit',
    slug: 'lingerie-nuit',
    description: 'Pyjamas, nuisettes et lingerie confortable pour des nuits douces et élégantes.',
    image: '/uploads/categories/123 (1).jpg',
    isActive: true,
    order: 12,
  },
];

// ── Run seed ────────────────────────────────────────────────
const seed = async () => {
  try {
    await connectDB();

    // --- Testimonials ---
    await Testimonial.deleteMany({});
    const createdTestimonials = await Testimonial.insertMany(testimonials);
    console.log(`✅ ${createdTestimonials.length} testimonials seeded`.green);

    // --- Collections (delete old + insert new) ---
    await Collection.deleteMany({});
    const createdCollections = await Collection.insertMany(newCollections);
    console.log(`✅ ${createdCollections.length} collections seeded`.green);

    // --- Categories (delete old + insert new) ---
    await Category.deleteMany({});
    const createdCategories = await Category.insertMany(newCategories);
    console.log(`✅ ${createdCategories.length} categories seeded`.green);

    console.log('\n🎉 All data seeded successfully!'.green.bold);
    console.log('\n📊 Summary:');
    console.log(`   Testimonials: ${createdTestimonials.length}`);
    console.log(`   Collections:  ${createdCollections.length}`);
    console.log(`   Categories:   ${createdCategories.length}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding:'.red, error);
    process.exit(1);
  }
};

seed();
