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
  build: {
    // https://docs.astro.build/en/reference/configuration-reference/#buildformat
    format: 'preserve',
  },
})
