# GTM + GA4 setup, conversion spec, and owner dashboard steps

September 2026. This is the operational sheet for the GA4-via-GTM integration.
The site side is implemented in this repository; the Google dashboard side below
requires the owner's Google login. **Nothing is live until the GTM container is
published and the site is deployed** — see the status matrix.

- GTM container: `GTM-MBGJ8SLD` (configured in `src/config/business.ts`,
  overridable with `PUBLIC_GTM_CONTAINER_ID`, empty string disables GTM + consent UI)
- GA4 web-stream measurement ID: `G-EQ9CBESN23` (configured **inside** the GTM
  container — the site never loads `gtag.js` directly)
- Site never loads a second tag manager, WordPress plugin, or paid tag service.

## Status matrix (be precise when reporting)

| Layer | State | Evidence |
| --- | --- | --- |
| Site-installed (this branch) | **Done** | GTM snippet + Consent Mode defaults + events in built HTML; `scripts/gtm-consent.mjs` 55/55 |
| GTM workspace configured | **NOT done** | Owner must create the tags below |
| GTM published | **NOT done** | Owner presses Submit → Publish |
| GA4 receiving data | **NOT verifiable yet** | Requires published container + deployment |
| `generate_lead` key event | **NOT done** | Owner marks it after data arrives |

## What the site sends (data layer)

One container, one Google Tag, fixed event names only. No form contents, names,
phone numbers, emails, ZIP codes, URLs with query strings, or IP-based custom
parameters are ever pushed.

| Visitor action | Data-layer event | GA4 event | Parameters | Consent needed |
| --- | --- | --- | --- | --- |
| Tel link clicked | `scs_call_click` | `scs_call_click` | `cta_slot` | analytics_storage |
| SMS link clicked | `scs_text_click` | `scs_text_click` | `cta_slot` | analytics_storage |
| Service-request CTA clicked | `scs_request_click` | `scs_request_click` | `cta_slot` | analytics_storage |
| First interaction with request form (single fire) | `scs_form_start` | `scs_form_start` | — | analytics_storage |
| Provider-confirmed form submission (via single-use session receipt on `/thank-you/`) | `scs_form_confirmed` | **`generate_lead`** | `service_category`, `cta_slot` | analytics_storage |

`service_category` is a closed allowlist: `repair`, `maintenance`,
`installation`, `airflow`, `commercial`, `tab`, `other`.
`cta_slot` is the pre-existing `data-cta` id (for example `call-hero`).

### Consent Mode v2 behavior (site side)

- `gtag('consent','default')` runs **before** the GTM snippet: `analytics_storage`,
  `ad_storage`, `ad_user_data`, `ad_personalization` all `denied`.
- A stored "Allow analytics" choice is re-applied with `gtag('consent','update')`
  before GTM loads on later visits.
- Advertising consent is never granted by this site (no ads/remarketing tags).
- The banner and the footer "Analytics preferences" link manage the choice;
  rejection is as easy as acceptance; no consent is inferred from scrolling.
- If JavaScript or storage is unavailable, consent stays denied (fail closed).

## Owner click-by-click: GTM workspace

Do these in <https://tagmanager.google.com> for container `GTM-MBGJ8SLD`.

1. **Variables (optional but recommended).** Variables → Configure → enable
   built-ins you plan to use. For event parameters create two Data Layer
   Variables: `DLV - service_category` (Data Layer Variable Name:
   `service_category`) and `DLV - cta_slot` (`cta_slot`).
2. **Google Tag.** Tags → New → Tag Configuration → **Google Tag**. Tag ID:
   `G-EQ9CBESN23`. Triggering: **Initialization – All Pages**. Leave Consent
   Settings at the default built-in Consent Mode behavior (do not add an
   "additional consent" requirement that would block it when analytics is
   allowed). Name: `GA4 - Google Tag - SCS`. Save. This is the only Google Tag
   for this stream.
3. **`generate_lead` tag (the qualified inquiry).** Tags → New → **GA4 Event**.
   Measurement ID / Google Tag: the Google Tag above. Event Name:
   `generate_lead`. Event Parameters:
   `service_category` = `{{DLV - service_category}}`, `cta_slot` =
   `{{DLV - cta_slot}}`. Trigger: New Trigger → **Custom Event**, event name
   `scs_form_confirmed`, fires on All Custom Events. Name:
   `GA4 - Event - generate_lead`. Save.
4. **Intent event tags.** For each row below, Tags → New → **GA4 Event**, same
   Google Tag, trigger = Custom Event with the data-layer name, event name =
   same name, parameter `cta_slot` = `{{DLV - cta_slot}}`:
   - `GA4 - Event - scs_call_click` → `scs_call_click`
   - `GA4 - Event - scs_text_click` → `scs_text_click`
   - `GA4 - Event - scs_request_click` → `scs_request_click`
   - `GA4 - Event - scs_form_start` → `scs_form_start` (no parameters)
5. **Do NOT create** a GA4 event tag triggered by a plain `/thank-you/` page
   view, and do not add a second page-view tag. Page views come from the Google
   Tag only.
6. **Preview.** Top right → **Preview** → enter
   `https://sunshineclimatesolutions.com` (after deployment). In Tag Assistant:
   confirm one page view, each CTA event once, `scs_form_start` once,
   `generate_lead` only after a real/intercepted successful form submission.
   Test banner states: first visit (denied), Allow (granted), Reject, and the
   footer preferences link. Tag Assistant should show GA4 tags blocked on first
   visit and firing after "Allow analytics".
7. **Publish.** GTM → **Submit** → name the version `SCS GA4 launch` → Publish.
   Saving alone does not send production data.
8. **GA4 stream URL.** GA4 → Admin → Data Streams → the web stream → change the
   stream URL from `https://www.sunshineclimatesolutions.com` to
   `https://sunshineclimatesolutions.com` (canonical apex; cosmetic consistency).
9. **GA4 enhanced measurement.** Stream → Enhanced measurement → Settings →
   turn **Form interactions OFF** (our validated custom flow replaces it).
   Keep page views and scrolls. Audit outbound clicks/form interactions for
   query-string PII; if any, adjust. Do not disable page-view measurement.
10. **Key event.** GA4 → Admin → Events (or Key events) → after `generate_lead`
    appears, toggle **Mark as key event**. Do not create page-view-based
    conversions.
11. **Search Console link.** GA4 → Admin → Product links → Search Console Links
    → link the owned `sunshineclimatesolutions.com` property to this single web
    stream.
12. **Housekeeping.** Set data retention (Admin → Data Settings → Data
    Retention; 14 months is the common maximum), add internal/developer traffic
    filters only after identifying IPs/patterns, and document UTM conventions
    for marketing. Do not apply destructive filters without review.

## Conversion measurement specification

- `scs_call_click` / `scs_text_click` are **intent**, not qualified leads. We
  cannot know from a click whether the call was answered or produced work.
- `scs_request_click` and `scs_form_start` are **funnel** signals only.
- `generate_lead` fires only after Web3Forms confirms `response.ok &&
  success === true`, is written as a single-use `sessionStorage` receipt, and is
  consumed once on `/thank-you/`. Manual or repeated visits to that URL never
  count; failed validation, spam, HTTP failures and duplicate submissions never
  count.
- Actual booked/paid jobs require a later call-tracking and/or CRM integration
  (e.g. forwarding-number or CRM stage data). Until then, `generate_lead` means
  "confirmed website inquiry", not "sold job".
- Umami continues to run (cookieless, aggregate) for comparison. Its events
  (`call-click`, `text-click`, `form-success`) are fire-and-forget and are not
  duplicated into GA4 automatically.

## Privacy text — owner approval required

`src/pages/privacy.astro` was updated to disclose both analytics services, the
optional nature of Google Analytics, the cookies it sets when allowed, the
advertising-denied posture, and the persistent footer preference control. This
wording is **pending owner review**; it is written to be accurate, not to assert
legal compliance. Open questions for the owner/advisor:

1. Florida/US audience — is opt-in for Google Analytics (the current, strictest
   behavior) the desired posture, or should analytics default on with opt-out?
   The implementation currently defaults to denied until "Allow analytics".
2. How long should GA4 data retention be set (14 months maximum)?
3. Should a data-processing addendum or vendor list be published alongside the
   privacy page?

## Manual steps remaining (owner)

1. Complete the GTM workspace steps above and publish.
2. Deploy the site (a push to `main` after merge approval) — a saved GTM
   workspace without deployment, or a deployment without a published container,
   sends no GA4 data.
3. GA4 Realtime/DebugView check, then mark `generate_lead` as a key event.
4. Search Console link + URL inspection as needed.
5. Owner review of the privacy wording and the consent questions above.
