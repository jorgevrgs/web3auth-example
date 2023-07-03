import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

const PREFIX = process.env.VITE_SERVER_PREFIX ?? '/api';
const SERVER = process.env.VITE_SERVER_URL ?? 'http://localhost:8080'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      [PREFIX]: {
        target: SERVER,
        changeOrigin: true,
        rewrite: (path) => path.replace(new RegExp(`^${PREFIX}`), '/api')
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true
        })
      ]
    }
  }
})
