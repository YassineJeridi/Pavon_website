// frontend/src/utils/constants.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 15000,
};

// Order Status
export const ORDER_STATUS = {
  EN_ATTENTE: 'en attente',
  ON_DELIVERY: 'on delivery',
  DONE: 'done',
  CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.EN_ATTENTE]: 'En attente',
  [ORDER_STATUS.ON_DELIVERY]: 'On Delivery',
  [ORDER_STATUS.DONE]: 'Done',
  [ORDER_STATUS.CANCELLED]: 'Annulée',
};

export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.EN_ATTENTE]: 'bg-yellow-100 text-yellow-800',
  [ORDER_STATUS.ON_DELIVERY]: 'bg-blue-100 text-blue-800',
  [ORDER_STATUS.DONE]: 'bg-green-100 text-green-800',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-800',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH_ON_DELIVERY: 'cash_on_delivery',
  CREDIT_CARD: 'credit_card',
  BANK_TRANSFER: 'bank_transfer',
  MOBILE_PAYMENT: 'mobile_payment',
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH_ON_DELIVERY]: 'Paiement à la livraison',
  [PAYMENT_METHODS.CREDIT_CARD]: 'Carte bancaire',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Virement bancaire',
  [PAYMENT_METHODS.MOBILE_PAYMENT]: 'Paiement mobile',
};

// Size Types
export const SIZE_TYPES = {
  LETTER: 'letter',
  NUMERIC: 'numeric',
};

export const LETTER_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const NUMERIC_SIZES = ['34', '36', '38', '40', '42', '44', '46', '48', '50'];

// Colors (Common clothing colors)
export const COMMON_COLORS = [
  'Noir',
  'Blanc',
  'Gris',
  'Bleu',
  'Marine',
  'Rouge',
  'Vert',
  'Jaune',
  'Orange',
  'Rose',
  'Violet',
  'Marron',
  'Beige',
  'Crème',
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 100,
};

// Sort Options
export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Plus récent' },
  { value: 'createdAt', label: 'Plus ancien' },
  { value: 'price', label: 'Prix croissant' },
  { value: '-price', label: 'Prix décroissant' },
  { value: 'name', label: 'Nom (A-Z)' },
  { value: '-name', label: 'Nom (Z-A)' },
];

// Filter Ranges
export const PRICE_RANGES = [
  { min: 0, max: 50, label: 'Moins de 50 TND' },
  { min: 50, max: 100, label: '50 - 100 TND' },
  { min: 100, max: 200, label: '100 - 200 TND' },
  { min: 200, max: 500, label: '200 - 500 TND' },
  { min: 500, max: null, label: 'Plus de 500 TND' },
];

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'cart',
  SESSION_ID: 'sessionId',
  ADMIN_TOKEN: 'adminToken',
  RECENT_SEARCHES: 'recentSearches',
  WISHLIST: 'wishlist',
  USER_PREFERENCES: 'userPreferences',
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+216)?[2459]\d{7}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 1000,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_IMAGES: 5,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  LONG: 'dddd, D MMMM YYYY',
};

// Currency
export const CURRENCY = {
  CODE: 'TND',
  SYMBOL: 'TND',
  DECIMAL_PLACES: 2,
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Notification Duration
export const NOTIFICATION_DURATION = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/elegance',
  INSTAGRAM: 'https://instagram.com/elegance',
  TWITTER: 'https://twitter.com/elegance',
  LINKEDIN: 'https://linkedin.com/company/elegance',
  TIKTOK: 'https://tiktok.com/@elegance',
};

// Contact Information
export const CONTACT_INFO = {
  EMAIL: 'contact@elegance.com',
  PHONE: '+216 12 345 678',
  ADDRESS: '123 Avenue Habib Bourguiba, Tunis 1000, Tunisia',
  SUPPORT_EMAIL: 'support@elegance.com',
};

// Business Hours
export const BUSINESS_HOURS = {
  WEEKDAYS: '9h00 - 18h00',
  SATURDAY: '10h00 - 17h00',
  SUNDAY: 'Fermé',
};

// Image Paths
export const IMAGE_PATHS = {
  LOGO: '/assets/logo.png',
  DEFAULT_PRODUCT: '/assets/products/default.jpg',
  DEFAULT_CATEGORY: '/assets/categories/default.jpg',
  DEFAULT_COLLECTION: '/assets/collections/default.jpg',
  DEFAULT_BANNER: '/assets/banners/default.jpg',
  PLACEHOLDER: '/assets/placeholder.png',
};

// Dashboard Routes
export const DASHBOARD_ROUTES = {
  HOME: '/dashboard',
  PRODUCTS: '/dashboard/products',
  ORDERS: '/dashboard/orders',
  CATEGORIES: '/dashboard/categories',
  COLLECTIONS: '/dashboard/collections',
  BANNERS: '/dashboard/banners',
  CONTACTS: '/dashboard/contacts',
  TESTIMONIALS: '/dashboard/testimonials',
  ANALYTICS: '/dashboard/analytics',
  SETTINGS: '/dashboard/settings',
  LOGIN: '/dashboard/login',
};

// Client Routes
export const CLIENT_ROUTES = {
  HOME: '/',
  PRODUCTS: '/produits',
  PRODUCT_DETAILS: '/produits/:slug',
  COLLECTIONS: '/collections',
  ABOUT: '/AboutPage',
  CONTACT: '/contact',
  CART: '/panier',
  CHECKOUT: '/commander',
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Une erreur est survenue. Veuillez réessayer.',
  NETWORK: 'Erreur de connexion. Vérifiez votre connexion internet.',
  UNAUTHORIZED: 'Vous devez être connecté pour effectuer cette action.',
  FORBIDDEN: 'Vous n\'avez pas les permissions nécessaires.',
  NOT_FOUND: 'La ressource demandée n\'existe pas.',
  VALIDATION: 'Veuillez vérifier les informations saisies.',
  SERVER: 'Erreur serveur. Veuillez réessayer plus tard.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PRODUCT_ADDED: 'Produit ajouté au panier avec succès',
  PRODUCT_REMOVED: 'Produit retiré du panier',
  ORDER_CREATED: 'Commande créée avec succès',
  CONTACT_SENT: 'Message envoyé avec succès',
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  SAVED: 'Enregistré avec succès',
  UPDATED: 'Mis à jour avec succès',
  DELETED: 'Supprimé avec succès',
};

// SEO
export const SEO = {
  DEFAULT_TITLE: 'Élégance - Vêtements de Luxe Français',
  TITLE_SUFFIX: ' | Élégance',
  DEFAULT_DESCRIPTION: 'Découvrez notre collection de vêtements de luxe français. Qualité premium, style intemporel, fabrication éthique.',
  DEFAULT_KEYWORDS: 'vêtements, mode, luxe, français, élégance, fashion',
  DEFAULT_OG_IMAGE: '/assets/og-image.jpg',
};

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
};

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Debounce Delays
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  INPUT: 500,
  RESIZE: 250,
};

// Product Stock Status
export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
};

export const STOCK_THRESHOLD = {
  LOW: 10,
  CRITICAL: 5,
};

// Rating
export const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 5,
};

// Shipping
export const SHIPPING = {
  FREE_THRESHOLD: 200, // Free shipping above 200 TND
  STANDARD_COST: 7,
  EXPRESS_COST: 15,
  STANDARD_DAYS: '3-5',
  EXPRESS_DAYS: '1-2',
};

// Cart Limits
export const CART_LIMITS = {
  MAX_ITEMS: 50,
  MAX_QUANTITY_PER_ITEM: 10,
};

// Dashboard Analytics Time Ranges
export const TIME_RANGES = {
  SEVEN_DAYS: '7days',
  THIRTY_DAYS: '30days',
  THREE_MONTHS: '3months',
  SIX_MONTHS: '6months',
  ONE_YEAR: '1year',
};

export const TIME_RANGE_LABELS = {
  [TIME_RANGES.SEVEN_DAYS]: '7 derniers jours',
  [TIME_RANGES.THIRTY_DAYS]: '30 derniers jours',
  [TIME_RANGES.THREE_MONTHS]: '3 derniers mois',
  [TIME_RANGES.SIX_MONTHS]: '6 derniers mois',
  [TIME_RANGES.ONE_YEAR]: '1 an',
};
