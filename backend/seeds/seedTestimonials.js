// backend/seeds/seedTestimonials.js
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Testimonial Schema (inline for independence)
const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
  },
  company: {
    type: String,
  },
  avatar: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

const testimonials = [
  {
    name: 'Amira Ben Salah',
    position: 'Cliente fidèle',
    avatar: 'https://i.pravatar.cc/150?img=1',
    comment: 'Élégance est devenu ma boutique préférée ! La qualité des vêtements est exceptionnelle et le service client est toujours à l\'écoute. Je recommande vivement !',
    rating: 5,
    isVerified: true,
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Yasmine Trabelsi',
    position: 'Fashionista',
    avatar: 'https://i.pravatar.cc/150?img=5',
    comment: 'J\'adore la nouvelle collection ! Les pièces sont élégantes et parfaitement adaptées au climat tunisien. Livraison rapide et emballage soigné.',
    rating: 5,
    isVerified: true,
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Leila Hamdi',
    position: 'Cliente',
    avatar: 'https://i.pravatar.cc/150?img=9',
    comment: 'Service impeccable ! J\'ai reçu ma commande en 2 jours. Les vêtements correspondent exactement aux photos. Très satisfaite de mon achat.',
    rating: 5,
    isVerified: true,
    isFeatured: false,
    isActive: true,
  },
  {
    name: 'Sarra Mejri',
    position: 'Cliente régulière',
    avatar: 'https://i.pravatar.cc/150?img=10',
    comment: 'Excellente expérience d\'achat ! La qualité est au rendez-vous et les prix sont très compétitifs. Je reviendrai certainement.',
    rating: 5,
    isVerified: true,
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Nour Gharbi',
    position: 'Cliente',
    avatar: 'https://i.pravatar.cc/150?img=16',
    comment: 'Très belle collection pour l\'été ! Les tissus sont légers et confortables. Parfait pour le climat de Tunis.',
    rating: 4,
    isVerified: true,
    isFeatured: false,
    isActive: true,
  },
  {
    name: 'Mariem Kacem',
    position: 'Cliente',
    avatar: 'https://i.pravatar.cc/150?img=20',
    comment: 'Service client réactif et professionnel. J\'ai eu un problème avec ma taille et l\'échange s\'est fait rapidement.',
    rating: 5,
    isVerified: true,
    isFeatured: false,
    isActive: true,
  },
  {
    name: 'Ines Bouazizi',
    position: 'Cliente VIP',
    avatar: 'https://i.pravatar.cc/150?img=24',
    comment: 'La qualité des produits justifie amplement le prix. Je suis cliente depuis 2 ans et toujours satisfaite !',
    rating: 5,
    isVerified: true,
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Salma Jendoubi',
    position: 'Cliente',
    avatar: 'https://i.pravatar.cc/150?img=28',
    comment: 'Belles pièces tendance ! J\'ai reçu beaucoup de compliments en portant ma nouvelle robe. Merci Élégance !',
    rating: 4,
    isVerified: false,
    isFeatured: false,
    isActive: true,
  },
  {
    name: 'Rahma Mansour',
    position: 'Cliente',
    avatar: 'https://i.pravatar.cc/150?img=32',
    comment: 'Produits de qualité supérieure ! Les finitions sont impeccables et le style est vraiment élégant. Je suis ravie de mes achats.',
    rating: 5,
    isVerified: true,
    isFeatured: true,
    isActive: true,
  },
  {
    name: 'Dorra Lakhoua',
    position: 'Cliente',
    avatar: 'https://i.pravatar.cc/150?img=44',
    comment: 'Excellent rapport qualité-prix. Les articles sont conformes à la description et la livraison a été très rapide. Merci !',
    rating: 5,
    isVerified: true,
    isFeatured: false,
    isActive: true,
  },
];

const seedTestimonials = async () => {
  try {
    // Get MongoDB URI with fallback
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elegance';

    console.log('🔌 Connecting to MongoDB...');
    console.log(`   URI: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing testimonials
    await Testimonial.deleteMany({});
    console.log('🗑️  Cleared existing testimonials');

    // Insert new testimonials
    const created = await Testimonial.insertMany(testimonials);
    console.log(`✅ ${created.length} testimonials created successfully!`);

    console.log('\n📊 Testimonials Summary:');
    console.log(`   - Total: ${created.length}`);
    console.log(`   - Featured: ${created.filter(t => t.isFeatured).length}`);
    console.log(`   - Verified: ${created.filter(t => t.isVerified).length}`);
    console.log(`   - Average Rating: ${(created.reduce((sum, t) => sum + t.rating, 0) / created.length).toFixed(1)}`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding testimonials:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedTestimonials();
