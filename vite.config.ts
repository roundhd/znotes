import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Plugin to copy manifest.json to dist directory during build
const copyManifest = () => {
  return {
    name: 'copy-manifest',
    closeBundle() {
      fs.copyFileSync('manifest.json', 'dist/manifest.json');
    }
  };
};

export default defineConfig({
  plugins: [react(), copyManifest()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        background: resolve(__dirname, 'background.ts'),
        content: resolve(__dirname, 'content.ts'),
      },
      output: {
        entryFileNames: '[name].js',
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  }
});