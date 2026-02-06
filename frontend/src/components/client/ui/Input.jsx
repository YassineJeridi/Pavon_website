// frontend/src/components/client/ui/Input.jsx

import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Input = ({
  type = 'text',
  name,
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  inputClassName = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  const baseInputStyles = `
    w-full px-4 py-3 border rounded-lg
    focus:outline-none focus:ring-2 transition-all duration-200
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
  `;

  const inputStates = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
    : isFocused
    ? 'border-gray-900 focus:ring-gray-900 focus:ring-opacity-20'
    : 'border-gray-300 focus:border-gray-900 focus:ring-gray-900 focus:ring-opacity-20';

  const paddingWithIcon = Icon && iconPosition === 'left' ? 'pl-12' : Icon && iconPosition === 'right' ? 'pr-12' : '';
  const paddingWithPassword = isPasswordType ? 'pr-12' : '';

  const containerWidth = fullWidth ? 'w-full' : '';

  return (
    <div className={`${containerWidth} ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-semibold text-gray-900 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Input Field */}
        <input
          type={inputType}
          name={name}
          id={id || name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            ${baseInputStyles}
            ${inputStates}
            ${paddingWithIcon}
            ${paddingWithPassword}
            ${inputClassName}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        />

        {/* Right Icon */}
        {Icon && iconPosition === 'right' && !isPasswordType && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Password Toggle */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Helper Text or Error */}
      {(error || helperText) && (
        <p
          className={`mt-2 text-sm ${
            error ? 'text-red-600' : 'text-gray-600'
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
