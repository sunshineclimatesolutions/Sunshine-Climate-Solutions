/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Web3Forms public access key (client-side submission identifier). */
  readonly PUBLIC_WEB3FORMS_ACCESS_KEY?: string;
  /** "true" adds noindex meta + Disallow-all robots.txt for preview deployments. */
  readonly PUBLIC_PREVIEW_MODE?: string;
  /** Umami Cloud website ID. Empty string disables analytics. */
  readonly PUBLIC_UMAMI_WEBSITE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Umami Cloud analytics (loaded only in production builds; see BaseHead.astro). */
interface Window {
  umami?: {
    track: (eventName: string) => void;
  };
}
