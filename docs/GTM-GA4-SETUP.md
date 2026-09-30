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

`service_category` is a closed allowlist: `repair`, `maintenance`, `installation`, `airflow`,
`commercial`, `tab`, `other`. `cta_slot` is the existing `data-cta` id (e.g. `call-hero`).
No names, phone numbers, emails, ZIP codes, descriptions or other customer-provided data are
ever pushed.

---

## Fastest path: import the prepared container

The repository ships a generated import file: **`docs/gtm/SCS-GA4-container-import.json`**
(structurally validated by `node scripts/verify-gtm-import.mjs`, 41/41). It contains:

- `GA4 - Google Tag - SCS` (Google Tag, `G-EQ9CBESN23`)
- `GA4 - Event - generate_lead` ← custom event `scs_form_confirmed`
- `GA4 - Event - scs_call_click` / `scs_text_click` / `scs_request_click` / `scs_form_start`
- Custom-event triggers `CE - scs_*` and one page-view trigger
- Data Layer Variables `DLV - service_category`, `DLV - cta_slot`

**Before importing — duplicate safety check:** in GTM, open **Tags** and confirm there is **no**
existing "Google Tag" or GA4 Event tag for this stream. If one exists, either delete it or skip
the import and use the manual steps (the import would otherwise create a second tag).

Import steps:

1. GTM → **Admin** → (Container) **Import Container**.
2. Choose `SCS-GA4-container-import.json`.
3. Workspace: **New workspace** (e.g. `GA4 SCS import`).
4. Import option: **Merge** (not Overwrite). **Never** use Overwrite on a container that has
   anything you care about.
5. Review the preview screen carefully: expect **6 tags, 6 triggers, 2 variables**, and no
   deletions. If the preview shows errors or unexpected items, **discard the import** and use
   the manual steps below — the import file is generated from the documented GTM export shape
   but could not be validated against Google's importer from this environment.
6. Rename nothing; tag names match the manual guide.

---

## Manual click-by-click (guaranteed path)

Do these in <https://tagmanager.google.com> for container `GTM-MBGJ8SLD`.

1. **Variables.** Variables → New → **Data Layer Variable**:
   - Name `DLV - service_category`, Data Layer Variable Name `service_category`, version 2.
   - Name `DLV - cta_slot`, Data Layer Variable Name `cta_slot`, version 2.
2. **Google Tag.** Tags → New → **Google Tag**. Tag ID `G-EQ9CBESN23`. Triggering:
   **Initialization – All Pages** (or **All Pages**). Name `GA4 - Google Tag - SCS`. Save.
   This is the **only** Google Tag for this stream.
3. **Lead tag.** Tags → New → **GA4 Event**. Event Name `generate_lead`. Event Parameters:
   `service_category` = `{{DLV - service_category}}`, `cta_slot` = `{{DLV - cta_slot}}`.
   Trigger: New Trigger → **Custom Event**, event name `scs_form_confirmed`, fires on All Custom
   Events. Name `GA4 - Event - generate_lead`. Save.
4. **Intent tags.** Four more GA4 Event tags, same pattern:
   - `GA4 - Event - scs_call_click` → event `scs_call_click`, parameter `cta_slot`
   - `GA4 - Event - scs_text_click` → event `scs_text_click`, parameter `cta_slot`
   - `GA4 - Event - scs_request_click` → event `scs_request_click`, parameter `cta_slot`
   - `GA4 - Event - scs_form_start` → event `scs_form_start`, no parameters
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

## Conversion measurement specification

- `scs_call_click` / `scs_text_click` are **intent**, not qualified leads — we cannot know from
  a click whether the call was answered or produced work.
- `scs_request_click` and `scs_form_start` are **funnel** signals only.
- `generate_lead` fires only after Web3Forms confirms `response.ok && success === true`, via a
  single-use `sessionStorage` receipt consumed once on `/thank-you/` **and only with analytics
  permission**. Manual/repeat visits, failed validation, spam, HTTP failures and duplicate
  submissions never count.
- Actual booked/paid jobs require a later call-tracking/CRM integration. Until then
  `generate_lead` means "confirmed website inquiry", not "sold job".
- Umami continues independently (cookieless `call-click` / `text-click` / `form-success`).

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

1. Import the container (or follow the manual steps) and **Publish**.
2. Deploy the site (push to `main` after approval) — neither half works alone.
3. Verify Realtime/DebugView, then mark `generate_lead` as a key event.
4. Link Search Console; review the privacy wording and the three questions above.

## What could NOT be verified from this environment

- The real GTM container behavior (tags firing in Google's runtime) — requires the published
  container and a deployed site. All site-side behavior is covered by `scripts/gtm-consent.mjs`
  with a stubbed container (62/62).
- The GTM import file against Google's importer — structurally validated only; the import
  preview is the final check.
- Real Web3Forms delivery to the inbox — owner-verified only.
