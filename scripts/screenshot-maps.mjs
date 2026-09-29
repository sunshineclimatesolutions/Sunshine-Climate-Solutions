// Focused before/after captures of the service-area map assets (September 2026
// Gulf of America change order). Captures the full map on /service-area/ and
// the compact map on / at 390/768/1440 into
// docs/verification/screenshots/aesthetic/maps-<mode>/.
//
// Usage: run `npm run preview` first, then:
//   node scripts/screenshot-maps.mjs before
//   node scripts/screenshot-maps.mjs after
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const mode = process.argv[2] === 'after' ? 'after' : 'before';
const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const OUT = path.join('docs', 'verification', 'screenshots', 'aesthetic', `maps-${mode}`);
fs.mkdirSync(OUT, { recursive: true });

const targets = [
  ['/service-area/', '.service-map-full', 'service-area-map-full'],
  ['/service-area/', '.service-map-full img', 'service-area-map-full-img'],
  ['/', '.service-map-compact', 'home-compact-map'],
  ['/', '.service-map-compact img', 'home-compact-map-img'],
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
    // Keep the sticky consent banner out of element captures so the map
    // comparison is not obscured; block third-party analytics for determinism.
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
    await context.route('**://www.googletagmanager.com/**', (route) => route.fulfill({ status: 204, body: '' }));
    await context.route('**://cloud.umami.is/**', (route) => route.fulfill({ status: 204, body: '' }));

    const page = await context.newPage();
    for (const [route, selector, name] of targets) {
      await page.goto(BASE + route, { waitUntil: 'networkidle' });
      await page.evaluate(async () => {
        for (let y = 0; y <= document.body.scrollHeight; y += 500) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 40));
        }
        window.scrollTo(0, 0);
      });
      try {
        const element = page.locator(selector).first();
        await element.scrollIntoViewIfNeeded();
        if (selector.endsWith('img')) {
          await element.evaluate(
            (img) =>
              img.complete ||
              new Promise((resolve) => {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
              }),
          );
        }
        await page.waitForTimeout(250);
        await element.screenshot({
          path: path.join(OUT, `${name}-${viewport.tag}.jpg`),
          type: 'jpeg',
          quality: 85,
        });
        const box = await element.boundingBox();
        if (!box || box.width < 100 || box.height < 100) {
          failures.push(`${name}-${viewport.tag}: suspicious bounds ${JSON.stringify(box)}`);
        }
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
console.log(`Map screenshots (${mode}) written to ${OUT}`);
console.log(`Capture problems: ${failures.length}`);
if (failures.length) {
  console.log(failures.join('\n'));
  process.exitCode = 1;
}
