import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outline' | 'ghost';
  animated?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const cardVariants = {
  default: 'bg-gray-800/50 backdrop-blur-sm border border-gray-700',
  elevated: 'bg-gray-800/70 backdrop-blur-md border border-gray-600 shadow-2xl',
  outline: 'bg-transparent border border-gray-600',
  ghost: 'bg-gray-900/20 border border-gray-800',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', animated = true, children, ...props }, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-300';
    
    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={cn(baseClasses, cardVariants[variant], className)}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          id={props.id}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseClasses, cardVariants[variant], className)}
        id={props.id}
      >
        {children}
      </div>
    );
  }
);

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, icon: Icon, title, subtitle, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between p-6 pb-3', className)}
        {...props}
      >
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="w-6 h-6 text-purple-400" />}
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    );
  }
);

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-3', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-6 py-4 pt-3 border-t border-gray-700', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';