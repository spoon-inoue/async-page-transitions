// @ts-check
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  scopedStyleStrategy: 'where',
  devToolbar: { enabled: false },
  server: {
    host: true,
  },
  base: '/async-page-transitions/',
  // base: '/',
  build: {
    // https://docs.astro.build/en/reference/configuration-reference/#buildformat
    format: 'preserve',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/scripts/entry.js',
          chunkFileNames: 'assets/scripts/chunk_[hash].js',
          assetFileNames: 'assets/style/main[extname]',
        },
      },
    },
  },
})
