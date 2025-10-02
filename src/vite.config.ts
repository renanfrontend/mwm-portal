import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Força todas as dependências a usarem a mesma instância do React
      // Isso resolve o erro "Invalid hook call"
      'react': path.resolve(__dirname, './node_modules/react')
    }
  }
})