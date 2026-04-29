import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    include: [
      '@myriaddreamin/typst.ts',
      '@myriaddreamin/typst-ts-renderer',
      '@myriaddreamin/typst-ts-web-compiler',
    ],
  },
});
