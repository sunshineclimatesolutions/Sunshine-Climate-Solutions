// Offer popup verification — behavior, accessibility, responsive layout,
// analytics integration and the offer claim flow through the existing request
// form. Run `npm run preview` first, then:
//   node scripts/verify-popup.mjs
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const failures = [];
const check = (name, condition, detail = '') => {
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch();

const newContext = async (viewport, { consent = null, recordUmami = false } = {}) => {
  const context = await browser.newContext({ viewport });
  await context.route('**://www.googletagmanager.com/**', (route) => route.fulfill({ status: 204, body: '' }));
  await context.route('**://cloud.umami.is/**', (route) => route.fulfill({ status: 204, body: '' }));
  const init = (choice) => {
    try {
      if (choice !== null) {
        window.localStorage.setItem('scs-consent-v1', JSON.stringify({ analytics: choice, v: 1 }));
      }
      window.umami = {
        track(name) {
          window.__umamiEvents = window.__umamiEvents || [];
          window.__umamiEvents.push(name);
        },
      };
    } catch {
      /* ignore */
    }
  };
  if (consent !== null || recordUmami) await context.addInitScript(init, consent);
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  return { context, page, pageErrors };
};

const eventNames = (page) =>
  page.evaluate(() =>
    (window.dataLayer || [])
      .filter((entry) => entry && typeof entry === 'object' && typeof entry.event === 'string')
      .map((entry) => entry.event),
  );
const umamiEvents = (page) => page.evaluate(() => window.__umamiEvents || []);
const popupOpen = (page) => page.evaluate(() => document.getElementById('offer-popup')?.open === true);

try {
  // ── 1. No immediate interruption; hidden until opened ──────────────────────
  {
    const { context, page, pageErrors } = await newContext({ width: 1440, height: 900 });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    check('popup does not open on page load', !(await popupOpen(page)));
    const closedState = await page.evaluate(() => {
      const dialog = document.getElementById('offer-popup');
      return { exists: Boolean(dialog), display: dialog ? getComputedStyle(dialog).display : null };
    });
    check('popup exists in the DOM and is display:none while closed', closedState.exists && closedState.display === 'none', JSON.stringify(closedState));
    check('no browser errors on load', pageErrors.length === 0, pageErrors.join(' | '));
    await context.close();
  }

  // ── 2. Open (QA hook), Escape close, focus return, once-per-session ────────
  {
    const { context, page } = await newContext({ width: 1440, height: 900 });
    await page.goto(`${BASE}/?popup=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#offer-popup[open]', { timeout: 5000 });
    check('popup opens via the QA delay hook', await popupOpen(page));
    const controls = await page.evaluate(() => {
      const cta = document.querySelector('[data-offer-cta]');
      const close = document.querySelector('[data-offer-close]');
      return {
        ctaText: cta?.textContent?.trim().replace(/\s+/g, ' ') ?? '',
        closeHeight: close ? Math.round(close.getBoundingClientRect().height) : 0,
        ctaHeight: cta ? Math.round(cta.getBoundingClientRect().height) : 0,
        heading: document.getElementById('offer-popup-heading')?.textContent?.trim() ?? '',
      };
    });
    check('CTA carries the offer text', controls.ctaText === 'Claim 10% Off', controls.ctaText);
    check('heading matches the approved offer', controls.heading === 'Get 10% Off Your First Service Call', controls.heading);
    check('close control is at least 44px', controls.closeHeight >= 44, `${controls.closeHeight}px`);
    check('CTA is at least 44px tall', controls.ctaHeight >= 44, `${controls.ctaHeight}px`);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    check('Escape closes the popup', !(await popupOpen(page)));
    const focusReturned = await page.evaluate(
      () => !document.getElementById('offer-popup')?.contains(document.activeElement),
    );
    check('focus is not trapped inside after closing', focusReturned);
    const sessionState = await page.evaluate(() => window.sessionStorage.getItem('scs-offer-popup'));
    check('dismissal is recorded for the session', sessionState === 'dismissed', String(sessionState));

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    check('popup does not reopen in the same session after dismissal', !(await popupOpen(page)));
    await context.close();
  }

  // ── 3. Backdrop click closes ───────────────────────────────────────────────
  {
    const { context, page } = await newContext({ width: 1440, height: 900 });
    await page.goto(`${BASE}/?popup=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#offer-popup[open]', { timeout: 5000 });
    await page.mouse.click(4, 4);
    await page.waitForTimeout(200);
    check('backdrop click closes the popup', !(await popupOpen(page)));
    await context.close();
  }

  // ── 4. Suppressed on conversion pages ──────────────────────────────────────
  {
    const { context, page } = await newContext({ width: 390, height: 844 });
    await page.goto(`${BASE}/contact/?popup=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    check('popup is suppressed on /contact/', !(await popupOpen(page)));
    await context.close();
  }

  // ── 6. Offer claim flow through the existing request form ─────────────────
  {
    const { context, page } = await newContext({ width: 390, height: 844 });
    await context.route('https://api.web3forms.com/submit', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'ok' }),
      }),
    );
    const submissions = [];
    page.on('request', (request) => {
      if (request.url().includes('api.web3forms.com')) {
        try {
          submissions.push(request.postDataJSON());
        } catch {
          /* ignore */
        }
      }
    });
    await page.goto(`${BASE}/?popup=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#offer-popup[open]', { timeout: 5000 });
    await page.click('[data-offer-cta]');
    await page.waitForURL('**/contact/?offer=FIRST10#request-form', { timeout: 10000 });
    check('CTA lands on the existing request form with the offer id', page.url().includes('/contact/?offer=FIRST10#request-form'), page.url());

    const note = await page.evaluate(() => {
      const el = document.querySelector('[data-offer-note]');
      return { hidden: el?.hidden ?? true, text: el?.textContent?.trim() ?? '' };
    });
    check('claim acknowledgement is visible on the form', !note.hidden && note.text.includes('10% off your first service call'), JSON.stringify(note));

    await page.evaluate(() => {
      const set = (id, value) => {
        const el = document.getElementById(id);
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      set('f-name', 'Popup Verification');
      set('f-phone', '7270000000');
      set('f-zip', '34609');
      set('f-desc', 'Automated popup verification submission.');
      const service = document.getElementById('f-service');
      service.value = 'AC repair / diagnostic';
      service.dispatchEvent(new Event('change', { bubbles: true }));
      document.getElementById('service-request-form').requestSubmit();
    });
    await page.waitForTimeout(1500);
    check('offer submission delivers exactly one provider request', submissions.length === 1, String(submissions.length));
    check(
      'submission carries the offer claim',
      submissions[0]?.['Offer Claimed'] === '10% Off Your First Service Call (FIRST10)',
      String(submissions[0]?.['Offer Claimed']),
    );
    const receipt = await page.evaluate(() => {
      try {
        return JSON.parse(window.sessionStorage.getItem('scs-lead-receipt') || 'null');
      } catch {
        return null;
      }
    });
    check('confirmed-lead receipt marks the popup as the cta slot', receipt?.cta_slot === 'popup-first10', JSON.stringify(receipt));
    await context.close();
  }

  // ── 7. Analytics: consent granted ──────────────────────────────────────────
  {
    const { context, page } = await newContext({ width: 1440, height: 900 }, { consent: true, recordUmami: true });
    await page.goto(`${BASE}/?popup=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#offer-popup[open]', { timeout: 5000 });
    const viewEvents = await eventNames(page);
    check('view event pushed after consent (scs_popup_view)', viewEvents.includes('scs_popup_view'));
    check('Umami records popup-view', (await umamiEvents(page)).includes('popup-view'));
    await page.click('[data-offer-close]');
    await page.waitForTimeout(200);
    const dismissEvents = await eventNames(page);
    check('dismiss event pushed after consent (scs_popup_dismiss)', dismissEvents.includes('scs_popup_dismiss'));
    check('Umami records popup-dismiss', (await umamiEvents(page)).includes('popup-dismiss'));
    await context.close();
  }
  {
    const { context, page } = await newContext({ width: 1440, height: 900 }, { consent: true, recordUmami: true });
    await page.goto(`${BASE}/?popup=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#offer-popup[open]', { timeout: 5000 });
    // Hold the page so the stubbed event arrays survive the click (the real
    // CTA navigates; the event push itself is what this scenario verifies).
    await page.evaluate(() => {
      document.addEventListener(
        'click',
        (event) => {
          if (event.target instanceof Element && event.target.closest('[data-offer-cta]')) {
            event.preventDefault();
          }
        },
        { capture: true },
      );
    });
    await page.click('[data-offer-cta]');
    await page.waitForTimeout(400);
    const clickEvents = await eventNames(page);
    check('CTA click event pushed after consent (scs_popup_cta_click)', clickEvents.includes('scs_popup_cta_click'));
    check('Umami records popup-cta-click', (await umamiEvents(page)).includes('popup-cta-click'));
    await context.close();
  }

  // ── 8. Analytics: no consent — Umami only, no GTM events ──────────────────
  {
    const { context, page } = await newContext({ width: 1440, height: 900 }, { recordUmami: true });
    await page.goto(`${BASE}/?popup=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#offer-popup[open]', { timeout: 5000 });
    const names = await eventNames(page);
    check('no popup events in the data layer before consent', !names.some((name) => name.startsWith('scs_popup_')));
    check('Umami still records popup-view without consent', (await umamiEvents(page)).includes('popup-view'));
    await context.close();
  }

  // ── 9. Mobile layout ───────────────────────────────────────────────────────
  for (const viewport of [
    { width: 320, height: 568, tag: '320' },
    { width: 375, height: 667, tag: '375' },
    { width: 390, height: 844, tag: '390' },
    { width: 430, height: 932, tag: '430' },
  ]) {
    const { context, page, pageErrors } = await newContext({ width: viewport.width, height: viewport.height });
    await page.goto(`${BASE}/?popup=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#offer-popup[open]', { timeout: 5000 });
    const layout = await page.evaluate(() => {
      const dialog = document.getElementById('offer-popup');
      const cta = document.querySelector('[data-offer-cta]');
      const close = document.querySelector('[data-offer-close]');
      const copy = document.querySelector('.offer-popup-copy');
      const rect = dialog.getBoundingClientRect();
      const ctaRect = cta.getBoundingClientRect();
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        dialogLeft: Math.round(rect.left),
        dialogRight: Math.round(rect.right),
        dialogHeight: Math.round(rect.height),
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        ctaVisible: ctaRect.top >= 0 && ctaRect.bottom <= window.innerHeight,
        ctaHeight: Math.round(ctaRect.height),
        closeHeight: Math.round(close.getBoundingClientRect().height),
        copyFontSize: parseFloat(getComputedStyle(copy).fontSize),
      };
    });
    check(`@${viewport.tag}: no horizontal overflow`, layout.overflow <= 1, `${layout.overflow}px`);
    check(`@${viewport.tag}: dialog fits the viewport width`, layout.dialogLeft >= 0 && layout.dialogRight <= layout.viewportWidth, JSON.stringify(layout));
    check(`@${viewport.tag}: dialog does not exceed the viewport height`, layout.dialogHeight <= layout.viewportHeight, `${layout.dialogHeight}/${layout.viewportHeight}`);
    check(`@${viewport.tag}: CTA is visible without scrolling`, layout.ctaVisible);
    check(`@${viewport.tag}: CTA >= 44px and close >= 44px`, layout.ctaHeight >= 44 && layout.closeHeight >= 44, JSON.stringify(layout));
    check(`@${viewport.tag}: copy font size >= 14px`, layout.copyFontSize >= 14, `${layout.copyFontSize}px`);
    check(`@${viewport.tag}: no browser errors`, pageErrors.length === 0, pageErrors.join(' | '));
    await context.close();
  }

  // ── 10. Accessibility (axe, popup open) ────────────────────────────────────
  for (const viewport of [
    { width: 390, height: 844, tag: 'mobile' },
    { width: 1440, height: 900, tag: 'desktop' },
  ]) {
    const { context, page } = await newContext({ width: viewport.width, height: viewport.height });
    await page.goto(`${BASE}/?popup=1`, { waitUntil: 'networkidle' });
    await page.waitForSelector('#offer-popup[open]', { timeout: 5000 });
    const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
    const detail = results.violations.map((v) => `${v.id} (${v.nodes.length})`).join(', ');
    check(`axe scan with popup open @${viewport.tag}: 0 violations`, results.violations.length === 0, detail);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`\n${failures.length ? `FAILURES:\n${failures.join('\n')}` : 'ALL POPUP CHECKS PASSED'}`);
if (failures.length) process.exitCode = 1;
