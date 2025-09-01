'use client';

import React from 'react';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary 
      onError={(error, errorInfo) => {
        // In production, you might want to send this to an error reporting service
        console.error('Application Error:', error, errorInfo);
        
        // Example: Send to analytics or error reporting
        // analytics.track('error', { message: error.message, stack: error.stack });
      }}
    >
      {children}
    </ErrorBoundary>
  );
};