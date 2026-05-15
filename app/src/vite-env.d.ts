/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __BUILD_HASH__: string;

declare module '@myriaddreamin/typst-ts-renderer/wasm?url' {
  const url: string;
  export default url;
}

declare module '@myriaddreamin/typst-ts-web-compiler/wasm?url' {
  const url: string;
  export default url;
}
