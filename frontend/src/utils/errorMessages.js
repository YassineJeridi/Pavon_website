// frontend/src/utils/errorMessages.js

/**
 * Transform technical error messages into user-friendly text
 * @param {Error|string} error - The error object or message
 * @param {string} context - Context about where the error occurred
 * @returns {Object} - Object with title and message
 */
export const parseError = (error, context = '') => {
    let message = typeof error === 'string' ? error : error?.message || 'Une erreur est survenue';
    let title = 'Erreur';

    // Network errors
    if (message.includes('Network Error') || message.includes('ERR_NETWORK')) {
        return {
            title: 'Problème de connexion',
            message: 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet et réessayer.',
        };
    }

    // Timeout errors
    if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
        return {
            title: 'Délai d\'attente dépassé',
            message: 'Le serveur met trop de temps à répondre. Veuillez réessayer dans quelques instants.',
        };
    }

    // Authentication errors
    if (message.includes('401') || message.includes('Unauthorized') || message.includes('non autorisé')) {
        return {
            title: 'Session expirée',
            message: 'Votre session a expiré. Veuillez vous reconnecter pour continuer.',
        };
    }

    if (message.includes('Email ou mot de passe incorrect') || message.includes('Invalid credentials')) {
        return {
            title: 'Identifiants incorrects',
            message: 'L\'email ou le mot de passe est incorrect. Veuillez vérifier vos informations.',
        };
    }

    // Permission errors
    if (message.includes('403') || message.includes('Forbidden') || message.includes('Permission denied')) {
        return {
            title: 'Accès refusé',
            message: 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.',
        };
    }

    // Not found errors
    if (message.includes('404') || message.includes('Not Found') || message.includes('non trouvé')) {
        return {
            title: 'Ressource introuvable',
            message: `L'élément que vous recherchez n'existe pas ou a été supprimé.`,
        };
    }

    // Validation errors
    if (message.includes('Validation failed') || message.includes('validation')) {
        // Parse Mongoose validation errors
        if (message.includes('required')) {
            return {
                title: 'Champs requis manquants',
                message: 'Veuillez remplir tous les champs obligatoires avant de continuer.',
            };
        }

        if (message.includes('enum')) {
            const match = message.match(/`([^`]+)` is not a valid enum value/);
            const value = match ? match[1] : '';
            return {
                title: 'Valeur invalide',
                message: `La valeur "${value}" n'est pas acceptée. Veuillez choisir une option valide.`,
            };
        }

        if (message.includes('unique') || message.includes('duplicate')) {
            return {
                title: 'Valeur déjà utilisée',
                message: 'Cette valeur existe déjà. Veuillez utiliser une valeur différente.',
            };
        }

        return {
            title: 'Données invalides',
            message: 'Les informations fournies ne sont pas valides. Veuillez vérifier vos données.',
        };
    }

    // File upload errors
    if (message.includes('File too large') || message.includes('LIMIT_FILE_SIZE')) {
        return {
            title: 'Fichier trop volumineux',
            message: 'Le fichier sélectionné est trop volumineux. Taille maximale autorisée : 10 MB.',
        };
    }

    if (message.includes('Invalid file type') || message.includes('LIMIT_UNEXPECTED_FILE')) {
        return {
            title: 'Type de fichier non supporté',
            message: 'Ce type de fichier n\'est pas accepté. Veuillez utiliser un format d\'image valide (JPG, PNG, WEBP).',
        };
    }

    // Database errors
    if (message.includes('MongoError') || message.includes('MongoDB')) {
        return {
            title: 'Erreur de base de données',
            message: 'Une erreur technique est survenue. Veuillez réessayer ou contacter le support.',
        };
    }

    // Server errors
    if (message.includes('500') || message.includes('Internal Server Error')) {
        return {
            title: 'Erreur serveur',
            message: 'Une erreur est survenue sur le serveur. Nos équipes ont été notifiées. Veuillez réessayer plus tard.',
        };
    }

    if (message.includes('502') || message.includes('503') || message.includes('Bad Gateway') || message.includes('Service Unavailable')) {
        return {
            title: 'Service temporairement indisponible',
            message: 'Le service est temporairement indisponible. Veuillez réessayer dans quelques minutes.',
        };
    }

    // Stock/inventory errors
    if (message.includes('Out of stock') || message.includes('rupture de stock')) {
        return {
            title: 'Article indisponible',
            message: 'Cet article est actuellement en rupture de stock. Nous vous invitons à revenir plus tard.',
        };
    }

    if (message.includes('Insufficient stock') || message.includes('stock insuffisant')) {
        return {
            title: 'Stock insuffisant',
            message: 'La quantité demandée n\'est pas disponible en stock.',
        };
    }

    // Payment errors
    if (message.includes('Payment') || message.includes('paiement')) {
        return {
            title: 'Erreur de paiement',
            message: 'Le paiement n\'a pas pu être traité. Veuillez vérifier vos informations de paiement.',
        };
    }

    // Context-specific messages
    if (context) {
        title = `Erreur ${context}`;
    }

    // Return cleaned message
    return {
        title,
        message: cleanErrorMessage(message),
    };
};

/**
 * Clean technical error messages
 */
const cleanErrorMessage = (message) => {
    // Remove technical stack traces
    const cleaned = message.split('\n')[0];

    // Remove error codes at the beginning
    const withoutCodes = cleaned.replace(/^(Error:|AxiosError:|TypeError:|ReferenceError:)\s*/i, '');

    // If the message is too technical, return a generic message
    if (
        withoutCodes.includes('undefined') ||
        withoutCodes.includes('null') ||
        withoutCodes.includes('Cannot read') ||
        withoutCodes.includes('is not a function')
    ) {
        return 'Une erreur technique est survenue. Veuillez réessayer ou contacter le support.';
    }

    return withoutCodes;
};

/**
 * Get success message based on action
 */
export const getSuccessMessage = (action, resource = '') => {
    const messages = {
        create: `${resource} créé avec succès`,
        update: `${resource} mis à jour avec succès`,
        delete: `${resource} supprimé avec succès`,
        save: `Modifications enregistrées avec succès`,
        send: `${resource} envoyé avec succès`,
        upload: `${resource} téléchargé avec succès`,
        login: 'Connexion réussie',
        logout: 'Déconnexion réussie',
        register: 'Inscription réussie',
        reset: 'Réinitialisation effectuée avec succès',
        add: `${resource} ajouté avec succès`,
        remove: `${resource} retiré avec succès`,
    };

    return messages[action] || `Action effectuée avec succès`;
};

/**
 * Get warning message based on action
 */
export const getWarningMessage = (action, details = '') => {
    const messages = {
        'session-expire': 'Votre session va expirer dans quelques minutes',
        'unsaved-changes': 'Vous avez des modifications non enregistrées',
        'low-stock': `Stock faible: ${details}`,
        'incomplete-profile': 'Votre profil est incomplet',
        'pending-verification': 'Vérification en attente',
        'maintenance': 'Maintenance programmée: ${details}',
    };

    return messages[action] || `Attention: ${details}`;
};

/**
 * Format Axios error
 */
export const formatAxiosError = (error) => {
    if (error.response) {
        // Server responded with error status
        const data = error.response.data;
        const message = data?.message || data?.error || error.message;
        const context = `(${error.response.status})`;

        return parseError(message, context);
    } else if (error.request) {
        // Request made but no response
        return parseError('Network Error');
    } else {
        // Something else happened
        return parseError(error.message);
    }
};

/**
 * Format validation errors from backend
 */
export const formatValidationErrors = (errors) => {
    if (!errors || typeof errors !== 'object') {
        return 'Erreurs de validation détectées';
    }

    const errorMessages = Object.entries(errors)
        .map(([field, error]) => {
            const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
            return `${fieldName}: ${error.message || error}`;
        })
        .join(', ');

    return errorMessages || 'Veuillez corriger les erreurs dans le formulaire';
};

export default {
    parseError,
    getSuccessMessage,
    getWarningMessage,
    formatAxiosError,
    formatValidationErrors,
};
