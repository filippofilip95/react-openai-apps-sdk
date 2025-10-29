# React OpenAI DevTools

> Development tools for OpenAI Apps SDK - Like React Query DevTools for ChatGPT widgets

[![npm version](https://img.shields.io/npm/v/react-openai-devtools)](https://www.npmjs.com/package/react-openai-devtools)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**React OpenAI DevTools** is a floating toolbar for debugging ChatGPT widgets. Toggle themes, change display modes, and adjust heights in real-time without reloading ChatGPT.

🎨 **Toggle theme** (light/dark) • 📐 **Change display mode** (inline/fullscreen/pip) • 📏 **Adjust height** • 🧪 **Mock `window.openai`** for local development

Based on [OpenAI Apps SDK official examples](https://developers.openai.com/apps-sdk/build/custom-ux).

## Quick Start

**Install:**

```bash
npm install react-openai-devtools
```

**Use:**

```tsx
import { OpenAIDevTools, useOpenAIGlobal } from 'react-openai-devtools';

function MyWidget() {
  const theme = useOpenAIGlobal('theme');

  return (
    <>
      <div className={theme === 'dark' ? 'dark' : 'light'}>
        Your widget content
      </div>

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

## Keyboard Shortcuts

- **E** - Toggle display mode (inline ↔ fullscreen)
- **T** - Toggle theme (light ↔ dark)

## Documentation

- **[API Reference](./API.md)** - Complete API docs with all props and types
- **[Examples](./EXAMPLES.md)** - Real-world usage examples and patterns
- **[Contributing](./CONTRIBUTING.md)** - Development setup and guidelines

## Common Use Cases

### Get Tool Output

```tsx
const toolOutput = useOpenAIGlobal('toolOutput');
```

### Check Display Mode

```tsx
const displayMode = useOpenAIGlobal('displayMode');
const isFullscreen = displayMode === 'fullscreen';
```

### Call Tools

```tsx
const openai = useOpenAI();
await openai?.callTool('my_tool', { arg: 'value' });
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

- Components render `null` (tree-shaken)
- Hooks still work (access real `window.openai`)
- Zero bundle size impact

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

- [npm Package](https://www.npmjs.com/package/react-openai-devtools)
- [GitHub Repository](https://github.com/filippofilip95/react-openai-devtools)
- [OpenAI Apps SDK Docs](https://developers.openai.com/apps-sdk)
- [Model Context Protocol](https://modelcontextprotocol.io)

## License

MIT © [Filip Popranec](https://github.com/filippofilip95)

---

**Built by** [Filip Popranec](https://github.com/filippofilip95) **with** [Claude Code](https://claude.ai/code)

**Inspired by**:
- [React Query DevTools](https://tanstack.com/query/latest/docs/framework/react/devtools)
- [OpenAI Apps SDK Examples](https://developers.openai.com/apps-sdk/build/custom-ux)
