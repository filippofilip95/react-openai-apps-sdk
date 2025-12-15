# React OpenAI Apps SDK

> React hooks and devtools for OpenAI Apps SDK

[![npm version](https://img.shields.io/npm/v/react-openai-apps-sdk)](https://www.npmjs.com/package/react-openai-apps-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**React OpenAI Apps SDK** provides React hooks and DevTools for building ChatGPT widgets with OpenAI Apps SDK. Access `window.openai` globals through hooks, mock state for local development, and debug with a floating toolbar - toggle themes, change display modes, and inspect state in real-time.

🎨 **Toggle theme** (light/dark) • 📐 **Change display mode** (inline/fullscreen/pip) • 📏 **Adjust height** • 🧪 **Mock `window.openai`** for local development

Based on [OpenAI Apps SDK custom UX guide](https://developers.openai.com/apps-sdk/build/custom-ux) and [official examples](https://github.com/openai/openai-apps-sdk-examples).

## Quick Start

**Install:**

```bash
npm install react-openai-apps-sdk
```

**Use:**

```tsx
import { OpenAIDevTools, SafeArea, useOpenAIGlobal } from 'react-openai-apps-sdk';

function MyWidget() {
  const theme = useOpenAIGlobal('theme');

  return (
    <>
      <SafeArea>
        <div className={theme === 'dark' ? 'dark' : 'light'}>
          Your widget content
        </div>
      </SafeArea>

      <OpenAIDevTools />
    </>
  );
}
```

That's it! In development, you'll see a floating button. In production, it's automatically removed.

## Features

- ⚡ **Zero config** - Drop in and start debugging
- 🎯 **Non-invasive** - Works with real ChatGPT without conflicts
- ⌨️ **Keyboard shortcuts** - `E` for expand, `T` for theme
- 📦 **Tree-shakeable** - Auto-removed in production builds
- 🔌 **Framework-aware** - Based on OpenAI's official examples
- 📱 **SafeArea component** - Automatically respect mobile notches and system UI

## Keyboard Shortcuts

- **E** - Toggle display mode (inline ↔ fullscreen)
- **T** - Toggle theme (light ↔ dark)

## Documentation

- **[API Reference](./API.md)** - Complete API docs with all props and types
- **[Examples](./EXAMPLES.md)** - Real-world usage examples and patterns
- **[Contributing](./CONTRIBUTING.md)** - Development setup and guidelines

## Common Use Cases

### Respect Safe Areas (Mobile Notches, System UI)

```tsx
import { SafeArea } from 'react-openai-apps-sdk';

<SafeArea fallbackHeight={600}>
  <YourWidget />
</SafeArea>
```

### Get Tool Output

```tsx
const toolOutput = useOpenAIGlobal('toolOutput');
```

### Check Display Mode

```tsx
const displayMode = useOpenAIGlobal('displayMode');
const isFullscreen = displayMode === 'fullscreen';
```

### Call Tools (with error handling)

```tsx
const { callTool, sendFollowUpMessage } = useOpenAIActions();

// Call a tool with built-in error handling
const { success, data } = await callTool({
  name: 'my_tool',
  args: { arg: 'value' },
  onError: (error) => console.error('Tool call failed:', error),
});

// Send follow-up message
await sendFollowUpMessage({
  prompt: 'Here is the result...',
  onSuccess: () => console.log('Message sent!'),
});
```

### Custom Mock for Testing

```tsx
<OpenAIDevTools
  mockConfig={{
    theme: 'dark',
    toolOutput: { /* test data */ }
  }}
/>
```

[See more examples →](./EXAMPLES.md)

## How It Works

### In ChatGPT (Production)

1. ChatGPT provides `window.openai`
2. DevTools detect real environment
3. Toolbar shows current settings (read-only)
4. Your widget uses real data

### In Local Development

1. `window.openai` doesn't exist
2. DevTools create a mock
3. Toolbar controls the mock state
4. Your widget uses mock as if it's real

### In Production Builds

- DevTools automatically removed (tree-shaken)
- Hooks still work (access real `window.openai`)
- Zero bundle size impact

**Production Debugging**: Enable DevTools in production ChatGPT for debugging:

```bash
# Build with DevTools enabled (read-only inspector)
VITE_ENABLE_OPENAI_DEVTOOLS=true pnpm build
```

This allows you to inspect `toolOutput`, `widgetState`, and other globals in production ChatGPT without creating mocks. The DevTools become a read-only inspector.

## Comparison

| Feature | Manual Setup | This Library |
|---------|--------------|--------------|
| Setup | Wrap entire app | Drop-in component |
| Theme toggle | Code changes | One click |
| Display mode | Code changes | One click |
| Production | Manual guard | Auto tree-shaken |
| ChatGPT compatible | May conflict | ✅ Yes |

## FAQ

**Does this work in real ChatGPT?**
Yes! It detects the real environment and doesn't interfere.

**Does it increase bundle size?**
No. It's automatically removed in production builds.

**Can I use without React?**
The UI is React-only, but core utilities (`createMockOpenAI`, `updateMockState`) work in any JS environment.

## Links

- [npm Package](https://www.npmjs.com/package/react-openai-apps-sdk)
- [GitHub Repository](https://github.com/filippofilip95/react-openai-apps-sdk)
- [OpenAI Apps SDK Docs](https://developers.openai.com/apps-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io)

## License

MIT © [Filip Papranec](https://github.com/filippofilip95)

---

**Built by** [Filip Papranec](https://github.com/filippofilip95) **with** [Claude Code](https://claude.ai/code)

**Inspired by**:
- [React Query DevTools](https://tanstack.com/query/latest/docs/framework/react/devtools)
- [OpenAI Apps SDK Examples](https://developers.openai.com/apps-sdk/build/custom-ux)
