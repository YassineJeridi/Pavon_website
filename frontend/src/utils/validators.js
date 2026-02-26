// frontend/src/utils/validators.js

import { VALIDATION_RULES } from './constants';

/**
 * Validate email
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, message: 'L\'email est requis' };
  }
  
  if (!VALIDATION_RULES.EMAIL_REGEX.test(email)) {
    return { valid: false, message: 'L\'email n\'est pas valide' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate phone number (Tunisian format)
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, message: 'Le numéro de téléphone est requis' };
  }
  
  // Remove spaces and special characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (!VALIDATION_RULES.PHONE_REGEX.test(cleaned)) {
    return { valid: false, message: 'Le numéro de téléphone n\'est pas valide' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate password
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'Le mot de passe est requis' };
  }
  
  if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      message: `Le mot de passe doit contenir au moins ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caractères`,
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password) => {
  if (!password) {
    return { strength: 'weak', score: 0, message: 'Mot de passe requis' };
  }
  
  let score = 0;
  const feedback = [];
  
  // Length
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Contains lowercase
  if (/[a-z]/.test(password)) {
    score++;
  } else {
    feedback.push('minuscules');
  }
  
  // Contains uppercase
  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    feedback.push('majuscules');
  }
  
  // Contains numbers
  if (/\d/.test(password)) {
    score++;
  } else {
    feedback.push('chiffres');
  }
  
  // Contains special characters
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score++;
  } else {
    feedback.push('caractères spéciaux');
  }
  
  let strength = 'weak';
  let message = '';
  
  if (score <= 2) {
    strength = 'weak';
    message = `Mot de passe faible. Ajoutez des ${feedback.join(', ')}`;
  } else if (score <= 4) {
    strength = 'medium';
    message = 'Mot de passe moyen';
  } else {
    strength = 'strong';
    message = 'Mot de passe fort';
  }
  
  return { strength, score, message, valid: score >= 3 };
};

/**
 * Validate name
 */
export const validateName = (name, fieldName = 'Nom') => {
  if (!name) {
    return { valid: false, message: `${fieldName} est requis` };
  }
  
  if (name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
    return {
      valid: false,
      message: `${fieldName} doit contenir au moins ${VALIDATION_RULES.NAME_MIN_LENGTH} caractères`,
    };
  }
  
  if (name.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
    return {
      valid: false,
      message: `${fieldName} ne doit pas dépasser ${VALIDATION_RULES.NAME_MAX_LENGTH} caractères`,
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate required field
 */
export const validateRequired = (value, fieldName = 'Ce champ') => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return { valid: false, message: `${fieldName} est requis` };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate message/comment
 */
export const validateMessage = (message) => {
  if (!message || message.trim() === '') {
    return { valid: false, message: 'Le message est requis' };
  }
  
  if (message.length < VALIDATION_RULES.MESSAGE_MIN_LENGTH) {
    return {
      valid: false,
      message: `Le message doit contenir au moins ${VALIDATION_RULES.MESSAGE_MIN_LENGTH} caractères`,
    };
  }
  
  if (message.length > VALIDATION_RULES.MESSAGE_MAX_LENGTH) {
    return {
      valid: false,
      message: `Le message ne doit pas dépasser ${VALIDATION_RULES.MESSAGE_MAX_LENGTH} caractères`,
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate number
 */
export const validateNumber = (value, min = null, max = null, fieldName = 'Ce champ') => {
  if (value === '' || value === null || value === undefined) {
    return { valid: false, message: `${fieldName} est requis` };
  }
  
  const number = parseFloat(value);
  
  if (isNaN(number)) {
    return { valid: false, message: `${fieldName} doit être un nombre` };
  }
  
  if (min !== null && number < min) {
    return { valid: false, message: `${fieldName} doit être supérieur ou égal à ${min}` };
  }
  
  if (max !== null && number > max) {
    return { valid: false, message: `${fieldName} doit être inférieur ou égal à ${max}` };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate price
 */
export const validatePrice = (price) => {
  return validateNumber(price, 0, null, 'Le prix');
};

/**
 * Validate quantity
 */
export const validateQuantity = (quantity, max = 100) => {
  return validateNumber(quantity, 1, max, 'La quantité');
};

/**
 * Validate postal code (Tunisian format)
 */
export const validatePostalCode = (postalCode) => {
  if (!postalCode) {
    return { valid: false, message: 'Le code postal est requis' };
  }
  
  const cleaned = postalCode.toString().replace(/\s/g, '');
  
  if (!/^\d{4}$/.test(cleaned)) {
    return { valid: false, message: 'Le code postal doit contenir 4 chiffres' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate URL
 */
export const validateUrl = (url) => {
  if (!url) {
    return { valid: false, message: 'L\'URL est requise' };
  }
  
  try {
    new URL(url);
    return { valid: true, message: '' };
  } catch {
    return { valid: false, message: 'L\'URL n\'est pas valide' };
  }
};

/**
 * Validate file
 */
export const validateFile = (file, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']) => {
  if (!file) {
    return { valid: false, message: 'Le fichier est requis' };
  }
  
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return { valid: false, message: `Le fichier ne doit pas dépasser ${maxSizeMB}MB` };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Type de fichier non autorisé' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate image
 */
export const validateImage = (file) => {
  return validateFile(
    file,
    5 * 1024 * 1024,
    ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  );
};

/**
 * Validate credit card number (basic)
 */
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) {
    return { valid: false, message: 'Le numéro de carte est requis' };
  }
  
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (!/^\d{16}$/.test(cleaned)) {
    return { valid: false, message: 'Le numéro de carte doit contenir 16 chiffres' };
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) {
    return { valid: false, message: 'Le numéro de carte n\'est pas valide' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Validate form
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];
    
    if (rule.required && !value) {
      errors[field] = `${rule.label || field} est requis`;
      isValid = false;
      return;
    }
    
    if (value && rule.validator) {
      const result = rule.validator(value);
      if (!result.valid) {
        errors[field] = result.message;
        isValid = false;
      }
    }
  });
  
  return { isValid, errors };
};

/**
 * Validate contact form
 */
export const validateContactForm = (formData) => {
  const rules = {
    name: {
      required: true,
      label: 'Nom',
      validator: validateName,
    },
    email: {
      required: true,
      label: 'Email',
      validator: validateEmail,
    },
    message: {
      required: true,
      label: 'Message',
      validator: validateMessage,
    },
  };
  
  return validateForm(formData, rules);
};

/**
 * Validate checkout form
 */
export const validateCheckoutForm = (formData) => {
  const rules = {
    firstName: {
      required: true,
      label: 'Prénom',
      validator: (value) => validateName(value, 'Prénom'),
    },
    lastName: {
      required: true,
      label: 'Nom',
      validator: (value) => validateName(value, 'Nom'),
    },
    email: {
      required: true,
      label: 'Email',
      validator: validateEmail,
    },
    phone: {
      required: true,
      label: 'Téléphone',
      validator: validatePhone,
    },
    address: {
      required: true,
      label: 'Adresse',
      validator: validateRequired,
    },
    city: {
      required: true,
      label: 'Ville',
      validator: validateRequired,
    },
    postalCode: {
      required: true,
      label: 'Code postal',
      validator: validatePostalCode,
    },
  };
  
  return validateForm(formData, rules);
};
