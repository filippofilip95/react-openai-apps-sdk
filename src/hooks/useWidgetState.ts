import { useCallback, useEffect, useState, type SetStateAction } from 'react';
import { useOpenAIGlobal } from './useOpenAIGlobal';

type UnknownObject = Record<string, unknown>;

/**
 * Hook to manage persistent widget state via window.openai.setWidgetState
 * Based on OpenAI Apps SDK official examples
 *
 * @template T The type of the widget state
 * @param defaultState Optional default state
 * @returns A tuple of [state, setState] similar to useState
 *
 * @example
 * ```tsx
 * interface WidgetData {
 *   favorites: string[];
 *   lastViewed: string;
 * }
 *
 * function MyWidget() {
 *   const [state, setState] = useWidgetState<WidgetData>({
 *     favorites: [],
 *     lastViewed: ''
 *   });
 *
 *   const addFavorite = (id: string) => {
 *     setState(prev => ({
 *       ...prev,
 *       favorites: [...prev.favorites, id]
 *     }));
 *   };
 *
 *   return <div>Favorites: {state.favorites.length}</div>;
 * }
 * ```
 */
export function useWidgetState<T extends UnknownObject>(
  defaultState: T | (() => T)
): readonly [T, (state: SetStateAction<T>) => void];

export function useWidgetState<T extends UnknownObject>(
  defaultState?: T | (() => T | null) | null
): readonly [T | null, (state: SetStateAction<T | null>) => void];

export function useWidgetState<T extends UnknownObject>(
  defaultState?: T | (() => T | null) | null
): readonly [T | null, (state: SetStateAction<T | null>) => void] {
  const widgetStateFromWindow = useOpenAIGlobal('widgetState') as T;

  const [widgetState, _setWidgetState] = useState<T | null>(() => {
    if (widgetStateFromWindow != null) {
      return widgetStateFromWindow;
    }
    return typeof defaultState === 'function'
      ? defaultState()
      : defaultState ?? null;
  });

  useEffect(() => {
    _setWidgetState(widgetStateFromWindow);
  }, [widgetStateFromWindow]);

  const setWidgetState = useCallback(
    (state: SetStateAction<T | null>) => {
      _setWidgetState((prevState) => {
        const newState = typeof state === 'function' ? state(prevState) : state;
        if (newState != null && typeof window !== 'undefined' && window.openai) {
          window.openai.setWidgetState(newState);
        }
        return newState;
      });
    },
    []
  );

  return [widgetState, setWidgetState] as const;
}
