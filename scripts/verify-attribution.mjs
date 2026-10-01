// Campaign attribution verification (September 2026 UTM system).
// Runs against a local preview server of the production-equivalent build and
// proves the guarantees the marketing system relies on:
//   - GA4-compatible query parameters survive page load (incl. gclid/gbraid/
//     wbraid/gad_* for Google Ads auto-tagging — nothing is stripped);
//   - internal navigation neither manufactures nor preserves UTMs;
//   - canonical URLs, the sitemap and tel:/sms:/mailto: links stay clean;
//   - no UTM value or generated URL contains PII;
//   - the site build itself contains no UTM parameters (inbound only);
//   - consent behavior is unchanged on a UTM landing page.
//
// Usage: run `npm run preview` first, then:
//   node scripts/verify-attribution.mjs
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { marketingLinks, siteUrl } from '../src/config/marketing-links.ts';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const failures = [];
const check = (name, condition, detail = '') => {
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

// ── 1. Registry URLs are PII-free and well-formed ───────────────────────────
{
  const urls = marketingLinks.map((link) => new URL(link.path, siteUrl));
  const built = marketingLinks.map((link) => {
    const url = new URL(link.path, siteUrl);
    url.searchParams.set('utm_source', link.utm.source);
    url.searchParams.set('utm_medium', link.utm.medium);
    url.searchParams.set('utm_campaign', link.utm.campaign);
    if (link.utm.content) url.searchParams.set('utm_content', link.utm.content);
    return url.href;
  });
  check('registry destinations are all on the production domain', urls.every((u) => u.origin === siteUrl));
  check(
    'no generated URL contains PII (email / 7+ digit sequences)',
    built.every((u) => !u.includes('@') && !/\d{7,}/.test(u)),
  );
  check(
    'no generated URL uses utm_term (paid keywords)',
    built.every((u) => !u.includes('utm_term')),
  );
  check(
    'no generated URL uses forbidden Google Ads UTMs',
    built.every((u) => !/utm_medium=(cpc|ppc|paid_search|display)/.test(u)),
  );
  check(
    'every generated URL has exactly one of each utm parameter',
    built.every((u) => {
      const url = new URL(u);
      return ['utm_source', 'utm_medium', 'utm_campaign'].every(
        (key) => url.searchParams.getAll(key).length === 1,
      );
    }),
  );
}

// ── 2. The built site contains no UTMs (inbound only) ───────────────────────
{
  const htmlFiles = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(html|js)$/.test(entry.name)) htmlFiles.push(full);
    }
  };
  if (!fs.existsSync('dist')) {
    console.error('dist/ not found — run npm run build first');
    process.exit(1);
  }
  walk('dist');

  const dirtyInternalLinks = [];
  const dirtyTelLinks = [];
  const dirtyCanonicals = [];
  for (const file of htmlFiles) {
    const text = fs.readFileSync(file, 'utf8');
    // Internal hrefs/srcs must never carry UTMs or ad click identifiers.
    // (External links — e.g. the pre-existing Google review submission URL —
    // legitimately carry their own campaign parameters and are out of scope.)
    for (const match of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const value = match[1];
      const isInternal = value.startsWith('/') || value.startsWith(siteUrl);
      if (isInternal && (value.includes('utm_') || /gclid|gbraid|wbraid|gad_/.test(value))) {
        dirtyInternalLinks.push(`${file}: ${value}`);
      }
    }
    for (const match of text.matchAll(/href="((?:tel|sms|mailto):[^"]*)"/g)) {
      if (match[1].includes('?') || match[1].includes('utm_')) dirtyTelLinks.push(`${file}: ${match[1]}`);
    }
    for (const match of text.matchAll(/<link rel="canonical" href="([^"]+)"/g)) {
      if (match[1].includes('?') || match[1].includes('utm_')) dirtyCanonicals.push(`${file}: ${match[1]}`);
    }
  }
  check('no internal link carries UTM or ad-click parameters', dirtyInternalLinks.length === 0, dirtyInternalLinks.slice(0, 5).join(' | '));
  check('no tel:/sms:/mailto: link carries query parameters', dirtyTelLinks.length === 0, dirtyTelLinks.join(' | '));
  check('no canonical URL carries query parameters', dirtyCanonicals.length === 0, dirtyCanonicals.join(' | '));

  // Regression guard: the external Google review submission link keeps its
  // intended campaign parameters (the review QR system must not be altered).
  const leaveReview = fs.readFileSync(path.join('dist', 'leave-review', 'index.html'), 'utf8');
  check(
    'external Google review link keeps its intended UTMs',
    leaveReview.includes('utm_source=gbp&utm_medium=reviews&utm_campaign=qr'),
  );

  const sitemap = fs.readFileSync(path.join('dist', 'sitemap-0.xml'), 'utf8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  // Indexable pages = every built index.html minus the noindexed thank-you and
  // support pages (both are intentionally excluded from the sitemap).
  const indexablePages = htmlFiles.filter(
    (f) =>
      f.endsWith('index.html') &&
      !f.includes('thank-you') &&
      path.basename(path.dirname(f)) !== 'support',
  ).length;
  check(
    'sitemap matches the indexable page count',
    locs.length === indexablePages,
    `sitemap ${locs.length} vs indexable ${indexablePages}`,
  );
  check('no sitemap URL carries query parameters or UTMs', locs.every((loc) => !loc.includes('?') && !loc.includes('utm_')));

  const robots = fs.readFileSync(path.join('dist', 'robots.txt'), 'utf8');
  check('robots.txt still allows indexing', robots.includes('Allow: /'));
}

// ── 3. Live behavior on a production-equivalent preview ─────────────────────
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const gtmRequests = [];
  await context.route('**://www.googletagmanager.com/**', (route) => {
    gtmRequests.push(route.request().url());
    return route.abort();
  });
  await context.route('**://cloud.umami.is/**', (route) => route.fulfill({ status: 204, body: '' }));
  const page = await context.newPage();

  const landing =
    '/?utm_source=facebook&utm_medium=organic_social&utm_campaign=maintenance&utm_content=post';
  await page.goto(`${BASE}${landing}`, { waitUntil: 'networkidle' });
  check(
    'UTM landing parameters survive page load',
    await page.evaluate(
      () =>
        location.search ===
        '?utm_source=facebook&utm_medium=organic_social&utm_campaign=maintenance&utm_content=post',
    ),
    await page.evaluate(() => location.search),
  );
  const landingCanonical = await page.evaluate(
    () => document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
  );
  check(
    'UTM landing page canonical stays clean (apex, no query)',
    landingCanonical === `${siteUrl}/`,
    landingCanonical,
  );
  check(
    'no GTM request before consent on a UTM landing',
    gtmRequests.length === 0,
    gtmRequests.join(' | '),
  );

  // Internal navigation: UTMs must not be manufactured or carried along.
  // (The visible mobile contact-strip "Request Service" link is used because
  // the desktop nav is intentionally hidden at 390px.)
  await page.click('.strip-request');
  await page.waitForLoadState('networkidle');
  check(
    'internal navigation drops campaign parameters (no forced persistence)',
    !page.url().includes('utm_') && !page.url().includes('?'),
    page.url(),
  );

  // Google Ads auto-tagging parameters must be preserved exactly.
  const gads =
    '/?gclid=test_click_123&gbraid=test_gbraid_456&wbraid=test_wbraid_789&gad_source=1&gad_campaignid=99887766';
  await page.goto(`${BASE}${gads}`, { waitUntil: 'networkidle' });
  check(
    'Google Ads click identifiers survive page load (gclid/gbraid/wbraid/gad_*)',
    await page.evaluate(
      () =>
        new URLSearchParams(location.search).get('gclid') === 'test_click_123' &&
        new URLSearchParams(location.search).get('gbraid') === 'test_gbraid_456' &&
        new URLSearchParams(location.search).get('wbraid') === 'test_wbraid_789' &&
        new URLSearchParams(location.search).get('gad_source') === '1' &&
        new URLSearchParams(location.search).get('gad_campaignid') === '99887766',
    ),
    await page.evaluate(() => location.search),
  );

  // Service page with UTMs (e.g. the maintenance QR destination).
  await page.goto(`${BASE}/services/ac-maintenance/?utm_source=print&utm_medium=qr&utm_campaign=maintenance`, {
    waitUntil: 'networkidle',
  });
  check(
    'service-page campaign parameters survive page load',
    await page.evaluate(
      () => location.search === '?utm_source=print&utm_medium=qr&utm_campaign=maintenance',
    ),
    await page.evaluate(() => location.search),
  );
  await context.close();

  // Production canonical/sitemap spot-check (read-only, no writes).
  const liveCanonical = await (async () => {
    try {
      const html = await (await fetch(`${siteUrl}/`)).text();
      return /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? '';
    } catch {
      return '';
    }
  })();
  check(
    'production canonical is a clean apex URL (no UTMs)',
    liveCanonical === `${siteUrl}/`,
    liveCanonical || 'unreachable (offline check skipped)',
  );
} finally {
  await browser.close();
}

console.log(`\n${failures.length ? `FAILURES:\n${failures.join('\n')}` : 'ALL ATTRIBUTION CHECKS PASSED'}`);
if (failures.length) process.exitCode = 1;
