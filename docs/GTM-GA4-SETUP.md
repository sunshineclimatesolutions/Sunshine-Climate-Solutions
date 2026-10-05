# GTM + GA4 setup, conversion spec, and owner dashboard steps

September 2026 (corrected); **current status reviewed October 1, 2026**. This is the
operational sheet for the GA4-via-GTM integration. The site side is implemented in this
repository; the Google dashboard side is configured by the owner. See the status matrix and
the CURRENT STATUS section below.

- GTM container: `GTM-MBGJ8SLD` (configured in `src/config/business.ts`, overridable with
  `PUBLIC_GTM_CONTAINER_ID`, empty string disables GTM + consent UI)
- GA4 web-stream measurement ID: `G-EQ9CBESN23` (configured **inside** the GTM container — the
  site never loads `gtag.js` directly)
- No second tag manager, WordPress plugin, or paid tag service is used.

## Status matrix (be precise when reporting)

| Layer | State | Evidence |
| --- | --- | --- |
| Site-installed (this branch) | **Done** | Basic Consent Mode + events verified in built HTML; `scripts/gtm-consent.mjs` 91/91 |
| GTM workspace configured | **Owner-confirmed done (2026-10-01)** | Support-tracking patch imported into a dedicated workspace; Google's import preview showed exactly 1 tag / 1 trigger / 1 variable added, 0 modifications, 0 deletions; both fundraiser-button tests passed. History: the first import attempt was rejected (`measurementIdOverride` empty) — corrected in both JSON files; see Import failure history |
| GTM published | **Owner-confirmed done (2026-10-01)** | Owner confirmed the configuration was published |
| GA4 receiving data | **Owner-confirmed (2026-10-01)** | `page_view`, `scs_call_click`, `scs_text_click`, `scs_request_click`, `scs_form_start` and other standard events arriving; `generate_lead` visible in the Realtime key-events report |
| `generate_lead` key event | **Owner-confirmed done (2026-10-01)** | Marked as a key event in GA4 |
| GA4 custom dimensions | **Owner-confirmed done (2026-10-01)** | All three event-scoped dimensions created (see CURRENT STATUS) |
| GA4 ↔ Search Console association | **Pending final confirmation** | Domain property appears in the linking wizard; do not record as complete until the owner confirms the final submission |

## CURRENT STATUS — October 1, 2026

Owner-confirmed through dashboards (not independently observable from this repository):

- **GTM:** the corrected support-tracking patch was imported into a dedicated workspace, tested
  (both fundraiser buttons), and **published**.
- **GA4:** the property is operational and collecting data. `generate_lead` was tested through
  the existing website setup, appeared in the Realtime key-events report, and is configured as
  a **key event**. Fundraiser event forwarding through GTM was tested and published.
- **GA4 custom dimensions (event-scoped, all completed):**
  - `Support platform` → `support_platform`
  - `Service category` → `service_category`
  - `CTA slot` → `cta_slot`
- **Search Console:** the GA4 linking wizard now displays the correct verified domain property
  for `sunshineclimatesolutions.com`.

**Still requiring owner confirmation (not verified):**

- Whether automatic Enhanced Measurement **form interactions** have been disabled (recommended
  OFF — the validated custom flow replaces it).
- Whether GA4 **data retention** was set to 14 months.
- Whether the GA4 **web stream URL** was changed to the canonical non-www domain.
- Whether the planned custom **Explorations** have been created.
- The final **GA4 ↔ Search Console** association submission (the wizard step was reached; the
  association is not recorded as complete here).

**Do not claim** that fundraiser contributions or paying customers have been measured through
GA4 — the analytics measure events, not money.

**Import files:** `docs/gtm/SCS-GA4-container-import.json` (full container) and
`docs/gtm/SCS-support-tracking-patch.json` (minimal merge patch) are retained for **fresh
installations, disaster recovery and structural verification** (`node
scripts/verify-gtm-import.mjs`). **Do not re-import them into the already-working container** —
that would create duplicates. To change an existing container, edit it in the GTM UI (or
import only genuinely missing resources with Merge after verifying they do not already exist).

## What the site does (Basic Consent Mode)

- The GTM container is **not loaded and no request is made to Google** until the visitor
  explicitly chooses "Allow analytics". There is no GTM `<noscript>` iframe (it would transmit
  without consent).
- Consent Mode v2 defaults (`analytics_storage`, `ad_storage`, `ad_user_data`,
  `ad_personalization`) are all `denied` before anything loads; the granted state is applied
  **before** GTM loads. Advertising consent is never granted.
- Returning consenting visitors auto-load with no repeat prompt. "Reject" or withdrawing
  permission keeps/returns analytics to denied, sets the Google tag disable flag, and stops
  further measurement. Refusal also drops any pending confirmed-lead receipt.
- The accessible banner (Allow / Reject / Preferences) plus the footer "Analytics preferences"
  link manage the choice; it is stored in `localStorage` (`scs-consent-v1`).
- Data-layer events are pushed **only with permission** — nothing from before permission can be
  replayed when GTM loads.

### Events (data layer)

| Visitor action | Data-layer event | GA4 event | Parameters |
| --- | --- | --- | --- |
| Tel link clicked | `scs_call_click` | `scs_call_click` | `cta_slot` |
| SMS link clicked | `scs_text_click` | `scs_text_click` | `cta_slot` |
| Service-request CTA clicked | `scs_request_click` | `scs_request_click` | `cta_slot` |
| First interaction with request form (single fire) | `scs_form_start` | `scs_form_start` | — |
| Provider-confirmed submission (single-use receipt on `/thank-you/`) | `scs_form_confirmed` | **`generate_lead`** | `service_category`, `cta_slot` |
| Fundraiser platform link clicked on `/support/` | `scs_support_click` | `scs_support_click` | `support_platform` |

`service_category` is a closed allowlist: `repair`, `maintenance`, `installation`, `airflow`,
`commercial`, `tab`, `other`. `cta_slot` is the existing `data-cta` id (e.g. `call-hero`).
`support_platform` is a closed allowlist: `gofundme`, `givesendgo`.

**What `scs_support_click` means — and does not mean.** It means an **outbound fundraiser
platform click** (GoFundMe or GiveSendGo) from the `/support/` page. It does **not** mean a
donation, a donor, funds received, or a payment conversion. Never assign donation revenue or
value to this event.

No names, phone numbers, emails, ZIP codes, descriptions, donation amounts, donor identities,
fundraiser URLs, query strings or other customer-provided data are ever pushed.

### Event reference (current)

| Event | Meaning | Parameters (allowlist) | Consent | GTM tag / trigger |
| --- | --- | --- | --- | --- |
| `scs_call_click` | Visitor clicked a `tel:` link (call **intent**, not an answered call) | `cta_slot` (any `data-cta` id) | GTM push only after analytics permission; Umami `call-click` independently | `GA4 - Event - scs_call_click` ← `CE - scs_call_click` |
| `scs_text_click` | Visitor clicked an `sms:` link | `cta_slot` | same | `GA4 - Event - scs_text_click` ← `CE - scs_text_click` |
| `scs_request_click` | Visitor clicked a request-service CTA (`data-cta` starting `request-`) | `cta_slot` | same | `GA4 - Event - scs_request_click` ← `CE - scs_request_click` |
| `scs_form_start` | First interaction with the request form (single fire per session) | — | same | `GA4 - Event - scs_form_start` ← `CE - scs_form_start` |
| `scs_form_confirmed` → GA4 **`generate_lead`** | Provider-confirmed submission, emitted once on `/thank-you/` from a single-use session receipt | `service_category` (`repair`, `maintenance`, `installation`, `airflow`, `commercial`, `tab`, `other`), `cta_slot` | same (permission required) | `GA4 - Event - generate_lead` ← `CE - scs_form_confirmed` |
| `scs_support_click` | Outbound fundraiser platform click on `/support/` (**not** a donation) | `support_platform` (`gofundme`, `givesendgo`) | same; Umami `support-gofundme-click` / `support-givesendgo-click` independently | `GA4 - Event - scs_support_click` ← `CE - scs_support_click` |

**Distinctions that must never be blurred:**

- A phone-button click (`scs_call_click`) is **not** an answered call or a booked job.
- A form start (`scs_form_start`) is **not** a submission.
- A confirmed lead (`generate_lead`) is **not** a paying customer — it is a provider-confirmed
  website inquiry.
- A fundraiser outbound click (`scs_support_click`) is **not** a donation, donor or payment.
- Donation totals and donor identities are never measured by the website; they are manual
  entries in the weekly scorecard's fundraiser section.

**Key event:** `generate_lead` (owner-confirmed configured). `scs_support_click` may optionally
be marked as a key event, but it measures outbound intent — never assign it donation value.

**Custom dimensions (all three created — owner-confirmed):** `Support platform`
(`support_platform`), `Service category` (`service_category`), `CTA slot` (`cta_slot`), all
event-scoped.

**Campaign attribution on lead emails (not analytics).** Successful service-request submissions
also carry the visitor's **first-touch and latest-touch campaign metadata**, captured
client-side by `src/lib/attribution.ts` and merged into the Web3Forms payload by
`ContactForm.astro`. It appears only in the owner's email notification — **it is never pushed to
the data layer, GTM, GA4 or Umami**, and it does not change `generate_lead` or any event.Fields: `first_utm_source|medium|campaign|content`, `latest_utm_source|medium|campaign|content`,
`attribution_landing_page`, `attribution_referrer_origin`, `attribution_first_at`,
`attribution_latest_at`.

Consent and retention (October 2026 release requirement):

- Capture and retention happen **only while the visitor's analytics consent is granted**. The
  module subscribes to the site's consent API (`window.scsConsent.subscribe` — an additive hook;
  the GTM consent logic itself is unchanged), so consent granted after load captures campaign
  parameters still present in the URL.
- Declining, ignoring, or withdrawing consent stores nothing and **deletes any previously
  stored attribution records**.
- Stored touches **expire after 90 days** and are removed on the next read.
- Incoming campaign values are validated (`[a-z][a-z0-9_-]{0,63}`, no 7+ digit runs), so
  arbitrary URL parameters cannot introduce names, emails or phone numbers.
- Capture is best-effort — missing storage or no consent can never block, delay or prevent a
  submission; no attribution is sent in that case. Advertising click identifiers are
  deliberately not collected (no ad campaigns run).
- Regression coverage: `scripts/verify-attribution.mjs` §4–5 (consent grant/decline/withdraw,
  post-load consent, expiration, value validation, payload, missing storage).
- Privacy disclosure: `/privacy/` → "Campaign attribution".

**Offer popup events (Umami now; GA4 requires owner GTM tags).** The first-service-call offer
popup (`src/components/OfferPopup.astro`, "10% Off Your First Service Call") emits:

- Data-layer events **only with consent**: `scs_popup_view`, `scs_popup_dismiss`,
  `scs_popup_cta_click` (each carries only the allowlisted `offer: 'first10'`).
- Umami fixed names, cookieless and independent of consent (matching the existing click-tracking
  behavior): `popup-view`, `popup-dismiss`, `popup-cta-click`.

**No GTM tags/triggers exist for the popup events** — the published container is not modified by
this repository. Owner action if GA4 reporting on the popup is wanted: add three GA4 Event tags
(`scs_popup_view`, `scs_popup_dismiss`, `scs_popup_cta_click`) with matching Custom Event
triggers. Two of the suggested event names need no separate implementation:
`popup_form_start` is covered by the existing `scs_form_start` once the visitor reaches the form,
and `popup_conversion` is covered by `generate_lead` with `cta_slot = popup-first10` when a
claimed offer is submitted (the popup CTA links to `/contact/?offer=FIRST10` and the claim is
attached to the Web3Forms submission as `Offer Claimed`). Regression coverage:
`scripts/verify-popup.mjs`.

### Verifying the live setup

1. Open the site in a fresh session; before choosing anything, confirm **no request** to
   `googletagmanager.com` (DevTools → Network).
2. Choose **Allow analytics**; confirm the GTM container loads once and a `page_view` appears in
   GA4 Realtime / DebugView.
3. Click a call link, a text link and a request CTA → confirm the three events; start the form →
   one `scs_form_start`.
4. Submit a **real test request you control** (or use GTM Preview interception) → one
   `generate_lead` on `/thank-you/`; reloading `/thank-you/` produces no second event.
5. On `/support/`, click a fundraiser button → `scs_support_click` with the correct
   `support_platform` value.
6. Site-side regression: `node scripts/gtm-consent.mjs` (must pass 91/91).

### Diagnosing a failed event

| Symptom | Check |
| --- | --- |
| No events at all in GA4 | Consent not granted; container not published; wrong measurement ID; ad-blockers/browser privacy settings on the test browser |
| GTM Preview shows the event but GA4 does not | GA4 event tag trigger mismatch; tag paused; measurement ID override wrong; Realtime lag (check DebugView) |
| `generate_lead` missing | Form submission not provider-confirmed; receipt already consumed; analytics not permitted; `/thank-you/` visited manually (by design) |
| `scs_support_click` missing | Button missing `data-support-platform`; consent not granted; support tag/trigger not published |
| Duplicate events | Enhanced Measurement form interactions still ON (turn OFF) or a duplicated tag in the container |

---

## Fastest path: import the prepared container

The repository ships a generated import file: **`docs/gtm/SCS-GA4-container-import.json`**
(structurally validated by `node scripts/verify-gtm-import.mjs`). It contains:

- `GA4 - Google Tag - SCS` (Google Tag, `G-EQ9CBESN23`)
- `GA4 - Event - generate_lead` ← custom event `scs_form_confirmed`
- `GA4 - Event - scs_call_click` / `scs_text_click` / `scs_request_click` / `scs_form_start`
- `GA4 - Event - scs_support_click` ← custom event `scs_support_click` (parameter
  `support_platform`)
- Custom-event triggers `CE - scs_*` and one page-view trigger
- Data Layer Variables `DLV - service_category`, `DLV - cta_slot`, `DLV - support_platform`

**Before importing — duplicate safety check:** in GTM, open **Tags** and confirm there is **no**
existing "Google Tag" or GA4 Event tag for this stream. If one exists, either delete it or skip
the import and use the manual steps (the import would otherwise create a second tag).

Import steps:

1. GTM → **Admin** → (Container) **Import Container**.
2. Choose `SCS-GA4-container-import.json`.
3. Workspace: **New workspace** (e.g. `GA4 SCS import`).
4. Import option: **Merge** (not Overwrite). **Never** use Overwrite on a container that has
   anything you care about.
5. Review the preview screen carefully: expect **7 tags, 7 triggers, 3 variables**, and no
   deletions. If the preview shows errors or unexpected items, **discard the import** and use
   the manual steps below — the import file is generated from the documented GTM export shape
   but could not be validated against Google's importer from this environment.
6. Rename nothing; tag names match the manual guide.

### Already-configured containers: minimal support tracking patch

If the container is already configured (from an earlier import or the manual steps) and you
only need to add fundraiser support tracking, use the minimal patch instead of the full
import:

**`docs/gtm/SCS-support-tracking-patch.json`** — contains only:

- `DLV - support_platform` (Data Layer Variable, version 2)
- `CE - scs_support_click` (Custom Event trigger)
- `GA4 - Event - scs_support_click` (GA4 event tag, `support_platform` =
  `{{DLV - support_platform}}`)

**IMPORT USING MERGE, NEVER OVERWRITE.** Before importing, verify these three items do not
already exist (Tags → search `scs_support_click`; Triggers → `CE - scs_support_click`;
Variables → `DLV - support_platform`). If any exist, do **not** import that resource — verify
it manually instead of creating a duplicate. The patch contains no Google base tag and deletes
nothing. Structural checks run via `node scripts/verify-gtm-import.mjs` (validates both
files).

### Import failure history (2026-10-01)

Google's container importer **rejected** the first version of
`docs/gtm/SCS-support-tracking-patch.json` with the exact validation error:

```text
containerVersion.tag[0].vendorTemplate.parameter.measurementIdOverride: The value must not be empty.
```

**Root cause:** the generated GA4 Event (`gaawe`) tags did not carry the required nonempty
`measurementIdOverride` parameter. Google's importer requires every GA4 Event tag to set a
measurement ID override, even when a Google Tag for the same stream exists in the container.

**Correction:** every `gaawe` tag in both JSON files now includes
`{"type":"TEMPLATE","key":"measurementIdOverride","value":"G-EQ9CBESN23"}`, matching genuine
GA4 Event export structures. `scripts/verify-gtm-import.mjs` now fails if any `gaawe` tag is
missing a nonempty measurement ID — for the full import **and** the patch.

**The live import in Google's UI is the final acceptance test.** Local structural checks
passing does not prove the import succeeds; do not report the import as done until the owner
has imported (and later published) the corrected file.

---

## Manual click-by-click (guaranteed path)

Do these in <https://tagmanager.google.com> for container `GTM-MBGJ8SLD`.

1. **Variables.** Variables → New → **Data Layer Variable**:
   - Name `DLV - service_category`, Data Layer Variable Name `service_category`, version 2.
   - Name `DLV - cta_slot`, Data Layer Variable Name `cta_slot`, version 2.
   - Name `DLV - support_platform`, Data Layer Variable Name `support_platform`, version 2.
2. **Google Tag.** Tags → New → **Google Tag**. Tag ID `G-EQ9CBESN23`. Triggering:
   **Initialization – All Pages** (or **All Pages**). Name `GA4 - Google Tag - SCS`. Save.
   This is the **only** Google Tag for this stream.
3. **Lead tag.** Tags → New → **GA4 Event**. Event Name `generate_lead`. Event Parameters:
   `service_category` = `{{DLV - service_category}}`, `cta_slot` = `{{DLV - cta_slot}}`.
   **Measurement ID override: `G-EQ9CBESN23`** — required; the importer rejects GA4 Event
   tags with an empty measurement ID (`vendorTemplate.parameter.measurementIdOverride: The
   value must not be empty`).
   Trigger: New Trigger → **Custom Event**, event name `scs_form_confirmed`, fires on All Custom
   Events. Name `GA4 - Event - generate_lead`. Save.
4. **Intent tags.** Five more GA4 Event tags, same pattern (each with **Measurement ID
   override `G-EQ9CBESN23`**):
   - `GA4 - Event - scs_call_click` → event `scs_call_click`, parameter `cta_slot`
   - `GA4 - Event - scs_text_click` → event `scs_text_click`, parameter `cta_slot`
   - `GA4 - Event - scs_request_click` → event `scs_request_click`, parameter `cta_slot`
   - `GA4 - Event - scs_form_start` → event `scs_form_start`, no parameters
   - `GA4 - Event - scs_support_click` → event `scs_support_click`, parameter
     `support_platform` = `{{DLV - support_platform}}`
   Each trigger: Custom Event with the matching data-layer name.
5. **Do NOT create** a GA4 event tag triggered by a plain `/thank-you/` page view, a second
   page-view tag, or any advertising/remarketing tag.
6. **Preview.** Top right → **Preview** → enter `https://sunshineclimatesolutions.com` (after
   deployment). Tag Assistant should show: **nothing** until you click "Allow analytics", then
   the Google Tag and one page view; each CTA event once; `generate_lead` only after a genuine
   (or intercepted) successful form submission. Test first visit, Allow, Reject, returning
   visitor, and withdrawal.
7. **Publish.** GTM → **Submit** → version name `SCS GA4 launch` → **Publish**. Saving alone
   does not send production data.

---

## After deployment — confirm data is actually arriving

1. GA4 → **Reports → Realtime** and **Admin → DebugView** (with GTM Preview or `debug_mode`).
   Open the live site, choose **Allow analytics**, and confirm `page_view` appears.
2. Click a call link → confirm `scs_call_click`; text link → `scs_text_click`; a "Request
   Service" CTA → `scs_request_click`; start the form → `scs_form_start` once.
3. Submit a **real test request you control** (or use GTM Preview interception) → on
   `/thank-you/` confirm **one** `generate_lead` with `service_category`. Reload `/thank-you/`
   → no second event. Visit `/thank-you/` directly in a fresh session → no event.
4. **Mark the key event:** GA4 → **Admin → Events** (or Key events) → after `generate_lead`
   appears, toggle **Mark as key event**. Do not create page-view-based conversions.
5. **Search Console:** GA4 → **Admin → Product links → Search Console Links** → link the owned
   `sunshineclimatesolutions.com` property to this single web stream.
6. GA4 → Admin → Data Streams → the web stream → set the stream URL to
   `https://sunshineclimatesolutions.com` (canonical apex).
7. Enhanced measurement → Settings → **turn Form interactions OFF** (the validated custom flow
   replaces it). Keep page views/scrolls. Audit outbound clicks for query-string PII.
8. Housekeeping: data retention (Admin → Data Settings; 14 months max), internal/developer
   traffic filters after identifying them, UTM naming conventions. Do not apply destructive
   filters without review.

### Fundraiser support tracking — GA4 owner actions

The website emits `scs_support_click` with the allowlisted `support_platform` parameter
(`gofundme` | `givesendgo`) when a visitor clicks a fundraiser button on `/support/`. To
report on it in GA4:

1. **Custom dimension (required for reporting by platform):** GA4 → **Admin → Custom
   definitions → Create custom dimension**. Dimension name `Support platform`, Scope
   `Event`, Event parameter `support_platform`. This allows reporting split by `gofundme`
   and `givesendgo`. (This repository cannot configure GA4 remotely — it is an owner action
   in the GA4 UI.)
2. **Optional/recommended key event:** GA4 → **Admin → Events** → once `scs_support_click`
   appears, optionally toggle **Mark as key event**. This measures **fundraiser outbound
   intent — NOT a confirmed donation**. Do **not** assign donation revenue or value to this
   event.
3. **Realtime check:** open `/support/`, choose **Allow analytics**, click a platform button
   → confirm `scs_support_click` with `support_platform = gofundme` or `givesendgo`. Before
   permission, no event reaches Google; Umami still records
   `support-gofundme-click` / `support-givesendgo-click` independently (cookieless).

## Conversion measurement specification

- `scs_call_click` / `scs_text_click` are **intent**, not qualified leads — we cannot know from
  a click whether the call was answered or produced work.
- `scs_request_click` and `scs_form_start` are **funnel** signals only.
- `scs_support_click` is an **outbound fundraiser platform click** on `/support/` — it is
  not a donation, not a donor, and not funds received. Never assign it donation revenue.
- `generate_lead` fires only after Web3Forms confirms `response.ok && success === true`, via a
  single-use `sessionStorage` receipt consumed once on `/thank-you/` **and only with analytics
  permission**. Manual/repeat visits, failed validation, spam, HTTP failures and duplicate
  submissions never count.
- Actual booked/paid jobs require a later call-tracking/CRM integration. Until then
  `generate_lead` means "confirmed website inquiry", not "sold job".
- Umami continues independently (cookieless `call-click` / `text-click` / `form-success` /
  `support-gofundme-click` / `support-givesendgo-click`).

## Privacy text — owner approval required

`src/pages/privacy.astro` was updated to describe this actual implementation (container not
loaded until permission; withdrawal stops measurement; a confirmed request is counted only when
analytics is allowed). It is written to be accurate, not to assert legal compliance. Open
questions for the owner/advisor:

1. Florida/US audience — opt-in for Google Analytics is the current, strictest posture; confirm
   it is the desired one.
2. GA4 data retention period (14 months maximum).
3. Whether a vendor/DPA list should be published alongside the privacy page.

## Manual steps remaining (owner)

1. Import the container (or follow the manual steps) and **Publish**. If the container is
   already configured, import only `docs/gtm/SCS-support-tracking-patch.json` using
   **Merge** (never Overwrite) after confirming the three support resources do not already
   exist.
2. Deploy the site (push to `main` after approval) — neither half works alone.
3. Verify Realtime/DebugView, then mark `generate_lead` as a key event.
4. Create the GA4 custom dimension `Support platform` (Event scope, parameter
   `support_platform`); optionally mark `scs_support_click` as a key event (outbound intent
   only — no donation value).
5. Link Search Console; review the privacy wording and the three questions above.

## What could NOT be verified from this environment

- The real GTM container behavior (tags firing in Google's runtime) — requires the published
  container and a deployed site. All site-side behavior is covered by `scripts/gtm-consent.mjs`
  with a stubbed container (91/91).
- The GTM import file against Google's importer — structurally validated only. A real import
  attempt failed once (2026-10-01, empty `measurementIdOverride`); the JSON has been corrected
  and the local checker now guards that field, but **the owner's live import is the final
  acceptance test**.
- Real Web3Forms delivery to the inbox — owner-verified only.
