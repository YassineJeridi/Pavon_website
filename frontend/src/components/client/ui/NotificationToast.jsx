// frontend/src/components/client/ui/NotificationToast.jsx

import { useEffect } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const NotificationToast = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'top-right',
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      icon: CheckCircleIcon,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      iconColor: 'text-green-500',
      textColor: 'text-green-800',
    },
    error: {
      icon: XCircleIcon,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      iconColor: 'text-red-500',
      textColor: 'text-red-800',
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-800',
    },
    info: {
      icon: InformationCircleIcon,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-800',
    },
  };

  const positions = {
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
    'top-center': 'top-6 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2',
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        fixed ${positions[position]} z-50
        max-w-sm w-full
        animate-slideInRight
      `}
      role="alert"
    >
      <div
        className={`
          ${config.bgColor} ${config.borderColor}
          border-l-4 rounded-lg shadow-lg p-4
          flex items-start space-x-3
        `}
      >
        {/* Icon */}
        <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0`} />

        {/* Message */}
        <p className={`flex-1 ${config.textColor} font-medium text-sm`}>
          {message}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`${config.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
          aria-label="Close notification"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="relative h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div
            className={`absolute left-0 top-0 h-full ${config.borderColor.replace('border', 'bg')} animate-shrink`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationToast;
