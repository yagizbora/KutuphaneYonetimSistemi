import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs/promises';

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx",
    include: /\.js$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    port: 3001
  },
  build: {
    outDir: 'build'
  }
});
