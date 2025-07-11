import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  build: {
    sourcemap: true
  },
  server: {
    port: 3340,
    host: '0.0.0.0' // This allows connections from outside the container
  },
})