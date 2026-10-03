// Lead attribution — preserves inbound campaign context for LEAD RECORDS only.
//
// Purpose: when a visitor arrives through one of the campaign links in the UTM
// registry (src/config/marketing-links.ts) and later submits a service request,
// the owner should be able to see which campaign brought the customer in. This
// is NOT analytics: the captured values are never sent to GA4/GTM or Umami —
// they travel only inside the Web3Forms submission the visitor deliberately
// sends to the business (see docs/GTM-GA4-SETUP.md and /privacy/).
//
// Rules:
//  - Only campaign metadata is stored: UTM values, landing path, external
//    referrer origin and timestamps. Never form contents or personal details.
//  - First-touch is captured once and never overwritten.
//  - Latest-touch is the most recent MEANINGFUL campaign touch: a genuinely new
//    campaign link updates it; internal navigation, refreshes and ordinary
//    direct views never erase campaign context; a same-site referrer is never
//    treated as a referral.
//  - Advertising click identifiers (gclid/gbraid/wbraid) are deliberately NOT
//    collected in this phase: the business runs no advertising campaigns, and
//    collecting ad identifiers without a campaign and a privacy review is
//    avoided. Revisit only when ads are actually launched.
//  - All storage access is best-effort: attribution must never block, delay or
//    prevent a form submission, and must never throw.
//
// Privacy and consent: capture does not depend on the analytics consent choice
// because it is first-party campaign metadata tied to the visitor's own request
// (not cross-site tracking, not analytics). This justification, the storage and
// retention model are disclosed on /privacy/ ("Campaign attribution") and are
// flagged for owner/advisor review in the implementation report.

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
}

export interface AttributionContext {
  first: AttributionTouch | null;
  latest: AttributionTouch | null;
}

const FIRST_KEY = 'scs-attribution-first';
const LATEST_KEY = 'scs-attribution-latest';
const MAX_VALUE_LENGTH = 100;

/** Values that identify a genuine campaign touch. */
const CAMPAIGN_KEYS = ['source', 'medium', 'campaign', 'content'] as const;

function safeRead(key: string): AttributionTouch | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as AttributionTouch) : null;
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

function clip(value: string | null): string | undefined {
  if (!value) return undefined;
  return value.length > MAX_VALUE_LENGTH ? value.slice(0, MAX_VALUE_LENGTH) : value;
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
 * Captures the current page view as a potential attribution touch. Called once
 * per page load from the base layout. Safe to call in any environment.
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const currentOrigin = window.location.origin;
    const touch: AttributionTouch = {
      source: clip(params.get('utm_source')),
      medium: clip(params.get('utm_medium')),
      campaign: clip(params.get('utm_campaign')),
      content: clip(params.get('utm_content')),
      landingPage: window.location.pathname,
      referrerOrigin: externalReferrerOrigin(document.referrer, currentOrigin),
      at: new Date().toISOString(),
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

/** Reads the stored first/latest touches (used by tests and the form adapter). */
export function getAttribution(): AttributionContext {
  if (typeof window === 'undefined') return { first: null, latest: null };
  return { first: safeRead(FIRST_KEY), latest: safeRead(LATEST_KEY) };
}

/**
 * Flattens attribution into Web3Forms field values. Non-identifying campaign
 * metadata only — these keys are merged into the lead submission and appear in
 * the owner's email; they are never pushed to analytics. Never throws.
 */
export function attributionFields(): Record<string, string> {
  const fields: Record<string, string> = {};
  try {
    const { first, latest } = getAttribution();
    const pick = (prefix: string, touch: AttributionTouch | null): void => {
      if (!touch) return;
      if (touch.source) fields[`${prefix}_utm_source`] = touch.source;
      if (touch.medium) fields[`${prefix}_utm_medium`] = touch.medium;
      if (touch.campaign) fields[`${prefix}_utm_campaign`] = touch.campaign;
      if (touch.content) fields[`${prefix}_utm_content`] = touch.content;
    };
    pick('first', first);
    pick('latest', latest);
    const meaningful = latest ?? first;
    if (meaningful) {
      fields.attribution_landing_page = meaningful.landingPage;
      if (meaningful.referrerOrigin) fields.attribution_referrer_origin = meaningful.referrerOrigin;
    }
    if (first?.at) fields.attribution_first_at = first.at;
    if (latest?.at) fields.attribution_latest_at = latest.at;
  } catch {
    // Attribution is optional; an empty result is acceptable.
  }
  return fields;
}
