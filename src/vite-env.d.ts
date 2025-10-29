/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENABLE_OPENAI_DEVTOOLS?: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
