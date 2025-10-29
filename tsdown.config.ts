import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  splitting: false,

  // Target modern browsers and Node.js
  target: 'es2022',

  // Skip node_modules
  skipNodeModulesBundle: true,
});
