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
export { SafeArea } from './components/SafeArea';
export type { SafeAreaProps } from './components/SafeArea';

// Hooks
export { useOpenAI } from './hooks/useOpenAI';
export { useOpenAIGlobal } from './hooks/useOpenAIGlobal';
export { useOpenAIActions } from './hooks/useOpenAIActions';
export { useDisplayMode } from './hooks/useDisplayMode';
export { useMaxHeight } from './hooks/useMaxHeight';
export { useWidgetProps } from './hooks/useWidgetProps';
export { useWidgetState } from './hooks/useWidgetState';
export type {
  SendFollowUpMessageOptions,
  CallToolOptions,
  RequestDisplayModeOptions,
  OpenExternalOptions,
} from './hooks/useOpenAIActions';

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
  SafeArea as SafeAreaType,
  UserAgent,
  CallTool,
  RequestDisplayMode,
  OpenAIAPI,
  OpenAIDevToolsProps,
  OpenAIDevToolsPanelProps,
} from './types';
