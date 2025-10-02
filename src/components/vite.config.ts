import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Garante que todas as dependências usem a mesma instância do React
      // e corrige o erro "Cannot find name '__dirname'" em um contexto ESM.
      'react': path.resolve(fileURLToPath(new URL('.', import.meta.url)), './node_modules/react')
    }
  }
})