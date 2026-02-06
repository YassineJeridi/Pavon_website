// frontend/src/utils/imageUtils.js

// Get API base URL from environment or fallback to localhost
// Note: Remove '/api' suffix for static file serving
const getBaseUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    // Remove '/api' suffix if present for static files
    return apiUrl.replace(/\/api$/, '');
};

const API_BASE_URL = getBaseUrl();

/**
 * Get full image URL from relative path
 * @param {string} imagePath - Relative image path from backend (e.g., /uploads/banners/image.jpg)
 * @returns {string} Full image URL
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If already a full URL (http/https), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // If starts with /, prepend API base URL
    if (imagePath.startsWith('/')) {
        return `${API_BASE_URL}${imagePath}`;
    }

    // Otherwise, assume it needs /uploads/ prefix
    return `${API_BASE_URL}/uploads/${imagePath}`;
};

/**
 * Get banner image URL
 * @param {object} banner - Banner object
 * @returns {string} Full banner image URL
 */
export const getBannerImageUrl = (banner) => {
    return getImageUrl(banner?.image);
};

/**
 * Get product image URL
 * @param {object} product - Product object
 * @returns {string} Full product image URL
 */
export const getProductImageUrl = (product) => {
    if (product?.images && product.images.length > 0) {
        return getImageUrl(product.images[0]);
    }
    return getImageUrl(product?.image);
};

/**
 * Get collection image URL
 * @param {object} collection - Collection object
 * @returns {string} Full collection image URL
 */
export const getCollectionImageUrl = (collection) => {
    return getImageUrl(collection?.image);
};

/**
 * Get category image URL
 * @param {string|object} category - Category object or image path string
 * @returns {string} Full category image URL
 */
export const getCategoryImageUrl = (category) => {
    // Handle if category is passed as string (just the image path)
    if (typeof category === 'string') {
        return getImageUrl(category);
    }
    // Handle if category is an object
    return getImageUrl(category?.image);
};

/**
 * Get testimonial avatar URL
 * @param {object} testimonial - Testimonial object
 * @returns {string} Full avatar URL or default avatar
 */
export const getTestimonialAvatarUrl = (testimonial) => {
    if (testimonial?.avatar) {
        return getImageUrl(testimonial.avatar);
    }
    // Default avatar if none provided
    return '/assets/default-avatar.png';
};
