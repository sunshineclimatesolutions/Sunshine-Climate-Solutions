// Screenshot verification: key pages at 360 / 768 / 1440 widths.
// Usage: node scripts/screenshot.mjs  (requires: npm i -D playwright && npx playwright install chromium)
// Env: BASE_URL (default http://localhost:4321), OUT_DIR (default docs/verification/screenshots)
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const OUT = process.env.OUT_DIR ?? path.join('docs', 'verification', 'screenshots');
fs.mkdirSync(OUT, { recursive: true });

const pages = [
  { name: 'home', path: '/' },
  { name: 'services', path: '/services/' },
  { name: 'service-ac-repair', path: '/services/ac-repair-diagnostics/' },
  { name: 'tab', path: '/tab-commissioning-support/' },
  { name: 'service-area', path: '/service-area/' },
  { name: 'about', path: '/about/' },
  { name: 'faq', path: '/faq/' },
  { name: 'contact', path: '/contact/' },
  { name: 'privacy', path: '/privacy/' },
  { name: 'thank-you', path: '/thank-you/' },
  { name: 'not-found', path: '/this-page-does-not-exist' },
];

const viewports = [
  { width: 360, height: 800, tag: '360' },
  { width: 768, height: 1024, tag: '768' },
  { width: 1440, height: 900, tag: '1440' },
];

// Committed set: mobile-focused coverage plus representative desktop/tablet.
const commit = new Set([
  'home-360', 'home-768', 'home-1440',
  'contact-360', 'contact-768', 'contact-1440',
  'service-ac-repair-360',
  'tab-360',
  'faq-360',
  'about-1440',
  'not-found-360',
]);

const consoleErrors = [];

const browser = await chromium.launch();

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      isMobile: viewport.width < 500,
      hasTouch: viewport.width < 500,
    });
    const page = await context.newPage();
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(`${viewport.tag}: ${page.url()} — ${message.text()}`);
    });
    page.on('pageerror', (error) => consoleErrors.push(`${viewport.tag}: ${page.url()} — ${error.message}`));

    for (const item of pages) {
      const key = `${item.name}-${viewport.tag}`;
      const response = await page.goto(BASE + item.path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(250);
      const status = response?.status() ?? 0;
      if (item.name === 'not-found' && status !== 404) {
        consoleErrors.push(`${key}: expected 404 status, got ${status}`);
      }
      if (item.name !== 'not-found' && status >= 400) {
        consoleErrors.push(`${key}: HTTP ${status}`);
      }
      const file = path.join(OUT, `${key}.jpg`);
      await page.screenshot({
        path: file,
        fullPage: viewport.width === 360,
        type: 'jpeg',
        quality: 72,
      });
      if (!commit.has(key)) fs.rmSync(file, { force: true });
    }

    // Special states on mobile
    if (viewport.width === 360) {
      // Mobile navigation open state
      await page.goto(BASE + '/', { waitUntil: 'networkidle' });
      await page.click('[data-nav-toggle]');
      await page.waitForTimeout(350);
      await page.screenshot({
        path: path.join(OUT, 'menu-open-360.jpg'),
        type: 'jpeg',
        quality: 72,
      });

      // Form validation errors state
      await page.goto(BASE + '/contact/', { waitUntil: 'networkidle' });
      await page.click('button[type="submit"]');
      await page.waitForTimeout(350);
      await page.screenshot({
        path: path.join(OUT, 'contact-360-errors.jpg'),
        fullPage: true,
        type: 'jpeg',
        quality: 72,
      });
    }

    await context.close();
  }
} finally {
  await browser.close();
}

console.log('Console/page errors captured:');
console.log(consoleErrors.length ? consoleErrors.join('\n') : '  none');
fs.writeFileSync(
  path.join(OUT, 'console-errors.txt'),
  consoleErrors.length ? consoleErrors.join('\n') + '\n' : 'none\n',
);
