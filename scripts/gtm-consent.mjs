// GA4-via-GTM Basic Consent Mode + event verification (September 2026
// correction order). Runs against a local preview server of a
// production-equivalent build. The GTM container is stubbed (the owner has not
// configured/published the dashboard container yet), so these checks verify the
// SITE side: no Google request before permission, load-after-consent ordering,
// persistence, withdrawal, no replay, data-layer payloads, the single-use lead
// receipt, Umami preservation and no PII.
//
// Usage: run `npm run preview` first, then:
//   node scripts/gtm-consent.mjs
// The preview-mode build guard runs at the end unless SKIP_PREVIEW_BUILD=1.
import { chromium } from 'playwright';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const GA4_ID = 'G-EQ9CBESN23';
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

// ── Helpers ─────────────────────────────────────────────────────────────────
const newContext = async ({ stored } = {}) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const gtmHits = [];
  const collectHits = [];
  await context.route('**://www.googletagmanager.com/gtm.js*', (route) => {
    gtmHits.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
  });
  await context.route('**://www.googletagmanager.com/ns.html*', (route) => {
    gtmHits.push(`NOSCRIPT:${route.request().url()}`);
    return route.fulfill({ status: 204, body: '' });
  });
  await context.route('**://cloud.umami.is/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: 'window.umami={track:function(n){(window.__umamiEvents=window.__umamiEvents||[]).push(n);}};',
    }),
  );
  await context.route(/google-analytics\.com|analytics\.google\.com|\/g\/collect/, (route) => {
    collectHits.push(route.request().url());
    return route.fulfill({ status: 204, body: '' });
  });
  if (stored !== undefined) {
    await context.addInitScript((choice) => {
      try {
        window.localStorage.setItem('scs-consent-v1', JSON.stringify({ analytics: choice, v: 1 }));
      } catch {
        /* no-op */
      }
    }, stored);
  }
  return { context, gtmHits, collectHits };
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
const businessEvents = (layer) => events(layer).filter((e) => e.event !== 'gtm.js');
const storedChoice = (page) => page.evaluate(() => window.localStorage.getItem('scs-consent-v1'));
const gtmScriptTags = (page) =>
  page.evaluate(() => document.querySelectorAll('script[src*="googletagmanager.com/gtm.js"]').length);
const bannerHidden = (page) =>
  page.evaluate(() => document.querySelector('[data-consent-banner]')?.hidden === true);

const clicksBlocked = (page) =>
  page.evaluate(() => {
    document.addEventListener('click', (event) => {
      if (event.target.closest('a')) event.preventDefault();
    });
  });

const clickSelector = async (page, selector) => {
  await page.evaluate((sel) => document.querySelector(sel)?.click(), selector);
  await page.waitForTimeout(250);
};

const interceptProvider = (context, { success, delayMs = 0 }, counter) => {
  return context.route('https://api.web3forms.com/submit', async (route) => {
    if (counter) counter.count += 1;
    if (delayMs) await new Promise((resolve) => setTimeout(resolve, delayMs));
    return route.fulfill({
      status: success ? 200 : 200,
      contentType: 'application/json',
      body: JSON.stringify(
        success ? { success: true, message: 'ok' } : { success: false, message: 'rejected' },
      ),
    });
  });
};

const fillForm = async (page, service) => {
  await page.fill('#f-name', FAKE.name);
  await page.fill('#f-phone', FAKE.phone);
  await page.fill('#f-zip', FAKE.zip);
  await page.selectOption('#f-service', service);
  await page.fill('#f-desc', FAKE.description);
};

try {
  // ── 1. First visit: nothing loads, nothing is sent ───────────────────────
  section('First visit — no permission, no Google request');
  {
    const { context, gtmHits, collectHits } = await newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });

    check('no GTM request before permission', gtmHits.length === 0, gtmHits.join(' | '));
    check('no GTM script tag in the DOM', (await gtmScriptTags(page)) === 0);
    check(
      'no GTM <noscript> iframe in the DOM',
      (await page.evaluate(() => document.querySelectorAll('noscript iframe[src*="ns.html"]').length)) === 0,
    );

    const layer = await readLayer(page);
    const defaults = consentDefaults(layer);
    check('consent default pushed', defaults.length === 1);
    if (defaults.length) {
      const state = defaults[0][2];
      check('default analytics_storage denied', state.analytics_storage === 'denied');
      check('default ad_storage denied', state.ad_storage === 'denied');
      check('default ad_user_data denied', state.ad_user_data === 'denied');
      check('default ad_personalization denied', state.ad_personalization === 'denied');
    }
    check('no consent update without a choice', consentUpdates(layer).length === 0);
    check('no business events before permission', businessEvents(layer).length === 0);

    check('consent banner visible on first visit', !(await bannerHidden(page)));
    check(
      'preferences panel starts closed',
      await page.evaluate(() => document.querySelector('[data-consent-prefs]')?.hidden === true),
    );
    const buttonSizes = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.consent-actions .btn')).map((el) => ({
        text: el.textContent.trim(),
        h: Math.round(el.getBoundingClientRect().height),
      })),
    );
    check(
      'consent buttons are >= 44px tall',
      buttonSizes.length >= 3 && buttonSizes.every((b) => b.h >= 44),
      JSON.stringify(buttonSizes),
    );
    check('no _ga cookie before consent', !(await page.evaluate(() => document.cookie)).includes('_ga'));
    check(
      'Umami still loads independently',
      await page.evaluate(() => typeof window.umami === 'object'),
    );
    check('no GA4 collect requests', collectHits.length === 0);
    await context.close();
  }

  // ── 2. Allow: GTM loads once, ordering correct ───────────────────────────
  section('Allow — GTM loads once, after consent state');
  {
    const { context, gtmHits } = await newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await clickSelector(page, '[data-consent-accept]');
    await page.waitForTimeout(300);

    check('GTM request made after permission', gtmHits.length === 1, gtmHits.join(' | '));
    check('GTM request carries the confirmed container ID', gtmHits[0]?.includes('id=GTM-MBGJ8SLD'));
    check('exactly one GTM script tag in the DOM', (await gtmScriptTags(page)) === 1);

    const layer = await readLayer(page);
    const updates = consentUpdates(layer);
    check(
      'allow pushes exactly one consent update',
      updates.length === 1 && updates[0][2].analytics_storage === 'granted',
    );
    check(
      'allow never grants advertising consent',
      updates.every((e) => !e[2].ad_storage && !e[2].ad_user_data && !e[2].ad_personalization),
    );
    const defaultIndex = layer.findIndex((e) => Array.isArray(e) && e[0] === 'consent' && e[1] === 'default');
    const updateIndex = layer.findIndex(
      (e) => Array.isArray(e) && e[0] === 'consent' && e[1] === 'update',
    );
    const gtmStartIndex = layer.findIndex((e) => !Array.isArray(e) && e.event === 'gtm.js');
    check(
      'ordering: default → update → GTM load',
      defaultIndex !== -1 && updateIndex > defaultIndex && gtmStartIndex > updateIndex,
      `default ${defaultIndex}, update ${updateIndex}, gtm ${gtmStartIndex}`,
    );
    check('choice persisted as granted', (await storedChoice(page))?.includes('"analytics":true'));
    check('banner hides after choice', await bannerHidden(page));
    await context.close();
  }

  // ── 3. Returning consenting visitor ──────────────────────────────────────
  section('Returning consenting visitor — auto-load, no prompt');
  {
    const { context, gtmHits } = await newContext({ stored: true });
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    check('returning visitor: GTM loads automatically', gtmHits.length === 1, gtmHits.join(' | '));
    const layer = await readLayer(page);
    const defaultIndex = layer.findIndex((e) => Array.isArray(e) && e[0] === 'consent' && e[1] === 'default');
    const updateIndex = layer.findIndex(
      (e) => Array.isArray(e) && e[0] === 'consent' && e[1] === 'update',
    );
    const gtmStartIndex = layer.findIndex((e) => !Array.isArray(e) && e.event === 'gtm.js');
    check(
      'returning visitor: granted applied before GTM loads',
      defaultIndex !== -1 && updateIndex > defaultIndex && gtmStartIndex > updateIndex,
    );
    check('returning visitor: no repeat prompt', await bannerHidden(page));
    check('returning visitor: choice unchanged', (await storedChoice(page))?.includes('"analytics":true'));
    await context.close();
  }

  // ── 4. Reject: nothing loads, persists across visits ─────────────────────
  section('Reject — no GTM request, persisted');
  {
    const { context, gtmHits } = await newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await clickSelector(page, '[data-consent-reject]');
    await page.waitForTimeout(250);

    check('reject: still no GTM request', gtmHits.length === 0, gtmHits.join(' | '));
    check('reject stored as denied', (await storedChoice(page))?.includes('"analytics":false'));
    check('reject hides the banner', await bannerHidden(page));
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    check('rejected visitor: no GTM request on return', gtmHits.length === 0);
    check('rejected visitor: no repeat prompt', await bannerHidden(page));
    await context.close();
  }

  // ── 5. Preferences, withdrawal and re-allow ──────────────────────────────
  section('Preferences, withdrawal, re-allow');
  {
    const { context, gtmHits } = await newContext({ stored: true });
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    check('granted visitor: GTM loaded', gtmHits.length === 1);

    await clickSelector(page, '[data-consent-open]');
    const reopened = await page.evaluate(() => ({
      visible: document.querySelector('[data-consent-banner]')?.hidden === false,
      prefsOpen: document.querySelector('[data-consent-prefs]')?.hidden === false,
      checked: document.querySelector('[data-consent-analytics-toggle]')?.checked === true,
    }));
    check('footer entry point reopens prefs with stored state', reopened.visible && reopened.prefsOpen && reopened.checked);
    check(
      'exactly one analytics-only preference (no advertising checkbox)',
      (await page.evaluate(
        () => document.querySelectorAll('[data-consent-banner] input[type="checkbox"]').length,
      )) === 1,
    );

    await page.evaluate(() => {
      document.querySelector('[data-consent-analytics-toggle]').checked = false;
    });
    await clickSelector(page, '[data-consent-save]');
    await page.waitForTimeout(250);
    const afterWithdraw = await readLayer(page);
    check(
      'withdrawal pushes consent update denied',
      consentUpdates(afterWithdraw).some((e) => e[2].analytics_storage === 'denied'),
    );
    check('withdrawal stored as denied', (await storedChoice(page))?.includes('"analytics":false'));
    check(
      'withdrawal sets the Google tag disable flag',
      await page.evaluate(() => window[`ga-disable-${'G-EQ9CBESN23'}`] === true),
    );

    await clicksBlocked(page);
    await clickSelector(page, 'a[data-cta="call-hero"]');
    check(
      'withdrawn visitor: no further business events',
      businessEvents(await readLayer(page)).length === 0,
    );

    const hitsBeforeReallow = gtmHits.length;
    await clickSelector(page, '[data-consent-open]');
    await page.evaluate(() => {
      document.querySelector('[data-consent-analytics-toggle]').checked = true;
    });
    await clickSelector(page, '[data-consent-save]');
    await page.waitForTimeout(250);
    check(
      're-allow grants analytics again',
      consentUpdates(await readLayer(page)).some((e) => e[2].analytics_storage === 'granted'),
    );
    check(
      're-allow does not load a second container',
      gtmHits.length === hitsBeforeReallow,
      `${hitsBeforeReallow} → ${gtmHits.length}`,
    );
    check(
      're-allow clears the Google tag disable flag',
      await page.evaluate(() => window[`ga-disable-${'G-EQ9CBESN23'}`] === false),
    );
    await context.close();
  }

  // ── 6. No replay of pre-permission events; Umami independent ─────────────
  section('No replay of pre-permission events');
  {
    const { context } = await newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await clicksBlocked(page);
    await clickSelector(page, 'a[data-cta="call-hero"]');
    await clickSelector(page, 'a[data-cta="text-hero"]');
    await clickSelector(page, 'a[data-cta="request-hero"]');
    check(
      'pre-permission clicks push no data-layer events',
      businessEvents(await readLayer(page)).length === 0,
    );
    const umamiPre = await page.evaluate(() => window.__umamiEvents || []);
    check('Umami records pre-permission call/text clicks independently', umamiPre.includes('call-click') && umamiPre.includes('text-click'), umamiPre.join(','));

    await clickSelector(page, '[data-consent-accept]');
    await page.waitForTimeout(300);
    const afterAllow = businessEvents(await readLayer(page));
    check(
      'allowing does not replay pre-permission events',
      afterAllow.length === 0,
      JSON.stringify(afterAllow),
    );

    await clickSelector(page, 'a[data-cta="call-hero"]');
    const afterClick = businessEvents(await readLayer(page));
    check(
      'post-permission clicks are tracked exactly once',
      afterClick.length === 1 && afterClick[0].event === 'scs_call_click' && afterClick[0].cta_slot === 'call-hero',
      JSON.stringify(afterClick),
    );
    await context.close();
  }

  // ── 7. Click events + PII scan (permission from the start) ───────────────
  section('Click events, cta_slot payloads, PII scan');
  {
    const { context } = await newContext({ stored: true });
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await clicksBlocked(page);
    await clickSelector(page, 'a[data-cta="call-hero"]');
    await clickSelector(page, 'a[data-cta="text-hero"]');
    await clickSelector(page, 'a[data-cta="request-hero"]');
    await page.evaluate(() => document.querySelector('a[data-cta="logo-home"]')?.click());
    await page.waitForTimeout(250);

    const layer = await readLayer(page);
    const evts = businessEvents(layer);
    const names = evts.map((e) => e.event);
    check('tel click pushes scs_call_click with cta_slot', evts.some((e) => e.event === 'scs_call_click' && e.cta_slot === 'call-hero'));
    check('sms click pushes scs_text_click with cta_slot', evts.some((e) => e.event === 'scs_text_click' && e.cta_slot === 'text-hero'));
    check('request CTA pushes scs_request_click with cta_slot', evts.some((e) => e.event === 'scs_request_click' && e.cta_slot === 'request-hero'));
    check(
      'exactly 3 business events (one per tracked click, no duplicates)',
      names.length === 3 && new Set(names).size === 3,
      names.join(','),
    );

    const serialized = JSON.stringify(layer);
    check('no fake phone digits in the data layer', !serialized.includes(FAKE.phone));
    check('no email/name/free text in the data layer', !serialized.includes('@') && !serialized.includes(FAKE.name));
    const umamiEvents = await page.evaluate(() => window.__umamiEvents || []);
    check('Umami call-click preserved', umamiEvents.includes('call-click'));
    check('Umami text-click preserved', umamiEvents.includes('text-click'));
    await context.close();
  }

  // ── 8. Form start gating ─────────────────────────────────────────────────
  section('Form start gating');
  {
    const { context } = await newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    await page.locator('#f-name').click();
    await page.keyboard.type('A');
    await page.waitForTimeout(200);
    check(
      'pre-permission form interaction pushes nothing',
      businessEvents(await readLayer(page)).length === 0,
    );
    await clickSelector(page, '[data-consent-accept]');
    await page.waitForTimeout(200);
    await page.locator('#f-desc').click();
    await page.keyboard.type('more');
    await page.waitForTimeout(200);
    const startEvents = businessEvents(await readLayer(page)).filter((e) => e.event === 'scs_form_start');
    check(
      'pre-permission interaction is never replayed as form_start',
      startEvents.length === 0,
      JSON.stringify(startEvents),
    );
    await context.close();
  }
  {
    const { context } = await newContext({ stored: true });
    const page = await context.newPage();
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    await page.locator('#f-name').click();
    await page.keyboard.type('A');
    await page.locator('#f-phone').click();
    await page.keyboard.type('5');
    await page.waitForTimeout(200);
    const startEvents = businessEvents(await readLayer(page)).filter((e) => e.event === 'scs_form_start');
    check('permitted visitor: form start fires exactly once', startEvents.length === 1);
    await context.close();
  }

  // ── 9. Confirmed lead with permission already given ──────────────────────
  section('Confirmed lead — permission already given');
  {
    const { context } = await newContext({ stored: true });
    const page = await context.newPage();
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    await interceptProvider(context, { success: true });
    await fillForm(page, 'AC repair / diagnostic');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/thank-you/', { timeout: 15000 });

    const receiptAfter = await page.evaluate(() => window.sessionStorage.getItem('scs-lead-receipt'));
    const leadEvents = businessEvents(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed');
    check('confirmed submission consumes the receipt', receiptAfter === null);
    check('exactly one scs_form_confirmed on /thank-you/', leadEvents.length === 1);
    check('confirmed event carries allowlisted service_category', leadEvents[0]?.service_category === 'repair', JSON.stringify(leadEvents[0] ?? {}));
    check('confirmed event carries form cta_slot', leadEvents[0]?.cta_slot === 'form-submit');
    check('submitted service value never leaves the form', !JSON.stringify(leadEvents).includes('AC repair'));

    await page.reload({ waitUntil: 'networkidle' });
    check(
      'reloading /thank-you/ does not repeat the lead',
      businessEvents(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed').length === 0,
    );
    await context.close();
  }
  {
    const { context } = await newContext({ stored: true });
    const page = await context.newPage();
    await page.goto(`${BASE}/thank-you/`, { waitUntil: 'networkidle' });
    check(
      'manual /thank-you/ visit counts no lead',
      businessEvents(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed').length === 0,
    );
    await context.close();
  }

  // ── 10. Confirmed lead pending → permission granted on /thank-you/ ───────
  section('Confirmed lead — permission granted on the thank-you page');
  {
    const { context, gtmHits } = await newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    await interceptProvider(context, { success: true });
    await fillForm(page, 'Premium AC Maintenance');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/thank-you/', { timeout: 15000 });

    const pending = await page.evaluate(() => window.sessionStorage.getItem('scs-lead-receipt'));
    check('no consent yet: lead is not transmitted', businessEvents(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed').length === 0);
    check('no consent yet: receipt stays pending', pending !== null);
    check('no GTM request while undecided', gtmHits.length === 0);

    await clickSelector(page, '[data-consent-accept]');
    await page.waitForTimeout(400);
    const granted = businessEvents(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed');
    check('granting on /thank-you/ transmits the pending lead once', granted.length === 1, JSON.stringify(granted));
    check('pending lead keeps the allowlisted category', granted[0]?.service_category === 'maintenance');
    check(
      'receipt consumed after transmission',
      (await page.evaluate(() => window.sessionStorage.getItem('scs-lead-receipt'))) === null,
    );
    check('GTM loads after that permission', gtmHits.length === 1);
    await page.reload({ waitUntil: 'networkidle' });
    check(
      'no duplicate lead after reload',
      businessEvents(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed').length === 0,
    );
    await context.close();
  }

  // ── 11. Confirmed lead refused on /thank-you/ ────────────────────────────
  section('Confirmed lead — permission refused');
  {
    const { context, gtmHits } = await newContext();
    const page = await context.newPage();
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    await interceptProvider(context, { success: true });
    await fillForm(page, 'Something else');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/thank-you/', { timeout: 15000 });
    await clickSelector(page, '[data-consent-reject]');
    await page.waitForTimeout(300);

    check(
      'refusal never transmits the pending lead',
      businessEvents(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed').length === 0,
    );
    check(
      'refusal drops the receipt',
      (await page.evaluate(() => window.sessionStorage.getItem('scs-lead-receipt'))) === null,
    );
    check('refusal loads no GTM', gtmHits.length === 0);
    await context.close();
  }

  // ── 12. Failure paths and duplicate-submit protection ────────────────────
  section('Failure paths and duplicate protection');
  {
    const { context } = await newContext({ stored: true });
    const page = await context.newPage();
    await page.goto(`${BASE}/contact/`, { waitUntil: 'networkidle' });
    await interceptProvider(context, { success: false });
    await fillForm(page, 'Something else');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(800);
    check('provider failure writes no receipt', (await page.evaluate(() => window.sessionStorage.getItem('scs-lead-receipt'))) === null);
    check('provider failure keeps the visitor on the form', page.url().includes('/contact/'));
    check(
      'provider failure never confirms a lead',
      businessEvents(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed').length === 0,
    );

    const counter = { count: 0 };
    await context.unroute('https://api.web3forms.com/submit');
    await interceptProvider(context, { success: true, delayMs: 600 }, counter);
    await fillForm(page, 'Airflow / ductwork issue');
    await page.evaluate(() => {
      const form = document.getElementById('service-request-form');
      form.requestSubmit();
      form.requestSubmit();
    });
    await page.waitForURL('**/thank-you/', { timeout: 15000 });
    check('duplicate submit sends exactly one provider request', counter.count === 1, String(counter.count));
    const leads = businessEvents(await readLayer(page)).filter((e) => e.event === 'scs_form_confirmed');
    check('duplicate submit produces exactly one lead', leads.length === 1, String(leads.length));
    await context.close();
  }

  // ── 13. Preview-mode build guard ─────────────────────────────────────────
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
