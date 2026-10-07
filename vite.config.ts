/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// No API proxy: the browser calls the APIs directly (see src/lib/apiClient.ts).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
     environment: 'jsdom',
     globals: true,
     include: ['src/**/*.test.{ts,tsx}'],
     clearMocks: true,
     restoreMocks: true,
     unstubGlobals: true,
  }
})
