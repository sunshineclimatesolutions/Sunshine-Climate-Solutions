// Focused captures of the corrected photographic galleries (homepage
// workmanship proof cards, TAB field photographs) at 390/768/1440.
// Output: docs/verification/screenshots/aesthetic/galleries/
//
// Usage: run `npm run preview` first, then:
//   node scripts/screenshot-galleries.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const OUT = path.join('docs', 'verification', 'screenshots', 'aesthetic', 'galleries');
fs.mkdirSync(OUT, { recursive: true });

const targets = [
  ['/', '.work-grid', 'home-workmanship-gallery'],
  ['/', '.pricing-grid', 'home-pricing'],
  ['/tab-commissioning-support/', '.tab-visuals', 'tab-field-gallery'],
  ['/faq/', '.conditions-grid', 'faq-conditions'],
];

const viewports = [
  { width: 390, height: 844, tag: '390' },
  { width: 768, height: 1024, tag: '768' },
  { width: 1440, height: 900, tag: '1440' },
];

const browser = await chromium.launch();
const failures = [];
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 2,
      isMobile: viewport.width < 500,
      hasTouch: viewport.width < 500,
    });
    await context.route('**://www.googletagmanager.com/**', (route) =>
      route.fulfill({ status: 204, body: '' }),
    );
    await context.route('**://cloud.umami.is/**', (route) =>
      route.fulfill({ status: 204, body: '' }),
    );
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
    for (const [route, selector, name] of targets) {
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        const imgs = Array.from(document.querySelectorAll('img'));
        for (const img of imgs) {
          img.scrollIntoView({ block: 'center' });
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
        window.scrollTo(0, 0);
      });
      try {
        const element = page.locator(selector).first();
        await element.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await element.screenshot({
          path: path.join(OUT, `${name}-${viewport.tag}.jpg`),
          type: 'jpeg',
          quality: 82,
        });
      } catch (error) {
        failures.push(`${name}-${viewport.tag}: ${String(error.message).split('\n')[0]}`);
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}

fs.writeFileSync(path.join(OUT, 'capture-report.txt'), failures.length ? failures.join('\n') + '\n' : 'none\n');
console.log(`Gallery screenshots written to ${OUT}`);
console.log(`Capture problems: ${failures.length}`);
if (failures.length) {
  console.log(failures.join('\n'));
  process.exitCode = 1;
}
