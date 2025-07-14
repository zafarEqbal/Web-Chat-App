import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: '../backend/dist',       // ✅ Build into backend/dist
    emptyOutDir: true,               // ✅ Clean old files
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Optional but nice
    },
  },
});
