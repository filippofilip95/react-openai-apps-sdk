/**
 * Utility hooks for OpenAI API actions with error handling
 * These abstract away the null checks and error handling for window.openai functions
 */

import { useCallback } from 'react';
import { useOpenAI } from './useOpenAI';

export interface SendFollowUpMessageOptions {
  prompt: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  fallbackMessage?: string;
}

export interface CallToolOptions<T = unknown> {
  name: string;
  args: Record<string, unknown>;
  onSuccess?: (result: { structuredContent?: T; result?: string }) => void;
  onError?: (error: Error) => void;
  fallbackMessage?: string;
}

export interface RequestDisplayModeOptions {
  mode: 'inline' | 'fullscreen' | 'pip';
  onSuccess?: (mode: 'inline' | 'fullscreen' | 'pip') => void;
  onError?: (error: Error) => void;
  fallbackMessage?: string;
}

export interface OpenExternalOptions {
  href: string;
  onError?: (error: Error) => void;
  fallbackMessage?: string;
}

/**
 * Hook providing safe wrappers for OpenAI API actions
 * Handles null checks, error handling, and provides fallback behavior
 */
export function useOpenAIActions() {
  const openai = useOpenAI();

  /**
   * Send a follow-up message to ChatGPT
   * Safely handles null checks and errors
   */
  const sendFollowUpMessage = useCallback(
    async (options: SendFollowUpMessageOptions): Promise<boolean> => {
      const { prompt, onSuccess, onError, fallbackMessage } = options;

      try {
        if (!openai?.sendFollowUpMessage) {
          throw new Error(
            fallbackMessage || 'ChatGPT API not available. Please try again later.'
          );
        }

        await openai.sendFollowUpMessage({ prompt });
        onSuccess?.();
        return true;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error occurred');
        onError?.(err);
        console.error('[useOpenAIActions] sendFollowUpMessage error:', err);
        return false;
      }
    },
    [openai]
  );

  /**
   * Call a tool and get the result
   * Safely handles null checks and errors
   */
  const callTool = useCallback(
    async <T = unknown>(options: CallToolOptions<T>): Promise<{ success: boolean; data?: T }> => {
      const { name, args, onSuccess, onError, fallbackMessage } = options;

      try {
        if (!openai?.callTool) {
          throw new Error(
            fallbackMessage || 'ChatGPT API not available. Please try again later.'
          );
        }

        const result = await openai.callTool(name, args);
        const typedResult = result as { structuredContent?: T; result?: string };
        onSuccess?.(typedResult);
        return { success: true, data: typedResult.structuredContent };
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error occurred');
        onError?.(err);
        console.error('[useOpenAIActions] callTool error:', err);
        return { success: false };
      }
    },
    [openai]
  );

  /**
   * Request display mode change
   * Safely handles null checks and errors
   */
  const requestDisplayMode = useCallback(
    async (options: RequestDisplayModeOptions): Promise<boolean> => {
      const { mode, onSuccess, onError, fallbackMessage } = options;

      try {
        if (!openai?.requestDisplayMode) {
          throw new Error(
            fallbackMessage || 'Display mode change not available.'
          );
        }

        const result = await openai.requestDisplayMode({ mode });
        onSuccess?.(result.mode);
        return true;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error occurred');
        onError?.(err);
        console.error('[useOpenAIActions] requestDisplayMode error:', err);
        return false;
      }
    },
    [openai]
  );

  /**
   * Open external URL
   * Safely handles null checks and errors
   */
  const openExternal = useCallback(
    (options: OpenExternalOptions): boolean => {
      const { href, onError, fallbackMessage } = options;

      try {
        if (!openai?.openExternal) {
          throw new Error(
            fallbackMessage || 'External link opening not available.'
          );
        }

        openai.openExternal({ href });
        return true;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error occurred');
        onError?.(err);
        console.error('[useOpenAIActions] openExternal error:', err);
        return false;
      }
    },
    [openai]
  );

  return {
    sendFollowUpMessage,
    callTool,
    requestDisplayMode,
    openExternal,
    isAvailable: !!openai,
  };
}
