import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/nsmbw-powerup-panels/',
  plugins: [react(), tailwind()],
  resolve: {
    preserveSymlinks: true
  },
  build: {
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        builder: resolve(import.meta.dirname, 'builder/index.html'),
        explorer: resolve(import.meta.dirname, 'explorer/index.html')
      }
    }
  }
});
