/**
 * Mock implementation of window.openai for local development
 */

import type { OpenAI, OpenAiGlobals, DisplayMode, Theme } from '../types';

const STORAGE_KEY = 'react-openai-apps-sdk-state';

export function getStoredState(): Partial<OpenAiGlobals> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveState(state: Partial<OpenAiGlobals>): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('[OpenAI DevTools] Failed to save state:', e);
  }
}

export function createMockOpenAI(config: Partial<OpenAiGlobals> = {}): OpenAI {
  const stored = getStoredState();

  const state: OpenAiGlobals = {
    theme: (stored.theme as Theme) || (config.theme as Theme) || 'light',
    displayMode: (stored.displayMode as DisplayMode) || (config.displayMode as DisplayMode) || 'inline',
    maxHeight: stored.maxHeight || config.maxHeight || 600,
    locale: stored.locale || config.locale || 'en',
    userAgent: stored.userAgent || config.userAgent || {
      device: { type: 'desktop' },
      capabilities: { hover: true, touch: false }
    },
    safeArea: stored.safeArea || config.safeArea || {
      insets: { top: 0, bottom: 0, left: 0, right: 0 }
    },
    toolInput: stored.toolInput || config.toolInput || null,
    toolOutput: stored.toolOutput || config.toolOutput || null,
    toolResponseMetadata: stored.toolResponseMetadata || config.toolResponseMetadata || null,
    widgetState: stored.widgetState || config.widgetState || null,
    setWidgetState: async (newState: unknown) => {
      state.widgetState = newState;
      saveState(state);
      dispatchOpenAIEvent('widget_state_change', { widgetState: newState });
    }
  };

  const mock: OpenAI = {
    ...state,
    __devMock: true,

    callTool: async (name: string, args: Record<string, unknown>) => {
      console.log('[OpenAI DevTools] callTool:', name, args);
      return { result: `Mock response for ${name}` };
    },

    sendFollowUpMessage: async (args: { prompt: string }) => {
      console.log('[OpenAI DevTools] sendFollowUpMessage:', args.prompt);
    },

    openExternal: (payload: { href: string }) => {
      console.log('[OpenAI DevTools] openExternal:', payload.href);
      window.open(payload.href, '_blank');
    },

    requestDisplayMode: async (args: { mode: DisplayMode }) => {
      console.log('[OpenAI DevTools] requestDisplayMode:', args.mode);
      updateMockState('displayMode', args.mode);
      return { mode: args.mode };
    }
  };

  // Apply theme class
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }

  return mock;
}

export function updateMockState<K extends keyof OpenAiGlobals>(
  key: K,
  value: OpenAiGlobals[K]
): void {
  if (!window.openai?.__devMock) {
    console.warn('[OpenAI DevTools] Cannot update: not a mock instance');
    return;
  }

  // Update window.openai
  (window.openai as any)[key] = value;

  // Save to localStorage
  const state = extractStateFromMock(window.openai);
  saveState(state);

  // Apply theme if changed
  if (key === 'theme' && typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', value === 'dark');
  }

  // Dispatch event
  dispatchOpenAIEvent('set_globals', { [key]: value });
}

export function dispatchOpenAIEvent(type: string, detail: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent(`openai:${type}`, {
      detail: { globals: detail }
    })
  );
}

function extractStateFromMock(openai: OpenAI): Partial<OpenAiGlobals> {
  return {
    theme: openai.theme,
    displayMode: openai.displayMode,
    maxHeight: openai.maxHeight,
    locale: openai.locale,
    userAgent: openai.userAgent,
    safeArea: openai.safeArea,
    toolInput: openai.toolInput,
    toolOutput: openai.toolOutput,
    toolResponseMetadata: openai.toolResponseMetadata,
    widgetState: openai.widgetState
  };
}

export function shouldCreateMock(enableMock: boolean = true): boolean {
  if (typeof window === 'undefined') return false;
  if (!enableMock) return false;

  // Real ChatGPT detected
  if (window.openai && !(window.openai as any).__devMock) {
    console.log('[OpenAI DevTools] Real window.openai detected, using native');
    return false;
  }

  // Mock already exists
  if (window.openai?.__devMock) {
    console.log('[OpenAI DevTools] Mock already initialized');
    return false;
  }

  return true;
}
