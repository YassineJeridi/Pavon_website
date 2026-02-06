// backend/middleware/validation.js

const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errorMessages,
    });
  }

  next();
};

// Product validation rules
exports.validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom du produit est requis')
    .isLength({ max: 200 })
    .withMessage('Le nom ne peut pas dépasser 200 caractères'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La description est requise')
    .isLength({ max: 2000 })
    .withMessage('La description ne peut pas dépasser 2000 caractères'),
  
  body('price')
    .notEmpty()
    .withMessage('Le prix est requis')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être positif'),
  
  body('category')
    .notEmpty()
    .withMessage('La catégorie est requise')
    .isMongoId()
    .withMessage('ID de catégorie invalide'),
  
  body('images')
    .isArray({ min: 1 })
    .withMessage('Au moins une image est requise'),
  
  body('sizes')
    .isArray({ min: 1 })
    .withMessage('Au moins une taille est requise'),
  
  body('colors')
    .isArray({ min: 1 })
    .withMessage('Au moins une couleur est requise'),
  
  body('stock')
    .notEmpty()
    .withMessage('Le stock est requis')
    .isInt({ min: 0 })
    .withMessage('Le stock doit être un nombre positif'),

  handleValidationErrors,
];

// Collection validation rules
exports.validateCollection = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom de la collection est requis')
    .isLength({ max: 100 })
    .withMessage('Le nom ne peut pas dépasser 100 caractères'),
  
  body('image')
    .notEmpty()
    .withMessage('L\'image est requise'),

  handleValidationErrors,
];

// Category validation rules
exports.validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom de la catégorie est requis')
    .isLength({ max: 100 })
    .withMessage('Le nom ne peut pas dépasser 100 caractères'),
  
  body('image')
    .notEmpty()
    .withMessage('L\'image est requise'),

  handleValidationErrors,
];

// Order validation rules
exports.validateOrder = [
  body('customer.firstName')
    .trim()
    .notEmpty()
    .withMessage('Le prénom est requis'),
  
  body('customer.lastName')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis'),
  
  body('customer.email')
    .trim()
    .notEmpty()
    .withMessage('L\'email est requis')
    .isEmail()
    .withMessage('Email invalide'),
  
  body('customer.phone')
    .trim()
    .notEmpty()
    .withMessage('Le téléphone est requis'),
  
  body('shippingAddress.address')
    .trim()
    .notEmpty()
    .withMessage('L\'adresse est requise'),
  
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('La ville est requise'),
  
  body('shippingAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Le code postal est requis'),
  
  body('items')
    .isArray({ min: 1 })
    .withMessage('Au moins un article est requis'),
  
  body('paymentMethod')
    .notEmpty()
    .withMessage('La méthode de paiement est requise')
    .isIn(['cash_on_delivery', 'credit_card', 'bank_transfer', 'mobile_payment'])
    .withMessage('Méthode de paiement invalide'),

  handleValidationErrors,
];

// Contact validation rules
exports.validateContact = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('L\'email est requis')
    .isEmail()
    .withMessage('Email invalide'),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Le message est requis')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Le message doit contenir entre 10 et 2000 caractères'),

  handleValidationErrors,
];

// Banner validation rules
exports.validateBanner = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Le titre est requis')
    .isLength({ max: 100 })
    .withMessage('Le titre ne peut pas dépasser 100 caractères'),
  
  body('image')
    .notEmpty()
    .withMessage('L\'image est requise'),
  
  body('position')
    .optional()
    .isIn(['hero', 'promotional', 'category', 'footer'])
    .withMessage('Position invalide'),

  handleValidationErrors,
];

// Testimonial validation rules
exports.validateTestimonial = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ max: 100 })
    .withMessage('Le nom ne peut pas dépasser 100 caractères'),
  
  body('rating')
    .notEmpty()
    .withMessage('La note est requise')
    .isInt({ min: 1, max: 5 })
    .withMessage('La note doit être entre 1 et 5'),
  
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Le commentaire est requis')
    .isLength({ max: 1000 })
    .withMessage('Le commentaire ne peut pas dépasser 1000 caractères'),

  handleValidationErrors,
];

// Auth validation rules
exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('L\'email est requis')
    .isEmail()
    .withMessage('Email invalide'),
  
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),

  handleValidationErrors,
];

exports.validateRegister = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('Le prénom est requis')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('L\'email est requis')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),

  handleValidationErrors,
];

exports.validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Le mot de passe actuel est requis'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('Le nouveau mot de passe est requis')
    .isLength({ min: 6 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères'),

  handleValidationErrors,
];

// MongoDB ID validation
exports.validateMongoId = [
  param('id')
    .isMongoId()
    .withMessage('ID invalide'),

  handleValidationErrors,
];

// Pagination validation
exports.validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un entier positif'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être entre 1 et 100'),

  handleValidationErrors,
];

module.exports.handleValidationErrors = handleValidationErrors;
