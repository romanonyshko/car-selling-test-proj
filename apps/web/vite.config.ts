import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv, type ProxyOptions } from 'vite'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

// /api/express/* → express:/api/*, /api/nest/* → nest:/api/*.
// The browser stays on one origin, so the auth cookie needs no CORS setup.
function backendProxy(name: string, target: string): ProxyOptions {
  return {
    target,
    rewrite: (path) => path.replace(`/api/${name}`, '/api'),
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '')

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api/express': backendProxy(
          'express',
          env.EXPRESS_API_URL || 'http://localhost:3001',
        ),
        '/api/nest': backendProxy(
          'nest',
          env.NEST_API_URL || 'http://localhost:3002',
        ),
      },
    },
  }
})
