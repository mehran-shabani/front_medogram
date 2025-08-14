import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

/**
 * Modern Card component with hover animations
 */
export const Card = React.forwardRef(({
  className,
  children,
  hover = true,
  padding = true,
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        'rounded-xl border border-gray-200 bg-white shadow-soft',
        padding && 'p-6',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2, boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)' } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

/**
 * Card Header component
 */
export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
    {children}
  </div>
);

/**
 * Card Title component
 */
export const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props}>
    {children}
  </h3>
);

/**
 * Card Description component
 */
export const CardDescription = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-gray-500', className)} {...props}>
    {children}
  </p>
);

/**
 * Card Content component
 */
export const CardContent = ({ className, children, ...props }) => (
  <div className={cn('pt-0', className)} {...props}>
    {children}
  </div>
);

/**
 * Card Footer component
 */
export const CardFooter = ({ className, children, ...props }) => (
  <div className={cn('flex items-center pt-4', className)} {...props}>
    {children}
  </div>
);