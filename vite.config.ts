/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // En local, npm run dev reenvía /api/* hacia el clúster real
      // (juan-in-one.local, servido por ingress-nginx) — así el código de
      // React llama siempre a rutas relativas ("/api/sport-api/..."), igual
      // en local que en producción, sin CORS de por medio.
      '/api': 'http://juan-in-one.local',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json'],
    },
  },
})
