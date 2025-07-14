import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {nodePolyfills} from 'vite-plugin-node-polyfills'



// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),nodePolyfills(),],
  define: {
    global: 'globalThis', // ✅ Critical for fixing `global is not defined`
  },
  resolve: {
    alias: {
      // Optional but useful for other Node.js modules
      buffer: 'buffer',
      process: 'process/browser',
    },
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
})
