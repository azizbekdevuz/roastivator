'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LoadingStep } from '@/types/github';
import { AdvancedLoading } from '@/components/ui/LoadingSpinner';
import { LOADING_MESSAGES } from '@/constants';

interface LoadingStateProps {
  step: LoadingStep;
}

const stepInfo = {
  'fetching-user': { label: 'Fetching User Profile', progress: 20 },
  'fetching-repos': { label: 'Scanning Repositories', progress: 40 },
  'fetching-commits': { label: 'Analyzing Commit History', progress: 60 },
  'analyzing': { label: 'Processing Data', progress: 80 },
  'roasting': { label: 'Generating Epic Roast', progress: 100 },
};

export const LoadingState: React.FC<LoadingStateProps> = ({ step }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const { label, progress } = stepInfo[step];

  return (
    <motion.div
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[400px] flex items-center justify-center"
    >
      <AdvancedLoading
        step={label}
        progress={progress}
        messages={[...LOADING_MESSAGES]}
        currentMessage={currentMessage}
      />
    </motion.div>
  );
};