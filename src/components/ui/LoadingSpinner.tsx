import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Github, Code, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'pulse' | 'bounce' | 'rotate';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-16 h-16',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  variant = 'default',
  className 
}) => {
  const baseClasses = cn(sizeClasses[size], className);

  switch (variant) {
    case 'pulse':
      return (
        <motion.div
          className={cn(baseClasses, 'bg-purple-500 rounded-full')}
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      );

    case 'bounce':
      return (
        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={cn('bg-purple-500 rounded-full', size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4')}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.1,
              }}
            />
          ))}
        </motion.div>
      );

    case 'rotate':
      return (
        <motion.div
          className={baseClasses}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Flame className="w-full h-full text-orange-500" />
        </motion.div>
      );

    default:
      return (
        <div className={cn(baseClasses, 'animate-spin')}>
          <div className="rounded-full border-2 border-transparent border-t-purple-500 border-r-purple-500"></div>
        </div>
      );
  }
};

interface AdvancedLoadingProps {
  step?: string;
  progress?: number;
  messages?: string[];
  currentMessage?: number;
}

export const AdvancedLoading: React.FC<AdvancedLoadingProps> = ({
  step,
  progress = 0,
  messages = [],
  currentMessage = 0,
}) => {
  const icons = [Github, Code, Zap, Flame];
  const IconComponent = icons[currentMessage % icons.length];

  return (
    <div className="text-center py-20">
      <motion.div
        className="mb-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <IconComponent className="w-16 h-16 text-orange-500 mx-auto" />
      </motion.div>
      
      <h2 className="text-3xl font-bold text-white mb-4">
        {step || 'Processing...'}
      </h2>
      
      <div className="max-w-md mx-auto mb-6">
        <motion.div className="bg-gray-800 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {messages.length > 0 && (
        <motion.p
          key={currentMessage}
          className="text-gray-300 h-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {messages[currentMessage]}
        </motion.p>
      )}
    </div>
  );
};