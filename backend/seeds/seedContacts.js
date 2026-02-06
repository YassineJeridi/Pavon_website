// backend/seeds/seedContacts.js
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Contact Schema (inline for independence)
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  subject: String,
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  replied: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

const contacts = [
  {
    name: 'Ahmed Messaoudi',
    email: 'ahmed.messaoudi@gmail.com',
    phone: '+216 98 765 432',
    subject: 'Question sur une commande',
    message: 'Bonjour, j\'aimerais savoir si ma commande #ORD-2024-001 a été expédiée. Merci de me tenir informé.',
    read: true,
    replied: true,
    createdAt: new Date('2026-01-20'),
  },
  {
    name: 'Fatma Bouzidi',
    email: 'fatma.bouzidi@yahoo.fr',
    phone: '+216 22 334 556',
    subject: 'Demande de partenariat',
    message: 'Bonjour, je suis influenceuse mode sur Instagram avec 50K followers. Je souhaiterais discuter d\'une collaboration. Cordialement.',
    read: false,
    replied: false,
    createdAt: new Date('2026-01-24'),
  },
  {
    name: 'Mohamed Ali',
    email: 'mohamed.ali@hotmail.com',
    phone: '+216 55 123 789',
    subject: 'Problème de taille',
    message: 'J\'ai reçu mon colis mais la taille ne correspond pas. Comment puis-je procéder à un échange ?',
    read: true,
    replied: true,
    createdAt: new Date('2026-01-22'),
  },
  {
    name: 'Rim Chaabane',
    email: 'rim.chaabane@gmail.com',
    phone: '+216 94 887 665',
    subject: 'Question produit',
    message: 'Bonjour, est-ce que la robe bleue en collection printemps sera bientôt disponible en taille M ?',
    read: true,
    replied: false,
    createdAt: new Date('2026-01-23'),
  },
  {
    name: 'Karim Ferchichi',
    email: 'karim.ferchichi@outlook.com',
    subject: 'Suggestion',
    message: 'Excellente boutique ! Serait-il possible d\'ajouter une collection pour hommes ? Je pense qu\'il y a un marché pour ça.',
    read: false,
    replied: false,
    createdAt: new Date('2026-01-24'),
  },
  {
    name: 'Sonia Dridi',
    email: 'sonia.dridi@gmail.com',
    phone: '+216 26 445 778',
    subject: 'Félicitations',
    message: 'Je voulais simplement vous féliciter pour la qualité de vos produits. J\'ai reçu ma commande et tout est parfait !',
    read: true,
    replied: true,
    createdAt: new Date('2026-01-21'),
  },
  {
    name: 'Hichem Bouali',
    email: 'hichem.bouali@gmail.com',
    phone: '+216 23 556 889',
    subject: 'Livraison retardée',
    message: 'Ma commande devait arriver hier mais je n\'ai toujours rien reçu. Pouvez-vous vérifier le statut SVP ?',
    read: false,
    replied: false,
    createdAt: new Date('2026-01-25'),
  },
  {
    name: 'Nesrine Guesmi',
    email: 'nesrine.guesmi@yahoo.fr',
    phone: '+216 99 223 445',
    subject: 'Catalogue printemps',
    message: 'Quand sera disponible le nouveau catalogue printemps-été ? Merci !',
    read: true,
    replied: true,
    createdAt: new Date('2026-01-19'),
  },
  {
    name: 'Bassem Zouari',
    email: 'bassem.zouari@gmail.com',
    subject: 'Paiement',
    message: 'Est-il possible de payer en plusieurs fois pour les commandes supérieures à 200 TND ?',
    read: false,
    replied: false,
    createdAt: new Date('2026-01-24'),
  },
  {
    name: 'Houda Mansour',
    email: 'houda.mansour@hotmail.com',
    phone: '+216 52 778 990',
    subject: 'Code promo',
    message: 'J\'ai un code promo mais il ne fonctionne pas sur le site. Pouvez-vous m\'aider ?',
    read: true,
    replied: false,
    createdAt: new Date('2026-01-23'),
  },
];

const seedContacts = async () => {
  try {
    // Get MongoDB URI with fallback
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/elegance';
    
    console.log('🔌 Connecting to MongoDB...');
    console.log(`   URI: ${MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing contacts
    await Contact.deleteMany({});
    console.log('🗑️  Cleared existing contacts');

    // Insert new contacts
    const created = await Contact.insertMany(contacts);
    console.log(`✅ ${created.length} contacts created successfully!`);

    console.log('\n📊 Contacts Summary:');
    console.log(`   - Total: ${created.length}`);
    console.log(`   - Read: ${created.filter(c => c.read).length}`);
    console.log(`   - Unread: ${created.filter(c => !c.read).length}`);
    console.log(`   - Replied: ${created.filter(c => c.replied).length}`);
    console.log(`   - Pending: ${created.filter(c => !c.replied).length}`);

    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding contacts:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedContacts();
