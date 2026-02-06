// frontend/src/context/NotificationContext.jsx

import { createContext, useState, useCallback } from 'react';
import GlobalNotificationContainer from '../components/common/GlobalNotification';
import { parseError, formatAxiosError, getSuccessMessage } from '../utils/errorMessages';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info', duration = 5000, title = null) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type,
      duration,
      title,
    };

    setNotifications((prev) => [...prev, notification]);

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, duration = 4000) => {
      const title = typeof message === 'object' ? message.title : null;
      const msg = typeof message === 'object' ? message.message : message;
      return showNotification(msg, 'success', duration, title);
    },
    [showNotification]
  );

  const showError = useCallback(
    (error, context = '', duration = 6000) => {
      // Parse error to user-friendly message
      let parsedError;

      if (error?.response || error?.request) {
        // Axios error
        parsedError = formatAxiosError(error);
      } else if (typeof error === 'object' && error.title && error.message) {
        // Already formatted error
        parsedError = error;
      } else {
        // Generic error
        parsedError = parseError(error, context);
      }

      return showNotification(
        parsedError.message,
        'error',
        duration,
        parsedError.title
      );
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message, duration = 5000) => {
      const title = typeof message === 'object' ? message.title : 'Attention';
      const msg = typeof message === 'object' ? message.message : message;
      return showNotification(msg, 'warning', duration, title);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message, duration = 4000) => {
      const title = typeof message === 'object' ? message.title : null;
      const msg = typeof message === 'object' ? message.message : message;
      return showNotification(msg, 'info', duration, title);
    },
    [showNotification]
  );

  const showLoading = useCallback(
    (message = 'Chargement en cours...', title = null) => {
      return showNotification(message, 'loading', 0, title);
    },
    [showNotification]
  );

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helper method to show contextual success messages
  const success = useCallback(
    (action, resource = '') => {
      const message = getSuccessMessage(action, resource);
      return showSuccess(message);
    },
    [showSuccess]
  );

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    removeNotification,
    clearAll,
    success, // Helper for contextual success messages
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <GlobalNotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </NotificationContext.Provider>
  );
};
