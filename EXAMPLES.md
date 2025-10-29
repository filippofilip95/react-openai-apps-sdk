# Examples

> React hooks and devtools for OpenAI Apps SDK

Complete examples for using react-openai-apps-sdk.

## Basic Usage

### Simple Widget with DevTools

```tsx
import { OpenAIDevTools, useOpenAIGlobal } from 'react-openai-apps-sdk';

function MyWidget() {
  const theme = useOpenAIGlobal('theme');
  const toolOutput = useOpenAIGlobal('toolOutput');

  return (
    <>
      <div className={theme === 'dark' ? 'dark-theme' : 'light-theme'}>
        <h1>My Widget</h1>
        <pre>{JSON.stringify(toolOutput, null, 2)}</pre>
      </div>

      <OpenAIDevTools />
    </>
  );
}
```

## Custom Configuration

### Dark Mode by Default

```tsx
<OpenAIDevTools
  initialIsOpen={true}
  mockConfig={{
    theme: 'dark',
    displayMode: 'fullscreen',
    maxHeight: 1200,
  }}
/>
```

### Fullscreen Mode with Test Data

```tsx
<OpenAIDevTools
  mockConfig={{
    displayMode: 'fullscreen',
    toolOutput: {
      platform: 'instagram',
      text: 'Sample post',
      images: ['https://example.com/image.jpg'],
    },
  }}
/>
```

## Embedded Mode

### Split View with DevTools Panel

```tsx
import { useState } from 'react';
import { OpenAIDevToolsPanel } from 'react-openai-apps-sdk';

function DevPage() {
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

## Using Hooks

### Accessing All Globals

```tsx
import { useOpenAIGlobal } from 'react-openai-apps-sdk';

function Widget() {
  const theme = useOpenAIGlobal('theme');
  const displayMode = useOpenAIGlobal('displayMode');
  const maxHeight = useOpenAIGlobal('maxHeight');
  const locale = useOpenAIGlobal('locale');

  return (
    <div style={{ height: maxHeight }}>
      Theme: {theme} | Mode: {displayMode} | Locale: {locale}
    </div>
  );
}
```

### Using Convenience Hooks

```tsx
import { useDisplayMode, useMaxHeight } from 'react-openai-apps-sdk';

function ResponsiveWidget() {
  const displayMode = useDisplayMode();
  const maxHeight = useMaxHeight();

  return (
    <div style={{ height: maxHeight || 600 }}>
      {displayMode === 'fullscreen' ? (
        <FullscreenLayout />
      ) : (
        <InlineLayout />
      )}
    </div>
  );
}
```

### Using Widget Props (Type-Safe Tool Output)

```tsx
import { useWidgetProps } from 'react-openai-apps-sdk';

interface PostData {
  platform: string;
  text: string;
  imageUrls?: string[];
}

function PostWidget() {
  const props = useWidgetProps<PostData>({
    platform: 'instagram',
    text: ''
  });

  return (
    <div>
      <h2>{props.platform}</h2>
      <p>{props.text}</p>
      {props.imageUrls?.map(url => <img key={url} src={url} />)}
    </div>
  );
}
```

### Using Widget State (Persistent State)

```tsx
import { useWidgetState } from 'react-openai-apps-sdk';

function FavoritesWidget() {
  const [favorites, setFavorites] = useWidgetState<string[]>([]);

  const addFavorite = (id: string) => {
    setFavorites(prev => [...(prev || []), id]);
  };

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev?.filter(fav => fav !== id) || null);
  };

  return (
    <div>
      <h3>Favorites ({favorites?.length || 0})</h3>
      <ul>
        {favorites?.map(id => (
          <li key={id}>
            {id}
            <button onClick={() => removeFavorite(id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Calling Tools

```tsx
import { useOpenAI } from 'react-openai-apps-sdk';

function Widget() {
  const openai = useOpenAI();

  const handleRefresh = async () => {
    const reply = await openai?.callTool('my_tool', { arg: 'value' });
    console.log(reply?.structuredContent);
  };

  return <button onClick={handleRefresh}>Refresh Data</button>;
}
```

### Sending Follow-up Messages

```tsx
import { useOpenAI } from 'react-openai-apps-sdk';

function Calendar() {
  const openai = useOpenAI();

  const handleShowPreview = async (post) => {
    await openai?.sendFollowUpMessage({
      prompt: `Show me a preview of this post: ${post.text}`
    });
  };

  return <button onClick={() => handleShowPreview(post)}>Preview</button>;
}
```

## Advanced Usage

### Manual Mock Creation

```tsx
import { createMockOpenAI, updateMockState } from 'react-openai-apps-sdk';

// In your test setup
beforeEach(() => {
  window.openai = createMockOpenAI({
    theme: 'dark',
    displayMode: 'inline',
    toolOutput: { /* test data */ },
  });
});

// Update during test
test('theme switching', () => {
  updateMockState('theme', 'light');
  // ... assertions
});
```

### Custom Event Handling

```tsx
import { dispatchOpenAIEvent } from 'react-openai-apps-sdk';

// Simulate a theme change
dispatchOpenAIEvent('set_globals', {
  theme: 'dark',
  displayMode: 'fullscreen',
});
```

## Real-World Patterns

### Post Preview Widget

```tsx
import { OpenAIDevTools, useOpenAIGlobal } from 'react-openai-apps-sdk';
import PostPreview from '@kontentino/kontentino-post-previews';

function PostPreviewWidget() {
  const displayMode = useOpenAIGlobal('displayMode');
  const toolOutput = useOpenAIGlobal('toolOutput');

  return (
    <>
      <PostPreview
        post={toolOutput}
        displayMode={displayMode}
      />

      {import.meta.env.DEV && <OpenAIDevTools />}
    </>
  );
}
```

### Content Calendar

```tsx
import { OpenAIDevTools, useOpenAIGlobal } from 'react-openai-apps-sdk';

function CalendarWidget() {
  const maxHeight = useOpenAIGlobal('maxHeight');
  const toolOutput = useOpenAIGlobal('toolOutput');

  return (
    <>
      <div style={{ height: `${maxHeight}px`, overflow: 'auto' }}>
        <Calendar posts={toolOutput?.posts || []} />
      </div>

      <OpenAIDevTools />
    </>
  );
}
```

## Testing Examples

### Unit Test with Mock

```tsx
import { render } from '@testing-library/react';
import { createMockOpenAI } from 'react-openai-apps-sdk';
import MyWidget from './MyWidget';

describe('MyWidget', () => {
  beforeEach(() => {
    window.openai = createMockOpenAI({
      theme: 'light',
      toolOutput: { data: 'test' },
    });
  });

  it('renders with light theme', () => {
    const { container } = render(<MyWidget />);
    expect(container.firstChild).toHaveClass('light-theme');
  });
});
```

### Integration Test

```tsx
import { updateMockState } from 'react-openai-apps-sdk';

test('theme toggle updates UI', async () => {
  render(<MyWidget />);

  // Initial state
  expect(screen.getByText('☀️ Light')).toBeInTheDocument();

  // Toggle theme
  updateMockState('theme', 'dark');

  // Wait for update
  await waitFor(() => {
    expect(screen.getByText('🌙 Dark')).toBeInTheDocument();
  });
});
```

## Conditional Loading

### Lazy Load DevTools

```tsx
import { lazy, Suspense } from 'react';

const OpenAIDevTools = lazy(() =>
  import('react-openai-apps-sdk').then(m => ({ default: m.OpenAIDevTools }))
);

function App() {
  return (
    <>
      <YourWidget />

      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <OpenAIDevTools />
        </Suspense>
      )}
    </>
  );
}
```

## Different Button Positions

```tsx
// Top Left
<OpenAIDevTools buttonPosition="top-left" />

// Top Right
<OpenAIDevTools buttonPosition="top-right" />

// Bottom Left
<OpenAIDevTools buttonPosition="bottom-left" />

// Bottom Right (default)
<OpenAIDevTools buttonPosition="bottom-right" />
```

## Custom Initial State

```tsx
<OpenAIDevTools
  mockConfig={{
    theme: 'dark',
    displayMode: 'fullscreen',
    maxHeight: 1000,
    locale: 'en',
    userAgent: {
      device: { type: 'desktop' },
      capabilities: { hover: true, touch: false }
    },
    toolOutput: {
      // Your test data here
    },
  }}
/>
```

## Production Debugging

### Debug in Real ChatGPT

Enable DevTools in production builds to debug issues in real ChatGPT:

```bash
# Build with DevTools enabled
VITE_ENABLE_OPENAI_DEVTOOLS=true pnpm build
```

Then in your widget:

```tsx
import { OpenAIDevTools, useWidgetProps } from 'react-openai-apps-sdk';

function ProductionWidget() {
  const props = useWidgetProps();

  return (
    <>
      <YourWidget data={props} />

      {/* DevTools will render in production when flag is set */}
      <OpenAIDevTools />
    </>
  );
}
```

**What you can inspect:**
- Real `toolOutput` from ChatGPT
- Current `widgetState`
- Theme, display mode, max height
- User agent, safe area, locale
- All globals in real-time

**Note:** No mocks are created. DevTools become a read-only inspector for the real ChatGPT environment.
