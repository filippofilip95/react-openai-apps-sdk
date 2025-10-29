/**
 * Type definitions for OpenAI Apps SDK
 * Based on official OpenAI Apps SDK types
 */

export type Theme = 'light' | 'dark';
export type DisplayMode = 'inline' | 'fullscreen' | 'pip';
export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface SafeArea {
  insets: SafeAreaInsets;
}

export interface UserAgent {
  device: { type: DeviceType };
  capabilities: { hover: boolean; touch: boolean };
}

export interface OpenAiGlobals {
  theme: Theme;
  displayMode: DisplayMode;
  maxHeight: number;
  locale: string;
  userAgent: UserAgent;
  safeArea: SafeArea;
  toolInput: unknown | null;
  toolOutput: unknown | null;
  toolResponseMetadata: unknown | null;
  widgetState: unknown | null;
  setWidgetState: (state: unknown) => Promise<void>;
}

export type CallTool = (name: string, args: Record<string, unknown>) => Promise<{
  result?: string;
  structuredContent?: unknown;
  [key: string]: unknown;
}>;

export type RequestDisplayMode = (args: { mode: DisplayMode }) => Promise<{ mode: DisplayMode }>;

export interface OpenAIAPI {
  callTool: CallTool;
  sendFollowUpMessage: (args: { prompt: string }) => Promise<void>;
  openExternal: (payload: { href: string }) => void;
  requestDisplayMode: RequestDisplayMode;
}

export interface OpenAI extends OpenAiGlobals, OpenAIAPI {
  __devMock?: boolean;
}

declare global {
  interface Window {
    openai?: OpenAI;
  }
}

export interface OpenAIDevToolsProps {
  /** Show the devtools initially open (default: false) */
  initialIsOpen?: boolean;

  /** Position of the toggle button (default: 'bottom-right') */
  buttonPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /** Position of the panel (default: 'bottom') */
  position?: 'top' | 'bottom' | 'left' | 'right';

  /** Enable mock when window.openai doesn't exist (default: true in dev) */
  enableMock?: boolean;

  /** Initial configuration for mock */
  mockConfig?: Partial<OpenAiGlobals>;

  /** Show the toolbar controls (default: true) */
  showToolbar?: boolean;

  /** Show keyboard shortcuts hint (default: true) */
  showHotkeys?: boolean;

  /** CSP nonce for inline styles */
  styleNonce?: string;
}

export interface OpenAIDevToolsPanelProps {
  /** Custom styles for the panel */
  style?: React.CSSProperties;

  /** Callback when panel is closed */
  onClose?: () => void;

  /** Show the toolbar controls (default: true) */
  showToolbar?: boolean;
}
