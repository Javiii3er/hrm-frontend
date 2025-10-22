import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@modules': resolve(__dirname, 'src/modules'),
      '@core': resolve(__dirname, 'src/core')
    }
  },
  server: {
    port: 5173,
    proxy: {
      // CORREGIR: El proxy debe apuntar al puerto correcto
      '/api': {
        target: 'http://localhost:4000', // ← Puerto de tu backend
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})