import type { APIRoute } from 'astro';

// Generated at build time. Preview deployments (PUBLIC_PREVIEW_MODE=true)
// produce a Disallow-all policy so preview URLs are never crawled.
// Production builds must leave that variable unset/false.
export const GET: APIRoute = ({ site }) => {
  const preview = import.meta.env.PUBLIC_PREVIEW_MODE === 'true';
  const base = site ?? new URL('https://sunshineclimatesolutions.com');
  const sitemapUrl = new URL('sitemap-index.xml', base).href;

  const body = preview
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
