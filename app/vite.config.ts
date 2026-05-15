import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const appVersion = JSON.parse(readFileSync('./package.json', 'utf8')).version as string;
const buildHash = execSync('git rev-parse --short HEAD').toString().trim();

export default defineConfig({
  base: '/bnk-decoder/',
  plugins: [svelte()],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
    __BUILD_HASH__: JSON.stringify(buildHash),
  },
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
