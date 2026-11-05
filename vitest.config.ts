import { configDefaults, defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      '~': path.resolve(import.meta.dirname, '.'),
    },
  },
  test: {
    environment: 'node',
    env: {
      NODE_ENV: 'development',
    },
    exclude: [...configDefaults.exclude, '.scratch/**', 'tests/browser/**', '.claude/**', '.agents/**', 'promo-project/**'],
  },
})
