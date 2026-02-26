// NOTIFICATION SYSTEM USAGE GUIDE
// ================================

/*
GLOBAL NOTIFICATION SYSTEM - Complete Implementation Guide

This guide explains how to use the global notification system throughout the platform.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. BASIC USAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Import the hook in your component:
*/

import { useNotification } from '../hooks/useNotification';

const MyComponent = () => {
    const { showSuccess, showError, showWarning, showInfo, showLoading } = useNotification();

    // Examples:

    // Success notification
    const handleSuccess = () => {
        showSuccess('Opération réussie !');
    };

    // Error notification (automatically parsed)
    const handleError = async () => {
        try {
            await someApiCall();
        } catch (error) {
            showError(error); // Automatically converts to user-friendly message
        }
    };

    // Warning notification
    const handleWarning = () => {
        showWarning({
            title: 'Attention',
            message: 'Cette action nécessite une confirmation'
        });
    };

    // Info notification
    const handleInfo = () => {
        showInfo('Nouvelle fonctionnalité disponible');
    };

    // Loading notification (stays until manually removed)
    const handleLoading = () => {
        const loadingId = showLoading('Chargement en cours...');

        // Later, remove it:
        // removeNotification(loadingId);
    };
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. API ERROR HANDLING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The notification system automatically converts technical errors into user-friendly messages:
*/

// Example with Axios
const createProduct = async (productData) => {
    const loadingId = showLoading('Création du produit...', 'Création');

    try {
        const response = await productService.create(productData);
        removeNotification(loadingId);
        showSuccess('Produit créé avec succès');
        return response;
    } catch (error) {
        removeNotification(loadingId);
        showError(error, 'création du produit'); // Context helps with error message
    }
};

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. NOTIFICATION TYPES & COLORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ success  - Green gradient (Emerald)
   Use for: Successful operations, confirmations, completions
   
❌ error    - Red gradient (Rose)
   Use for: Failed operations, critical errors, blocked actions
   
⚠️  warning  - Orange gradient (Amber)
   Use for: Warnings, cautions, important notices
   
ℹ️  info     - Blue gradient (Indigo)
   Use for: General information, tips, updates
   
⚡ loading  - Purple gradient (Pink)
   Use for: Ongoing operations, processing states

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. ADVANCED EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

// Example 1: CRUD Operations
const handleCreate = async (data) => {
    const loadingId = showLoading('Création en cours...');

    try {
        await api.create(data);
        removeNotification(loadingId);
        showSuccess('Élément créé avec succès');
        navigate('/list');
    } catch (error) {
        removeNotification(loadingId);
        showError(error, 'création');
    }
};

// Example 2: Form Validation
const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
        showWarning({
            title: 'Champ requis',
            message: 'Veuillez saisir une adresse email'
        });
        return;
    }

    // Continue with submission...
};

// Example 3: Multiple Operations
const handleBulkDelete = async (selectedIds) => {
    if (selectedIds.length === 0) {
        showWarning('Aucun élément sélectionné');
        return;
    }

    const loadingId = showLoading(`Suppression de ${selectedIds.length} éléments...`);

    try {
        await Promise.all(selectedIds.map(id => api.delete(id)));
        removeNotification(loadingId);
        showSuccess(`${selectedIds.length} éléments supprimés avec succès`);
    } catch (error) {
        removeNotification(loadingId);
        showError(error, 'suppression en masse');
    }
};

// Example 4: Session Expiry
const checkSession = () => {
    const expiresIn = getSessionExpiry();

    if (expiresIn < 300000) { // 5 minutes
        showWarning({
            title: 'Session expirée bientôt',
            message: 'Votre session va expirer dans 5 minutes. Sauvegardez votre travail.'
        });
    }
};

// Example 5: Network Status
window.addEventListener('offline', () => {
    showError({
        title: 'Connexion perdue',
        message: 'Vous êtes hors ligne. Vérifiez votre connexion internet.'
    });
});

window.addEventListener('online', () => {
    showSuccess({
        title: 'Connexion rétablie',
        message: 'Vous êtes de nouveau en ligne'
    });
});

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. ERROR MESSAGES TRANSFORMED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Technical Error → User-Friendly Message:

Network Error
  → "Impossible de se connecter au serveur. Vérifiez votre connexion."

401 Unauthorized
  → "Votre session a expiré. Veuillez vous reconnecter."

403 Forbidden
  → "Vous n'avez pas les permissions pour cette action."

404 Not Found
  → "L'élément recherché n'existe pas ou a été supprimé."

500 Internal Server Error
  → "Une erreur est survenue sur le serveur. Réessayez plus tard."

Validation failed: position: `top` is not a valid enum value
  → "La valeur 'top' n'est pas acceptée. Veuillez choisir une option valide."

File too large
  → "Le fichier est trop volumineux. Taille max: 10 MB."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. BEST PRACTICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ DO:
  - Use showLoading for operations taking >1 second
  - Always provide context in error messages (2nd parameter)
  - Remove loading notifications when operation completes
  - Use appropriate notification types for different situations
  - Keep messages concise but informative

❌ DON'T:
  - Don't show technical stack traces to users
  - Don't use generic "Error" messages without context
  - Don't forget to remove loading notifications
  - Don't show too many notifications at once
  - Don't use alerts/confirms - use notifications instead

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. AVAILABLE METHODS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

showSuccess(message, duration)
  - message: String or { title, message }
  - duration: Auto-dismiss time in ms (default: 4000)
  - Returns: notification ID

showError(error, context, duration)
  - error: Error object, Axios error, or string
  - context: String describing the operation
  - duration: Auto-dismiss time in ms (default: 6000)
  - Returns: notification ID

showWarning(message, duration)
  - message: String or { title, message }
  - duration: Auto-dismiss time in ms (default: 5000)
  - Returns: notification ID

showInfo(message, duration)
  - message: String or { title, message }
  - duration: Auto-dismiss time in ms (default: 4000)
  - Returns: notification ID

showLoading(message, title)
  - message: Loading message
  - title: Optional title
  - Returns: notification ID (must be manually removed)

removeNotification(id)
  - id: Notification ID returned from show methods

clearAll()
  - Removes all active notifications

success(action, resource)
  - Helper for contextual success messages
  - action: 'create', 'update', 'delete', 'save', etc.
  - resource: Resource name (e.g., 'produit', 'bannière')
  - Example: success('create', 'produit') → "Produit créé avec succès"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Animations:
  - Smooth enter/exit with Framer Motion
  - Spring physics for natural movement
  - Pulse effects on icons
  - Progress bar for auto-dismiss

🎨 Design:
  - Gradient backgrounds matching brand colors
  - Glassmorphism effects
  - Color-coded notification types
  - Premium shadows and borders
  - Responsive layout

🚀 Performance:
  - Optimized re-renders with useCallback
  - Automatic cleanup of old notifications
  - Smooth 60fps animations
  - Minimal bundle size

♿ Accessibility:
  - ARIA labels and roles
  - Keyboard navigation support
  - Screen reader friendly
  - Focus management

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

export default null; // This is a documentation file
