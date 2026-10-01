import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production domain. Preview deployments must set PUBLIC_PREVIEW_MODE=true
// so they are not indexed (see docs/DEPLOYMENT.md).
export default defineConfig({
  site: 'https://sunshineclimatesolutions.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // /support/ is intentionally noindex (direct/referral-only fundraiser
      // page — it must not compete with the HVAC service pages in search).
      filter: (page) =>
        !page.includes('/404') && !page.includes('/thank-you') && !page.includes('/support'),
    }),
  ],
});
