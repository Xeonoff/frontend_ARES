import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
    base: "",
    plugins: [ react() ],
    server: {
      host: "localhost",
      port: 3000,
      proxy: process.env.NODE_ENV === 'development' ? {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      } : {}
    },
})
