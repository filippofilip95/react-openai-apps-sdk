/**
 * OpenAI DevTools - Floating development toolbar
 * Like React Query DevTools - non-invasive, drop-in component
 */

import { useState, useEffect } from 'react';
import { createMockOpenAI, shouldCreateMock } from '../core/mock';
import { Toolbar } from './Toolbar';
import type { OpenAIDevToolsProps } from '../types';

export function OpenAIDevTools({
  initialIsOpen = false,
  buttonPosition = 'bottom-right',
  enableMock = true,
  mockConfig = {},
  showToolbar = true,
  showHotkeys = true,
  styleNonce,
}: OpenAIDevToolsProps) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [isMock, setIsMock] = useState(false);

  // Initialize mock if needed (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && shouldCreateMock(enableMock)) {
      console.log('[OpenAI DevTools] Creating mock window.openai');
      window.openai = createMockOpenAI(mockConfig);
      setIsMock(true);
    } else if (window.openai?.__devMock) {
      setIsMock(true);
    } else if (window.openai && !window.openai.__devMock) {
      // Real OpenAI detected (production ChatGPT)
      setIsMock(false);
    }
  }, [enableMock, mockConfig]);

  // Production guard - can be overridden with build-time flag
  if (process.env.NODE_ENV === 'production' && !import.meta.env.VITE_ENABLE_OPENAI_DEVTOOLS) {
    return null;
  }

  const positions = {
    'top-left': { top: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' },
    'bottom-left': { bottom: '20px', left: '20px' },
    'bottom-right': { bottom: '20px', right: '20px' },
  };

  const position = positions[buttonPosition];

  return (
    <div
      style={{
        position: 'fixed',
        ...position,
        zIndex: 99999,
      }}
      nonce={styleNonce}
    >
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#60a5fa',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 14px',
            cursor: 'pointer',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", monospace',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            transition: 'opacity 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
          title="Open OpenAI DevTools"
        >
          🛠 {isMock ? 'Mock' : 'OpenAI'}
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div
          style={{
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '10px',
              zIndex: 1,
            }}
            title="Close DevTools"
          >
            ✕
          </button>

          {/* Toolbar */}
          {showToolbar && <Toolbar showHotkeys={showHotkeys} />}
        </div>
      )}
    </div>
  );
}
