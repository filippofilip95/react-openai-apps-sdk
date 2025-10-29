/**
 * Hook to access window.openai
 * Works with both real ChatGPT and development mock
 */

import { useState, useEffect } from 'react';
import type { OpenAI } from '../types';

export function useOpenAI(): OpenAI | undefined {
  const [openai, setOpenai] = useState<OpenAI | undefined>(
    typeof window !== 'undefined' ? window.openai : undefined
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Set initial value
    setOpenai(window.openai);

    // Listen for openai ready event
    const handleReady = () => {
      setOpenai(window.openai);
    };

    // Listen for global changes
    const handleSetGlobals = () => {
      setOpenai(window.openai);
    };

    window.addEventListener('openai:ready', handleReady);
    window.addEventListener('openai:set_globals', handleSetGlobals);

    return () => {
      window.removeEventListener('openai:ready', handleReady);
      window.removeEventListener('openai:set_globals', handleSetGlobals);
    };
  }, []);

  return openai;
}
