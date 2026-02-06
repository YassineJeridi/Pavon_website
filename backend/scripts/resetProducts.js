// backend/scripts/resetProducts.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
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

// Generate random price between min and max
const randomPrice = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate random stock
const randomStock = () => {
  return Math.floor(Math.random() * 50) + 10;
};

// Product names by category
const productNamesByCategory = {
  'Robes': [
    'Robe Midi Élégante', 'Robe Longue Soirée', 'Robe Courte Été', 'Robe Cocktail Chic',
    'Robe Portefeuille', 'Robe Asymétrique', 'Robe Plissée', 'Robe Cache-Cœur'
  ],
  'Hauts': [
    'Chemise Blanche Classique', 'Top Dentelle', 'Blouse Satinée', 'Chemisier Rayé',
    'Top Brodé', 'Blouse Fluide', 'Top Col V', 'Chemisier Manches Longues'
  ],
  'Pantalons': [
    'Pantalon Large Fluide', 'Pantalon Tailleur', 'Jean Slim', 'Pantalon Cigarette',
    'Pantalon Palazzo', 'Jean Boyfriend', 'Pantalon Carotte', 'Jean Bootcut'
  ],
  'Jupes': [
    'Jupe Midi Plissée', 'Jupe Longue', 'Jupe Courte A-Line', 'Jupe Crayon',
    'Jupe Patineuse', 'Jupe Asymétrique', 'Jupe Portefeuille'
  ],
  'Vestes & Manteaux': [
    'Veste Blazer Noir', 'Trench Coat', 'Veste Jean', 'Manteau Long',
    'Blazer Oversize', 'Veste Courte', 'Cardigan Long'
  ],
  'Accessoires': [
    'Sac À Main Cuir', 'Écharpe Soie', 'Ceinture Dorée', 'Foulard Imprimé',
    'Sac Bandoulière', 'Collier Statement'
  ],
  'Chaussures': [
    'Escarpins Noirs', 'Sandales Talons', 'Baskets Blanches', 'Bottines Cuir'
  ],
  'Ensembles': [
    'Ensemble Tailleur', 'Ensemble Sport Chic', 'Ensemble Coordonné'
  ]
};

// Descriptions
const descriptions = [
  'Pièce intemporelle qui allie confort et élégance. Parfait pour toutes les occasions.',
  'Design moderne et sophistiqué pour un look raffiné. Matière de qualité supérieure.',
  'Style unique qui saura sublimer votre silhouette. Coupe flatteuse et tendance.',
  'Article essentiel de votre garde-robe. Qualité exceptionnelle et finitions soignées.',
  'Créé avec attention aux détails pour un style impeccable. Confort assuré toute la journée.',
  'Pièce versatile qui se marie avec tout. Élégance et modernité réunies.',
  'Design intemporel pour un look chic et actuel. Matériaux nobles et durables.',
  'Style raffiné pour toutes les occasions. Coupe parfaite et qualité premium.'
];

// Sizes
const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const colors = ['Noir', 'Blanc', 'Beige', 'Bleu Marine', 'Rouge', 'Rose', 'Vert', 'Gris'];

// Reset Products
const resetProducts = async () => {
  try {
    await connectDB();

    // Fetch categories and collections
    console.log('📥 Fetching categories and collections...');
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    const collections = await Collection.find({ isActive: true }).sort({ order: 1 });

    if (categories.length === 0) {
      console.error('❌ No categories found. Please create categories first.');
      process.exit(1);
    }

    console.log(`✅ Found ${categories.length} categories:`);
    categories.forEach((cat, idx) => {
      console.log(`   ${idx + 1}. ${cat.name} (ID: ${cat._id})`);
    });

    console.log(`✅ Found ${collections.length} collections:`);
    collections.forEach((col, idx) => {
      console.log(`   ${idx + 1}. ${col.name} (ID: ${col._id})`);
    });

    // Delete all products
    console.log('\n🗑️  Deleting all existing products...');
    const deleteResult = await Product.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} products`);

    // Generate 40 products
    console.log('\n📦 Creating 40 new products...');
    const products = [];
    let productCount = 0;

    for (const category of categories) {
      const categoryNames = productNamesByCategory[category.name] || ['Article Mode'];
      const productsPerCategory = Math.ceil(40 / categories.length);
      
      for (let i = 0; i < productsPerCategory && productCount < 40; i++) {
        const nameIndex = i % categoryNames.length;
        const productName = categoryNames[nameIndex];
        const price = randomPrice(29, 299);
        const hasDiscount = Math.random() > 0.7; // 30% chance of discount
        
        // Randomly assign collection (or none)
        const collection = Math.random() > 0.3 && collections.length > 0 
          ? collections[Math.floor(Math.random() * collections.length)]._id 
          : null;

        const product = {
          name: `${productName} ${i + 1}`,
          slug: `${productName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')}-${productCount + 1}`,
          description: descriptions[Math.floor(Math.random() * descriptions.length)],
          price: price,
          compareAtPrice: hasDiscount ? Math.floor(price * 1.3) : null,
          categories: [category._id],
          productCollection: collection,
          stock: randomStock(),
          sku: `ELG-${category.name.substring(0, 3).toUpperCase()}-${String(productCount + 1).padStart(4, '0')}`,
          sizes: sizes.slice(0, Math.floor(Math.random() * 3) + 3), // 3-5 sizes
          colors: colors.slice(0, Math.floor(Math.random() * 3) + 2), // 2-4 colors
          isActive: true,
          isFeatured: Math.random() > 0.8, // 20% featured
          isNewArrival: Math.random() > 0.7, // 30% new arrivals
          tags: ['Élégance', 'Mode', category.name],
          rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
          reviewCount: Math.floor(Math.random() * 50),
        };

        products.push(product);
        productCount++;
      }
    }

    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Show summary
    console.log('\n📊 Summary by category:');
    for (const category of categories) {
      const count = createdProducts.filter(p => 
        p.categories.some(c => c.toString() === category._id.toString())
      ).length;
      console.log(`   ${category.name}: ${count} products`);
    }

    console.log('\n📊 Summary by collection:');
    for (const collection of collections) {
      const count = createdProducts.filter(p => 
        p.productCollection && p.productCollection.toString() === collection._id.toString()
      ).length;
      console.log(`   ${collection.name}: ${count} products`);
    }

    const noCollection = createdProducts.filter(p => !p.productCollection).length;
    console.log(`   Sans collection: ${noCollection} products`);

    console.log('\n✨ Products reset successfully!');
    console.log('💡 You can now add images to these products through the dashboard.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting products:', error);
    process.exit(1);
  }
};

// Run the script
resetProducts();
