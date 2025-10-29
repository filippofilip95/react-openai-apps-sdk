# Contributing to React OpenAI DevTools

Thank you for your interest in contributing! 🎉

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/react-openai-devtools.git
   cd react-openai-devtools
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development**
   ```bash
   pnpm dev
   ```

## Project Structure

```
react-openai-devtools/
├── src/
│   ├── components/      # React components
│   ├── hooks/           # React hooks
│   ├── core/            # Core mock logic
│   └── types/           # TypeScript types
├── dist/                # Build output (generated)
└── README.md
```

## Development Workflow

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test locally:
   ```bash
   pnpm run typecheck  # Check types
   pnpm run build      # Build the package
   ```

3. Link locally to test in a real project:
   ```bash
   # In react-openai-devtools/
   pnpm link --global

   # In your test project/
   pnpm link --global react-openai-devtools
   ```

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Add JSDoc comments for public APIs
- Keep components simple and focused

### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>
```

Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat(hooks): add useOpenAIGlobal hook
fix(toolbar): correct theme toggle behavior
docs(readme): update installation instructions
```

### Pull Request Process

1. Update the README.md if needed
2. Ensure the build passes: `pnpm run build`
3. Ensure types are correct: `pnpm run typecheck`
4. Create a Pull Request with a clear description

## Testing

Currently, the library doesn't have automated tests. If you'd like to contribute a testing setup, that would be greatly appreciated!

For now, please test manually:
1. Build the library
2. Link it to a test project
3. Verify the feature works as expected
4. Test in both development and production modes

## Questions?

Feel free to open an issue for any questions or discussions!
