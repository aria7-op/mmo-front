import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure base path is set to root for production
  css: {
    devSourcemap: false,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/css/variables.css";`
      }
    }
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
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom', 'react-router-hash-link'],
          ui: ['react-bootstrap', 'bootstrap'],
          charts: ['chart.js', 'react-chartjs-2'],
          utils: ['crypto-js', 'dompurify'],
          icons: ['react-icons', '@fortawesome/fontawesome-free'],
          animations: ['framer-motion', 'react-countup', 'react-countdown'],
          media: ['swiper', 'photoswipe', 'react-photoswipe-gallery', 'react-modal-video'],
          editor: ['quill', 'react-quill'],
          i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector', 'i18next-http-backend']
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').pop();
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/.test(assetInfo.name)) {
            return `media/[name]-[hash].[ext]`;
          }
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return `images/[name]-[hash].[ext]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return `fonts/[name]-[hash].[ext]`;
          }
          return `${extType}/[name]-[hash].[ext]`;
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
