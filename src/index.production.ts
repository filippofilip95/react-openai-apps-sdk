/**
 * OpenAI DevTools - Production Build
 * All components are tree-shaken (empty) in production
 */

import type {
  OpenAIDevToolsProps,
  OpenAIDevToolsPanelProps,
  OpenAI,
  OpenAiGlobals,
} from './types';

// Empty components for production
export function OpenAIDevTools(_props: OpenAIDevToolsProps): null {
  return null;
}

export function OpenAIDevToolsPanel(_props: OpenAIDevToolsPanelProps): null {
  return null;
}

// Hooks still work (access real window.openai)
export { useOpenAI } from './hooks/useOpenAI';
export { useOpenAIGlobal } from './hooks/useOpenAIGlobal';

// No-op utilities
export const createMockOpenAI = (): OpenAI => {
  throw new Error('[OpenAI DevTools] Mock not available in production');
};

export const updateMockState = (): void => {
  // No-op in production
};

export const dispatchOpenAIEvent = (): void => {
  // No-op in production
};

export const shouldCreateMock = (): boolean => false;

export const getStoredState = (): Partial<OpenAiGlobals> => ({});

export const saveState = (): void => {
  // No-op in production
};

// Re-export types
export type {
  OpenAI,
  OpenAiGlobals,
  Theme,
  DisplayMode,
  DeviceType,
  SafeAreaInsets,
  SafeArea,
  UserAgent,
  CallTool,
  RequestDisplayMode,
  OpenAIAPI,
  OpenAIDevToolsProps,
  OpenAIDevToolsPanelProps,
} from './types';
