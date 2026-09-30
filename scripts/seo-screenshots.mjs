// SEO before/after page screenshots at 390/768/1440.
// Output: docs/seo/screenshots/<mode>/
//
// Usage: run `npm run preview` first, then:
//   node scripts/seo-screenshots.mjs before
//   node scripts/seo-screenshots.mjs after
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const mode = process.argv[2] === 'after' ? 'after' : 'before';
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const OUT = path.join('docs', 'seo', 'screenshots', mode);
fs.mkdirSync(OUT, { recursive: true });

const routes = [
  ['home', '/'],
  ['services', '/services/'],
  ['service-ac-repair', '/services/ac-repair-diagnostics/'],
  ['service-maintenance', '/services/ac-maintenance/'],
  ['service-airflow', '/services/airflow-ductwork/'],
  ['service-replacement', '/services/replacement-installation/'],
  ['service-commercial', '/services/commercial-service-maintenance/'],
  ['tab', '/tab-commissioning-support/'],
  ['service-area', '/service-area/'],
  ['spring-hill', '/service-area/spring-hill-fl/'],
  ['faq', '/faq/'],
];

const viewports = [
  { width: 390, height: 844, tag: '390' },
  { width: 768, height: 1024, tag: '768' },
  { width: 1440, height: 900, tag: '1440' },
];

const browser = await chromium.launch();
const skipped = [];
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      isMobile: viewport.width < 500,
      hasTouch: viewport.width < 500,
    });
    await context.route('**://www.googletagmanager.com/**', (route) => route.fulfill({ status: 204, body: '' }));
    await context.route('**://cloud.umami.is/**', (route) => route.fulfill({ status: 204, body: '' }));
    await context.addInitScript(() => {
      try {
        window.localStorage.setItem('scs-consent-v1', JSON.stringify({ analytics: false, v: 1 }));
      } catch {
        /* no-op */
      }
      document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');
        style.textContent = '.skip-link{display:none !important}';
        document.head.appendChild(style);
      });
    });
    const page = await context.newPage();
    for (const [name, route] of routes) {
      const response = await page.goto(BASE + route, { waitUntil: 'networkidle' });
      if ((response?.status() ?? 0) === 404) {
        skipped.push(`${name} (404 — page not built)`);
        continue;
      }
      await page.evaluate(async () => {
        const imgs = Array.from(document.querySelectorAll('img'));
        for (const img of imgs) {
          img.scrollIntoView({ block: 'center' });
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(200);
      const file = path.join(OUT, `${name}-${viewport.tag}.jpg`);
      try {
        await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 70 });
      } catch (error) {
        // Very tall pages can exceed Chromium's capture limits; retry once
        // after a short settle, then record the skip instead of failing.
        await page.waitForTimeout(800);
        try {
          await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 70 });
        } catch (retryError) {
          skipped.push(`${name}-${viewport.tag}: ${String(retryError.message).split('\n')[0]}`);
        }
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(`SEO screenshots (${mode}) written to ${OUT}`);
if (skipped.length) console.log(`skipped: ${skipped.join(', ')}`);
