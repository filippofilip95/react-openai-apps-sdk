# React OpenAI DevTools

> Development tools for OpenAI Apps SDK - Like React Query DevTools for ChatGPT widgets

[![npm version](https://img.shields.io/npm/v/react-openai-devtools)](https://www.npmjs.com/package/react-openai-devtools)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**OpenAI DevTools** is a floating toolbar for debugging and testing ChatGPT widgets built with the OpenAI Apps SDK. It provides a non-invasive way to:

- 🎨 Toggle theme (light/dark)
- 📐 Change display mode (inline/fullscreen/pip)
- 📏 Adjust max height dynamically
- 🔍 Inspect `window.openai` state
- 🧪 Mock `window.openai` for local development

## 🎯 Problem It Solves

When building ChatGPT widgets with the OpenAI Apps SDK, you need to test different themes, display modes, and heights. Normally, you'd need to:

- ❌ Reload ChatGPT each time you want to test a different configuration
- ❌ Write manual mock code for `window.openai` in development
- ❌ Switch between light/dark themes in ChatGPT settings
- ❌ Manually adjust viewport sizes to test responsive layouts

**OpenAI DevTools solves this** by providing a floating toolbar that lets you control all these settings **in real-time**, right in your development environment.

## 📦 Installation

```bash
npm install react-openai-devtools
# or
pnpm add react-openai-devtools
# or
yarn add react-openai-devtools
```

## 🚀 Quick Start

### Basic Usage (Floating Toolbar)

```tsx
import { OpenAIDevTools } from 'react-openai-devtools';

function App() {
  return (
    <>
      <YourWidget />
      <OpenAIDevTools />
    </>
  );
}
```

That's it! In development, you'll see a floating button in the bottom-right corner. In production, it's automatically tree-shaken out.

### Using Hooks

```tsx
import { useOpenAI, useOpenAIGlobal } from 'react-openai-devtools';

function MyWidget() {
  // Get full window.openai
  const openai = useOpenAI();

  // Or get specific globals
  const theme = useOpenAIGlobal('theme');
  const displayMode = useOpenAIGlobal('displayMode');
  const toolOutput = useOpenAIGlobal('toolOutput');

  return (
    <div className={theme === 'dark' ? 'dark' : 'light'}>
      <h1>Display Mode: {displayMode}</h1>
      <pre>{JSON.stringify(toolOutput, null, 2)}</pre>
    </div>
  );
}
```

## 📖 API Reference

### `<OpenAIDevTools />`

Main component - floating toolbar that appears in development.

```tsx
<OpenAIDevTools
  initialIsOpen={false}
  buttonPosition="bottom-right"
  enableMock={true}
  mockConfig={{
    theme: 'dark',
    displayMode: 'fullscreen',
    maxHeight: 800,
  }}
  showToolbar={true}
  showHotkeys={true}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialIsOpen` | `boolean` | `false` | Show toolbar initially open |
| `buttonPosition` | `'top-left' \| 'top-right' \| 'bottom-left' \| 'bottom-right'` | `'bottom-right'` | Toggle button position |
| `enableMock` | `boolean` | `true` | Enable mock when `window.openai` doesn't exist |
| `mockConfig` | `Partial<OpenAiGlobals>` | `{}` | Initial mock configuration |
| `showToolbar` | `boolean` | `true` | Show toolbar controls |
| `showHotkeys` | `boolean` | `true` | Show keyboard shortcuts hint |
| `styleNonce` | `string` | - | CSP nonce for inline styles |

### `<OpenAIDevToolsPanel />`

Embedded mode - renders toolbar inline in your layout.

```tsx
<OpenAIDevToolsPanel
  style={{ height: '400px' }}
  onClose={() => setShowPanel(false)}
  showToolbar={true}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `style` | `React.CSSProperties` | - | Custom styles for panel |
| `onClose` | `() => void` | - | Callback when panel closes |
| `showToolbar` | `boolean` | `true` | Show toolbar controls |

### Hooks

#### `useOpenAI()`

Returns the current `window.openai` object (real or mock).

```tsx
const openai = useOpenAI();

// Use window.openai methods
await openai?.callTool('my_tool', { arg: 'value' });
await openai?.sendFollowUpMessage({ prompt: 'Follow up...' });
```

#### `useOpenAIGlobal(key)`

Returns a specific global from `window.openai`.

```tsx
const theme = useOpenAIGlobal('theme');
const displayMode = useOpenAIGlobal('displayMode');
const maxHeight = useOpenAIGlobal('maxHeight');
const locale = useOpenAIGlobal('locale');
const toolOutput = useOpenAIGlobal('toolOutput');
const widgetState = useOpenAIGlobal('widgetState');
```

## ⌨️ Keyboard Shortcuts

When the DevTools are active, you can use keyboard shortcuts:

- **E** - Toggle display mode (inline ↔ fullscreen)
- **T** - Toggle theme (light ↔ dark)

## 🧪 How It Works

### In ChatGPT (Production)

When your widget runs in ChatGPT:

1. ChatGPT provides `window.openai` with real data
2. DevTools detects real environment and doesn't create a mock
3. Toolbar displays current settings but doesn't override them
4. Your widget uses the real `window.openai`

### In Local Development

When developing locally:

1. `window.openai` doesn't exist
2. DevTools creates a mock with sensible defaults
3. Toolbar allows you to control the mock state
4. Your widget uses the mock as if it's real

### Production Builds

In production (`NODE_ENV=production`):

- `<OpenAIDevTools />` renders `null` (tree-shaken)
- Hooks still work (access real `window.openai`)
- Zero bundle size impact

## 📚 Examples

### Example 1: Basic Widget

```tsx
import { OpenAIDevTools, useOpenAIGlobal } from 'react-openai-devtools';

function PostPreview() {
  const theme = useOpenAIGlobal('theme');
  const toolOutput = useOpenAIGlobal('toolOutput');

  return (
    <>
      <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
        <h1>Post Preview</h1>
        <pre>{JSON.stringify(toolOutput, null, 2)}</pre>
      </div>

      <OpenAIDevTools />
    </>
  );
}
```

### Example 2: Custom Mock Config

```tsx
import { OpenAIDevTools } from 'react-openai-devtools';

function App() {
  return (
    <>
      <MyWidget />

      <OpenAIDevTools
        initialIsOpen={true}
        buttonPosition="top-right"
        mockConfig={{
          theme: 'dark',
          displayMode: 'fullscreen',
          maxHeight: 1200,
          locale: 'en',
          toolOutput: {
            platform: 'instagram',
            text: 'Sample post content',
          },
        }}
      />
    </>
  );
}
```

### Example 3: Embedded Panel

```tsx
import { useState } from 'react';
import { OpenAIDevToolsPanel } from 'react-openai-devtools';

function DebugPage() {
  const [showPanel, setShowPanel] = useState(true);

  return (
    <div style={{ display: 'grid', gridTemplateRows: '1fr 400px' }}>
      <YourWidget />

      {showPanel && (
        <OpenAIDevToolsPanel
          onClose={() => setShowPanel(false)}
          style={{ borderTop: '1px solid #ccc' }}
        />
      )}
    </div>
  );
}
```

## 🔧 Advanced Usage

### Manual Mock Creation

```tsx
import { createMockOpenAI, updateMockState } from 'react-openai-devtools';

// Create mock manually
window.openai = createMockOpenAI({
  theme: 'dark',
  displayMode: 'fullscreen',
});

// Update mock state
updateMockState('theme', 'light');
updateMockState('maxHeight', 800);
```

### Dispatch Custom Events

```tsx
import { dispatchOpenAIEvent } from 'react-openai-devtools';

dispatchOpenAIEvent('set_globals', {
  theme: 'dark',
  displayMode: 'fullscreen',
});
```

## 🆚 Comparison with Other Approaches

| Approach | OpenAI DevTools | Manual Provider | Testing in ChatGPT |
|----------|----------------|-----------------|-------------------|
| **Setup** | Drop-in component | Wrap entire app | No setup needed |
| **Mock Control** | Visual toolbar | Code changes | N/A |
| **Hot Reload** | ✅ Yes | ✅ Yes | ❌ No |
| **Theme Toggle** | ✅ One click | Manual code | ChatGPT settings |
| **Display Mode** | ✅ One click | Manual code | Manual resize |
| **Production** | Auto tree-shaken | Manual guard | N/A |
| **Compatibility** | ✅ Works with real ChatGPT | ⚠️ May conflict | ✅ Native |

## 🤝 Contributing

Contributions are welcome! Please open an issue or PR on [GitHub](https://github.com/filippofilip95/openai-devtools).

## 📄 License

MIT © [Filip Popranec](https://github.com/filippofilip95)

## 🔗 Links

- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [GitHub Repository](https://github.com/filippofilip95/react-openai-devtools)
- [npm Package](https://www.npmjs.com/package/react-openai-devtools)

## ❓ FAQ

### Does this work with real ChatGPT?

Yes! The DevTools detect when `window.openai` already exists (real ChatGPT) and won't override it. The toolbar will display current settings without interfering.

### Does this add bundle size to production?

No. In production builds, all DevTools components render `null` and are tree-shaken by your bundler. Only the lightweight hooks remain (which access real `window.openai`).

### Can I use this without React?

Currently, OpenAI DevTools is React-only. However, the core mock utilities (`createMockOpenAI`, `updateMockState`) can be used in any JavaScript environment.

### Why not use a Context Provider?

Context Providers require wrapping your entire app and can cause unnecessary re-renders. OpenAI DevTools follows the React Query DevTools pattern: a drop-in component that works independently, without wrapping.

### How do I disable in production?

You don't need to! The library automatically detects `process.env.NODE_ENV` and renders nothing in production. Your bundler will tree-shake the unused code.

---

**Made with ❤️ by [Filip Popranec](https://github.com/filippofilip95)**
