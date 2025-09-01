'use client';

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { UserInput } from '@/components/github/UserInput';
import { LoadingState } from '@/components/github/LoadingState';
import { RoastDisplay } from '@/components/github/RoastDisplay';
import { useGitHubData } from '@/hooks/useGitHubData';
import { useRoasting } from '@/hooks/useRoasting';
import { useClientOnly } from '@/hooks/useClientOnly';

type AppStep = 'input' | 'loading' | 'result';

export default function GitHubRoaster() {
  const { data, loading, error, loadingStep, fetchUserData, reset, isValidUsername } = useGitHubData();
  const { generateRoast } = useRoasting();
  
  const [step, setStep] = React.useState<AppStep>('input');
  const [roastResult, setRoastResult] = React.useState<ReturnType<typeof generateRoast> | null>(null);

  const handleReset = React.useCallback(() => {
    reset();
    setRoastResult(null);
    setStep('input');
  }, [reset]);

  // Keyboard shortcuts for better UX
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step === 'result') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step, handleReset]);

  // Update step based on data state
  useEffect(() => {
    if (loading) {
      setStep('loading');
    } else if (data && !error) {
      const roast = generateRoast(data);
      setRoastResult(roast);
      setStep('result');
    } else if (error) {
      setStep('input');
    }
  }, [data, loading, error, generateRoast]);

  const handleSubmit = async (username: string) => {
    if (!isValidUsername(username)) {
      return;
    }
    
    await fetchUserData(username);
  };



  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {step === 'input' && (
              <UserInput
                key="input"
                onSubmit={handleSubmit}
                loading={loading}
                disabled={loading}
              />
            )}

            {step === 'loading' && loadingStep && (
              <LoadingState
                key="loading"
                step={loadingStep}
              />
            )}

            {step === 'result' && roastResult && data && (
              <RoastDisplay
                key="result"
                result={roastResult}
                username={data.user.login}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>

          {/* Floating decorative elements */}
          <FloatingElements />
          
          {/* Error display */}
          {error && step === 'input' && (
            <div className="fixed bottom-4 right-4 max-w-sm">
              <div className="bg-red-900/90 border border-red-700 rounded-lg p-4 text-red-300">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

const FloatingElements: React.FC = () => {
  const [positions, setPositions] = React.useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);
  const mounted = useClientOnly();

  React.useEffect(() => {
    if (mounted) {
      // Generate positions only on client side to avoid hydration mismatch
      const newPositions = Array.from({ length: 15 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 3,
      }));
      setPositions(newPositions);
    }
  }, [mounted]);

  if (!mounted || positions.length === 0) {
    return null; // Return null during SSR and until positions are generated
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
          style={{
            left: `${pos.left}%`,
            top: `${pos.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: pos.duration,
            repeat: Infinity,
            delay: pos.delay,
          }}
        />
      ))}
    </div>
  );
};