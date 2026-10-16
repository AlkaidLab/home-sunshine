import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/website-release-metadata': {
        target: 'https://www.alkaidlab.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Preserve the Vite 7 browser baseline when upgrading the build tool.
    target: ['chrome107', 'edge107', 'firefox104', 'safari16'],
  },
  // Vue 3.6's Vapor runtime exposes ESM-only internal bindings.
  // Bundle Vue packages for the temporary SSR build so Node does not select CJS exports.
  ssr: {
    noExternal: true,
    resolve: {
      conditions: ['module', 'browser', 'development|production'],
    },
  },
})
