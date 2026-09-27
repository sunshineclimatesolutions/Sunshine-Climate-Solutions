/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Web3Forms public access key (client-side submission identifier). */
  readonly PUBLIC_WEB3FORMS_ACCESS_KEY?: string;
  /** "true" adds noindex meta + Disallow-all robots.txt for preview deployments. */
  readonly PUBLIC_PREVIEW_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
