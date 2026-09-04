import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      components: resolve('./src/components'),
      config: resolve('./src/config'),
      constants: resolve('./src/constants'),
      helpers: resolve('./src/helpers'),
      hooks: resolve('./src/hooks'),
      pages: resolve('./src/pages'),
      routes: resolve('./src/routes'),
      services: resolve('./src/services'),
      types: resolve('./src/types'),
    },
  },
});
