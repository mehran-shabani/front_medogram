import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const buttonVariants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  outline: 'btn border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500',
  destructive: 'btn bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
  success: 'btn bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
};

const buttonSizes = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

/**
 * Modern Button component with multiple variants and animations
 */
export const Button = React.forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  as: Component = 'button',
  ...props
}, ref) => {
  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };

  const buttonClasses = cn(
    buttonVariants[variant],
    buttonSizes[size],
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'cursor-wait',
    className
  );

  if (Component !== 'button') {
    return (
      <Component
        ref={ref}
        className={buttonClasses}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <div className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
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
            در حال پردازش...
          </div>
        ) : (
          children
        )}
      </Component>
    );
  }

  return (
    <motion.button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
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
          در حال پردازش...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';