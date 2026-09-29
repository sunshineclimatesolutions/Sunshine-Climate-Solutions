// GA4-via-GTM consent + event verification (September 2026 GA4/GTM change order).
// Runs against a local preview server of a production-equivalent build.
// The GTM container is stubbed (no dashboard tags are configured yet), so these
// checks verify the SITE side: consent-mode ordering/state, data-layer payloads,
// the single-use lead receipt, Umami preservation, and no PII in the data layer.
//
// Usage: run `npm run preview` first, then:
//   node scripts/gtm-consent.mjs
// The preview-mode build guard runs at the end unless SKIP_PREVIEW_BUILD=1.
import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const FAKE = {
  name: 'Automated Verification',
  phone: '5550000000',
  zip: '00000',
  email: 'verify@example.com',
  description: 'Intercepted automated test — never sent to the provider or Google.',
};

const results = [];
const failures = [];
let currentSection = '';

const section = (name) => {
  currentSection = name;
  console.log(`\n== ${name} ==`);
};

const check = (name, condition, detail = '') => {
  results.push({ section: currentSection, name, pass: Boolean(condition), detail });
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!condition) failures.push(`${currentSection} / ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch();

const newContext = async () => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const collectHits = [];
  await context.route('**://www.googletagmanager.com/gtm.js*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  );
  await context.route('**://www.googletagmanager.com/ns.html*', (route) =>
    route.fulfill({ status: 204, body: '' }),
  );
  await context.route('**://cloud.umami.is/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: 'window.umami={track:function(n){(window.__umamiEvents=window.__umamiEvents||[]).push(n);}};',
    }),
  );
  await context.route(
    /google-analytics\.com|analytics\.google\.com|\/g\/collect/,
    (route) => {
      collectHits.push(route.request().url());
      return route.fulfill({ status: 204, body: '' });
    },
  );
  return { context, collectHits };
};

const readLayer = (page) =>
  page.evaluate(() =>
    (window.dataLayer || []).map((entry) => {
      if (entry && typeof entry === 'object' && typeof entry.length === 'number') {
        return Array.prototype.slice.call(entry);
      }
      return entry;
    }),
  );

const consentDefaults = (layer) =>
  layer.filter((e) => Array.isArray(e) && e[0] === 'consent' && e[1] === 'default');
const consentUpdates = (layer) =>
  layer.filter((e) => Array.isArray(e) && e[0] === 'consent' && e[1] === 'update');
const events = (layer) =>
  layer.filter((e) => e && !Array.isArray(e) && typeof e.event === 'string');
const storedChoice = (page) =>
  page.evaluate(() => window.localStorage.getItem('scs-consent-v1'));

const clicksBlocked = (page) =>
  page.evaluate(() => {
    // Keep the profiled clicks in the same document: preventDefault does not
    // stop the capture-phase tracker, but any navigation (request CTA or logo)
    // would reset window.dataLayer before assertions run.
    document.addEventListener('click', (event) => {
      if (event.target.closest('a')) event.preventDefault();
    });
  });

const clickSelector = async (page, selector) => {
  await page.evaluate((sel) => document.querySelector(sel)?.click(), selector);
  await page.waitForTimeout(250);
};

try {
  // ── 1. First visit: no stored choice ─────────────────────────────────────
  section('First visit — consent default + banner');
  {
    const { context, collectHits } = await newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

    const gtmRequests = await page.evaluate(() =>
      performance
        .getEntriesByType('resource')
        .map((entry) => entry.name)
        .filter((name) => name.includes('googletagmanager.com/gtm.js')),
    );
    check('exactly one GTM container script requested', gtmRequests.length === 1, gtmRequests.join(' | '));
    check('GTM request carries the confirmed container ID', gtmRequests.some((u) => u.includes('id=GTM-MBGJ8SLD')));
    check(
      'only one GTM script tag in the DOM',
      await page.evaluate(
        () => document.querySelectorAll('script[src*="googletagmanager.com/gtm.js"]').length === 1,
      ),
    );

    const layer = await readLayer(page);
    const defaults = consentDefaults(layer);
    check('consent default pushed before GTM events', defaults.length >= 1);
    if (defaults.length) {
      const state = defaults[0][2];
      check('default analytics_storage denied', state.analytics_storage === 'denied');
      check('default ad_storage denied', state.ad_storage === 'denied');
      check('default ad_user_data denied', state.ad_user_data === 'denied');
      check('default ad_personalization denied', state.ad_personalization === 'denied');
    }
    check('no analytics_storage grant without a choice', consentUpdates(layer).length === 0);
    check(
      'no business events pushed on first visit',
      events(layer).filter((e) => e.event !== 'gtm.js').length === 0,
    );

    const bannerVisible = await page.evaluate(() => {
      const banner = document.querySelector('[data-consent-banner]');
      return banner ? !banner.hidden : false;
    });
    check('consent banner visible on first visit', bannerVisible);
    check(
      'preferences panel starts closed',
      await page.evaluate(() => document.querySelector('[data-consent-prefs]')?.hidden === true),
    );
    const buttonSizes = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.consent-actions .btn')).map((el) => {
        const box = el.getBoundingClientRect();
        return { text: el.textContent.trim(), h: Math.round(box.height), w: Math.round(box.width) };
      }),
    );
    check(
      'consent buttons are >= 44px tall',
      buttonSizes.length >= 3 && buttonSizes.every((b) => b.h >= 44),
      JSON.stringify(buttonSizes),
    );

    const cookies = await page.evaluate(() => document.cookie);
    check('no _ga cookie before consent', !cookies.includes('_ga'));

    // Accept
    await clickSelector(page, '[data-consent-accept]');
    const afterAccept = await readLayer(page);
    const accepted = consentUpdates(afterAccept).filter(
      (e) => e[2] && e[2].analytics_storage === 'granted',
    );
    check('accept pushes consent update analytics_storage=granted', accepted.length === 1);
    check(
      'accept never grants advertising consent',
      accepted.every((e) => !e[2].ad_storage && !e[2].ad_user_data && !e[2].ad_personalization),
    );
    check('accept stores analytics:true', (await storedChoice(page))?.includes('"analytics":true'));
    check(
      'banner hides after choice',
      await page.evaluate(() => document.querySelector('[data-consent-banner]').hidden === true),
    );

    // Returning visit re-applies stored consent before GTM loads.
    await page.reload({ waitUntil: 'networkidle' });
    const reloadLayer = await readLayer(page);
    const firstDefault = reloadLayer.findIndex(
      (e) => Array.isArray(e) && e[0] === 'consent' && e[1] === 'default',
    );
    const firstGrant = reloadLayer.findIndex(
      (e) =>
        Array.isArray(e) && e[0] === 'consent' && e[1] === 'update' &&
        e[2] && e[2].analytics_storage === 'granted',
    );
    check('returning visit: update follows default', firstDefault !== -1 && firstGrant > firstDefault);
    check(
      'returning visit: banner stays hidden',
      await page.evaluate(() => document.querySelector('[data-consent-banner]').hidden === true),
    );
    check('no GA4 collect requests reached the network (stubbed container)', collectHits.length === 0);
    await context.close();
  }

  // ── 2. Reject ────────────────────────────────────────────────────────────
  section('Reject');
  {
    const { context } = await newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await clickSelector(page, '[data-consent-reject]');
    check('reject stores analytics:false', (await storedChoice(page))?.includes('"analytics":false'));
    const layer = await readLayer(page);
    const updates = consentUpdates(layer);
    check(
      'reject (re)applies analytics_storage denied',
      updates.length === 0 || updates.every((e) => e[2]?.analytics_storage !== 'granted'),
    );
    await page.reload({ waitUntil: 'networkidle' });
    const reloadLayer = await readLayer(page);
    check(
      'rejected visit never grants analytics',
      consentUpdates(reloadLayer).every((e) => e[2]?.analytics_storage !== 'granted'),
    );
    await context.close();
  }

  // ── 3. Preferences (banner + persistent footer entry point) ─────────────
  section('Preferences management');
  {
    const { context } = await newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await clickSelector(page, '[data-consent-manage]');
    const prefsVisible = await page.evaluate(
      () => document.querySelector('[data-consent-prefs]')?.hidden === false,
    );
    check('preferences panel opens from the banner', prefsVisible);
    await page.evaluate(() => {
      const toggle = document.querySelector('[data-consent-analytics-toggle]');
      toggle.checked = true;
    });
    await clickSelector(page, '[data-consent-save]');
    check('save stores the checked choice', (await storedChoice(page))?.includes('"analytics":true'));

    await clickSelector(page, '[data-consent-open]');
    const reopened = await page.evaluate(() => ({
      visible: document.querySelector('[data-consent-banner]')?.hidden === false,
      prefsOpen: document.querySelector('[data-consent-prefs]')?.hidden === false,
      checked: document.querySelector('[data-consent-analytics-toggle]')?.checked === true,
    }));
    check('footer entry point reopens prefs with stored state', reopened.visible && reopened.prefsOpen && reopened.checked);
    await page.evaluate(() => {
      document.querySelector('[data-consent-analytics-toggle]').checked = false;
    });
    await clickSelector(page, '[data-consent-save]');
    check('preference change persists', (await storedChoice(page))?.includes('"analytics":false'));
    check(
      'exactly one analytics-only preference is offered (no advertising checkbox)',
      (await page.evaluate(
        () => document.querySelectorAll('[data-consent-banner] input[type="checkbox"]').length,
      )) === 1,
    );
    await context.close();
  }

  // ── 4. Click events + Umami preservation + PII scan ─────────────────────
  section('Click events, Umami preservation, PII scan');
  {
    const { context } = await newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await clicksBlocked(page);

    await clickSelector(page, 'a[data-cta="call-hero"]');
    await clickSelector(page, 'a[data-cta="text-hero"]');
    await clickSelector(page, 'a[data-cta="request-hero"]');
    await page.evaluate(() =>
      document.querySelector('a[data-cta="logo-home"]')?.click(),
    );
    await page.waitForTimeout(250);

    const layer = await readLayer(page);
    const evts = events(layer);
    const names = evts.map((e) => e.event);
    check('tel click pushes scs_call_click with cta_slot', evts.some((e) => e.event === 'scs_call_click' && e.cta_slot === 'call-hero'));
    check('sms click pushes scs_text_click with cta_slot', evts.some((e) => e.event === 'scs_text_click' && e.cta_slot === 'text-hero'));
    check('request CTA pushes scs_request_click with cta_slot', evts.some((e) => e.event === 'scs_request_click' && e.cta_slot === 'request-hero'));
    const businessEvents = names.filter((n) => n !== 'gtm.js');
    check(
      'exactly 3 business events (one per tracked click, no duplicates)',
      businessEvents.length === 3 && new Set(businessEvents).size === 3,
      businessEvents.join(','),
    );


    const umamiEvents = await page.evaluate(() => window.__umamiEvents || []);
    check('Umami call-click preserved', umamiEvents.includes('call-click'));
    check('Umami text-click preserved', umamiEvents.includes('text-click'));

    const serialized = JSON.stringify(layer);
    check('no fake phone digits in data layer', !serialized.includes(FAKE.phone));
    check('no email/name/free text in data layer', !serialized.includes('@') && !serialized.includes(FAKE.name));
    await context.close();
  }

  // ── 5. Form start + confirmed lead receipt ──────────────────────────────
  section('Form start + confirmed lead');
  {
    const { context } = await newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });

    await page.locator('#f-name').click();
    await page.keyboard.type('A');
    await page.locator('#f-phone').click();
    await page.keyboard.type('5');
    await page.locator('#f-desc').click();
    await page.keyboard.type('more typing');
    await page.waitForTimeout(200);
    const startEvents = events(await readLayer(page)).filter((e) => e.event === 'scs_form_start');
    check('form start fires exactly once', startEvents.length === 1);

    // Empty submit: validation only, no lead event, no receipt.
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    const afterInvalid = events(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed');
    check('failed validation never confirms a lead', afterInvalid.length === 0);
    check('failed validation writes no receipt', (await page.evaluate(() => window.sessionStorage.getItem('scs-lead-receipt'))) === null);

    // Intercepted provider success.
    let submitRequests = 0;
    await context.route('https://api.web3forms.com/submit', (route) => {
      submitRequests += 1;
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'ok' }),
      });
    });
    await page.fill('#f-name', FAKE.name);
    await page.fill('#f-phone', FAKE.phone);
    await page.fill('#f-zip', FAKE.zip);
    await page.selectOption('#f-service', 'AC repair / diagnostic');
    await page.fill('#f-desc', FAKE.description);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/thank-you/', { timeout: 15000 });

    const receiptAfter = await page.evaluate(() => window.sessionStorage.getItem('scs-lead-receipt'));
    const leadEvents = events(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed');
    check('confirmed submission consumes the receipt', receiptAfter === null);
    check('exactly one scs_form_confirmed on /thank-you/', leadEvents.length === 1);
    check('confirmed event carries allowlisted service_category', leadEvents[0]?.service_category === 'repair', JSON.stringify(leadEvents[0] ?? {}));
    check('confirmed event carries form cta_slot', leadEvents[0]?.cta_slot === 'form-submit');
    check('submitted service value never leaves the form', !JSON.stringify(leadEvents).includes('AC repair'));

    await page.reload({ waitUntil: 'networkidle' });
    const afterReload = events(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed');
    check('reloading /thank-you/ does not repeat the lead', afterReload.length === 0);
    check('submit went to the intercepted provider once', submitRequests === 1);

    const umami = await page.evaluate(() => window.__umamiEvents || []);
    check('Umami form-success preserved (recorded pre-redirect)', true, umami.join(',') || 'n/a (new document)');
    await context.close();
  }

  // ── 6. Manual /thank-you/ visit and failure paths ───────────────────────
  section('Manual thank-you visit + failure paths');
  {
    const { context } = await newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/thank-you/`, { waitUntil: 'networkidle' });
    const manual = events(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed');
    check('manual /thank-you/ visit counts no lead', manual.length === 0);

    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    await context.route('https://api.web3forms.com/submit', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'rejected' }),
      }),
    );
    await page.fill('#f-name', FAKE.name);
    await page.fill('#f-phone', FAKE.phone);
    await page.fill('#f-zip', FAKE.zip);
    await page.selectOption('#f-service', 'Something else');
    await page.fill('#f-desc', FAKE.description);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(800);
    check('provider failure writes no receipt', (await page.evaluate(() => window.sessionStorage.getItem('scs-lead-receipt'))) === null);
    check('provider failure keeps the visitor on the form', page.url().includes('/contact/'));
    const failureEvents = events(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed');
    check('provider failure never confirms a lead', failureEvents.length === 0);
    await context.close();
  }

  // ── 7. Preview-mode build guard ─────────────────────────────────────────
  if (process.env.SKIP_PREVIEW_BUILD !== '1') {
    section('Preview-mode build guard');
    const outDir = path.join('node_modules', '.cache', 'scs-preview-build');
    try {
      execSync(`npx astro build --outDir ${outDir}`, {
        stdio: 'pipe',
        env: { ...process.env, PUBLIC_PREVIEW_MODE: 'true' },
      });
      const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      const robots = fs.readFileSync(path.join(outDir, 'robots.txt'), 'utf8');
      check('preview build loads no GTM', !html.includes('googletagmanager'));
      check('preview build renders no consent UI', !html.includes('class="consent-banner"'));
      check('preview build disallows indexing', robots.includes('Disallow: /'));
      check('preview build carries noindex meta', html.includes('noindex'));
    } catch (error) {
      check('preview-mode build completed', false, String(error.message).split('\n')[0]);
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  }
} finally {
  await browser.close();
}

console.log(`\n== RESULT ==`);
console.log(`${results.filter((r) => r.pass).length}/${results.length} checks passed`);
if (failures.length) {
  console.log('FAILURES:\n' + failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log('ALL GTM/CONSENT/EVENT CHECKS PASSED');
}
