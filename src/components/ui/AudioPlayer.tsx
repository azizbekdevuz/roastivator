'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  children: React.ReactNode;
  className?: string;
  volume?: number;
  preload?: boolean;
}

interface AudioPermissionState {
  granted: boolean;
  requested: boolean;
  supported: boolean;
}

/**
 * AudioPlayer component that handles browser audio permissions
 * and provides a clickable trigger for playing sound effects
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  children,
  className = "",
  volume = 0.7,
  preload = true
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [permission, setPermission] = useState<AudioPermissionState>({
    granted: false,
    requested: false,
    supported: true
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Check if audio is supported
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const audio = new Audio();
    const canPlayMp3 = audio.canPlayType('audio/mpeg');
    setPermission(prev => ({
      ...prev,
      supported: canPlayMp3 !== ''
    }));
  }, []);

  // Request audio permission on first interaction
  const requestAudioPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    
    try {
      // For better browser compatibility, just try to play the actual audio
      if (audioRef.current) {
        audioRef.current.volume = 0.1; // Very low volume for permission test
        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      setPermission(prev => ({ ...prev, granted: true, requested: true }));
      return true;
    } catch (error) {
      console.warn('Audio permission not granted:', error);
      setPermission(prev => ({ ...prev, granted: false, requested: true }));
      return false;
    }
  }, []);

  // Handle audio playback
  const playAudio = useCallback(async () => {
    console.log('🔊 Audio click detected!', { 
      audioExists: !!audioRef.current, 
      supported: permission.supported,
      src: src 
    });
    
    if (!audioRef.current || !permission.supported) {
      console.warn('❌ Audio not available:', { audioRef: !!audioRef.current, supported: permission.supported });
      return;
    }

    try {
      setIsPlaying(true);
      setHasError(false);

      // Request permission if not already requested
      if (!permission.requested) {
        console.log('🔐 Requesting audio permission...');
        const permissionGranted = await requestAudioPermission();
        if (!permissionGranted) {
          console.warn('❌ Audio permission denied');
          setIsPlaying(false);
          return;
        }
        console.log('✅ Audio permission granted');
      }

      // Reset audio to beginning and play
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume;
      
      console.log('▶️ Attempting to play audio...');
      await audioRef.current.play();
      console.log('🎵 Audio playing successfully!');
      
    } catch (error) {
      console.error('❌ Error playing audio:', error);
      setHasError(true);
      setIsPlaying(false);
      
      // Try to request permission if autoplay was blocked
      if (!permission.granted) {
        console.log('🔄 Retrying permission request...');
        await requestAudioPermission();
      }
    }
  }, [permission, volume, requestAudioPermission, src]);

  // Handle audio end
  const handleAudioEnd = useCallback(() => {
    console.log('✅ Audio playback completed');
    setIsPlaying(false);
  }, []);

  const handleAudioError = useCallback((error: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error('❌ Audio error occurred:', error);
    setHasError(true);
    setIsPlaying(false);
  }, []);

  // Show permission prompt on first visit
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const hasVisited = localStorage.getItem('roastivator-audio-visited');
    if (!hasVisited && permission.supported) {
      localStorage.setItem('roastivator-audio-visited', 'true');
      
      // Show a friendly notification about audio features
      setTimeout(() => {
        if (!permission.requested) {
          console.log('🔊 Roastivator uses sound effects for extra emotional damage! Click sounds to enable audio.');
        }
      }, 2000);
    }
  }, [permission]);

  if (!permission.supported) {
    return <span className={className}>{children}</span>;
  }

  return (
    <>
      <button
        onClick={playAudio}
        className={`
          inline-flex items-center gap-1 transition-all duration-200
          hover:text-red-400 hover:scale-105 active:scale-95
          cursor-pointer group relative
          ${className}
          ${hasError ? 'text-gray-500' : ''}
        `}
        title={hasError ? 'Audio unavailable' : 'Click for emotional damage sound effect'}
        disabled={isPlaying}
      >
        {children}
        
        {/* Audio icon indicator */}
        <span className="inline-flex ml-1 opacity-70 group-hover:opacity-100 transition-opacity">
          {hasError ? (
            <VolumeX className="w-3 h-3" />
          ) : (
            <Volume2 className={`w-3 h-3 ${isPlaying ? 'animate-pulse text-red-400' : ''}`} />
          )}
        </span>
        
        {/* Visual feedback for interaction */}
        {isPlaying && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
        )}
      </button>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={src}
        preload={preload ? 'auto' : 'none'}
        onEnded={handleAudioEnd}
        onError={handleAudioError}
        onLoadedData={() => console.log('🎵 Audio loaded successfully:', src)}
        onCanPlay={() => console.log('✅ Audio can play:', src)}
        style={{ display: 'none' }}
      />
    </>
  );
};

/**
 * Hook for managing global audio permission state
 */
export const useAudioPermission = () => {
  const [permission, setPermission] = useState<AudioPermissionState>({
    granted: false,
    requested: false,
    supported: true
  });

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    
    try {
      const testAudio = new Audio();
      testAudio.volume = 0;
      testAudio.muted = true;
      
      await testAudio.play();
      testAudio.pause();
      
      setPermission({ granted: true, requested: true, supported: true });
      return true;
    } catch (error) {
      setPermission(prev => ({ ...prev, granted: false, requested: true }));
      return false;
    }
  }, []);

  return { permission, requestPermission };
};