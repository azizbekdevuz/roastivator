import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  hint?: string;
  animated?: boolean;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-label'?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
  maxLength?: number;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    label, 
    error, 
    icon: Icon, 
    iconPosition = 'left',
    hint,
    animated = true,
    ...props 
  }, ref) => {
    const hasError = !!error;
    
    const inputClasses = cn(
      'w-full px-4 py-4 bg-gray-800/50 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300 text-lg',
      Icon && iconPosition === 'left' && 'pl-12',
      Icon && iconPosition === 'right' && 'pr-12',
      hasError 
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
        : 'border-gray-700 focus:ring-purple-500 focus:border-transparent',
      className
    );

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        
        <div className="relative">
          {Icon && (
            <Icon 
              className={cn(
                'absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5',
                iconPosition === 'left' ? 'left-4' : 'right-4'
              )} 
            />
          )}
          
          {animated ? (
            <motion.input
              ref={ref}
              className={inputClasses}
              aria-invalid={hasError}
              aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              {...props}
            />
          ) : (
            <input
              ref={ref}
              className={inputClasses}
              aria-invalid={hasError}
              aria-describedby={error ? `${props.id}-error` : hint ? `${props.id}-hint` : undefined}
              {...props}
            />
          )}
        </div>
        
        {error && (
          <motion.p
            id={`${props.id}-error`}
            className="text-red-400 text-sm flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.p>
        )}
        
        {hint && !error && (
          <p id={`${props.id}-hint`} className="text-gray-500 text-sm">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';