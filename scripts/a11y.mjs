// Accessibility scan (axe-core) across key routes at mobile and desktop widths.
// Usage: node scripts/a11y.mjs  (requires: npm i -D playwright @axe-core/playwright)
// Env: BASE_URL (default http://localhost:4321), OUT_DIR (default docs/verification)
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const OUT = process.env.OUT_DIR ?? path.join('docs', 'verification');
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
  { width: 390, height: 844, tag: 'mobile' },
  { width: 1280, height: 800, tag: 'desktop' },
];

const browser = await chromium.launch();
const report = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    for (const item of pages) {
      await page.goto(BASE + item.path, { waitUntil: 'networkidle' });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
        .analyze();
      report.push({
        page: item.name,
        viewport: viewport.tag,
        violations: results.violations.map((violation) => ({
          id: violation.id,
          impact: violation.impact,
          help: violation.help,
          nodes: violation.nodes.length,
          tags: violation.tags.filter((tag) => tag.startsWith('wcag')),
        })),
      });
      const count = results.violations.length;
      console.log(`${viewport.tag} ${item.name}: ${count} violation group(s)`);
    }
    await context.close();
  }
} finally {
  await browser.close();
}

const allViolations = report.flatMap((entry) => entry.violations);
const summary = {
  scanned: report.length,
  totalViolationGroups: allViolations.length,
  byRule: {},
};
for (const violation of allViolations) {
  summary.byRule[violation.id] = (summary.byRule[violation.id] ?? 0) + 1;
}

fs.writeFileSync(path.join(OUT, 'a11y-report.json'), JSON.stringify({ report, summary }, null, 2));
console.log('---');
console.log(JSON.stringify(summary, null, 2));
