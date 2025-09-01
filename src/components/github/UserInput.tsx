'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Github, Search, Dice6, Flame } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { validateUsername } from '@/lib/validations';
import { DEMO_USERNAMES } from '@/constants';

interface UserInputProps {
  onSubmit: (username: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const UserInput: React.FC<UserInputProps> = ({ 
  onSubmit, 
  loading = false, 
  disabled = false 
}) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(() => {
    const validation = validateUsername(username);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid username');
      return;
    }

    setError('');
    onSubmit(username.trim());
  }, [username, onSubmit]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  }, [error]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && !disabled) {
      handleSubmit();
    }
  }, [handleSubmit, loading, disabled]);

  const tryDemo = useCallback(() => {
    const randomUsername = DEMO_USERNAMES[Math.floor(Math.random() * DEMO_USERNAMES.length)];
    setUsername(randomUsername);
    setError('');
    
    // Slight delay for better UX
    setTimeout(() => {
      onSubmit(randomUsername);
    }, 300);
  }, [onSubmit]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="text-center mb-8">
        <motion.div
          className="flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        >
          <Flame className="w-16 h-16 text-orange-500 mr-4 animate-float" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Roastivator
          </h1>
          <Github className="w-16 h-16 text-white ml-4 animate-float" style={{ animationDelay: '1s' }} />
        </motion.div>
        
        <motion.p 
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Get brutally honest feedback about your GitHub profile. 
          We&apos;ll analyze your repos, commits, and coding habits to deliver the roast you deserve.
        </motion.p>
      </div>

      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Input
          type="text"
          value={username}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter GitHub username"
          icon={Github}
          iconPosition="left"
          error={error}
          hint="Enter any public GitHub username to analyze"
          disabled={loading || disabled}
          aria-label="GitHub username"
          maxLength={39}
        />
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <Button
          onClick={handleSubmit}
          disabled={!username.trim() || loading || disabled}
          variant="primary"
          size="lg"
          icon={Search}
          iconPosition="left"
          isLoading={loading}
          animated
        >
          {loading ? 'Roasting...' : 'Roast This Developer'}
        </Button>

        <Button
          onClick={tryDemo}
          disabled={loading || disabled}
          variant="secondary"
          size="lg"
          icon={Dice6}
          iconPosition="left"
          animated
        >
          Try Demo
        </Button>
      </motion.div>

      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-gray-400 text-sm mb-4">
          ⚠️ Warning: Results may cause{' '}
          <AudioPlayer 
            src="/audio/emotional-damage.mp3"
            className="text-red-400 font-semibold hover:text-red-300 transition-colors underline decoration-red-400/50 hover:decoration-red-300"
          >
            emotional damage
          </AudioPlayer>
          . Proceed with thick skin.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <span>✓ Commit message analysis</span>
          <span>✓ Contribution patterns</span>
          <span>✓ Emoji abuse detection</span>
          <span>✓ Repository quality assessment</span>
        </div>
        
        <div className="mt-4 text-xs text-gray-600">
          <p>💡 Pro tip: Press Enter to roast • Ctrl+Enter for express roasting</p>
        </div>
      </motion.div>
    </motion.div>
  );
};