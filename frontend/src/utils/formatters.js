// frontend/src/utils/formatters.js

import { CURRENCY } from './constants';

/**
 * Format price
 */
export const formatPrice = (price, currency = CURRENCY.SYMBOL) => {
  if (typeof price !== 'number') {
    price = parseFloat(price) || 0;
  }
  
  return `${price.toFixed(CURRENCY.DECIMAL_PLACES)} ${currency}`;
};

/**
 * Format price with thousands separator
 */
export const formatPriceWithSeparator = (price, currency = CURRENCY.SYMBOL) => {
  if (typeof price !== 'number') {
    price = parseFloat(price) || 0;
  }
  
  const formatted = price.toLocaleString('fr-FR', {
    minimumFractionDigits: CURRENCY.DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY.DECIMAL_PLACES,
  });
  
  return `${formatted} ${currency}`;
};

/**
 * Format date
 */
export const formatDate = (date, format = 'long') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const options = {
    short: { day: '2-digit', month: '2-digit', year: 'numeric' },
    medium: { day: '2-digit', month: 'short', year: 'numeric' },
    long: { day: 'numeric', month: 'long', year: 'numeric' },
    full: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
  };
  
  return dateObj.toLocaleDateString('fr-FR', options[format] || options.long);
};

/**
 * Format date with time
 */
export const formatDateTime = (date, includeSeconds = false) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const timeOptions = includeSeconds
    ? { hour: '2-digit', minute: '2-digit', second: '2-digit' }
    : { hour: '2-digit', minute: '2-digit' };
  
  const formattedDate = dateObj.toLocaleDateString('fr-FR', dateOptions);
  const formattedTime = dateObj.toLocaleTimeString('fr-FR', timeOptions);
  
  return `${formattedDate} à ${formattedTime}`;
};

/**
 * Format relative time (e.g., "il y a 2 heures")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) {
    return 'à l\'instant';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `il y a ${diffInMonths} mois`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Tunisian phone number
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('216')) {
    return `+216 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  return phone;
};

/**
 * Format number with separator
 */
export const formatNumber = (number, decimals = 0) => {
  if (typeof number !== 'number') {
    number = parseFloat(number) || 0;
  }
  
  return number.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 0;
  }
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 octets';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['octets', 'Ko', 'Mo', 'Go', 'To'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format order number
 */
export const formatOrderNumber = (orderNumber) => {
  if (!orderNumber) return '';
  return `#${orderNumber}`;
};

/**
 * Format credit card number
 */
export const formatCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  
  const cleaned = cardNumber.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  
  return groups ? groups.join(' ') : cardNumber;
};

/**
 * Mask credit card number (show only last 4 digits)
 */
export const maskCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return cardNumber;
  
  const lastFour = cleaned.slice(-4);
  const masked = '**** **** **** ' + lastFour;
  
  return masked;
};

/**
 * Format postal code
 */
export const formatPostalCode = (postalCode) => {
  if (!postalCode) return '';
  return postalCode.toString().padStart(4, '0');
};

/**
 * Format address
 */
export const formatAddress = (address) => {
  if (!address) return '';
  
  const parts = [];
  
  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.postalCode) parts.push(formatPostalCode(address.postalCode));
  if (address.country) parts.push(address.country);
  
  return parts.join(', ');
};

/**
 * Format full name
 */
export const formatFullName = (firstName, lastName) => {
  const parts = [];
  
  if (firstName) parts.push(firstName);
  if (lastName) parts.push(lastName);
  
  return parts.join(' ');
};

/**
 * Format duration (seconds to human readable)
 */
export const formatDuration = (seconds) => {
  if (typeof seconds !== 'number' || seconds < 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  const parts = [];
  
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);
  
  return parts.join(' ');
};

/**
 * Format distance
 */
export const formatDistance = (meters) => {
  if (typeof meters !== 'number' || meters < 0) return '0 m';
  
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
};

/**
 * Format list (array to comma-separated string)
 */
export const formatList = (array, separator = ', ', lastSeparator = ' et ') => {
  if (!Array.isArray(array) || array.length === 0) return '';
  
  if (array.length === 1) return array[0];
  
  if (array.length === 2) return array.join(lastSeparator);
  
  const allButLast = array.slice(0, -1).join(separator);
  const last = array[array.length - 1];
  
  return allButLast + lastSeparator + last;
};

/**
 * Pluralize word
 */
export const pluralize = (count, singular, plural = null) => {
  if (count === 1) return singular;
  
  if (plural) return plural;
  
  // Simple French pluralization rule
  return singular + 's';
};

/**
 * Format stock status
 */
export const formatStockStatus = (stock) => {
  if (stock === 0) return 'Rupture de stock';
  if (stock <= 5) return `Plus que ${stock} en stock`;
  if (stock <= 10) return 'Stock limité';
  return 'En stock';
};
