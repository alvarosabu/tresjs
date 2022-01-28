import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'

import { resolve } from 'pathe'
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '/@': resolve(__dirname, './src'),
    },
  },

  plugins: [WindiCSS()],
})
