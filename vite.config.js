import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/myReact/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // 将 React 相关库单独打包
          'react-vendor': ['react', 'react-dom'],
          // 将 Markdown 相关库单独打包
          'markdown-vendor': ['react-markdown', 'remark-gfm', 'rehype-highlight'],
          // 将 Supabase 单独打包
          'supabase-vendor': ['@supabase/supabase-js'],
          // 将图标库单独打包
          'icons-vendor': ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
})