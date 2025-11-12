/**
 * SafeArea - Respect mobile notches, system UI, and chat input
 *
 * WHY THIS COMPONENT EXISTS:
 * Mobile devices (especially iPhone) have notches, rounded corners, and system UI
 * that obscure content. Additionally, ChatGPT's chat input bar takes vertical space.
 * This component automatically adjusts your widget's dimensions to fit within the
 * safe, visible area.
 *
 * DESIGN DECISIONS:
 * 1. Top inset uses padding (not height reduction):
 *    - Pushes content down from notch/status bar
 *    - Maintains background color behind notch
 *    - Prevents content from being obscured
 *
 * 2. Bottom inset reduces height:
 *    - Chat input bar takes fixed space at bottom
 *    - Must reduce content height to prevent scrolling
 *    - Uses calc() for dynamic adjustment in fullscreen
 *
 * 3. Left/right insets use padding:
 *    - Safe area from rounded corners and system gestures
 *    - Keeps content within visible bounds
 *    - Prevents content from being cut off
 *
 * 4. Fullscreen vs Inline modes:
 *    - Fullscreen: Uses percentage-based height (responsive)
 *    - Inline: Uses fixed pixel height (embedded in chat)
 *
 * @example
 * ```tsx
 * // Basic usage - handles all safe area concerns automatically
 * <SafeArea>
 *   <YourWidget />
 * </SafeArea>
 * ```
 *
 * @example
 * ```tsx
 * // Custom fallback height for inline mode
 * <SafeArea fallbackHeight={800}>
 *   <TallerWidget />
 * </SafeArea>
 * ```
 *
 * @example
 * ```tsx
 * // Apply only top and bottom insets (ignore left/right)
 * <SafeArea applyInsets={{ top: true, bottom: true, left: false, right: false }}>
 *   <FullWidthWidget />
 * </SafeArea>
 * ```
 *
 * @example
 * ```tsx
 * // Combine with className for Tailwind styling
 * <SafeArea className="bg-gray-50 flex flex-col" fallbackHeight={600}>
 *   <Header />
 *   <Content />
 *   <Footer />
 * </SafeArea>
 * ```
 *
 * @example
 * ```tsx
 * // Complex layout with custom styles
 * <SafeArea
 *   className="relative overflow-hidden"
 *   style={{ background: 'linear-gradient(to bottom, #667eea 0%, #764ba2 100%)' }}
 *   fallbackHeight={700}
 * >
 *   <div className="absolute inset-0 flex items-center justify-center">
 *     <YourCenteredContent />
 *   </div>
 * </SafeArea>
 * ```
 */

import { CSSProperties, ReactNode } from 'react';
import { useOpenAIGlobal } from '../hooks/useOpenAIGlobal';
import type { SafeAreaInsets } from '../types';

export interface SafeAreaProps {
  /** Child components to render within safe area */
  children: ReactNode;

  /** Additional CSS classes (works with Tailwind, CSS modules, etc.) */
  className?: string;

  /** Inline styles (merged with safe area styles) */
  style?: CSSProperties;

  /**
   * Height to use when not in fullscreen mode (inline embedding)
   * Default: 600px
   *
   * WHY: In inline mode, widgets are embedded in the chat and need a fixed height.
   * Choose a height that works well for your content without excessive scrolling.
   */
  fallbackHeight?: number;

  /**
   * Which insets to apply
   * Default: All sides (top, bottom, left, right)
   *
   * WHY: Some widgets might want to extend to screen edges for visual effect.
   * For example, a full-bleed image might ignore left/right insets.
   */
  applyInsets?: {
    /** Apply top inset (notch/status bar) */
    top?: boolean;
    /** Apply bottom inset (chat input bar) */
    bottom?: boolean;
    /** Apply left inset (safe area from screen edge) */
    left?: boolean;
    /** Apply right inset (safe area from screen edge) */
    right?: boolean;
  };
}

/**
 * Container that automatically respects safe area insets from mobile devices,
 * system UI, and ChatGPT's chat input bar.
 *
 * WHEN TO USE:
 * - Root container for your widget
 * - Whenever content should avoid being obscured by device notches or system UI
 * - When you need consistent padding on mobile devices
 *
 * WHEN NOT TO USE:
 * - For nested containers (only use at root level)
 * - If you're manually managing device-specific layouts
 * - For desktop-only widgets that don't need mobile consideration
 *
 * @see SafeAreaProps for detailed prop documentation
 */
export function SafeArea({
  children,
  className = '',
  style = {},
  fallbackHeight = 600,
  applyInsets = { top: true, bottom: true, left: true, right: true },
}: SafeAreaProps) {
  // Fetch current OpenAI state
  const displayMode = useOpenAIGlobal('displayMode') as string | undefined;
  const safeArea = useOpenAIGlobal('safeArea') as { insets: SafeAreaInsets } | undefined;

  // Get insets or default to zero (safe fallback for desktop/development)
  const insets = safeArea?.insets || { top: 0, bottom: 0, left: 0, right: 0 };

  // Calculate which insets to apply based on configuration
  // WHY !== false: Allows undefined to default to true (apply inset)
  const topInset = applyInsets.top !== false ? insets.top : 0;
  const bottomInset = applyInsets.bottom !== false ? insets.bottom : 0;
  const leftInset = applyInsets.left !== false ? insets.left : 0;
  const rightInset = applyInsets.right !== false ? insets.right : 0;

  // Determine display mode
  const isFullscreen = displayMode === 'fullscreen';

  // Calculate height strategy:
  // - Fullscreen: Use calc(100% - bottomInset) for responsive height
  //   WHY: Widget takes full viewport height, must subtract bottom inset to avoid being hidden by chat input
  // - Inline: Use fixed pixel height minus bottom inset
  //   WHY: Widget embedded in chat with fixed dimensions, bottom inset still applies for chat input
  const heightStyle = isFullscreen
    ? `calc(100% - ${bottomInset}px)`
    : `${fallbackHeight - bottomInset}px`;

  return (
    <div
      className={className}
      style={{
        // Merge user styles first, then apply safe area styles
        // This allows users to override if needed, but provides sensible defaults
        ...style,

        // Height: Adjusted for bottom inset (chat input bar)
        height: heightStyle,

        // Padding: Push content away from notches and system UI
        // WHY conditional: Only add padding if inset > 0 to avoid unnecessary styling
        paddingTop: topInset > 0 ? `${topInset}px` : undefined,
        paddingLeft: leftInset > 0 ? `${leftInset}px` : undefined,
        paddingRight: rightInset > 0 ? `${rightInset}px` : undefined,

        // Box sizing: Ensure padding doesn't increase total dimensions
        // WHY: Padding should be internal, not additive to height/width
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}
