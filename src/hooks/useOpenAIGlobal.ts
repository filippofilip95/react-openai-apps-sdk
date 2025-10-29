/**
 * Hook to get a specific global from window.openai
 * Works with both real ChatGPT and development mock
 */

import { useSyncExternalStore, useCallback } from 'react';
import type { OpenAiGlobals } from '../types';

export function useOpenAIGlobal<K extends keyof OpenAiGlobals>(
  key: K
): OpenAiGlobals[K] | null {
  const subscribe = useCallback((callback: () => void) => {
    if (typeof window === 'undefined') return () => {};

    // Listen for changes to this specific global
    const handleChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.globals?.[key] !== undefined) {
        callback();
      }
    };

    window.addEventListener('openai:set_globals', handleChange);
    return () => window.removeEventListener('openai:set_globals', handleChange);
  }, [key]);

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || !window.openai) return null;
    return window.openai[key] ?? null;
  }, [key]);

  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
