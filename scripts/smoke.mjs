// Quick smoke test: home + contact pages at mobile and desktop widths.
// Usage: node scripts/smoke.mjs   (requires: npm i && npx playwright install chromium)
// Env: BASE_URL (default http://localhost:4321)
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';

const check = async (page, url) => {
  const response = await page.goto(url, { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const overflowX = document.documentElement.scrollWidth - document.documentElement.clientWidth;
    const stripCall = document.querySelector('.strip-call');
    const stripBox = stripCall?.getBoundingClientRect();
    const bar = document.querySelector('[data-action-bar]');
    const barBox = bar?.getBoundingClientRect();
    return {
      overflowX,
      stripVisible: Boolean(stripBox && stripBox.height > 40 && stripBox.bottom > 0),
      actionBarButtons: bar ? bar.querySelectorAll('a').length : 0,
      actionBarHeight: barBox ? Math.round(barBox.height) : 0,
      telLinks: document.querySelectorAll('a[href^="tel:"]').length,
      smsLinks: document.querySelectorAll('a[href^="sms:"]').length,
      h1: document.querySelector('h1')?.textContent?.trim() ?? null,
      bodyPaddingBottom: getComputedStyle(document.body).paddingBottom,
    };
  });
  return { status: response?.status() ?? 0, data };
};

const browser = await chromium.launch();
const failures = [];
try {
  for (const width of [360, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 800 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    const home = await check(page, `${BASE}/`);
    const contact = await check(page, `${BASE}/contact/`);

    console.log(`\n== viewport ${width}px ==`);
    console.log('home:', JSON.stringify(home));
    console.log('contact:', JSON.stringify(contact));
    console.log('page errors:', errors.length ? errors : 'none');

    for (const [name, result] of [
      ['home', home],
      ['contact', contact],
    ]) {
      if (result.status !== 200) failures.push(`${width} ${name}: HTTP ${result.status}`);
      if (result.data.overflowX > 0) failures.push(`${width} ${name}: horizontal overflow ${result.data.overflowX}px`);
      if (width === 360) {
        if (!result.data.stripVisible) failures.push(`${width} ${name}: contact strip not visible`);
        if (result.data.actionBarButtons !== 3) failures.push(`${width} ${name}: action bar buttons != 3`);
        if (result.data.actionBarHeight < 48) failures.push(`${width} ${name}: action bar shorter than 48px`);
      }
      if (result.data.telLinks < 2) failures.push(`${width} ${name}: tel links missing`);
    }
    if (errors.length) failures.push(`${width}: page errors: ${errors.join(' | ')}`);

    // Mobile: form validation + sticky bar keyboard behavior
    if (width === 360) {
      const page2 = await context.newPage();
      await page2.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
      const form = page2.locator('#service-request-form');
      if ((await form.count()) !== 1) failures.push('360 contact: form not rendered');
      await page2.click('button[type="submit"]');
      await page2.waitForTimeout(300);
      const errCount = await page2.locator('.field-error:not([hidden])').count();
      if (errCount < 4) failures.push(`360 contact: expected >=4 visible field errors, got ${errCount}`);
      const phoneInput = page2.locator('#f-phone');
      await phoneInput.focus();
      await page2.waitForTimeout(150);
      const kbHidden = await page2.evaluate(() => {
        const bar = document.querySelector('[data-action-bar]');
        return bar?.getAttribute('data-keyboard') === 'open';
      });
      if (!kbHidden) failures.push('360 contact: action bar did not hide on input focus');
      const menu = page2.locator('[data-nav-toggle]');
      await menu.click();
      await page2.waitForTimeout(300);
      const expanded = await menu.getAttribute('aria-expanded');
      if (expanded !== 'true') failures.push('360: mobile nav did not open');
      const panelVisible = await page2.evaluate(() => {
        const panel = document.getElementById('mobile-nav');
        return panel && !panel.hidden && panel.getBoundingClientRect().height > 100;
      });
      if (!panelVisible) failures.push('360: mobile nav panel not visible');
      await page2.keyboard.press('Escape');
      await page2.waitForTimeout(200);
      const closed = await menu.getAttribute('aria-expanded');
      if (closed !== 'false') failures.push('360: mobile nav did not close on Escape');
    }
    await context.close();
  }
} finally {
  await browser.close();
}

console.log('\n== RESULT ==');
if (failures.length) {
  console.log('FAILURES:\n' + failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('ALL SMOKE CHECKS PASSED');
}
