/**
 * OpenAI DevTools Panel - Embedded mode
 * Renders directly in your component layout
 */

import { useEffect, useState } from 'react';
import { createMockOpenAI, shouldCreateMock } from '../core/mock';
import { Toolbar } from './Toolbar';
import type { OpenAIDevToolsPanelProps } from '../types';

export function OpenAIDevToolsPanel({
  style,
  onClose,
  showToolbar = true,
}: OpenAIDevToolsPanelProps) {
  const [isMock, setIsMock] = useState(false);

  // Initialize mock if needed
  useEffect(() => {
    if (shouldCreateMock(true)) {
      console.log('[OpenAI DevTools Panel] Creating mock window.openai');
      window.openai = createMockOpenAI();
      setIsMock(true);
    } else if (window.openai?.__devMock) {
      setIsMock(true);
    }
  }, []);

  // Production guard
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div
      style={{
        height: '500px',
        background: 'rgba(0, 0, 0, 0.05)',
        borderRadius: '10px',
        padding: '20px',
        position: 'relative',
        overflow: 'auto',
        ...style,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", monospace',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f2937',
          }}
        >
          🛠 OpenAI DevTools {isMock && '(Mock)'}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '10px',
              color: '#6b7280',
            }}
          >
            Close
          </button>
        )}
      </div>

      {/* Toolbar */}
      {showToolbar && <Toolbar showHotkeys={true} />}
    </div>
  );
}
