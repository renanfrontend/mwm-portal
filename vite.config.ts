// vite.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts', // Caminho relativo ajustado para o diretório raiz
    css: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://pgrsbpcapp-backend.lemonwater-1dd3241c.eastus2.azurecontainerapps.io',
        changeOrigin: true,
        secure: true
      }
    }
  },
});