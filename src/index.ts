/**
 * OpenAI DevTools - Development Tools for OpenAI Apps SDK
 *
 * Drop-in React components for debugging and testing OpenAI widgets.
 * Similar to React Query DevTools.
 *
 * @packageDocumentation
 */

// Main components
export { OpenAIDevTools } from './components/OpenAIDevTools';
export { OpenAIDevToolsPanel } from './components/OpenAIDevToolsPanel';

// Hooks
export { useOpenAI } from './hooks/useOpenAI';
export { useOpenAIGlobal } from './hooks/useOpenAIGlobal';

// Core utilities (advanced usage)
export {
  createMockOpenAI,
  updateMockState,
  dispatchOpenAIEvent,
  shouldCreateMock,
  getStoredState,
  saveState,
} from './core/mock';

// Types
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
