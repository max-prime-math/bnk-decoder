import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  base: '/bnk-decoder/',
  plugins: [svelte()],
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: [
      '@myriaddreamin/typst.ts',
      '@myriaddreamin/typst-ts-renderer',
      '@myriaddreamin/typst-ts-web-compiler',
    ],
  },
});
