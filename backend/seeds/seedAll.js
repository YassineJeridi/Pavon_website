// backend/seeds/seedAll.js
// Seeds: Admin, TopBanners, Banners, Categories, Collections, Products, Testimonials
// Images reference the local /uploads folder

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');

const Admin       = require('../models/Admin');
const TopBanner   = require('../models/TopBanner');
const Banner      = require('../models/Banner');
const Category    = require('../models/Category');
const Collection  = require('../models/Collection');
const Product     = require('../models/Product');
const Testimonial = require('../models/Testimonial');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elegance';

// ─────────────────────────────────────────────
// ADMIN
// ─────────────────────────────────────────────

const adminData = {
  firstName: 'Admin',
  lastName:  'Pavone Collection',
  email:     'admin@elegance.tn',
  password:  'Admin@123456',
  role:      'super_admin',
  isActive:  true,
};

// ─────────────────────────────────────────────
// TOP BANNERS
// ─────────────────────────────────────────────

const topBannersData = [
  { text: '✨ Livraison gratuite en Tunisie dès 150 TND d’achat', isActive: true },
  { text: '📦 Retour gratuit sous 14 jours — Satisfait ou Remboursé', isActive: true },
  { text: '💎 Nouvelle collection Pavone disponible — Découvrez nos dernières tendances', isActive: true, link: '/collections' },
];

// ─────────────────────────────────────────────
// DATA DEFINITIONS
// ─────────────────────────────────────────────

const bannersData = [
  { title: 'Nouvelle Saison', subtitle: 'Découvrez nos dernières tendances', description: 'Collection printemps-été avec des pièces uniques pour toutes les occasions.', image: '/uploads/banners/item_1770344176931.jpg', buttonText: 'Découvrir', position: 'hero', order: 1, isActive: true },
  { title: 'Style Intemporel', subtitle: 'Élégance au quotidien', description: 'Des vêtements qui traversent les saisons avec style et raffinement.', image: '/uploads/banners/item_1770344210396.jpg', buttonText: 'Explorer', position: 'hero', order: 2, isActive: true },
  { title: 'Collection Exclusive', subtitle: 'Pièces en édition limitée', description: 'Des créations exclusives pour femmes exigeantes.', image: '/uploads/banners/item_1770344216084.jpg', buttonText: 'Voir la collection', position: 'promotional', order: 3, isActive: true },
  { title: 'Soirées Parfaites', subtitle: 'Tenues de prestige', description: 'Habillez-vous avec élégance pour chaque occasion spéciale.', image: '/uploads/banners/item_1770344220327.jpg', buttonText: 'Acheter maintenant', position: 'hero', order: 4, isActive: true },
  { title: 'Mode Urbaine', subtitle: 'Casual & Chic', description: 'Le parfait équilibre entre confort moderne et élégance urbaine.', image: '/uploads/banners/item_1770344224848.jpg', buttonText: 'Voir plus', position: 'promotional', order: 5, isActive: true },
  { title: 'Prêt-à-Porter Premium', subtitle: 'Qualité et sophistication', description: 'Des matières nobles et des coupes parfaites pour sublimer votre silhouette.', image: '/uploads/banners/item_1770344229129.jpg', buttonText: 'Découvrir', position: 'hero', order: 6, isActive: true },
  { title: 'Inspiration du Moment', subtitle: 'Tendances actuelles', description: 'Restez à la pointe de la mode avec nos dernières inspirations.', image: '/uploads/banners/item_1770344233545.jpg', buttonText: 'Explorer', position: 'category', order: 7, isActive: true },
];

const categoriesData = [
  { name: 'Robes', slug: 'robes', description: 'Une sélection de robes pour toutes les occasions, du quotidien aux soirées.', image: '/uploads/categories/robes_1770344022184.jpg', order: 1, isActive: true },
  { name: 'Tops & Chemises', slug: 'tops-chemises', description: 'Tops, chemises et blouses tendance pour un look parfait au quotidien.', image: '/uploads/categories/tops-chemises_1770344028092.jpg', order: 2, isActive: true },
  { name: 'Pantalons & Jeans', slug: 'pantalons-jeans', description: 'Pantalons classiques, jeans modernes et coupes tendance.', image: '/uploads/categories/pantalons-jeans_1770344032340.jpg', order: 3, isActive: true },
  { name: 'Vêtements de Sport', slug: 'vetements-sport', description: 'Tenues sportswear alliant performance et style.', image: '/uploads/categories/vetements-sport_1770344049119.jpg', order: 4, isActive: true },
  { name: 'Accessoires', slug: 'accessoires', description: 'Sacs, ceintures, écharpes et autres accessoires pour compléter votre tenue.', image: '/uploads/categories/accessoires_1770344067032.jpg', order: 5, isActive: true },
];

const collectionsData = [
  { name: 'Urban Chic', slug: 'urban-chic', description: "Une collection urbaine et sophistiquée pour la femme moderne de la ville.", image: '/uploads/collections/collection-urban-chic_1769726613676.jpg', isFeatured: true, isActive: true, order: 1 },
  { name: 'Minimaliste', slug: 'minimaliste', description: "Lignes épurées et couleurs neutres pour un style intemporel et élégant.", image: '/uploads/collections/collection-minimaliste_1769726624453.jpg', isFeatured: true, isActive: true, order: 2 },
  { name: 'Glamour Soirée', slug: 'glamour-soiree', description: "Des tenues spectaculaires pour briller lors de vos soirées et événements.", image: '/uploads/collections/collection-glamour-soiree_1769726632667.jpg', isFeatured: true, isActive: true, order: 3 },
  { name: 'Sport Style', slug: 'sport-style', description: "Le sportswear qui allie performance, confort et tendance mode.", image: '/uploads/collections/collection-sport-style_1769726638987.jpg', isFeatured: false, isActive: true, order: 4 },
  { name: 'Romantic Dreams', slug: 'romantic-dreams', description: "Dentelles, volants et matières douces pour un style romantique et féminin.", image: '/uploads/collections/collection-romantic-dreams_1769726644521.jpg', isFeatured: true, isActive: true, order: 5 },
  { name: 'Été Méditerranéen', slug: 'ete-mediterraneen', description: "Couleurs vives et tissus légers inspirés du soleil méditerranéen.", image: '/uploads/collections/collection-ete-mediterraneen_1769726654637.jpg', isFeatured: false, isActive: true, order: 6 },
  { name: 'Vintage Renaissance', slug: 'vintage-renaissance', description: "Un retour aux inspirations vintage revisitées avec un regard contemporain.", image: '/uploads/collections/collection-vintage-renaissance_1769726658845.jpg', isFeatured: false, isActive: true, order: 7 },
  { name: 'Casual Chic', slug: 'casual-chic', description: "Le mariage parfait entre décontracté et élégance pour le quotidien.", image: '/uploads/collections/collection-casual-chic_1770343717549.jpg', isFeatured: true, isActive: true, order: 8 },
  { name: 'Soirée', slug: 'soiree', description: "Des robes et tenues de soirée pour des moments inoubliables.", image: '/uploads/collections/collection-soiree_1770343723255.jpg', isFeatured: false, isActive: true, order: 9 },
  { name: 'Nouvelle Collection Printemps', slug: 'nouvelle-collection-printemps', description: "Découvrez les nouvelles tendances de la saison printanière.", image: '/uploads/collections/nouvelle-collection-printemps_1770343709270.jpg', isFeatured: true, isActive: true, order: 10 },
];

// Products referencing category & collection by local index (resolved after insert)
const productsTemplate = [
  {
    name: 'Robe Fleurie Bohème',
    slug: 'robe-fleurie-boheme',
    description: 'Une magnifique robe fleurie de style bohème, parfaite pour les journées estivales. Tissu léger et respirant.',
    price: 89.99,
    comparePrice: 119.99,
    images: ['/uploads/products/images-1769729661582-60741290.jpg', '/uploads/products/images-1769729661582-837255541.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Multicolore', 'Blanc'],
    stock: 45,
    sku: 'ROB-FLR-001',
    featured: true,
    bestseller: false,
    isActive: true,
    tags: ['robe', 'fleurie', 'bohème', 'été'],
    materials: ['Viscose', 'Polyester'],
    categoryIndex: 0,   // Robes
    collectionIndex: 5, // Été Méditerranéen
  },
  {
    name: 'Robe Midi Élégante',
    slug: 'robe-midi-elegante',
    description: 'Robe midi à coupe ajustée, idéale pour les occasions semi-formelles. Finitions soignées et tissu de qualité.',
    price: 120.00,
    comparePrice: 150.00,
    images: ['/uploads/products/images-1769732563048-147185426.jpg', '/uploads/products/images-1769732563049-666601931.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Bordeaux'],
    stock: 30,
    sku: 'ROB-MDI-002',
    featured: true,
    bestseller: true,
    isActive: true,
    tags: ['robe', 'midi', 'élégante'],
    materials: ['Crêpe', 'Élasthanne'],
    categoryIndex: 0,   // Robes
    collectionIndex: 2, // Glamour Soirée
  },
  {
    name: 'Robe de Soirée Noire',
    slug: 'robe-soiree-noire',
    description: 'Robe de soirée longue en satin noir avec décolleté en V. Une pièce incontournable pour vos soirées.',
    price: 179.99,
    comparePrice: 220.00,
    images: [
      '/uploads/products/images-1769732603169-605581584.jpg',
      '/uploads/products/images-1769732603169-709907797.jpg',
      '/uploads/products/images-1769732603169-890915369.jpg',
      '/uploads/products/images-1769732603171-718414639.jpg',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Noir'],
    stock: 20,
    sku: 'ROB-SOI-003',
    featured: true,
    bestseller: true,
    isActive: true,
    tags: ['robe', 'soirée', 'noire', 'satin'],
    materials: ['Satin', 'Doublure polyester'],
    categoryIndex: 0,   // Robes
    collectionIndex: 8, // Soirée
  },
  {
    name: 'Top Femme Fluide',
    slug: 'top-femme-fluide',
    description: 'Top fluide avec manches légères, parfait pour les journées chaudes. Coupe décontractée et élégante.',
    price: 45.00,
    comparePrice: 60.00,
    images: ['/uploads/products/images-1769732937694-616884695.jpg', '/uploads/products/images-1769732937694-804713680.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blanc', 'Beige', 'Rose'],
    stock: 60,
    sku: 'TOP-FLU-001',
    featured: false,
    bestseller: true,
    isActive: true,
    tags: ['top', 'fluide', 'été'],
    materials: ['Viscose'],
    categoryIndex: 1,   // Tops & Chemises
    collectionIndex: 0, // Urban Chic
  },
  {
    name: 'Chemise Structurée',
    slug: 'chemise-structuree',
    description: 'Chemise à col classique, coupe structurée. Idéale pour un look professionnel ou casual chic.',
    price: 65.00,
    comparePrice: 85.00,
    images: ['/uploads/products/images-1769732961207-313545229.jpg', '/uploads/products/images-1769732961207-935489790.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blanc', 'Bleu clair', 'Rayé'],
    stock: 50,
    sku: 'CHE-STR-001',
    featured: false,
    bestseller: false,
    isActive: true,
    tags: ['chemise', 'structurée', 'classique'],
    materials: ['Coton', 'Polyester'],
    categoryIndex: 1,   // Tops & Chemises
    collectionIndex: 1, // Minimaliste
  },
  {
    name: 'Top Romantique en Dentelle',
    slug: 'top-romantique-dentelle',
    description: 'Top délicat avec empiècements en dentelle. Une pièce romantique pour sublimer votre style féminin.',
    price: 55.00,
    comparePrice: 70.00,
    images: ['/uploads/products/images-1769732972239-802082040.jpg', '/uploads/products/images-1769732972239-950234806.jpg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Blanc', 'Ivoire', 'Rose pâle'],
    stock: 35,
    sku: 'TOP-DEN-002',
    featured: true,
    bestseller: false,
    isActive: true,
    tags: ['top', 'dentelle', 'romantique'],
    materials: ['Dentelle', 'Coton'],
    categoryIndex: 1,   // Tops & Chemises
    collectionIndex: 4, // Romantic Dreams
  },
  {
    name: 'Pantalon Tailleur Noir',
    slug: 'pantalon-tailleur-noir',
    description: 'Pantalon tailleur à coupe droite en tissu premium. Une pièce essentielle de votre garde-robe professionnelle.',
    price: 95.00,
    comparePrice: 120.00,
    images: ['/uploads/products/images-1769732979231-500164001.jpg', '/uploads/products/images-1769732979231-643944372.jpg'],
    sizes: ['34', '36', '38', '40', '42', '44'],
    colors: ['Noir', 'Gris anthracite', 'Marine'],
    stock: 40,
    sku: 'PAN-TAI-001',
    featured: false,
    bestseller: true,
    isActive: true,
    tags: ['pantalon', 'tailleur', 'noir'],
    materials: ['Laine mélangée', 'Polyester'],
    categoryIndex: 2,   // Pantalons & Jeans
    collectionIndex: 0, // Urban Chic
  },
  {
    name: 'Jean Slim Premium',
    slug: 'jean-slim-premium',
    description: 'Jean slim stretch de haute qualité pour un confort optimal et un look impeccable toute la journée.',
    price: 79.99,
    comparePrice: 99.99,
    images: ['/uploads/products/images-1769732998537-258575964.jpg', '/uploads/products/images-1769732998538-940142523.jpg'],
    sizes: ['34', '36', '38', '40', '42', '44'],
    colors: ['Bleu denim', 'Noir délavé', 'Blanc'],
    stock: 55,
    sku: 'JEA-SLI-001',
    featured: false,
    bestseller: true,
    isActive: true,
    tags: ['jean', 'slim', 'denim'],
    materials: ['Coton', 'Élasthanne'],
    categoryIndex: 2,   // Pantalons & Jeans
    collectionIndex: 7, // Casual Chic
  },
  {
    name: 'Pantalon Palazzo',
    slug: 'pantalon-palazzo',
    description: 'Pantalon palazzo coupe palazzo fluide, élégant et confortable. Parfait pour les sorties décontractées.',
    price: 69.99,
    comparePrice: 89.99,
    images: ['/uploads/products/images-1769733076747-972248947.jpg', '/uploads/products/images-1769733076749-339504763.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Kaki', 'Camel'],
    stock: 42,
    sku: 'PAN-PAL-002',
    featured: false,
    bestseller: false,
    isActive: true,
    tags: ['pantalon', 'palazzo', 'fluide'],
    materials: ['Viscose', 'Lin'],
    categoryIndex: 2,   // Pantalons & Jeans
    collectionIndex: 5, // Été Méditerranéen
  },
  {
    name: 'Ensemble Sport Tendance',
    slug: 'ensemble-sport-tendance',
    description: 'Ensemble sportwear deux pièces alliant style et performance. Top et legging coordonnés pour un look parfait à la salle.',
    price: 85.00,
    comparePrice: 110.00,
    images: ['/uploads/products/images-1769733616152-384431398.jpg', '/uploads/products/images-1769733616152-472167711.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Rose fuschia', 'Bleu électrique'],
    stock: 38,
    sku: 'SPO-ENS-001',
    featured: true,
    bestseller: false,
    isActive: true,
    tags: ['sport', 'ensemble', 'legging'],
    materials: ['Polyamide', 'Élasthanne'],
    categoryIndex: 3,   // Vêtements de Sport
    collectionIndex: 3, // Sport Style
  },
  {
    name: 'Legging Sport Sculptant',
    slug: 'legging-sport-sculptant',
    description: 'Legging gainant haute performance avec technologie sculptante. Taille haute pour maintien optimal.',
    price: 55.00,
    comparePrice: 70.00,
    images: [
      '/uploads/products/images-1769733625299-295534529.jpg',
      '/uploads/products/images-1769733625300-143908030.jpg',
      '/uploads/products/images-1769733625301-740563729.jpg',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Noir', 'Gris', 'Bleu marine'],
    stock: 65,
    sku: 'LEG-SPO-001',
    featured: false,
    bestseller: true,
    isActive: true,
    tags: ['legging', 'sport', 'sculptant'],
    materials: ['Polyamide', 'Élasthanne'],
    categoryIndex: 3,   // Vêtements de Sport
    collectionIndex: 3, // Sport Style
  },
  {
    name: 'Veste de Sport Zippée',
    slug: 'veste-sport-zippee',
    description: 'Veste de sport légère avec zip intégral. Idéale pour le running et les activités en extérieur.',
    price: 75.00,
    comparePrice: 95.00,
    images: ['/uploads/products/images-1769733634496-358022781.jpg', '/uploads/products/images-1769733634496-564710434.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Blanc', 'Corail'],
    stock: 28,
    sku: 'VES-SPO-001',
    featured: false,
    bestseller: false,
    isActive: true,
    tags: ['veste', 'sport', 'zip'],
    materials: ['Polyester', 'Spandex'],
    categoryIndex: 3,   // Vêtements de Sport
    collectionIndex: 3, // Sport Style
  },
  {
    name: 'Sac à Main Cuir Premium',
    slug: 'sac-main-cuir-premium',
    description: 'Sac à main en cuir véritable avec coutures soignées. Plusieurs compartiments pour ranger vos essentiels.',
    price: 149.99,
    comparePrice: 200.00,
    images: ['/uploads/products/images-1769733643795-241542693.jpg', '/uploads/products/images-1769733643795-456288677.jpg'],
    sizes: ['S', 'M'],
    colors: ['Noir', 'Camel', 'Bordeaux'],
    stock: 18,
    sku: 'SAC-CUI-001',
    featured: true,
    bestseller: false,
    isActive: true,
    tags: ['sac', 'cuir', 'main'],
    materials: ['Cuir naturel'],
    categoryIndex: 4,   // Accessoires
    collectionIndex: 2, // Glamour Soirée
  },
  {
    name: 'Ceinture Élégante',
    slug: 'ceinture-elegante',
    description: 'Ceinture en cuir avec boucle dorée. Accessoire incontournable pour structurer vos tenues.',
    price: 35.00,
    comparePrice: 50.00,
    images: ['/uploads/products/images-1769733652399-217320620.jpg', '/uploads/products/images-1769733652402-637461528.jpg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Marron', 'Blanc'],
    stock: 70,
    sku: 'CEI-ELE-001',
    featured: false,
    bestseller: false,
    isActive: true,
    tags: ['ceinture', 'cuir', 'accessoire'],
    materials: ['Cuir synthétique'],
    categoryIndex: 4,   // Accessoires
    collectionIndex: 1, // Minimaliste
  },
  {
    name: 'Écharpe en Soie',
    slug: 'echarpe-en-soie',
    description: 'Écharpe légère en soie naturelle aux motifs floraux. Un accessoire raffiné pour toutes saisons.',
    price: 65.00,
    comparePrice: 85.00,
    images: ['/uploads/products/images-1769733659342-929845986.jpg', '/uploads/products/images-1769733659346-539773795.jpg'],
    sizes: ['S'],
    colors: ['Multicolore', 'Rose', 'Bleu'],
    stock: 25,
    sku: 'ECH-SOI-001',
    featured: false,
    bestseller: false,
    isActive: true,
    tags: ['écharpe', 'soie', 'accessoire'],
    materials: ['Soie'],
    categoryIndex: 4,   // Accessoires
    collectionIndex: 4, // Romantic Dreams
  },
  {
    name: 'Robe Vintage Fleurie',
    slug: 'robe-vintage-fleurie',
    description: 'Robe vintage aux motifs floraux des années 60. Jupe évasée et ceinture intégrée pour une silhouette parfaite.',
    price: 99.99,
    comparePrice: 130.00,
    images: ['/uploads/products/images-1769737828052-117393681.jpg', '/uploads/products/images-1769737828053-600184371.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Multicolore fond rouge', 'Multicolore fond bleu'],
    stock: 22,
    sku: 'ROB-VIN-004',
    featured: true,
    bestseller: false,
    isActive: true,
    tags: ['robe', 'vintage', 'fleurie'],
    materials: ['Coton', 'Viscose'],
    categoryIndex: 0,   // Robes
    collectionIndex: 6, // Vintage Renaissance
  },
  {
    name: 'Chemise Bohème Brodée',
    slug: 'chemise-boheme-brodee',
    description: 'Chemise bohème avec broderies colorées à la main. Style artisanal pour un look unique et authentique.',
    price: 75.00,
    comparePrice: 95.00,
    images: ['/uploads/products/images-1769737838447-501189951.jpg', '/uploads/products/images-1769737838447-813366030.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blanc', 'Bleu marine'],
    stock: 30,
    sku: 'CHE-BOH-002',
    featured: false,
    bestseller: false,
    isActive: true,
    tags: ['chemise', 'bohème', 'brodée'],
    materials: ['Coton brodé'],
    categoryIndex: 1,   // Tops & Chemises
    collectionIndex: 6, // Vintage Renaissance
  },
  {
    name: 'Robe Printanière Pastel',
    slug: 'robe-printaniere-pastel',
    description: "Robe légère aux couleurs pastels, parfaite pour célébrer l'arrivée du printemps avec fraîcheur.",
    price: 85.00,
    comparePrice: 105.00,
    images: ['/uploads/products/images-1769737846144-85027966.jpg', '/uploads/products/images-1769737846146-269014180.jpg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Rose pâle', 'Lavande', 'Menthe'],
    stock: 33,
    sku: 'ROB-PRI-005',
    featured: true,
    bestseller: false,
    isActive: true,
    tags: ['robe', 'printemps', 'pastel'],
    materials: ['Mousseline', 'Soie'],
    categoryIndex: 0,   // Robes
    collectionIndex: 9, // Nouvelle Collection Printemps
  },
  {
    name: 'Jean Wide Leg',
    slug: 'jean-wide-leg',
    description: 'Jean wide leg tendance avec coupe ample et taille haute. Le pantalon culte de la saison.',
    price: 89.99,
    comparePrice: 115.00,
    images: ['/uploads/products/images-1769737856233-315021277.jpg', '/uploads/products/images-1769737856234-668223070.jpg'],
    sizes: ['34', '36', '38', '40', '42', '44', '46'],
    colors: ['Bleu clair', 'Blanc', 'Noir'],
    stock: 48,
    sku: 'JEA-WID-002',
    featured: false,
    bestseller: true,
    isActive: true,
    tags: ['jean', 'wide leg', 'tendance'],
    materials: ['Denim coton'],
    categoryIndex: 2,   // Pantalons & Jeans
    collectionIndex: 9, // Nouvelle Collection Printemps
  },
  {
    name: 'Top Crop Sport',
    slug: 'top-crop-sport',
    description: 'Top crop respirant pour le sport et le yoga. Tissu technique anti-transpiration.',
    price: 39.99,
    comparePrice: 55.00,
    images: ['/uploads/products/images-1769737873700-719390066.jpg', '/uploads/products/images-1769737873701-346092140.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Rose', 'Vert'],
    stock: 52,
    sku: 'TOP-CRP-003',
    featured: false,
    bestseller: false,
    isActive: true,
    tags: ['top', 'crop', 'sport'],
    materials: ['Polyamide', 'Élasthanne'],
    categoryIndex: 3,   // Vêtements de Sport
    collectionIndex: 3, // Sport Style
  },
  {
    name: 'Robe Casual Chic',
    slug: 'robe-casual-chic',
    description: 'Robe casual chic polyvalente, du bureau au dîner. Coupe flatteuse adaptée à toutes les morphologies.',
    price: 75.00,
    comparePrice: 95.00,
    images: ['/uploads/products/images-1769737881737-537135292.jpg', '/uploads/products/images-1769737881737-763825544.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Bleu canard', 'Vert olive', 'Taupe'],
    stock: 40,
    sku: 'ROB-CAS-006',
    featured: false,
    bestseller: true,
    isActive: true,
    tags: ['robe', 'casual', 'chic'],
    materials: ['Jersey', 'Viscose'],
    categoryIndex: 0,   // Robes
    collectionIndex: 7, // Casual Chic
  },
  {
    name: 'Blazer Structuré Oversize',
    slug: 'blazer-structure-oversize',
    description: 'Blazer oversize à épaules structurées, tendance et élégant. La pièce star du vestiaire urbain.',
    price: 115.00,
    comparePrice: 150.00,
    images: ['/uploads/products/images-1769737888613-171545392.jpg', '/uploads/products/images-1769737888613-893113098.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Camel', 'Noir', 'Gris'],
    stock: 25,
    sku: 'BLA-OVE-001',
    featured: true,
    bestseller: false,
    isActive: true,
    tags: ['blazer', 'oversize', 'structuré'],
    materials: ['Laine', 'Polyester'],
    categoryIndex: 1,   // Tops & Chemises
    collectionIndex: 0, // Urban Chic
  },
  {
    name: 'Robe Minimaliste Épurée',
    slug: 'robe-minimaliste-epuree',
    description: 'Robe aux lignes épurées et minimalistes. Design intemporel pour un style sophistiqué au quotidien.',
    price: 105.00,
    comparePrice: 135.00,
    images: ['/uploads/products/images-1769737896436-654122997.jpg', '/uploads/products/images-1769737896438-886001519.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Noir', 'Écru', 'Gris perle'],
    stock: 35,
    sku: 'ROB-MIN-007',
    featured: true,
    bestseller: false,
    isActive: true,
    tags: ['robe', 'minimaliste', 'épurée'],
    materials: ['Crêpe premium'],
    categoryIndex: 0,   // Robes
    collectionIndex: 1, // Minimaliste
  },
  {
    name: 'Pantalon Cargo Tendance',
    slug: 'pantalon-cargo-tendance',
    description: 'Pantalon cargo revisité avec poches plaquées et coupe moderne. Style streetwear chic.',
    price: 85.00,
    comparePrice: 105.00,
    images: ['/uploads/products/images-1769737903644-193110810.jpg', '/uploads/products/images-1769737903644-194586808.jpg'],
    sizes: ['34', '36', '38', '40', '42', '44'],
    colors: ['Kaki', 'Noir', 'Gris'],
    stock: 33,
    sku: 'PAN-CAR-003',
    featured: false,
    bestseller: false,
    isActive: true,
    tags: ['pantalon', 'cargo', 'streetwear'],
    materials: ['Coton', 'Polyester'],
    categoryIndex: 2,   // Pantalons & Jeans
    collectionIndex: 0, // Urban Chic
  },
  {
    name: 'Top Chic Brillant',
    slug: 'top-chic-brillant',
    description: 'Top brillant pour les soirées avec finition satinée. Élégance instantanée pour vos nuits glamour.',
    price: 65.00,
    comparePrice: 85.00,
    images: ['/uploads/products/images-1769737911515-171326181.jpg', '/uploads/products/images-1769737911517-451135565.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Or', 'Argent', 'Noir'],
    stock: 20,
    sku: 'TOP-CHI-004',
    featured: true,
    bestseller: false,
    isActive: true,
    tags: ['top', 'brillant', 'soirée'],
    materials: ['Satin', 'Polyester'],
    categoryIndex: 1,   // Tops & Chemises
    collectionIndex: 2, // Glamour Soirée
  },
  {
    name: 'Robe Été Légère',
    slug: 'robe-ete-legere',
    description: "Robe d'été légère aux imprimés colorés. Confort maximal pour vos journées estivales.",
    price: 59.99,
    comparePrice: 79.99,
    images: ['/uploads/products/images-1769737919724-156324296.jpg', '/uploads/products/images-1769737919724-406205684.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Multicolore', 'Jaune', 'Orange'],
    stock: 50,
    sku: 'ROB-ETE-008',
    featured: false,
    bestseller: true,
    isActive: true,
    tags: ['robe', 'été', 'légère'],
    materials: ['Coton léger'],
    categoryIndex: 0,   // Robes
    collectionIndex: 5, // Été Méditerranéen
  },
  {
    name: 'Ensemble Ville Sophistiqué',
    slug: 'ensemble-ville-sophistique',
    description: 'Ensemble deux pièces pantalon + blazer coordonnés pour une allure sophistiquée en ville.',
    price: 189.99,
    comparePrice: 240.00,
    images: ['/uploads/products/images-1769737926782-398295780.jpg', '/uploads/products/images-1769737926783-452773004.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Bleu nuit', 'Rose poudré'],
    stock: 18,
    sku: 'ENS-VIL-001',
    featured: true,
    bestseller: false,
    isActive: true,
    tags: ['ensemble', 'ville', 'sophistiqué'],
    materials: ['Tweed', 'Polyester'],
    categoryIndex: 1,   // Tops & Chemises
    collectionIndex: 9, // Nouvelle Collection Printemps
  },
  {
    name: 'Robe Romantique Pastel',
    slug: 'robe-romantique-pastel',
    description: 'Robe romantique aux tons pastels avec volants et dentelle. La pièce phare de la collection Romantic Dreams.',
    price: 135.00,
    comparePrice: 170.00,
    images: ['/uploads/products/images-1769738487573-240660150.jpg', '/uploads/products/images-1769738487574-558594496.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Rose poudrée', 'Lilas', 'Pêche'],
    stock: 22,
    sku: 'ROB-ROM-009',
    featured: true,
    bestseller: true,
    isActive: true,
    tags: ['robe', 'romantique', 'pastel', 'dentelle'],
    materials: ['Mousseline', 'Dentelle'],
    categoryIndex: 0,   // Robes
    collectionIndex: 4, // Romantic Dreams
  },
];

const testimonialsData = [
  {
    name: 'Sophie Martin',
    position: 'Styliste',
    company: 'Maison Martin',
    avatar: '/uploads/testimonials/testimonials_1.jpg',
    rating: 5,
    comment: "J'ai commandé plusieurs pièces et je suis absolument ravie de la qualité! Les matières sont luxueuses et les coupes parfaitement flatteuses. Je recommande vivement!",
    isVerified: true,
    isFeatured: true,
    isActive: true,
    order: 1,
  },
  {
    name: 'Léa Dubois',
    position: 'Blogueuse Mode',
    company: 'LéaStyle',
    avatar: '/uploads/testimonials/testimonials_2.jpg',
    rating: 5,
    comment: "Des vêtements d'une qualité exceptionnelle avec des designs uniques. J'ai reçu de nombreux compliments sur ma robe de soirée. Service client impeccable!",
    isVerified: true,
    isFeatured: true,
    isActive: true,
    order: 2,
  },
  {
    name: 'Camille Rousseau',
    position: 'Chef de Projet',
    company: 'Agence Créa',
    avatar: '/uploads/testimonials/testimonials_3.jpg',
    rating: 4,
    comment: "Livraison rapide et emballage soigné. Les vêtements são exactement comme sur les photos. Je suis cliente depuis un an et je ne suis jamais déçue!",
    isVerified: true,
    isFeatured: false,
    isActive: true,
    order: 3,
  },
  {
    name: 'Emma Bernard',
    position: 'Photographe',
    company: 'Studio Emma',
    avatar: '/uploads/testimonials/testimonials_4.jpg',
    rating: 5,
    comment: "La qualité des tissus est remarquable! Mes commandes arrivent toujours bien emballées et correspondent parfaitement aux descriptions. Je ne commande plus ailleurs.",
    isVerified: true,
    isFeatured: true,
    isActive: true,
    order: 4,
  },
  {
    name: 'Julie Moreau',
    position: 'Architecte',
    company: 'Cabinet Moreau',
    avatar: '/uploads/testimonials/testimonials_5.jpg',
    rating: 5,
    comment: "Une boutique en ligne qui allie parfaitement esthétique et qualité. Chaque pièce est une oeuvre d'art portée. Je suis fan de la collection Urban Chic!",
    isVerified: false,
    isFeatured: true,
    isActive: true,
    order: 5,
  },
  {
    name: 'Clara Lambert',
    position: 'Directrice Marketing',
    company: 'Luxe & Mode',
    avatar: '/uploads/testimonials/testimonials_6.jpg',
    rating: 5,
    comment: "Service exceptionnel du début à la fin. La qualité des produits surpasse toutes mes attentes. Je recommande cette boutique à toutes mes amies!",
    isVerified: true,
    isFeatured: false,
    isActive: true,
    order: 6,
  },
  {
    name: 'Inès Petit',
    position: 'Avocate',
    company: 'Cabinet Petit & Associés',
    avatar: '/uploads/testimonials/testimonials_7.jpg',
    rating: 4,
    comment: "Enfin une boutique qui propose de vraies tailles et des coupes adaptées à une vraie silhouette! Les vêtements sont beaux, confortables et durables.",
    isVerified: true,
    isFeatured: false,
    isActive: true,
    order: 7,
  },
];

// ─────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────

async function seed() {
  console.log('🔌 Connecting to MongoDB:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected\n');

  // ── Clear existing data ──────────────────────────────
  console.log('🗑️  Clearing existing data...');
  await Promise.all([
    Admin.deleteMany({}),
    TopBanner.deleteMany({}),
    Banner.deleteMany({}),
    Category.deleteMany({}),
    Collection.deleteMany({}),
    Product.deleteMany({}),
    Testimonial.deleteMany({}),
  ]);
  console.log('   ✓ Cleared\n');

  // ── Seed Admin ───────────────────────────────────────────
  console.log('🔐 Seeding admin...');
  // Plain password — Admin model pre('save') hook hashes it
  const admin = await Admin.create({ ...adminData });
  console.log(`   ✓ Admin created: ${admin.email}\n`);

  // ── Seed Top Banners ────────────────────────────────────
  console.log('🏗️  Seeding top banners...');
  const topBanners = await TopBanner.insertMany(topBannersData);
  console.log(`   ✓ ${topBanners.length} top banners inserted\n`);

  // ── Seed Banners ─────────────────────────────────────
  console.log('📸 Seeding banners...');
  const banners = await Banner.insertMany(bannersData);
  console.log(`   ✓ ${banners.length} banners inserted\n`);

  // ── Seed Categories ──────────────────────────────────
  console.log('🏷️  Seeding categories...');
  const categories = await Category.insertMany(categoriesData);
  console.log(`   ✓ ${categories.length} categories inserted\n`);

  // ── Seed Collections ─────────────────────────────────
  console.log('📦 Seeding collections...');
  const collections = await Collection.insertMany(collectionsData);
  console.log(`   ✓ ${collections.length} collections inserted\n`);

  // ── Seed Products (resolve category/collection refs) ─
  console.log('👗 Seeding products...');
  const productsToInsert = productsTemplate.map(({ categoryIndex, collectionIndex, ...p }) => ({
    ...p,
    categories: [categories[categoryIndex]._id],
    productCollection: collections[collectionIndex]._id,
  }));
  const products = await Product.insertMany(productsToInsert);
  console.log(`   ✓ ${products.length} products inserted\n`);

  // ── Seed Testimonials ────────────────────────────────
  console.log('💬 Seeding testimonials...');
  const testimonials = await Testimonial.insertMany(testimonialsData);
  console.log(`   ✓ ${testimonials.length} testimonials inserted\n`);

  // ── Summary ──────────────────────────────────────────
  console.log('─────────────────────────────────────');
  console.log('✅ Seeding complete!');  console.log(`   Admin:        1 (${adminData.email} / ${adminData.password})`);
  console.log(`   Top Banners:  ${topBanners.length}`);  console.log(`   Banners:      ${banners.length}`);
  console.log(`   Categories:   ${categories.length}`);
  console.log(`   Collections:  ${collections.length}`);
  console.log(`   Products:     ${products.length}`);
  console.log(`   Testimonials: ${testimonials.length}`);
  console.log('─────────────────────────────────────');

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
