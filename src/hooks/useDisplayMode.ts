import { useOpenAIGlobal } from './useOpenAIGlobal';
import type { DisplayMode } from '../types';

/**
 * Hook to get the current display mode from window.openai
 * Based on OpenAI Apps SDK official examples
 *
 * @returns The current display mode or null if not available
 *
 * @example
 * ```tsx
 * function MyWidget() {
 *   const displayMode = useDisplayMode();
 *
 *   return (
 *     <div className={displayMode === 'fullscreen' ? 'full' : 'inline'}>
 *       {displayMode === 'fullscreen' ? 'Fullscreen View' : 'Inline View'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDisplayMode(): DisplayMode | null {
  return useOpenAIGlobal('displayMode');
}
