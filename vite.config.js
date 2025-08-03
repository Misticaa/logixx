import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        tracking: 'rastreamento.html',
        obrigado: 'obrigado.html',
        painel: 'painelk7.html'
      }
    }
  },
  define: {
    global: 'globalThis',
  },
  server: {
    port: 5173,
    host: true
  }
})