// backend/seeds/seedExternalOrders.js
// Seeds 40 random external orders + 10 sample expenses into the database

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const ExternalOrder = require('../models/ExternalOrder');
const Expense = require('../models/Expense');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elegance';

const sources = ['Facebook', 'Instagram', 'WhatsApp', 'Direct Contact', 'Other'];

const customerNames = [
  'Amine Ben Ali', 'Sarra Mansouri', 'Mohamed Trabelsi', 'Yasmine Bouazizi',
  'Karim Jebali', 'Fatma Chaaben', 'Omar Tlili', 'Rania Hamdi',
  'Nizar Khlifi', 'Ines Belhadj', 'Walid Sfar', 'Amira Dridi',
  'Hichem Guesmi', 'Mariem Jaziri', 'Bilel Mrad', 'Nour Sassi',
  'Sofiane Riahi', 'Hajer Mejri', 'Aymen Gharbi', '',
];

const notesList = [
  'Commande via message direct', 'Livraison express demandée', 'Client fidèle - réduction appliquée',
  'Paiement à la livraison', 'Commande groupée', 'Cadeau - emballage spécial',
  'Demande de suivi', 'Retour possible sous 7 jours', 'Taille personnalisée',
  'Couleur spéciale demandée', '', '', '', '',
];

const expenseLabels = [
  { label: 'Achat tissu coton', category: 'Matières premières' },
  { label: 'Frais de livraison Aramex', category: 'Livraison' },
  { label: 'Publicité Instagram', category: 'Marketing' },
  { label: 'Loyer atelier janvier', category: 'Loyer' },
  { label: 'Salaire couturière', category: 'Salaires' },
  { label: 'Achat boutons et fermetures', category: 'Matières premières' },
  { label: 'Frais de livraison local', category: 'Livraison' },
  { label: 'Boost Facebook Ads', category: 'Marketing' },
  { label: 'Emballages et packaging', category: 'Autre' },
  { label: 'Frais photographe produit', category: 'Marketing' },
];

function randomDate(daysBack = 90) {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

function randomAmount(min = 25, max = 350) {
  return Math.round((min + Math.random() * (max - min)) * 1000) / 1000;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await ExternalOrder.deleteMany({});
    await Expense.deleteMany({});
    console.log('🗑️  Cleared existing external orders & expenses');

    // Generate 40 random external orders
    const orders = [];
    for (let i = 0; i < 40; i++) {
      orders.push({
        source: pick(sources),
        amount: randomAmount(),
        date: randomDate(),
        customerName: pick(customerNames),
        notes: pick(notesList),
      });
    }

    const insertedOrders = await ExternalOrder.insertMany(orders);
    console.log(`✅ Inserted ${insertedOrders.length} external orders`);

    // Generate 10 sample expenses
    const expenses = expenseLabels.map((e) => ({
      label: e.label,
      amount: randomAmount(20, 500),
      date: randomDate(60),
      category: e.category,
      notes: '',
    }));

    const insertedExpenses = await Expense.insertMany(expenses);
    console.log(`✅ Inserted ${insertedExpenses.length} expenses`);

    console.log('\n🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
}

seed();
