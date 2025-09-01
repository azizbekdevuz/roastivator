'use client';

import { useEffect } from 'react';

interface KeyboardShortcut {
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: (event: KeyboardEvent) => void;
  preventDefault?: boolean;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      shortcuts.forEach(({ key, metaKey, ctrlKey, shiftKey, altKey, callback, preventDefault }) => {
        const keyMatches = event.key.toLowerCase() === key.toLowerCase();
        const metaMatches = metaKey === undefined || event.metaKey === metaKey;
        const ctrlMatches = ctrlKey === undefined || event.ctrlKey === ctrlKey;
        const shiftMatches = shiftKey === undefined || event.shiftKey === shiftKey;
        const altMatches = altKey === undefined || event.altKey === altKey;

        if (keyMatches && metaMatches && ctrlMatches && shiftMatches && altMatches) {
          if (preventDefault) {
            event.preventDefault();
          }
          callback(event);
        }
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [shortcuts]);
};

export const useEscapeKey = (callback: () => void) => {
  useKeyboardShortcuts([
    {
      key: 'Escape',
      callback,
      preventDefault: true,
    }
  ]);
};