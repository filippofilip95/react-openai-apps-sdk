# API Reference

Complete API documentation for react-openai-devtools.

## Components

### `<OpenAIDevTools />`

Floating toolbar for debugging OpenAI Apps SDK widgets.

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

**Example:**

```tsx
<OpenAIDevTools
  initialIsOpen={true}
  buttonPosition="top-right"
  mockConfig={{
    theme: 'dark',
    displayMode: 'fullscreen',
  }}
/>
```

### `<OpenAIDevToolsPanel />`

Embedded mode - renders toolbar inline.

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `style` | `React.CSSProperties` | - | Custom styles |
| `onClose` | `() => void` | - | Callback when panel closes |
| `showToolbar` | `boolean` | `true` | Show toolbar controls |

**Example:**

```tsx
<OpenAIDevToolsPanel
  style={{ height: '400px' }}
  onClose={() => setShowPanel(false)}
/>
```

## Hooks

### `useOpenAI()`

Returns the current `window.openai` object.

**Returns:** `OpenAI | undefined`

**Example:**

```tsx
const openai = useOpenAI();

await openai?.callTool('my_tool', { arg: 'value' });
await openai?.sendFollowUpMessage({ prompt: 'Follow up...' });
```

### `useOpenAIGlobal(key)`

Returns a specific global from `window.openai`.

**Parameters:**
- `key`: Key of the global to access

**Returns:** `OpenAiGlobals[K] | null`

**Example:**

```tsx
const theme = useOpenAIGlobal('theme');
const displayMode = useOpenAIGlobal('displayMode');
const maxHeight = useOpenAIGlobal('maxHeight');
const toolOutput = useOpenAIGlobal('toolOutput');
const widgetState = useOpenAIGlobal('widgetState');
```

**Based on [OpenAI Apps SDK official examples](https://developers.openai.com/apps-sdk/build/custom-ux)**

## Advanced Functions

### `createMockOpenAI(config?)`

Manually create a mock `window.openai` object.

**Parameters:**
- `config` (optional): Initial configuration

**Returns:** `OpenAI`

**Example:**

```tsx
window.openai = createMockOpenAI({
  theme: 'dark',
  displayMode: 'fullscreen',
});
```

### `updateMockState(key, value)`

Update a specific value in the mock.

**Parameters:**
- `key`: The key to update
- `value`: The new value

**Example:**

```tsx
updateMockState('theme', 'light');
updateMockState('maxHeight', 800);
```

### `dispatchOpenAIEvent(type, detail)`

Dispatch a custom OpenAI event.

**Parameters:**
- `type`: Event type
- `detail`: Event details

**Example:**

```tsx
dispatchOpenAIEvent('set_globals', {
  theme: 'dark',
  displayMode: 'fullscreen',
});
```

## Types

### `OpenAI`

Complete type definition for `window.openai`.

```typescript
interface OpenAI extends OpenAiGlobals, OpenAIAPI {
  __devMock?: boolean;
}
```

### `OpenAiGlobals`

Global state available from ChatGPT.

```typescript
interface OpenAiGlobals {
  theme: 'light' | 'dark';
  displayMode: 'inline' | 'fullscreen' | 'pip';
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
```

### `OpenAIAPI`

API methods available on `window.openai`.

```typescript
interface OpenAIAPI {
  callTool: (name: string, args: Record<string, unknown>) => Promise<any>;
  sendFollowUpMessage: (args: { prompt: string }) => Promise<void>;
  openExternal: (payload: { href: string }) => void;
  requestDisplayMode: (args: { mode: DisplayMode }) => Promise<{ mode: DisplayMode }>;
}
```

## Keyboard Shortcuts

When DevTools are active:

- **E** - Toggle display mode (inline ↔ fullscreen)
- **T** - Toggle theme (light ↔ dark)

## Production Behavior

In production (`NODE_ENV=production`):

- Components render `null` (tree-shaken)
- Hooks still work (access real `window.openai`)
- Zero bundle size impact
