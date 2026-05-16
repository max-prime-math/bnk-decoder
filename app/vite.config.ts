import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const appVersion = JSON.parse(readFileSync('./package.json', 'utf8')).version as string;

function resolveBuildHash(): string {
  const envHash = process.env.GITHUB_SHA || process.env.VITE_BUILD_HASH || process.env.BUILD_HASH;
  if (envHash) return envHash.slice(0, 7);
  return 'dev';
}

const buildHash = resolveBuildHash();

export default defineConfig({
  base: '/bnk-decoder/',
  plugins: [svelte()],
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
    __BUILD_HASH__: JSON.stringify(buildHash),
  },
  build: {
    outDir: '../dist',
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
