import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// https://vite.dev/config/
export default defineConfig({

    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080', // 如 http://localhost:8080
                changeOrigin: true,
                // 不需要重写路径（避免再次添加 /api）
                // rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    },

  plugins: [
    vue(),
    vueJsx(),
  ],
  
    resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
