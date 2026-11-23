import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/** Preload the two fonts used above the fold, so they download alongside the CSS instead of after it. */
function preloadFonts(): Plugin {
  return {
    name: 'preload-fonts',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        return Object.keys(ctx.bundle ?? {})
          .filter((f) => /(fraunces-latin-soft-normal|caveat-latin-600-normal).*\.woff2$/.test(f))
          .map((f) => ({ tag: 'link', attrs: { rel: 'preload', href: `./${f}`, as: 'font', type: 'font/woff2', crossorigin: '' }, injectTo: 'head' as const }))
      },
    },
  }
}

// Relative base so the build works on GitHub Pages (/teaching-english-planner/) or any static host.
export default defineConfig({
  base: './',
  plugins: [react(), preloadFonts()],
})
