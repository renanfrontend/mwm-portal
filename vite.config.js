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
    server: {
    // No 'deps' property here; remove invalid configuration
    },
});
