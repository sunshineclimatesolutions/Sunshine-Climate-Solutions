# September 2026 Final Corrections — Basic Consent Mode, Gallery Fix, GTM Setup

**Branch:** `feat/scs-light-aesthetic-overhaul-sep-2026` · **Base commit:** `acfcd85` ·
**Status:** implemented, verified, committed and pushed to this feature branch only — **not
merged, not deployed; no Cloudflare/DNS change and no GTM publish.** This supersedes the
consent and gallery details of `AESTHETIC_OVERHAUL_IMPLEMENTATION.md`.

## Task 1 — Google consent corrected to Basic Consent Mode

The previous implementation loaded GTM with denied defaults (advanced-style), which contradicted
the privacy notice. Now:

- **No GTM container, no GA4 and no request to Google before explicit permission.** The head
  script only initializes `dataLayer`/`gtag`, pushes Consent Mode v2 defaults
  (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization` all `denied`), and
  reads the stored choice. GTM is injected dynamically (`loadGtm()`) only after permission, with
  the granted `consent update` applied first. Returning consenting visitors auto-load with no
  repeat prompt.
- **Advertising consent is never granted**; no ad/remarketing tags are created.
- **Withdrawal and rejection stop collection:** consent update denied + the Google tag disable
  flag (`ga-disable-G-EQ9CBESN23`) is set; re-allowing clears it. No second container is ever
  loaded (guarded, and the script tag is checked before injecting).
- **The GTM `<noscript>` iframe was removed** (it would transmit without any consent choice).
- **Nothing from before permission is replayed:** call/text/request click events and
  `scs_form_start` are pushed only with permission; a pre-permission form interaction marks the
  single-fire flag without pushing, so it can never fire later.
- **Confirmed-lead receipt:** `scs_form_confirmed` (GA4 `generate_lead`) still comes only from a
  Web3Forms-confirmed success, via a single-use `sessionStorage` receipt consumed once on
  `/thank-you/`. With permission already given it fires immediately; **undecided keeps it
  pending and granting on the thank-you page transmits it once; refusal drops it without
  transmission.** Manual/repeat visits, failed submissions and duplicates never count.
- **Umami unchanged and independent** (cookieless `call-click` / `text-click` / `form-success`).
- One container (`GTM-MBGJ8SLD`) and one GA4 Google Tag (`G-EQ9CBESN23`, configured inside the
  container; the site never loads gtag.js directly).
- **Privacy notice updated** to describe this exact behavior (container not loaded until
  permission; withdrawal stops measurement; a confirmed request is counted only when analytics
  is allowed). `AGENTS.md` and `docs/GTM-GA4-SETUP.md` updated to match.

Files: `src/components/BaseHead.astro`, `src/components/ConsentBanner.astro`,
`src/layouts/BaseLayout.astro`, `src/components/ContactForm.astro`, `src/pages/thank-you.astro`,
`src/pages/privacy.astro`, `src/env.d.ts`, `AGENTS.md`, `docs/GTM-GA4-SETUP.md`.

## Task 2 — Photographic galleries fixed (root cause)

**Root cause:** the responsive `<img>` elements carry the source `width`/`height` attributes
(e.g. `1500x2000`) as HTML presentational hints. `.photo-card img` set `width: 100%` and
`aspect-ratio: 4/3` but never reset `height`, so the used height stayed at the attribute value —
every card rendered **2000px tall** (measured 348×2000, 498×1200, etc.) and the aspect ratio was
ignored. This affected the homepage Workmanship gallery, the TAB field-photography section and
the FAQ conditions photo.

**Fix:** `height: auto` (+ `display: block`) on `.photo-card img`, so the fixed 4:3 card crop
applies; per-photo focal points (`position` field, wired through `PhotoCard` and the content
schema) keep subjects centered — the ductboard plenum is framed on the unit and the vehicle
branding is cropped out; the TAB pair now uses two equal columns. Measured result at all widths:
home 348×261 / 339×254 / 323×242, TAB and FAQ 498×374 at desktop — all exactly 4:3.

Files: `src/styles/global.css`, `src/components/PhotoCard.astro`, `src/content.config.ts`,
`src/pages/index.astro`, `src/pages/tab-commissioning-support.astro`, `src/pages/faq.astro`,
`src/content/site/home.md`, `src/content/site/tab.md`.

Evidence: `docs/verification/screenshots/aesthetic/galleries/` (home proof, TAB field, FAQ
conditions at 390/768/1440) and refreshed `after-final/home-*`, `after-final/tab-*`,
`after-final/home-workmanship-*`.

## Task 3 — Analytics quality control (genuine browser + network tests)

`scripts/gtm-consent.mjs` was rewritten for Basic Consent Mode and runs against the real
production-equivalent build with the GTM container stubbed and all third-party requests
intercepted (nothing leaves the machine). **85/85 checks pass**, covering: no GTM request before
permission; none after rejection (including on return); GTM loads exactly once after permission
with correct default→update→load ordering; returning-consent auto-load; withdrawal and re-allow
(including the disable flag); no replay of pre-permission call/text/request events; no duplicate
events; confirmed submissions produce exactly one lead (including when permission is granted on
the thank-you page); refusal never transmits; manual thank-you visits, provider failures and
duplicate submits produce zero leads; Umami still records call/text clicks; no PII in the data
layer; preview builds contain no GTM/consent UI.

**Disclosed limitation:** actual GA4 tag firing, page-view counts, Realtime/DebugView and the
key-event flag require the owner's published GTM container and deployment. The site-side
contract (what is pushed, when, and with what permission) is fully covered above.

## Task 4 — Google dashboard setup made easy

- `docs/GTM-GA4-SETUP.md` rewritten: status matrix, exact click-by-click manual path, import
  path, post-deploy verification (Realtime/DebugView), key-event marking, Search Console link,
  enhanced-measurement settings, conversion specification and the open privacy questions.
- `docs/gtm/SCS-GA4-container-import.json` — a generated, importable container (Google Tag,
  `DLV - service_category`, `DLV - cta_slot`, five custom-event triggers, one page-view trigger,
  five GA4 event tags incl. `generate_lead`) built to the current GTM export shape
  (`exportFormatVersion: 2`; `googtag`/`tagId`; `gaawe`/`eventSettingsTable`; snake-case enum
  types) and verified against a current real-world export structure.
- `scripts/verify-gtm-import.mjs` — **41/41 structural checks** (unique IDs/names, no dangling
  trigger/variable references, exactly one Google Tag for `G-EQ9CBESN23`, exactly one tag per
  approved event, `generate_lead` ← `scs_form_confirmed`, no second page-view tag, no legacy
  config or advertising tags).
- Duplicate safety: the guide requires checking for existing GA4 tags first, importing into a
  **new workspace** with **Merge** (never Overwrite), and reviewing the import preview; if
  anything is unexpected, discard and use the manual steps (the guaranteed path). The import
  file could not be validated against Google's importer from this environment and this is
  stated plainly.

## Task 5 — Verification, screenshots, handoff

| Check | Result |
| --- | --- |
| `npm run verify` | **0 errors / 0 warnings / 0 hints, 16 pages** |
| `scripts/links.mjs` | **819 internal URLs, 0 broken** |
| `scripts/smoke.mjs` | **ALL PASSED** |
| `scripts/a11y.mjs` | **26 scans, 0 violations** |
| `scripts/verify-layout.mjs` | **582/582** |
| `scripts/verify-maps.mjs` | **36/36** |
| `scripts/gtm-consent.mjs` | **85/85** |
| `scripts/verify-gtm-import.mjs` | **41/41** |

Screenshots (committed): refreshed `docs/verification/screenshots/aesthetic/after-final/`
(home, TAB, Workmanship section, consent states), new
`docs/verification/screenshots/aesthetic/galleries/` (corrected galleries at 390/768/1440), and
the previously committed map before/after sets. No personal data, form submissions or
credentials are present.

## Owner approval gates

1. Review the corrected gallery screenshots and the consent behavior on the preview.
2. Configure GTM (import or manual) and publish; then deploy.
3. Confirm Realtime/DebugView, mark `generate_lead` as a key event, link Search Console.
4. Answer the privacy questions in `docs/GTM-GA4-SETUP.md`.

**No merge to `main`, no deploy, no Cloudflare/DNS change, no GTM publish was performed.**
