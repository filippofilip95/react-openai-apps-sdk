/**
 * Toolbar component for controlling OpenAI globals
 * Theme, display mode, and max height controls
 */

import React, { useState, useEffect } from 'react';
import { updateMockState } from '../core/mock';
import type { Theme, DisplayMode } from '../types';

interface ToolbarProps {
  showHotkeys?: boolean;
}

export function Toolbar({ showHotkeys = true }: ToolbarProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('inline');
  const [maxHeight, setMaxHeight] = useState(600);
  const [heightInput, setHeightInput] = useState('600');
  const [locale, setLocale] = useState('en');

  // Sync with window.openai
  useEffect(() => {
    if (typeof window === 'undefined' || !window.openai) return;

    setTheme(window.openai.theme);
    setDisplayMode(window.openai.displayMode);
    setMaxHeight(window.openai.maxHeight);
    setHeightInput(window.openai.maxHeight.toString());
    setLocale(window.openai.locale);

    const handleSetGlobals = (event: Event) => {
      const customEvent = event as CustomEvent;
      const globals = customEvent.detail?.globals;

      if (globals?.theme) setTheme(globals.theme);
      if (globals?.displayMode) setDisplayMode(globals.displayMode);
      if (globals?.maxHeight) {
        setMaxHeight(globals.maxHeight);
        setHeightInput(globals.maxHeight.toString());
      }
      if (globals?.locale) setLocale(globals.locale);
    };

    window.addEventListener('openai:set_globals', handleSetGlobals);
    return () => window.removeEventListener('openai:set_globals', handleSetGlobals);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // E = toggle expand
      if (e.key === 'e' || e.key === 'E') {
        const nextMode = displayMode === 'inline' ? 'fullscreen' : 'inline';
        handleModeToggle(nextMode);
      }

      // T = toggle theme
      if (e.key === 't' || e.key === 'T') {
        const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
        handleThemeToggle(newTheme);
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [displayMode, theme]);

  const handleThemeToggle = (newTheme?: Theme) => {
    const nextTheme = newTheme || (theme === 'light' ? 'dark' : 'light');
    setTheme(nextTheme);
    updateMockState('theme', nextTheme);
  };

  const handleModeToggle = (newMode?: DisplayMode) => {
    const modes: DisplayMode[] = ['inline', 'fullscreen', 'pip'];
    const currentIndex = modes.indexOf(displayMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode: DisplayMode = newMode ?? modes[nextIndex]!;

    const newMaxHeight =
      nextMode === 'fullscreen' ? window.innerHeight - 100 :
      nextMode === 'pip' ? 400 : 600;

    setDisplayMode(nextMode);
    setMaxHeight(newMaxHeight);
    setHeightInput(newMaxHeight.toString());

    updateMockState('displayMode', nextMode);
    updateMockState('maxHeight', newMaxHeight);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeightInput(e.target.value);
  };

  const handleHeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newHeight = parseInt(heightInput, 10);
    if (!isNaN(newHeight) && newHeight > 0) {
      setMaxHeight(newHeight);
      updateMockState('maxHeight', newHeight);
    }
  };

  const modeIcons: Record<DisplayMode, string> = {
    inline: '📱',
    fullscreen: '🖥',
    pip: '🪟'
  };

  const modeColors: Record<DisplayMode, string> = {
    inline: '#3b82f6',
    fullscreen: '#10b981',
    pip: '#f59e0b'
  };

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '14px 18px',
        borderRadius: '10px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", monospace',
        fontSize: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minWidth: '220px',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Title */}
      <div style={{ color: '#60a5fa', fontSize: '13px', marginBottom: '2px' }}>
        🛠 <strong>OpenAI DevTools</strong>
      </div>

      {/* Display mode button */}
      <button
        onClick={() => handleModeToggle()}
        style={{
          background: modeColors[displayMode],
          color: 'white',
          border: 'none',
          padding: '7px 14px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: '600',
          transition: 'opacity 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {modeIcons[displayMode]} {displayMode}
      </button>

      {/* Theme button */}
      <button
        onClick={() => handleThemeToggle()}
        style={{
          background: theme === 'light' ? '#f59e0b' : '#6366f1',
          color: 'white',
          border: 'none',
          padding: '7px 14px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: '600',
          transition: 'opacity 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {theme === 'light' ? '☀️ Light' : '🌙 Dark'}
      </button>

      {/* Height input */}
      <form onSubmit={handleHeightSubmit} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <label style={{ color: '#94a3b8', fontSize: '10px', whiteSpace: 'nowrap' }}>
          Height (px):
        </label>
        <input
          type="number"
          value={heightInput}
          onChange={handleHeightChange}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: 'white',
            padding: '4px 8px',
            fontSize: '11px',
            width: '70px',
          }}
          min="100"
          max="2000"
        />
        <button
          type="submit"
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '10px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Set
        </button>
      </form>

      {/* Info */}
      <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '2px' }}>
        Current: {maxHeight}px · {locale}
      </div>

      {/* Hotkeys hint */}
      {showHotkeys && (
        <div
          style={{
            color: '#64748b',
            fontSize: '9px',
            fontStyle: 'italic',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '6px',
            marginTop: '2px',
          }}
        >
          Hotkeys: E=expand, T=theme
        </div>
      )}
    </div>
  );
}
