// DOM/layout verification for the September 2026 aesthetic overhaul + GA4/GTM
// build. Complements the screenshot set with machine checks for alignment
// invariants, typography, button sizing, image loading, overflow and console
// health at 390/768/1440.
//
// Usage: run `npm run preview` first, then: node scripts/verify-layout.mjs
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';

const routes = [
  '/', '/services/', '/services/ac-repair-diagnostics/', '/services/replacement-installation/',
  '/services/ac-maintenance/', '/services/airflow-ductwork/',
  '/services/commercial-service-maintenance/', '/tab-commissioning-support/', '/service-area/',
  '/service-area/spring-hill-fl/',
  '/about/', '/faq/', '/contact/', '/leave-review/', '/privacy/', '/thank-you/',
];

const viewports = [
  { width: 390, height: 844, tag: '390' },
  { width: 768, height: 1024, tag: '768' },
  { width: 1440, height: 900, tag: '1440' },
];

const failures = [];
const passes = [];
const check = (name, condition, detail = '') => {
  if (condition) passes.push(name);
  else {
    failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
    console.log(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
};

const browser = await chromium.launch();
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
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
    });
    const page = await context.newPage();
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    for (const route of routes) {
      const response = await page.goto(BASE + route, { waitUntil: 'networkidle' });
      // Native lazy-loading ignores instant window.scrollTo jumps; bring each
      // image through the viewport and wait for load/error before measuring.
      await page.evaluate(async () => {
        const imgs = Array.from(document.querySelectorAll('img'));
        const wait = (img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
                setTimeout(resolve, 4000);
              });
        for (const img of imgs) {
          img.scrollIntoView({ block: 'center' });
          await new Promise((resolve) => setTimeout(resolve, 60));
        }
        await Promise.all(imgs.map(wait));
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(150);

      const info = await page.evaluate(() => {
        const cols = (selector) => {
          const el = document.querySelector(selector);
          if (!el) return null;
          const value = getComputedStyle(el).gridTemplateColumns;
          return value === 'none' ? 0 : value.split(' ').filter(Boolean).length;
        };
        const imgs = Array.from(document.querySelectorAll('main img, footer img, header img'));
        const h1s = Array.from(document.querySelectorAll('h1'));
        const headings = Array.from(document.querySelectorAll('h1, h2, h3')).slice(0, 6);
        const buttons = Array.from(
          document.querySelectorAll('a.btn, button.btn, .ab-btn'),
        ).filter((el) => el.getClientRects().length > 0);
        const gold = document.querySelector('.btn--gold');
        const navy = document.querySelector('.btn--navy');
        const centered = document.querySelector('.page-hero-inner--center');
        const sectionPaddings = Array.from(document.querySelectorAll('.section')).map(
          (el) => getComputedStyle(el).paddingTop,
        );
        return {
          status: 0,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          h1Count: h1s.length,
          h1Text: h1s[0]?.textContent?.trim() ?? '',
          imgTotal: imgs.length,
          imgLoaded: imgs.filter((img) => img.complete && img.naturalWidth > 0).length,
          imgMissingAlt: imgs.filter((img) => !img.hasAttribute('alt')).length,
          visibleFieldErrors: Array.from(document.querySelectorAll('.field-error')).filter(
            (el) => el.getClientRects().length > 0,
          ).length,
          headingFonts: [...new Set(headings.map((el) => getComputedStyle(el).fontFamily.split(',')[0].replace(/"/g, '')))],
          bodyFont: getComputedStyle(document.body).fontFamily.split(',')[0].replace(/"/g, ''),
          minButtonHeight: buttons.length
            ? Math.min(...buttons.map((el) => Math.round(el.getBoundingClientRect().height)))
            : null,
          goldBg: gold ? getComputedStyle(gold).backgroundColor : null,
          navyBg: navy ? getComputedStyle(navy).backgroundColor : null,
          centeredTextAlign: centered ? getComputedStyle(centered).textAlign : null,
          uniqueSectionPadding: [...new Set(sectionPaddings)].length,
          gridSix: cols('.grid--six'),
          gridFour: cols('.grid--four'),
          areaList: cols('.area-list--two'),
          areaDuo: cols('.area-duo'),
          steps: cols('.steps'),
          gridSeven: cols('.grid--seven'),
        };
      });

      const label = `${route} @${viewport.tag}`;
      check(`${label}: HTTP 200`, (response?.status() ?? 0) === 200);
      check(
        `${label}: no horizontal overflow`,
        info.scrollWidth <= info.clientWidth + 1,
        `${info.scrollWidth} > ${info.clientWidth}`,
      );
      check(`${label}: exactly one h1`, info.h1Count === 1 && info.h1Text.length > 0);
      check(`${label}: every image has alt`, info.imgMissingAlt === 0, `${info.imgMissingAlt} missing`);
      check(
        `${label}: all images loaded`,
        info.imgTotal === 0 || info.imgLoaded === info.imgTotal,
        `${info.imgLoaded}/${info.imgTotal}`,
      );
      check(
        `${label}: headings use Archivo`,
        info.headingFonts.every((font) => font === 'Archivo'),
        info.headingFonts.join(','),
      );
      check(`${label}: body uses Public Sans`, info.bodyFont === 'Public Sans', info.bodyFont);
      check(
        `${label}: buttons >= 44px tall`,
        info.minButtonHeight === null || info.minButtonHeight >= 44,
        `${info.minButtonHeight}px`,
      );
      check(
        `${label}: consistent section padding`,
        info.uniqueSectionPadding <= 1,
        `${info.uniqueSectionPadding} unique`,
      );
      if (info.goldBg) {
        check(`${label}: gold button uses the token color`, info.goldBg === 'rgb(244, 182, 49)', info.goldBg);
      }
      if (info.navyBg) {
        check(`${label}: navy button uses the token color`, info.navyBg === 'rgb(45, 66, 86)', info.navyBg);
      }
      if (info.centeredTextAlign) {
        check(`${label}: centered page hero`, info.centeredTextAlign === 'center', info.centeredTextAlign);
      }
      check(`${label}: no page errors`, pageErrors.length === 0, pageErrors.join(' | '));

      if (route === '/') {
        const expectedSix = viewport.width >= 1024 ? 3 : viewport.width >= 640 ? 2 : 1;
        check(`home @${viewport.tag}: service cards ${expectedSix} columns`, info.gridSix === expectedSix, String(info.gridSix));
        const expectedFour = viewport.width >= 920 ? 4 : viewport.width >= 640 ? 2 : 1;
        check(`home @${viewport.tag}: diagnostics grid ${expectedFour} columns`, info.gridFour === expectedFour, String(info.gridFour));
        check(`home @${viewport.tag}: counties 2x2`, info.areaList === 2, String(info.areaList));
      }
      if (route === '/contact/') {
        check(
          `contact @${viewport.tag}: validation errors hidden before submit`,
          info.visibleFieldErrors === 0,
          `${info.visibleFieldErrors} visible`,
        );
      }
      if (route === '/services/') {
        const expectedSix = viewport.width >= 1024 ? 3 : viewport.width >= 640 ? 2 : 1;
        check(`services @${viewport.tag}: six-card grid ${expectedSix} columns`, info.gridSix === expectedSix, String(info.gridSix));
      }
      if (route === '/service-area/') {
        check(`service-area @${viewport.tag}: counties 2x2`, info.areaList === 2, String(info.areaList));
        const expectedDuo = viewport.width >= 768 ? 2 : 1;
        check(`service-area @${viewport.tag}: map duo ${expectedDuo} columns`, info.areaDuo === expectedDuo, String(info.areaDuo));
      }
      if (route === '/tab-commissioning-support/' || route === '/thank-you/') {
        const expectedSteps = viewport.width >= 640 ? 2 : 1;
        check(`${route} @${viewport.tag}: steps ${expectedSteps} columns`, info.steps === expectedSteps, String(info.steps));
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`\n== RESULT ==`);
console.log(`${passes.length}/${passes.length + failures.length} layout checks passed`);
if (failures.length) {
  console.log('FAILURES:\n' + failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('ALL LAYOUT CHECKS PASSED');
}
