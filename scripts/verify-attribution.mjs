// Campaign attribution verification (September 2026 UTM system; extended
// October 2026 with lead-record attribution). Runs against a local preview
// server of the production-equivalent build and proves the guarantees the
// marketing system relies on:
//   - GA4-compatible query parameters survive page load (incl. gclid/gbraid/
//     wbraid/gad_* for Google Ads auto-tagging — nothing is stripped);
//   - internal navigation neither manufactures nor preserves UTMs;
//   - canonical URLs, the sitemap and tel:/sms:/mailto: links stay clean;
//   - no UTM value or generated URL contains PII;
//   - the site build itself contains no UTM parameters (inbound only);
//   - consent behavior is unchanged on a UTM landing page;
//   - lead attribution (first/latest touch) is captured on campaign landings,
//     preserved across internal navigation and direct visits, updated only by
//     genuinely new campaigns, attached to successful Web3Forms submissions
//     without PII, and can never block a submission when storage is missing.
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

  // ── 4. Lead attribution — first/latest touch on successful submissions ────
  {
    const attributionContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await attributionContext.route('**://www.googletagmanager.com/**', (route) =>
      route.fulfill({ status: 204, body: '' }),
    );
    await attributionContext.route('**://cloud.umami.is/**', (route) =>
      route.fulfill({ status: 204, body: '' }),
    );
    const submissions = [];
    await attributionContext.route('https://api.web3forms.com/submit', async (route) => {
      submissions.push(route.request().postDataJSON());
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'ok' }),
      });
    });
    const page = await attributionContext.newPage();
    const readTouch = (key) =>
      page.evaluate((k) => JSON.parse(window.localStorage.getItem(k) || 'null'), key);

    // A. A campaign landing captures first and latest touch.
    await page.goto(
      `${BASE}/?utm_source=facebook&utm_medium=organic_social&utm_campaign=maintenance&utm_content=post`,
      { waitUntil: 'networkidle' },
    );
    const firstA = await readTouch('scs-attribution-first');
    const latestA = await readTouch('scs-attribution-latest');
    check(
      'campaign landing captures first-touch',
      firstA?.source === 'facebook' &&
        firstA?.medium === 'organic_social' &&
        firstA?.campaign === 'maintenance' &&
        firstA?.content === 'post',
      JSON.stringify(firstA),
    );
    check('campaign landing sets latest-touch to the same campaign', latestA?.campaign === 'maintenance');

    // B. Internal navigation preserves campaign context.
    await page.click('.strip-request');
    await page.waitForLoadState('networkidle');
    const latestAfterNav = await readTouch('scs-attribution-latest');
    check(
      'internal navigation preserves latest-touch campaign',
      latestAfterNav?.source === 'facebook' && latestAfterNav?.campaign === 'maintenance',
      JSON.stringify(latestAfterNav),
    );

    // C. A genuinely new campaign updates latest-touch only.
    await page.goto(
      `${BASE}/?utm_source=instagram&utm_medium=organic_social&utm_campaign=ac_repair&utm_content=reel`,
      { waitUntil: 'networkidle' },
    );
    const firstC = await readTouch('scs-attribution-first');
    const latestC = await readTouch('scs-attribution-latest');
    check(
      'a new campaign updates latest-touch',
      latestC?.source === 'instagram' && latestC?.campaign === 'ac_repair',
      JSON.stringify(latestC),
    );
    check(
      'a new campaign never overwrites first-touch',
      firstC?.source === 'facebook' && firstC?.campaign === 'maintenance',
      JSON.stringify(firstC),
    );

    // D. An ordinary direct visit does not erase campaign context.
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    const latestD = await readTouch('scs-attribution-latest');
    check(
      'direct visit does not erase latest-touch campaign',
      latestD?.source === 'instagram' && latestD?.campaign === 'ac_repair',
      JSON.stringify(latestD),
    );

    // E. A successful submission carries first + latest attribution.
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const set = (id, value) => {
        const el = document.getElementById(id);
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set('f-name', 'Attribution Verification');
      set('f-phone', '7270000000');
      set('f-zip', '34609');
      set('f-desc', 'Automated attribution verification submission.');
      const service = document.getElementById('f-service');
      service.value = 'AC repair / diagnostic';
      service.dispatchEvent(new Event('change', { bubbles: true }));
      document.getElementById('service-request-form').requestSubmit();
    });
    await page.waitForTimeout(1500);
    check(
      'attribution submission delivers exactly one provider request',
      submissions.length === 1,
      String(submissions.length),
    );
    const payload = submissions[0] ?? {};
    check(
      'submission includes first-touch campaign fields',
      payload.first_utm_source === 'facebook' && payload.first_utm_campaign === 'maintenance',
      JSON.stringify({ first_utm_source: payload.first_utm_source, first_utm_campaign: payload.first_utm_campaign }),
    );
    check(
      'submission includes latest-touch campaign fields',
      payload.latest_utm_source === 'instagram' && payload.latest_utm_campaign === 'ac_repair',
      JSON.stringify({ latest_utm_source: payload.latest_utm_source, latest_utm_campaign: payload.latest_utm_campaign }),
    );
    check(
      'submission includes attribution landing page and timestamps',
      typeof payload.attribution_landing_page === 'string' &&
        payload.attribution_landing_page.length > 0 &&
        typeof payload.attribution_first_at === 'string' &&
        typeof payload.attribution_latest_at === 'string',
      JSON.stringify({
        landing: payload.attribution_landing_page,
        firstAt: payload.attribution_first_at,
        latestAt: payload.attribution_latest_at,
      }),
    );
    const attributionOnly = Object.fromEntries(
      Object.entries(payload).filter(
        ([key]) =>
          key.startsWith('first_') || key.startsWith('latest_') || key.startsWith('attribution_'),
      ),
    );
    const attributionText = JSON.stringify(attributionOnly);
    check(
      'attribution fields contain no PII (no email/phone/name/form text)',
      !attributionText.includes('@') &&
        !/\d{7,}/.test(attributionText) &&
        !attributionText.includes('Attribution Verification') &&
        !attributionText.includes('Automated attribution'),
      attributionText,
    );
    await attributionContext.close();
  }

  // ── 5. Missing storage — attribution must never block a submission ────────
  {
    const blockedContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await blockedContext.addInitScript(() => {
      try {
        Object.defineProperty(window, 'localStorage', {
          configurable: true,
          get() {
            throw new Error('storage disabled for test');
          },
        });
      } catch {
        window.__storageBlockFailed = true;
      }
    });
    await blockedContext.route('**://www.googletagmanager.com/**', (route) =>
      route.fulfill({ status: 204, body: '' }),
    );
    await blockedContext.route('**://cloud.umami.is/**', (route) =>
      route.fulfill({ status: 204, body: '' }),
    );
    const blockedSubmissions = [];
    await blockedContext.route('https://api.web3forms.com/submit', async (route) => {
      blockedSubmissions.push(route.request().postDataJSON());
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'ok' }),
      });
    });
    const page = await blockedContext.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await page.goto(
      `${BASE}/?utm_source=facebook&utm_medium=organic_social&utm_campaign=maintenance`,
      { waitUntil: 'networkidle' },
    );
    const storageBlocked = await page.evaluate(() => {
      try {
        void window.localStorage;
        return false;
      } catch {
        return true;
      }
    });
    check('storage can be disabled for the resilience test', storageBlocked);

    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const set = (id, value) => {
        const el = document.getElementById(id);
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set('f-name', 'Attribution Verification');
      set('f-phone', '7270000000');
      set('f-zip', '34609');
      set('f-desc', 'Automated attribution verification submission.');
      const service = document.getElementById('f-service');
      service.value = 'AC repair / diagnostic';
      service.dispatchEvent(new Event('change', { bubbles: true }));
      document.getElementById('service-request-form').requestSubmit();
    });
    await page.waitForTimeout(1500);
    check(
      'submission still succeeds when storage is unavailable',
      blockedSubmissions.length === 1,
      String(blockedSubmissions.length),
    );
    const blockedPayload = blockedSubmissions[0] ?? {};
    check(
      'blocked storage omits attribution fields but keeps the request',
      blockedPayload['Full Name'] === 'Attribution Verification' &&
        !Object.keys(blockedPayload).some(
          (key) => key.startsWith('first_utm_') || key.startsWith('attribution_'),
        ),
      JSON.stringify(Object.keys(blockedPayload)),
    );
    check('no page errors when storage is unavailable', pageErrors.length === 0, pageErrors.join(' | '));
    await blockedContext.close();
  }

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
