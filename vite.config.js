import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure base path is set to root for production
  css: {
    devSourcemap: true
  },
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,       // Specify port
    strictPort: false, // Allow port to be automatically adjusted if 5173 is in use
    open: false,      // Don't automatically open browser
    proxy: {
      '/bak': {
        target: 'https://khwanzay.school',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/bak/, '/bak'),
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Add CORS headers to prevent CORS issues
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
          });
        }
      },
      '/includes/images': {
        target: 'https://khwanzay.school',
        changeOrigin: true,
        secure: true,
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Add CORS headers to prevent OpaqueResponseBlocking
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
          });
        }
      }
    }
  },
  build: {
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          crypto: ['crypto-js']
        }
      }
    }
  }
})
