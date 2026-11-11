import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/magic-route/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 4321,
    host: '127.0.0.1',
  },
  preview: {
    port: 4321,
    host: '127.0.0.1',
  },
})
