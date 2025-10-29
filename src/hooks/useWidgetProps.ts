import { useOpenAIGlobal } from './useOpenAIGlobal';

/**
 * Hook to get widget properties (toolOutput) from window.openai
 * Based on OpenAI Apps SDK official examples
 *
 * @template T The type of the tool output
 * @param defaultState Optional default state if toolOutput is not available
 * @returns The tool output data or the default state
 *
 * @example
 * ```tsx
 * interface PostData {
 *   text: string;
 *   images: string[];
 * }
 *
 * function PostWidget() {
 *   const post = useWidgetProps<PostData>({ text: '', images: [] });
 *
 *   return (
 *     <div>
 *       <p>{post.text}</p>
 *       {post.images.map(img => <img key={img} src={img} />)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useWidgetProps<T extends Record<string, unknown>>(
  defaultState?: T | (() => T)
): T {
  const props = useOpenAIGlobal('toolOutput') as T;

  const fallback =
    typeof defaultState === 'function'
      ? (defaultState as () => T | null)()
      : defaultState ?? null;

  return props ?? fallback;
}
