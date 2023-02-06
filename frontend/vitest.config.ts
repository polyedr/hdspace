/// <reference types="vitest" />

import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@Components': path.resolve(__dirname, './src', 'components'),
      '@Constants': path.resolve(__dirname, './src', 'constants'),
      '@Utils': path.resolve(__dirname, './src', 'utils'),
      '@Redux': path.resolve(__dirname, './src', 'redux'),
      '@Api': path.resolve(__dirname, './src', 'api'),
      '@Types': path.resolve(__dirname, './src', 'types'),
      '@Domain': path.resolve(__dirname, './src', 'domain'),
      '@Src': path.resolve(__dirname, './src'),
    },
  },
});
