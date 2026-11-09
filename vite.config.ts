import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base so the build works on GitHub Pages (/teaching-english-planner/) or any static host.
export default defineConfig({
  base: './',
  plugins: [react()],
})
