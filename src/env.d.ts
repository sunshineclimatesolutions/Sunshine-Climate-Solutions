/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Web3Forms public access key (client-side submission identifier). */
  readonly PUBLIC_WEB3FORMS_ACCESS_KEY?: string;
  /** "true" adds noindex meta + Disallow-all robots.txt for preview deployments. */
  readonly PUBLIC_PREVIEW_MODE?: string;
  /** Umami Cloud website ID. Empty string disables analytics. */
  readonly PUBLIC_UMAMI_WEBSITE_ID?: string;
  /** Google Tag Manager container ID. Empty string disables GTM + consent UI. */
  readonly PUBLIC_GTM_CONTAINER_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** Analytics bridges loaded by the site (see BaseHead.astro / ConsentBanner.astro). */
interface Window {
  umami?: {
    track: (eventName: string) => void;
  };
  /** GTM / GA4 data layer. Pushes are inert until GTM loads and consent allows. */
  dataLayer?: unknown[];
  /** Consent Mode v2 bridge defined before the GTM container snippet. */
  gtag?: (...args: unknown[]) => void;
}
