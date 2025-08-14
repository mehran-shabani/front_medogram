import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * Modern Input component with validation states and animations
 */
export const Input = React.forwardRef(({
  className,
  type = 'text',
  label,
  error,
  success,
  helperText,
  disabled = false,
  required = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}, ref) => {
  const hasError = Boolean(error);
  const hasSuccess = Boolean(success);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        
        <motion.input
          ref={ref}
          type={type}
          className={cn(
            'input',
            LeftIcon && 'pl-10',
            (RightIcon || hasError || hasSuccess) && 'pr-10',
            hasError && 'border-error-300 focus:border-error-500 focus:ring-error-500',
            hasSuccess && 'border-success-300 focus:border-success-500 focus:ring-success-500',
            disabled && 'bg-gray-50 text-gray-500 cursor-not-allowed',
            className
          )}
          disabled={disabled}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          {...props}
        />
        
        {(RightIcon || hasError || hasSuccess) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {hasError && (
              <ExclamationCircleIcon className="h-5 w-5 text-error-400" />
            )}
            {hasSuccess && !hasError && (
              <CheckCircleIcon className="h-5 w-5 text-success-400" />
            )}
            {RightIcon && !hasError && !hasSuccess && (
              <RightIcon className="h-5 w-5 text-gray-400" />
            )}
          </div>
        )}
      </div>
      
      {(error || success || helperText) && (
        <motion.p
          className={cn(
            'mt-1 text-sm',
            hasError && 'text-error-600',
            hasSuccess && !hasError && 'text-success-600',
            !hasError && !hasSuccess && 'text-gray-500'
          )}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2 }}
        >
          {error || success || helperText}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';