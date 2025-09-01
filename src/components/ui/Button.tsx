import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  animated?: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
  'aria-label'?: string;
}

const buttonVariants = {
  primary: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold animate-glow',
  secondary: 'bg-gray-700 hover:bg-gray-600 text-white font-semibold',
  ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white',
  outline: 'border border-gray-600 hover:border-gray-500 bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white',
};

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    icon: Icon, 
    iconPosition = 'left',
    animated = true,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
    
    if (animated) {
      return (
        <motion.button
          ref={ref}
          className={cn(
            baseClasses,
            buttonVariants[variant],
            buttonSizes[size],
            className
          )}
          disabled={disabled || isLoading}
          whileHover={disabled || isLoading ? {} : { scale: 1.05 }}
          whileTap={disabled || isLoading ? {} : { scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          type={props.type}
          id={props.id}
          aria-label={props['aria-label']}
        >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Loading...
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
          </>
        )}
        </motion.button>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        disabled={disabled || isLoading}
        type={props.type}
        id={props.id}
        aria-label={props['aria-label']}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            Loading...
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';