// Section-level screenshots of the proof/brand/map/TAB/conditions sections at
// 360 and 1440 px — the close-ups used for owner visual review.
// Usage: run `npm run preview` first, then:
//   node scripts/screenshot-sections.mjs
// Output: docs/verification/screenshots/sections/
import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const OUT = 'docs/verification/screenshots/sections';
fs.mkdirSync(OUT, { recursive: true });

const shots = [
  ['/', 'section[aria-labelledby="home-proof-heading"]', 'home-proof'],
  ['/', 'section[aria-labelledby="cta-maintenance-heading"]', 'home-maintenance'],
  ['/', '.brand-strip', 'home-brands'],
  ['/', '.footer-brand', 'footer-brand'],
  ['/contact/', '.social-links', 'contact-social'],
  ['/leave-review/', '.review-card', 'leave-review-cta'],
  ['/leave-review/', '.review-social', 'leave-review-social'],
  ['/', '.service-map-compact', 'home-compact-map'],
  ['/service-area/', '.map-band', 'service-area-map'],
  ['/tab-commissioning-support/', '.tab-visuals', 'tab-visuals'],
  ['/faq/', 'section[aria-labelledby="conditions-heading"]', 'faq-conditions'],
];

const browser = await chromium.launch();
for (const width of [360, 1440]) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  // Skip-link capture artifact guard (see screenshot.mjs for rationale).
  await context.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style');
      style.textContent = '.skip-link{display:none !important}';
      document.head.appendChild(style);
    });
  });
  const page = await context.newPage();
  for (const [url, selector, name] of shots) {
    await page.goto(BASE + url, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      for (let y = 0; y <= document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
    try {
      const el = page.locator(selector).first();
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(350);
      await el.screenshot({ path: `${OUT}/${name}-${width}.jpg`, type: 'jpeg', quality: 80 });
      console.log(`${name}-${width}.jpg written`);
    } catch (error) {
      console.log(`SKIP ${name}-${width}: ${String(error.message).split('\n')[0]}`);
    }
  }
  await context.close();
}
await browser.close();
console.log('Section screenshots complete.');
