import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  // Vue 3.6 beta's Vapor runtime exposes ESM-only internal bindings.
  // Bundle Vue packages for the temporary SSR build so Node does not select CJS exports.
  ssr: {
    noExternal: true,
    resolve: {
      conditions: ['module', 'browser', 'development|production'],
    },
  },
})
