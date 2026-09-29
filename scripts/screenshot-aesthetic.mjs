// Aesthetic overhaul verification screenshots (September 2026 change order).
// Captures every published route full-page at 390/768/1440 plus close-ups of
// the owner-flagged sections, console errors, and horizontal-overflow checks.
//
// Usage: run `npm run preview` first (build the branch you want to capture), then:
//   node scripts/screenshot-aesthetic.mjs before
//   node scripts/screenshot-aesthetic.mjs after
// Output: docs/verification/screenshots/aesthetic/<mode>/
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const mode = process.argv[2] === 'after' ? 'after' : 'before';
const suffix = process.argv[3] ? `-${process.argv[3]}` : '';
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const OUT = path.join('docs', 'verification', 'screenshots', 'aesthetic', `${mode}${suffix}`);
fs.mkdirSync(OUT, { recursive: true });

// Deterministic captures: third-party analytics are stubbed and a stored
// consent choice keeps the banner out of the page screenshots (the banner has
// its own dedicated captures at the end).
const stubAnalytics = async (context) => {
  await context.route('**://www.googletagmanager.com/**', (route) =>
    route.fulfill({ status: 204, body: '' }),
  );
  await context.route('**://cloud.umami.is/**', (route) =>
    route.fulfill({ status: 204, body: '' }),
  );
};
const seedConsent = async (context) => {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('scs-consent-v1', JSON.stringify({ analytics: false, v: 1 }));
    } catch {
      /* no-op */
    }
  });
};

const routes = [
  ['home', '/'],
  ['services', '/services/'],
  ['service-ac-repair', '/services/ac-repair-diagnostics/'],
  ['service-replacement', '/services/replacement-installation/'],
  ['service-maintenance', '/services/ac-maintenance/'],
  ['service-airflow', '/services/airflow-ductwork/'],
  ['service-commercial', '/services/commercial-service-maintenance/'],
  ['tab', '/tab-commissioning-support/'],
  ['service-area', '/service-area/'],
  ['about', '/about/'],
  ['faq', '/faq/'],
  ['contact', '/contact/'],
  ['leave-review', '/leave-review/'],
  ['privacy', '/privacy/'],
  ['thank-you', '/thank-you/'],
  ['not-found', '/this-page-does-not-exist/'],
];

const viewports = [
  { width: 390, height: 844, tag: '390' },
  { width: 768, height: 1024, tag: '768' },
  { width: 1440, height: 900, tag: '1440' },
];

// Close-ups of the owner-flagged sections (change order §VII).
const closeUps = [
  ['/', '.hero', 'home-hero'],
  ['/', '.hero .chips', 'home-trust-chips'],
  ['/', 'section[aria-labelledby="home-proof-heading"]', 'home-workmanship'],
  ['/', 'section[aria-labelledby="home-diag-heading"]', 'home-diagnostics'],
  ['/', 'section[aria-labelledby="home-tab-heading"]', 'home-tab-band'],
  ['/', 'section[aria-labelledby="cta-maintenance-heading"]', 'home-maintenance-band'],
  ['/', 'section[aria-labelledby="home-about-heading"] .area-duo', 'home-area-duo'],
  ['/', '.service-map-compact', 'home-compact-map'],
  ['/', 'section[aria-labelledby="home-contact-heading"]', 'home-final-cta'],
  ['/', 'section[aria-labelledby="brands-heading"]', 'home-brands'],
  ['/', 'footer.site-footer', 'site-footer'],
  ['/', 'header.site-header', 'site-header'],
  ['/service-area/', '.service-map-full', 'service-area-map-full'],
  ['/services/', '.grid--six', 'services-grid'],
  ['/tab-commissioning-support/', 'section[aria-labelledby="tab-services-heading"]', 'tab-services-grid'],
];

const consoleErrors = [];
const overflow = [];

const browser = await chromium.launch();
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      isMobile: viewport.width < 500,
      hasTouch: viewport.width < 500,
    });
    await context.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.textContent = '.skip-link{display:none !important}';
        document.head.appendChild(style);
      });
    });
    await seedConsent(context);
    await stubAnalytics(context);
    const page = await context.newPage();
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(`${viewport.tag}: ${page.url()} — ${message.text()}`);
      }
    });
    page.on('pageerror', (error) => {
      consoleErrors.push(`${viewport.tag}: ${page.url()} — ${error.message}`);
    });

    for (const [name, route] of routes) {
      const response = await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(200);
      const status = response?.status() ?? 0;
      if (name === 'not-found' && status !== 404) {
        consoleErrors.push(`${name}-${viewport.tag}: expected 404, got ${status}`);
      }
      if (name !== 'not-found' && status >= 400) {
        consoleErrors.push(`${name}-${viewport.tag}: HTTP ${status}`);
      }
      const doc = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      if (doc.scrollWidth > doc.clientWidth + 1) {
        overflow.push(`${name}-${viewport.tag}: scrollWidth ${doc.scrollWidth} > clientWidth ${doc.clientWidth}`);
      }
      await page.screenshot({
        path: path.join(OUT, `${name}-${viewport.tag}.jpg`),
        fullPage: true,
        type: 'jpeg',
        quality: 70,
      });
    }

    for (const [route, selector, name] of closeUps) {
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        for (let y = 0; y <= document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(400);
      try {
        const element = page.locator(selector).first();
        await element.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await element.screenshot({
          path: path.join(OUT, `${name}-${viewport.tag}.jpg`),
          type: 'jpeg',
          quality: 75,
        });
      } catch (error) {
        console.log(`SKIP ${name}-${viewport.tag}: ${String(error.message).split('\n')[0]}`);
      }
    }
    await context.close();
  }

  // Special widths: 360/412 mobile header + CTA strip, 940 header/diagnostics.
  const specials = [
    { width: 360, height: 800, tag: '360', routes: [['/', '.hero'], ['/', 'header.site-header']] },
    { width: 412, height: 915, tag: '412', routes: [['/', '.hero'], ['/', 'header.site-header']] },
    {
      width: 940,
      height: 900,
      tag: '940',
      routes: [
        ['/', 'header.site-header'],
        ['/', 'section[aria-labelledby="home-diag-heading"]'],
      ],
    },
  ];
  for (const special of specials) {
    const context = await browser.newContext({
      viewport: { width: special.width, height: special.height },
      deviceScaleFactor: 1,
      isMobile: special.width < 500,
      hasTouch: special.width < 500,
    });
    await context.addInitScript(() => {
      document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.textContent = '.skip-link{display:none !important}';
        document.head.appendChild(style);
      });
    });
    await seedConsent(context);
    await stubAnalytics(context);
    const page = await context.newPage();
    for (const [route, selector] of special.routes) {
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      try {
        const element = page.locator(selector).first();
        await element.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        const slug = selector.includes('header') ? 'header' : 'hero';
        await element.screenshot({
          path: path.join(OUT, `${slug}-${special.tag}.jpg`),
          type: 'jpeg',
          quality: 78,
        });
      } catch (error) {
        console.log(`SKIP ${selector}-${special.tag}: ${String(error.message).split('\n')[0]}`);
      }
    }
    await context.close();
  }

  // Consent banner states (first visit, no stored choice) for owner review.
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: width < 500 ? 844 : 900 },
      deviceScaleFactor: 1,
      isMobile: width < 500,
      hasTouch: width < 500,
    });
    await stubAnalytics(context);
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: path.join(OUT, `consent-banner-${width}.jpg`),
      type: 'jpeg',
      quality: 78,
    });
    await page.click('[data-consent-manage]');
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(OUT, `consent-preferences-${width}.jpg`),
      type: 'jpeg',
      quality: 78,
    });
    await context.close();
  }
} finally {
  await browser.close();
}

fs.writeFileSync(
  path.join(OUT, 'console-errors.txt'),
  consoleErrors.length ? consoleErrors.join('\n') + '\n' : 'none\n',
);
fs.writeFileSync(
  path.join(OUT, 'overflow-report.txt'),
  overflow.length ? overflow.join('\n') + '\n' : 'none\n',
);
console.log(`Screenshots (${mode}) written to ${OUT}`);
console.log(`Console errors: ${consoleErrors.length} (see console-errors.txt)`);
console.log(`Overflow: ${overflow.length} (see overflow-report.txt)`);
