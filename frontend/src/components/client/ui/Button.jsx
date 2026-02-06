// frontend/src/components/client/ui/Button.jsx

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon,
  iconPosition = 'left',
}) => {
  const baseStyles = 'font-semibold rounded-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';

  const variants = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-300',
    secondary: 'bg-white text-gray-900 border-2 border-gray-900 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300',
    outline: 'bg-transparent text-gray-900 border border-gray-300 hover:border-gray-900 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-300',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const buttonClasses = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${widthClass}
    ${className}
    ${loading ? 'relative' : ''}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClasses}
    >
      <span className={`flex items-center justify-center space-x-2 ${loading ? 'invisible' : ''}`}>
        {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
        <span>{children}</span>
        {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
      </span>

      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
    </button>
  );
};

export default Button;
