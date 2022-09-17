import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        bundle: './src/app/index.js',
        setDB: './src/app/setDB.js',
      },
      output: {
        entryFileNames: '[name].js',
        dir: "./src/public/js/"
      }
    }
  }
})
