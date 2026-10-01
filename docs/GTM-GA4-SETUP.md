# GTM + GA4 setup, conversion spec, and owner dashboard steps

September 2026 (corrected). This is the operational sheet for the GA4-via-GTM integration.
The site side is implemented in this repository; the Google dashboard side requires the owner's
Google login. **Nothing is live until the GTM container is published and the site is deployed** —
see the status matrix.

- GTM container: `GTM-MBGJ8SLD` (configured in `src/config/business.ts`, overridable with
  `PUBLIC_GTM_CONTAINER_ID`, empty string disables GTM + consent UI)
- GA4 web-stream measurement ID: `G-EQ9CBESN23` (configured **inside** the GTM container — the
  site never loads `gtag.js` directly)
- No second tag manager, WordPress plugin, or paid tag service is used.

## Status matrix (be precise when reporting)

| Layer | State | Evidence |
| --- | --- | --- |
| Site-installed (this branch) | **Done** | Basic Consent Mode + events verified in built HTML; `scripts/gtm-consent.mjs` 62/62 |
| GTM workspace configured | **NOT done** | Owner: import file or manual steps below |
| GTM published | **NOT done** | Owner presses Submit → Publish |
| GA4 receiving data | **NOT verifiable yet** | Requires published container + deployment |
| `generate_lead` key event | **NOT done** | Owner marks it after data arrives |

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
   Trigger: New Trigger → **Custom Event**, event name `scs_form_confirmed`, fires on All Custom
   Events. Name `GA4 - Event - generate_lead`. Save.
4. **Intent tags.** Five more GA4 Event tags, same pattern:
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
  with a stubbed container (62/62).
- The GTM import file against Google's importer — structurally validated only; the import
  preview is the final check.
- Real Web3Forms delivery to the inbox — owner-verified only.
