// backend/seeds/seedProducts.js
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Product Schema (inline for independence)
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  compareAtPrice: Number,
  cost: Number,
  sku: String,
  barcode: String,
  stock: {
    type: Number,
    default: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  collections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
  }],
  images: [String],
  sizes: [String],
  colors: [String],
  material: String,
  featured: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

// ✅ UPDATED WITH YOUR ACTUAL IDS
const CATEGORY_IDS = {
  FEMMES: '69756c60f4caeaf4ffac55bd',
  HOMMES: '69756c60f4caeaf4ffac55be',
  ACCESSOIRES: '69756c60f4caeaf4ffac55bf',
  CHAUSSURES: '69756c60f4caeaf4ffac55c0',
  SPORT: '69756c60f4caeaf4ffac55c1',
};

const COLLECTION_IDS = {
  PRINTEMPS: '69756c608d4d46a219944e11',
  CLASSIQUE: '69756c608d4d46a219944e12',
  ETE_2026: '69756c608d4d46a219944e13',
  CASUAL: '69756c608d4d46a219944e14',
  SOIREE: '69756c608d4d46a219944e15',
  BUREAU: '69756c608d4d46a219944e16',
  ACCESSOIRES: '69756c608d4d46a219944e17',
};

const products = [
  // Femmes - Collection Printemps
  {
    name: 'Robe Fleurie Printemps',
    slug: 'robe-fleurie-printemps',
    description: 'Magnifique robe fleurie légère et aérienne, parfaite pour les journées ensoleillées. Tissu respirant et confortable.',
    price: 129.90,
    compareAtPrice: 159.90,
    cost: 65.00,
    sku: 'ROB-FLE-001',
    barcode: '7891234567890',
    stock: 45,
    lowStockThreshold: 10,
    category: CATEGORY_IDS.FEMMES,
    collections: [COLLECTION_IDS.PRINTEMPS, COLLECTION_IDS.CLASSIQUE],
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Rose', 'Bleu Ciel', 'Blanc'],
    material: 'Coton 95%, Élasthanne 5%',
    featured: true,
    active: true,
    tags: ['robe', 'printemps', 'floral', 'casual'],
  },
  {
    name: 'Blouse Élégante Dentelle',
    slug: 'blouse-elegante-dentelle',
    description: 'Blouse sophistiquée avec détails en dentelle. Idéale pour le bureau ou les occasions spéciales.',
    price: 89.90,
    compareAtPrice: 119.90,
    cost: 45.00,
    sku: 'BLO-DEN-002',
    barcode: '7891234567891',
    stock: 60,
    category: CATEGORY_IDS.FEMMES,
    collections: [COLLECTION_IDS.CLASSIQUE, COLLECTION_IDS.BUREAU],
    images: [
      'https://images.unsplash.com/photo-1564257577-7e3adfc79e78?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Blanc', 'Noir', 'Beige'],
    material: 'Polyester 80%, Dentelle 20%',
    featured: true,
    active: true,
    tags: ['blouse', 'élégant', 'bureau', 'dentelle'],
  },
  {
    name: 'Jupe Midi Plissée',
    slug: 'jupe-midi-plissee',
    description: 'Jupe midi plissée tendance, facile à assortir. Coupe flatteuse pour toutes les morphologies.',
    price: 79.90,
    cost: 40.00,
    sku: 'JUP-PLI-003',
    barcode: '7891234567892',
    stock: 35,
    category: CATEGORY_IDS.FEMMES,
    collections: [COLLECTION_IDS.CLASSIQUE, COLLECTION_IDS.CASUAL],
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Marine', 'Bordeaux'],
    material: 'Polyester 100%',
    featured: false,
    active: true,
    tags: ['jupe', 'midi', 'plissée', 'versatile'],
  },
  {
    name: 'Robe de Soirée Longue',
    slug: 'robe-soiree-longue',
    description: 'Robe de soirée longue élégante avec finitions luxueuses. Pour briller lors de vos événements spéciaux.',
    price: 249.90,
    compareAtPrice: 299.90,
    cost: 125.00,
    sku: 'ROB-SOI-004',
    barcode: '7891234567893',
    stock: 20,
    category: CATEGORY_IDS.FEMMES,
    collections: [COLLECTION_IDS.SOIREE],
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Noir', 'Rouge', 'Bleu Marine'],
    material: 'Satin, Dentelle',
    featured: true,
    active: true,
    tags: ['robe', 'soirée', 'longue', 'élégant'],
  },
  {
    name: 'Top Casual Été',
    slug: 'top-casual-ete',
    description: 'Top décontracté en coton léger, parfait pour l\'été tunisien. Respirant et confortable.',
    price: 49.90,
    cost: 25.00,
    sku: 'TOP-CAS-005',
    barcode: '7891234567894',
    stock: 80,
    category: CATEGORY_IDS.FEMMES,
    collections: [COLLECTION_IDS.CASUAL, COLLECTION_IDS.ETE_2026],
    images: [
      'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanc', 'Beige', 'Rose Pâle', 'Vert Menthe'],
    material: 'Coton 100%',
    featured: false,
    active: true,
    tags: ['top', 'casual', 'été', 'coton'],
  },

  // Accessoires
  {
    name: 'Sac à Main Cuir Premium',
    slug: 'sac-main-cuir-premium',
    description: 'Sac à main en cuir véritable de haute qualité. Design intemporel et pratique.',
    price: 189.90,
    compareAtPrice: 229.90,
    cost: 95.00,
    sku: 'SAC-CUI-006',
    barcode: '7891234567895',
    stock: 25,
    category: CATEGORY_IDS.ACCESSOIRES,
    collections: [COLLECTION_IDS.ACCESSOIRES, COLLECTION_IDS.CLASSIQUE],
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
    ],
    sizes: ['Unique'],
    colors: ['Noir', 'Marron', 'Beige'],
    material: 'Cuir véritable 100%',
    featured: true,
    active: true,
    tags: ['sac', 'cuir', 'accessoire', 'premium'],
  },
  {
    name: 'Foulard Soie Imprimé',
    slug: 'foulard-soie-imprime',
    description: 'Foulard en soie avec motifs élégants. Complète parfaitement votre tenue.',
    price: 39.90,
    cost: 20.00,
    sku: 'FOU-SOI-007',
    barcode: '7891234567896',
    stock: 50,
    category: CATEGORY_IDS.ACCESSOIRES,
    collections: [COLLECTION_IDS.ACCESSOIRES],
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80',
    ],
    sizes: ['90x90cm'],
    colors: ['Multicolore', 'Bleu', 'Rouge'],
    material: 'Soie 100%',
    featured: false,
    active: true,
    tags: ['foulard', 'soie', 'accessoire'],
  },
  {
    name: 'Ceinture Cuir Élégante',
    slug: 'ceinture-cuir-elegante',
    description: 'Ceinture en cuir avec boucle dorée. Accessoire indispensable pour sublimer votre silhouette.',
    price: 59.90,
    cost: 30.00,
    sku: 'CEI-CUI-008',
    barcode: '7891234567897',
    stock: 40,
    category: CATEGORY_IDS.ACCESSOIRES,
    collections: [COLLECTION_IDS.ACCESSOIRES, COLLECTION_IDS.CLASSIQUE],
    images: [
      'https://images.unsplash.com/photo-1624222247344-550fb60583bb?w=800&q=80',
    ],
    sizes: ['75cm', '85cm', '95cm'],
    colors: ['Noir', 'Marron', 'Blanc'],
    material: 'Cuir véritable',
    featured: false,
    active: true,
    tags: ['ceinture', 'cuir', 'accessoire'],
  },

  // Chaussures
  {
    name: 'Escarpins Classiques',
    slug: 'escarpins-classiques',
    description: 'Escarpins élégants à talons moyens. Confort et style pour toute la journée.',
    price: 139.90,
    compareAtPrice: 169.90,
    cost: 70.00,
    sku: 'ESC-CLA-009',
    barcode: '7891234567898',
    stock: 30,
    category: CATEGORY_IDS.CHAUSSURES,
    collections: [COLLECTION_IDS.CLASSIQUE, COLLECTION_IDS.BUREAU],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    ],
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: ['Noir', 'Beige', 'Rouge'],
    material: 'Cuir synthétique',
    featured: true,
    active: true,
    tags: ['escarpins', 'chaussures', 'élégant', 'talons'],
  },
  {
    name: 'Sandales Été Confort',
    slug: 'sandales-ete-confort',
    description: 'Sandales légères et confortables pour l\'été. Semelle ergonomique.',
    price: 69.90,
    cost: 35.00,
    sku: 'SAN-ETE-010',
    barcode: '7891234567899',
    stock: 55,
    category: CATEGORY_IDS.CHAUSSURES,
    collections: [COLLECTION_IDS.ETE_2026, COLLECTION_IDS.CASUAL],
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80',
    ],
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Beige', 'Blanc', 'Argenté'],
    material: 'Synthétique',
    featured: false,
    active: true,
    tags: ['sandales', 'été', 'confort'],
  },

  // Sport & Loisirs
  {
    name: 'Ensemble Sport Femme',
    slug: 'ensemble-sport-femme',
    description: 'Ensemble sportswear complet : legging + top. Tissu respirant et extensible.',
    price: 99.90,
    compareAtPrice: 129.90,
    cost: 50.00,
    sku: 'ENS-SPO-011',
    barcode: '7891234567800',
    stock: 40,
    category: CATEGORY_IDS.SPORT,
    collections: [COLLECTION_IDS.CASUAL],
    images: [
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80',
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Noir', 'Gris', 'Rose'],
    material: 'Polyester 85%, Élasthanne 15%',
    featured: false,
    active: true,
    tags: ['sport', 'fitness', 'legging'],
  },
  {
    name: 'Baskets Running Femme',
    slug: 'baskets-running-femme',
    description: 'Baskets de running légères avec amorti optimal. Pour vos séances de sport.',
    price: 119.90,
    cost: 60.00,
    sku: 'BAS-RUN-012',
    barcode: '7891234567801',
    stock: 35,
    category: CATEGORY_IDS.CHAUSSURES,
    collections: [],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    ],
    sizes: ['36', '37', '38', '39', '40'],
    colors: ['Blanc/Rose', 'Noir', 'Gris/Bleu'],
    material: 'Mesh, Caoutchouc',
    featured: false,
    active: true,
    tags: ['baskets', 'running', 'sport'],
  },
];

const seedProducts = async () => {
  try {
    // Get MongoDB URI with fallback
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elegance';
    
    console.log('🔌 Connecting to MongoDB...');
    console.log(`   URI: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products
    const created = await Product.insertMany(products);
    console.log(`✅ ${created.length} products created successfully!`);

    console.log('\n📊 Products Summary:');
    console.log(`   - Total: ${created.length}`);
    console.log(`   - Featured: ${created.filter(p => p.featured).length}`);
    console.log(`   - In Stock: ${created.filter(p => p.stock > 0).length}`);
    console.log(`   - Low Stock: ${created.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length}`);
    console.log(`   - Total Stock Value: ${created.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)} TND`);
    
    console.log('\n📋 Created Products:');
    created.forEach((product, i) => {
      console.log(`   ${i + 1}. ${product.name} - ${product.price} TND (Stock: ${product.stock})`);
      console.log(`      ID: ${product._id}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedProducts();
