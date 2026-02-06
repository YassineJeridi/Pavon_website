// frontend/src/components/common/GlobalNotification.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Info,
    X,
    Zap,
    AlertCircle
} from 'lucide-react';

const GlobalNotification = React.forwardRef(({ notification, onClose }, ref) => {
    if (!notification) return null;

    const { id, message, type, title } = notification;

    const types = {
        success: {
            icon: CheckCircle,
            gradient: 'from-green-500 to-emerald-600',
            bgGradient: 'from-green-50 to-emerald-50',
            borderColor: 'border-green-200',
            iconColor: 'text-green-600',
            titleColor: 'text-green-900',
            textColor: 'text-green-800',
            ringColor: 'ring-green-500/20',
            glowColor: 'shadow-green-500/20',
        },
        error: {
            icon: XCircle,
            gradient: 'from-red-500 to-rose-600',
            bgGradient: 'from-red-50 to-rose-50',
            borderColor: 'border-red-200',
            iconColor: 'text-red-600',
            titleColor: 'text-red-900',
            textColor: 'text-red-800',
            ringColor: 'ring-red-500/20',
            glowColor: 'shadow-red-500/20',
        },
        warning: {
            icon: AlertTriangle,
            gradient: 'from-orange-500 to-amber-600',
            bgGradient: 'from-orange-50 to-amber-50',
            borderColor: 'border-orange-200',
            iconColor: 'text-orange-600',
            titleColor: 'text-orange-900',
            textColor: 'text-orange-800',
            ringColor: 'ring-orange-500/20',
            glowColor: 'shadow-orange-500/20',
        },
        info: {
            icon: Info,
            gradient: 'from-blue-500 to-indigo-600',
            bgGradient: 'from-blue-50 to-indigo-50',
            borderColor: 'border-blue-200',
            iconColor: 'text-blue-600',
            titleColor: 'text-blue-900',
            textColor: 'text-blue-800',
            ringColor: 'ring-blue-500/20',
            glowColor: 'shadow-blue-500/20',
        },
        loading: {
            icon: Zap,
            gradient: 'from-purple-500 to-pink-600',
            bgGradient: 'from-purple-50 to-pink-50',
            borderColor: 'border-purple-200',
            iconColor: 'text-purple-600',
            titleColor: 'text-purple-900',
            textColor: 'text-purple-800',
            ringColor: 'ring-purple-500/20',
            glowColor: 'shadow-purple-500/20',
        },
    };

    const config = types[type] || types.info;
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 30,
                mass: 0.8
            }}
            className={`
        relative w-full max-w-sm
        bg-gradient-to-br ${config.bgGradient}
        backdrop-blur-xl
        border ${config.borderColor}
        rounded-2xl shadow-xl ${config.glowColor}
        ring-2 ${config.ringColor}
        overflow-hidden
      `}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            {/* Animated gradient border */}
            <motion.div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.gradient}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
            />

            <div className="p-4 flex items-start gap-4">
                {/* Icon with pulse animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 15,
                        delay: 0.1
                    }}
                    className="flex-shrink-0"
                >
                    <div className={`
            relative
            p-2.5 rounded-xl
            bg-gradient-to-br ${config.gradient}
            shadow-lg
          `}>
                        <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />

                        {/* Pulse ring effect */}
                        <motion.div
                            className={`absolute inset-0 rounded-xl bg-gradient-to-br ${config.gradient} opacity-20`}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.2, 0, 0.2],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </div>
                </motion.div>

                {/* Content */}
                <div className="flex-1 pt-0.5 min-w-0">
                    {title && (
                        <motion.h4
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className={`font-bold text-sm ${config.titleColor} mb-1`}
                        >
                            {title}
                        </motion.h4>
                    )}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`text-sm ${config.textColor} leading-relaxed`}
                    >
                        {message}
                    </motion.p>
                </div>

                {/* Close button */}
                <motion.button
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onClose(id)}
                    className={`
            flex-shrink-0 p-1.5 rounded-lg
            ${config.iconColor} hover:bg-white/50
            transition-all duration-200
            focus:outline-none focus:ring-2 ${config.ringColor}
          `}
                    aria-label="Fermer la notification"
                >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                </motion.button>
            </div>

            {/* Progress bar for auto-dismiss */}
            {notification.duration > 0 && (
                <motion.div
                    className={`h-1 bg-gradient-to-r ${config.gradient} origin-left`}
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{
                        duration: notification.duration / 1000,
                        ease: 'linear'
                    }}
                />
            )}
        </motion.div>
    );
});

GlobalNotification.displayName = 'GlobalNotification';

// Container component
const GlobalNotificationContainer = ({ notifications, onClose }) => {
    return (
        <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
            <div className="flex flex-col gap-3 pointer-events-auto max-h-screen overflow-y-auto pr-2 pb-4">
                <AnimatePresence mode="popLayout">
                    {notifications.map((notification) => (
                        <GlobalNotification
                            key={notification.id}
                            notification={notification}
                            onClose={onClose}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GlobalNotificationContainer;
