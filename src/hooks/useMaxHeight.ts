import { useOpenAIGlobal } from './useOpenAIGlobal';

/**
 * Hook to get the maximum height from window.openai
 * Based on OpenAI Apps SDK official examples
 *
 * @returns The maximum height in pixels or null if not available
 *
 * @example
 * ```tsx
 * function MyWidget() {
 *   const maxHeight = useMaxHeight();
 *
 *   return (
 *     <div style={{ height: `${maxHeight}px`, overflow: 'auto' }}>
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export function useMaxHeight(): number | null {
  return useOpenAIGlobal('maxHeight');
}
