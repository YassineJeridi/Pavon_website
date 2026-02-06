// backend/utils/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const Product = require('../models/Product');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
const Admin = require('../models/Admin');
const Banner = require('../models/Banner');
const Testimonial = require('../models/Testimonial');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

// Connect to DB
mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);

// Sample data using actual uploaded images
const categories = [
  {
    name: 'Robes',
    slug: 'robes',
    description: 'Collection élégante de robes pour toutes occasions',
    image: '/uploads/collections/Capture d\'écran 2026-01-01 014134.png',
    isActive: true,
    order: 1,
  },
  {
    name: 'Tops & Chemises',
    slug: 'tops-chemises',
    description: 'Tops et chemises tendance pour femmes',
    image: '/uploads/collections/Capture d\'écran 2026-01-04 040438.png',
    isActive: true,
    order: 2,
  },
  {
    name: 'Pantalons & Jeans',
    slug: 'pantalons-jeans',
    description: 'Confort et style avec nos pantalons et jeans',
    image: '/uploads/collections/Capture d\'écran 2026-01-05 205151.png',
    isActive: true,
    order: 3,
  },
  {
    name: 'Vêtements Sport',
    slug: 'vetements-sport',
    description: 'Tenues de sport modernes et confortables',
    image: '/uploads/collections/Capture d\'écran 2026-01-09 030316.png',
    isActive: true,
    order: 4,
  },
  {
    name: 'Accessoires',
    slug: 'accessoires',
    description: 'Accessoires de mode pour compléter votre look',
    image: '/uploads/collections/Capture d\'écran 2026-01-09 041501.png',
    isActive: true,
    order: 5,
  },
];

const collections = [
  {
    name: 'Nouvelle Collection Printemps',
    slug: 'nouvelle-collection-printemps',
    description: 'Découvrez notre dernière collection printemps/été 2026',
    image: '/uploads/collections/Capture d\'écran 2026-01-11 003059.png',
    isActive: true,
    featured: true,
    order: 1,
  },
  {
    name: 'Collection Casual Chic',
    slug: 'collection-casual-chic',
    description: 'Style décontracté et élégant pour le quotidien',
    image: '/uploads/collections/Capture d\'écran 2026-01-11 003103.png',
    isActive: true,
    featured: true,
    order: 2,
  },
  {
    name: 'Collection Soirée',
    slug: 'collection-soiree',
    description: 'Tenues élégantes pour vos événements spéciaux',
    image: '/uploads/collections/Capture d\'écran 2026-01-12 191947.png',
    isActive: true,
    featured: true,
    order: 3,
  },
];

const admins = [
  {
    firstName: 'Admin',
    lastName: 'Principal',
    email: 'admin@elegance.tn',
    password: 'admin123',
    role: 'super_admin',
    isActive: true,
  },
];

const banners = [
  {
    title: 'Nouvelle Collection Printemps 2026',
    subtitle: 'Les dernières tendances sont arrivées',
    description: 'Découvrez notre collection exclusive de printemps avec des styles frais et élégants',
    image: '/uploads/banners/item_1769621523121.png',
    link: '/collections/nouvelle-collection-printemps',
    buttonText: 'Découvrir',
    isActive: true,
    position: 'hero',
    order: 1,
  },
  {
    title: 'Soldes d\'Hiver',
    subtitle: 'Jusqu\'à -50% sur une sélection',
    description: 'Profitez de nos offres exceptionnelles sur toute la collection hiver',
    image: '/uploads/banners/item_1769621536140.png',
    link: '/products',
    buttonText: 'Voir les offres',
    isActive: true,
    position: 'hero',
    order: 2,
  },
  {
    title: 'Collection Casual Chic',
    subtitle: 'Style décontracté et élégant',
    description: 'Des pièces versatiles pour toutes vos occasions',
    image: '/uploads/banners/item_1769621553127.png',
    link: '/collections/collection-casual-chic',
    buttonText: 'Explorer',
    isActive: true,
    position: 'promotional',
    order: 3,
  },
  {
    title: 'Accessoires Tendance',
    subtitle: 'Complétez votre look',
    description: 'Découvrez notre sélection d\'accessoires mode',
    image: '/uploads/banners/item_1769621562174.png',
    link: '/category/accessoires',
    buttonText: 'Voir plus',
    isActive: true,
    position: 'category',
    order: 4,
  },
  {
    title: 'Livraison Gratuite',
    subtitle: 'Partout en Tunisie',
    description: 'Pour toute commande supérieure à 150 DT',
    image: '/uploads/banners/item_1769621972312.jpg',
    link: '/products',
    buttonText: 'Commander',
    isActive: true,
    position: 'promotional',
    order: 5,
  },
  {
    title: 'Nouveautés de la Semaine',
    subtitle: 'Découvrez nos derniers arrivages',
    description: 'De nouvelles pièces chaque semaine',
    image: '/uploads/banners/item_1769622663263.jpg',
    link: '/products?sort=newest',
    buttonText: 'Voir tout',
    isActive: true,
    position: 'category',
    order: 6,
  },
  {
    title: 'Service Client Premium',
    subtitle: 'À votre écoute 7j/7',
    description: 'Contactez-nous pour toute question',
    image: '/uploads/banners/item_1769622687598.jpg',
    link: '/contact',
    buttonText: 'Contactez-nous',
    isActive: true,
    position: 'footer',
    order: 7,
  },
];

const testimonials = [
  {
    name: 'Dorra Lakhoua',
    rating: 5,
    comment: 'Excellente qualité et livraison rapide ! Je suis très satisfaite de mon achat. Les vêtements sont conformes aux photos et la coupe est parfaite.',
    image: '/uploads/testimonials/dorra-lakhoua_1769645903638.jpg',
    isVerified: true,
    isFeatured: true,
    isActive: true,
    order: 1,
  },
  {
    name: 'Sarra Mejri',
    rating: 5,
    comment: 'Service client au top et produits de qualité exceptionnelle. Je recommande vivement cette boutique à toutes mes amies !',
    image: '/uploads/testimonials/sarra-mejri_1769646226827.jpg',
    isVerified: true,
    isFeatured: true,
    isActive: true,
    order: 2,
  },
  {
    name: 'Leila Hamdi',
    rating: 5,
    comment: 'Magnifique collection ! J\'ai trouvé exactement ce que je cherchais. La qualité des tissus est remarquable et les prix sont très raisonnables.',
    image: '/uploads/testimonials/leila-hamdi_1769646242200.jpg',
    isVerified: true,
    isFeatured: true,
    isActive: true,
    order: 3,
  },
];

// Products data (will be populated with references after categories/collections are created)
const getProducts = (categoryIds, collectionIds) => [
  {
    name: 'Robe Élégante Fleurie',
    slug: 'robe-elegante-fleurie',
    description: 'Magnifique robe avec motifs floraux, parfaite pour les occasions spéciales. Tissu de haute qualité, coupe flatteuse et confortable.',
    price: 129.90,
    comparePrice: 179.90,
    images: ['/uploads/products/images-1769649418009-256708161.jpg'],
    categories: [categoryIds[0]], // Robes
    collections: [collectionIds[0], collectionIds[2]], // Nouvelle Collection, Collection Soirée
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Rouge', 'Bleu', 'Vert'],
    stock: 50,
    sku: 'ROBE-FLEUR-001',
    isFeatured: true,
    isNew: true,
    isActive: true,
    tags: ['robe', 'fleurie', 'élégante', 'soirée'],
  },
  {
    name: 'Ensemble Casual Moderne',
    slug: 'ensemble-casual-moderne',
    description: 'Ensemble deux pièces parfait pour un look casual chic. Confortable et stylé pour votre quotidien.',
    price: 89.90,
    comparePrice: 119.90,
    images: ['/uploads/products/images-1769649418010-624614412.jpg'],
    categories: [categoryIds[1]], // Tops & Chemises
    collections: [collectionIds[1]], // Collection Casual Chic
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Noir', 'Blanc'],
    stock: 75,
    sku: 'ENS-CAS-001',
    isFeatured: true,
    isNew: true,
    isActive: true,
    tags: ['ensemble', 'casual', 'moderne', 'confortable'],
  },
  {
    name: 'Robe Longue Bohème',
    slug: 'robe-longue-boheme',
    description: 'Robe longue au style bohème avec imprimés délicats. Idéale pour l\'été et les sorties décontractées.',
    price: 99.90,
    comparePrice: 139.90,
    images: ['/uploads/products/images-1769649418009-256708161.jpg'],
    categories: [categoryIds[0]], // Robes
    collections: [collectionIds[0]], // Nouvelle Collection
    sizes: ['S', 'M', 'L'],
    colors: ['Multicolore'],
    stock: 40,
    sku: 'ROBE-BOH-001',
    isFeatured: false,
    isNew: true,
    isActive: true,
    tags: ['robe', 'longue', 'bohème', 'été'],
  },
  {
    name: 'Top Moderne à Motifs',
    slug: 'top-moderne-motifs',
    description: 'Top élégant avec motifs modernes. Parfait pour créer un look tendance et sophistiqué.',
    price: 59.90,
    comparePrice: 79.90,
    images: ['/uploads/products/images-1769649418010-624614412.jpg'],
    categories: [categoryIds[1]], // Tops & Chemises
    collections: [collectionIds[1]], // Collection Casual Chic
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Rose', 'Bleu'],
    stock: 60,
    sku: 'TOP-MOD-001',
    isFeatured: true,
    isNew: false,
    isActive: true,
    tags: ['top', 'moderne', 'motifs', 'chic'],
  },
  {
    name: 'Pantalon Tailleur Élégant',
    slug: 'pantalon-tailleur-elegant',
    description: 'Pantalon tailleur coupe droite, parfait pour le bureau ou les occasions formelles. Tissu premium.',
    price: 79.90,
    comparePrice: 99.90,
    images: ['/uploads/products/images-1769649418009-256708161.jpg'],
    categories: [categoryIds[2]], // Pantalons & Jeans
    collections: [collectionIds[2]], // Collection Soirée
    sizes: ['36', '38', '40', '42', '44'],
    colors: ['Noir', 'Gris', 'Bleu marine'],
    stock: 45,
    sku: 'PANT-TAIL-001',
    isFeatured: false,
    isNew: false,
    isActive: true,
    tags: ['pantalon', 'tailleur', 'élégant', 'formel'],
  },
];

// Import data
const importData = async () => {
  try {
    console.log('🔄 Importing data...'.yellow.bold);

    // Clear existing data
    console.log('📦 Clearing old data...');
    await Category.deleteMany();
    await Collection.deleteMany();
    await Product.deleteMany();
    await Admin.deleteMany();
    await Banner.deleteMany();
    await Testimonial.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();

    console.log('✅ Data cleared'.green);

    // Insert categories first
    const createdCategories = await Category.insertMany(categories);
    console.log('✅ Categories created'.green);
    const categoryIds = createdCategories.map(cat => cat._id);

    // Insert collections
    const createdCollections = await Collection.insertMany(collections);
    console.log('✅ Collections created'.green);
    const collectionIds = createdCollections.map(col => col._id);

    // Insert products with references
    const products = getProducts(categoryIds, collectionIds);
    await Product.insertMany(products);
    console.log('✅ Products created'.green);

    // Hash admin passwords before inserting
    for (let admin of admins) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(admin.password, salt);
    }
    const createdAdmins = await Admin.insertMany(admins);
    console.log('✅ Admins created'.green);

    // Insert banners
    await Banner.insertMany(banners);
    console.log('✅ Banners created'.green);

    // Insert testimonials
    await Testimonial.insertMany(testimonials);
    console.log('✅ Testimonials created'.green);

    console.log('\n🎉 Data imported successfully!'.green.bold);
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${createdCategories.length}`);
    console.log(`   - Collections: ${createdCollections.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Admins: ${createdAdmins.length}`);
    console.log(`   - Banners: ${banners.length}`);
    console.log(`   - Testimonials: ${testimonials.length}`);
    console.log('\n👤 Admin credentials:');
    console.log(`   Email: admin@elegance.tn`);
    console.log(`   Password: admin123\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    console.log('🔄 Deleting data...'.yellow.bold);

    await Category.deleteMany();
    await Collection.deleteMany();
    await Product.deleteMany();
    await Admin.deleteMany();
    await Banner.deleteMany();
    await Testimonial.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();

    console.log('✅ All data deleted successfully!'.green.bold);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting data:', error);
    process.exit(1);
  }
};

// Run seeder
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use: npm run seed -i (import) or npm run seed -d (delete)');
  process.exit(0);
}
