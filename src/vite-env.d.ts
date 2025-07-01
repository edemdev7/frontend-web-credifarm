/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_API_URL: string;
  VITE_SECRET_KEY: string;
  VITE_SENTRY_AUTH_TOKEN: string;
  VITE_ACCESS_SECRET: string;
  VITE_REFRESH_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
