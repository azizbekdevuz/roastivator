'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to ensure component only renders on client-side
 * Prevents hydration mismatches for components with dynamic content
 */
export const useClientOnly = (): boolean => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
};

/**
 * Hook for generating stable random values that won't cause hydration issues
 */
export const useStableRandom = (count: number) => {
  const [values, setValues] = useState<number[]>([]);
  const mounted = useClientOnly();

  useEffect(() => {
    if (mounted) {
      setValues(Array.from({ length: count }, () => Math.random()));
    }
  }, [mounted, count]);

  return { values, mounted };
};