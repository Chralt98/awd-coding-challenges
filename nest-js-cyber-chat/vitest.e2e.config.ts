import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    environment: 'node',
    hookTimeout: 30000,
    testTimeout: 30000,
    root: './',
  },
  plugins: [swc.vite()],
});
