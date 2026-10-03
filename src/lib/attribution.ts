// Lead attribution — preserves inbound campaign context for LEAD RECORDS only.
//
// Purpose: when a visitor arrives through one of the campaign links in the UTM
// registry (src/config/marketing-links.ts) and later submits a service request,
// the owner should be able to see which campaign brought the customer in. This
// is NOT analytics: the captured values are never sent to GA4/GTM or Umami —
// they travel only inside the Web3Forms submission the visitor deliberately
// sends to the business (see docs/GTM-GA4-SETUP.md and /privacy/).
//
// Consent (October 2026 release requirement — conservative approach):
//  - Attribution is captured and retained ONLY while the visitor's existing
//    analytics consent choice is "granted". It subscribes to the site's
//    consent API (window.scsConsent), so consent granted after the initial
//    page load captures the campaign parameters that are still in the URL.
//  - Declining, ignoring, or withdrawing consent never persists attribution,
//    and clears any previously stored campaign records.
//  - The analytics/GTM consent implementation itself is untouched: this module
//    only observes the choice (the consent script exposes a small additive
//    `subscribe` hook and is otherwise unchanged).
//
// Retention: stored touches expire 90 days after capture and are removed on
// the next read (legacy records without an explicit expiry use the same window
// measured from their capture time).
//
// Validation: incoming campaign values are restricted to lowercase campaign
// tokens (`[a-z][a-z0-9_-]{0,63}`, no 7+ digit runs), so arbitrary URL
// parameters can never introduce names, emails or phone numbers into the
// attribution fields.
//
// Rules:
//  - Only campaign metadata is stored: validated UTM values, landing path,
//    external referrer origin and timestamps. Never form contents or personal
//    details.
//  - First-touch is captured once and never overwritten.
//  - Latest-touch is the most recent MEANINGFUL campaign touch: a genuinely new
//    campaign link updates it; internal navigation, refreshes and ordinary
//    direct views never erase campaign context; a same-site referrer is never
//    treated as a referral.
//  - Advertising click identifiers (gclid/gbraid/wbraid) are deliberately NOT
//    collected: the business runs no advertising campaigns. Revisit only when
//    ads are actually launched and a privacy review has been completed.
//  - All storage access is best-effort: attribution must never block, delay or
//    prevent a form submission, and must never throw.

export interface AttributionTouch {
  source?: string | undefined;
  medium?: string | undefined;
  campaign?: string | undefined;
  content?: string | undefined;
  /** Path of the page the touch was first seen on (no query string). */
  landingPage: string;
  /** External referrer origin only; same-site or malformed referrers are dropped. */
  referrerOrigin?: string | undefined;
  /** ISO timestamp of the touch. */
  at: string;
  /** ISO timestamp after which the touch must not be retained. */
  expiresAt: string;
}

export interface AttributionContext {
  first: AttributionTouch | null;
  latest: AttributionTouch | null;
}

interface ConsentApi {
  granted?: () => boolean;
  choice?: () => boolean | null;
  subscribe?: (listener: (granted: boolean) => void) => void;
}

const FIRST_KEY = 'scs-attribution-first';
const LATEST_KEY = 'scs-attribution-latest';
const MAX_VALUE_LENGTH = 64;
const MAX_PATH_LENGTH = 200;
const RETENTION_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Values that identify a genuine campaign touch. */
const CAMPAIGN_KEYS = ['source', 'medium', 'campaign', 'content'] as const;

// Campaign tokens are lowercase snake_case-style values (the UTM registry
// enforces ^[a-z0-9_]+$ for generated links). Anything else — spaces, '@',
// mixed case, or a 7+ digit run that could be a phone number — is dropped.
const SAFE_VALUE = /^[a-z][a-z0-9_-]{0,63}$/;
const DIGIT_RUN = /\d{7,}/;

function consentApi(): ConsentApi | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { scsConsent?: ConsentApi }).scsConsent;
}

/** True only when the visitor's analytics consent choice is granted. */
function consentGranted(): boolean {
  try {
    const consent = consentApi();
    if (!consent) return false;
    if (consent.granted?.() === true) return true;
    return consent.choice?.() === true;
  } catch {
    return false;
  }
}

/** Validates a campaign value; returns undefined when it is not a safe token. */
function cleanCampaignValue(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized.length === 0 || normalized.length > MAX_VALUE_LENGTH) return undefined;
  if (!SAFE_VALUE.test(normalized)) return undefined;
  if (DIGIT_RUN.test(normalized)) return undefined;
  return normalized;
}

/** Landing paths are same-origin pathnames; anything unexpected is rejected. */
function cleanLandingPage(pathname: string): string {
  if (typeof pathname !== 'string' || !pathname.startsWith('/')) return '/';
  return pathname.length > MAX_PATH_LENGTH ? pathname.slice(0, MAX_PATH_LENGTH) : pathname;
}

function remove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Nothing to do — storage may be unavailable.
  }
}

function isExpired(touch: AttributionTouch): boolean {
  const capturedAt = Date.parse(touch.at ?? '');
  const explicitExpiry = touch.expiresAt ? Date.parse(touch.expiresAt) : Number.NaN;
  const expiresAt = Number.isNaN(explicitExpiry)
    ? capturedAt + RETENTION_DAYS * DAY_MS
    : explicitExpiry;
  if (Number.isNaN(expiresAt)) return true;
  return Date.now() > expiresAt;
}

function safeRead(key: string): AttributionTouch | null {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const touch = JSON.parse(raw) as AttributionTouch;
    if (!touch || typeof touch !== 'object' || isExpired(touch)) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* storage unavailable */
      }
      return null;
    }
    return touch;
  } catch {
    return null;
  }
}

function safeWrite(key: string, touch: AttributionTouch): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(touch));
  } catch {
    // Attribution is best-effort; storage failure must never break the page.
  }
}

/**
 * The external referrer origin, or undefined when there is no referrer, the
 * referrer is malformed, or it points back at this same site (internal
 * navigation is not a referral).
 */
function externalReferrerOrigin(referrer: string, currentOrigin: string): string | undefined {
  if (!referrer) return undefined;
  try {
    const origin = new URL(referrer).origin;
    if (!origin || origin === 'null' || origin === currentOrigin) return undefined;
    return origin;
  } catch {
    return undefined;
  }
}

function isCampaignTouch(touch: AttributionTouch): boolean {
  return CAMPAIGN_KEYS.some((key) => Boolean(touch[key]));
}

/** True when two touches carry the same campaign identifiers and landing page. */
function sameTouch(a: AttributionTouch, b: AttributionTouch): boolean {
  return (
    CAMPAIGN_KEYS.every((key) => (a[key] ?? '') === (b[key] ?? '')) &&
    a.landingPage === b.landingPage
  );
}

/**
 * Removes all stored campaign-attribution records. Called when consent is
 * declined, withdrawn, or absent — and safe to call at any time.
 */
export function clearAttribution(): void {
  if (typeof window === 'undefined') return;
  remove(FIRST_KEY);
  remove(LATEST_KEY);
}

/**
 * Captures the current page view as a potential attribution touch. No-op
 * unless the visitor's analytics consent is granted; never throws.
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    if (!consentGranted()) return;

    const params = new URLSearchParams(window.location.search);
    const currentOrigin = window.location.origin;
    const now = new Date();
    const touch: AttributionTouch = {
      source: cleanCampaignValue(params.get('utm_source')),
      medium: cleanCampaignValue(params.get('utm_medium')),
      campaign: cleanCampaignValue(params.get('utm_campaign')),
      content: cleanCampaignValue(params.get('utm_content')),
      landingPage: cleanLandingPage(window.location.pathname),
      referrerOrigin: externalReferrerOrigin(document.referrer, currentOrigin),
      at: now.toISOString(),
      expiresAt: new Date(now.getTime() + RETENTION_DAYS * DAY_MS).toISOString(),
    };

    if (!safeRead(FIRST_KEY)) {
      safeWrite(FIRST_KEY, touch);
    }

    const latest = safeRead(LATEST_KEY);
    if (!latest) {
      safeWrite(LATEST_KEY, touch);
      return;
    }

    if (isCampaignTouch(touch)) {
      // A genuinely new campaign link replaces the latest touch; a refresh of
      // the identical campaign link is left alone.
      if (!sameTouch(latest, touch)) safeWrite(LATEST_KEY, touch);
      return;
    }

    // Ordinary views never erase campaign context.
    if (isCampaignTouch(latest)) return;

    // While no campaign touch exists, a new external referral may refine the
    // latest touch. Same-origin/direct views never do.
    if (touch.referrerOrigin && touch.referrerOrigin !== latest.referrerOrigin) {
      safeWrite(LATEST_KEY, touch);
    }
  } catch {
    // No attribution is better than a broken page.
  }
}

/**
 * Initializes consent-aware attribution. Called once per page load from the
 * base layout. When consent is granted, the current view is captured; when it
 * is not, any stored campaign records are cleared. A subscription keeps the
 * behavior correct when the visitor grants or withdraws consent after load
 * (campaign parameters still in the URL are captured at that moment).
 */
export function initAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    const consent = consentApi();
    if (!consent) {
      // No consent interface on this build — fail closed: no marketing storage.
      clearAttribution();
      return;
    }
    if (consentGranted()) captureAttribution();
    else clearAttribution();
    consent.subscribe?.((granted) => {
      if (granted) captureAttribution();
      else clearAttribution();
    });
  } catch {
    // Fail closed, but never break the page.
    clearAttribution();
  }
}

/** Reads the stored first/latest touches (used by tests and the form adapter). */
export function getAttribution(): AttributionContext {
  if (typeof window === 'undefined') return { first: null, latest: null };
  return { first: safeRead(FIRST_KEY), latest: safeRead(LATEST_KEY) };
}

/**
 * Flattens attribution into Web3Forms field values. Non-identifying campaign
 * metadata only — these keys are merged into the lead submission and appear in
 * the owner's email; they are never pushed to analytics. Values are re-validated
 * on output, so stale or tampered storage can never leak unsafe text. Never
 * throws; returns an empty object when there is nothing safe to send.
 */
export function attributionFields(): Record<string, string> {
  const fields: Record<string, string> = {};
  try {
    const { first, latest } = getAttribution();
    const pick = (prefix: string, touch: AttributionTouch | null): void => {
      if (!touch) return;
      const source = cleanCampaignValue(touch.source);
      const medium = cleanCampaignValue(touch.medium);
      const campaign = cleanCampaignValue(touch.campaign);
      const content = cleanCampaignValue(touch.content);
      if (source) fields[`${prefix}_utm_source`] = source;
      if (medium) fields[`${prefix}_utm_medium`] = medium;
      if (campaign) fields[`${prefix}_utm_campaign`] = campaign;
      if (content) fields[`${prefix}_utm_content`] = content;
    };
    pick('first', first);
    pick('latest', latest);
    const meaningful = latest ?? first;
    if (meaningful) {
      fields.attribution_landing_page = cleanLandingPage(meaningful.landingPage);
      if (meaningful.referrerOrigin) fields.attribution_referrer_origin = meaningful.referrerOrigin;
    }
    if (first?.at) fields.attribution_first_at = first.at;
    if (latest?.at) fields.attribution_latest_at = latest.at;
  } catch {
    // Attribution is optional; an empty result is acceptable.
  }
  return fields;
}
