import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Lets the React app call fetch('/api/...') without worrying about
      // CORS or hardcoding a host during local development.
      '/api': 'http://localhost:5000',
    },
  },
})
