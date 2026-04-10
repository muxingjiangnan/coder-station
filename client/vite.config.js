import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// 定义路径别名
const pathResolve = (dir) => path.resolve(__dirname, dir);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      '@': pathResolve('src'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },

  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
        changeOrigin: true,
      },
      '/res': {
        target: 'http://localhost:7001',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:7001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'build',
    assetsDir: 'assets',
    sourcemap: process.env.GENERATE_SOURCEMAP !== 'false',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name].[hash].js',
        chunkFileNames: 'assets/js/[name].[hash].chunk.js',
        assetFileNames: 'assets/media/[name].[hash].[ext]',
      },
    },
  },
});
