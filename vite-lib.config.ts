import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'

import { resolve } from 'pathe'
import pkg from './package.json'

const banner = `/*!
 * ${pkg.name} v0.0.0
 * (c) ${new Date().getFullYear()} Alvaro Saburido
 * @license MIT
 */`

const footer = '/* follow me on Twitter! @alvarosabu */'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '/@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    copy({
      targets: [{ src: 'src/styles/themes/**/*', dest: 'dist/themes' }],
      hook: 'writeBundle', // notice here
    }),
  ],
  build: {
    target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'tresjs',
      fileName: 'tresjs',
      formats: ['es', 'cjs', 'umd', 'iife'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        banner,
        footer,
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
