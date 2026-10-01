# Verification

What has actually been tested, where, and what remains unverified. This file is updated as
verification continues. **Last updated: October 2026 (external platform status addendum);
the verification sections below remain dated records of their passes.**

## October 2026 — external platform status (owner-confirmed)

The site-side verification below is unchanged. Since those passes were recorded, the owner
confirmed the external platform configuration through dashboards: GTM support-tracking patch
imported and published; GA4 collecting events with `generate_lead` configured as a key event
and all three custom dimensions created; Google Business Profile linked to GA4; Search Console
domain property verified and recording; Bing Webmaster Tools active (long titles corrected) and
Bing Places published/synchronized; fundraiser tracking live.

**Current platform status — including what remains unverified — is maintained only in
`docs/operations/PLATFORM-STATUS.md`.** The dated sections below are historical records and
may show earlier states (e.g. "GTM workspace PENDING" at the time of that pass).

## September 2026 aesthetic overhaul + GA4/GTM + Gulf of America — verification

| Check | Result |
| --- | --- |
| `npm run verify` | **PASS** — 0 errors / 0 warnings / 0 hints, 16 pages |
| `scripts/links.mjs` | **PASS** — 819 internal URLs, 0 broken |
| `scripts/smoke.mjs` (360/1440) | **PASS** — conversions, action bar, validation, nav intact; 0px overflow |
| `scripts/a11y.mjs` (axe-core) | **PASS** — 26 scans, 0 violations (consent banner included) |
| `scripts/gtm-consent.mjs` (new) | **PASS — 56/56** — consent defaults/update ordering, banner + preferences, no ad consent, click events, single-fire form start, receipt-based `generate_lead`, manual thank-you never counts, provider failure never counts, no PII in the data layer, preview-mode build guard |
| `scripts/verify-layout.mjs` (new) | **PASS — 582/582** — 15 routes × 390/768/1440: no overflow, one h1, Archivo/Public Sans typography, ≥44px buttons, all images loaded with alt, token colors, centered heroes, grid column invariants (6-card 3/2/1, counties 2×2, steps 2×2), form errors hidden pre-submit |
| `scripts/verify-maps.mjs` (new) | **PASS — 36/36** — both SVGs (public + dist) display GULF OF AMERICA, never the former label, all four county labels, accessible title/desc, page alt text updated |
| Map generator guard | **PASS** — regeneration asserts the Gulf label on both variants at ≥10px rendered and fails if the old name appears |
| Preview-mode gate | **PASS** — `PUBLIC_PREVIEW_MODE=true` build contains no GTM, no consent UI, noindex + Disallow-all |
| Screenshots | `docs/verification/screenshots/aesthetic/` — `maps-before/` vs `maps-after/` (map change-order pairs at 390/768/1440), `after-final/` (full 16-route set + section close-ups + consent banner/preferences states at 390/1440); superseded `before/`+`after/` retained on disk |
| Defects found & fixed in review | (1) **Pre-existing on main:** `.field-error { display:flex }` defeated the `hidden` attribute — every contact-form validation message rendered permanently; fixed with `.field-error[hidden]{display:none}` + regression check. (2) New consent component: preferences panel visible on first load; fixed with `.consent-preferences[hidden]{display:none}` + test check. (3) Screenshot route for 404 lacked the trailing slash and captured Astro's built-in page; corrected to the real custom 404 |
| **Owner visual approval** | **PENDING** — final screenshots on disk for review; agent inspection limited by image-context policy |
| **GTM workspace + publish / deployment** | **PENDING** — owner dashboard steps in `docs/GTM-GA4-SETUP.md`; no deploy without approval |

## September 2026 final corrections — Basic Consent Mode, galleries, GTM import

| Check | Result |
| --- | --- |
| Basic Consent Mode (site) | **Done** — GTM container and GA4 are not loaded and **no request reaches Google** until the visitor allows analytics; Consent Mode v2 defaults all-denied are set first, granted is applied *before* GTM loads; returning consent auto-loads; withdrawal/refusal returns to denied, sets the Google tag disable flag and drops any pending lead; the GTM `<noscript>` iframe was removed; events are only pushed with permission (no replay) |
| `npm run verify` | **PASS** — 0 errors / 0 warnings / 0 hints, 16 pages |
| `scripts/links.mjs` | **PASS** — 819 internal URLs, 0 broken |
| `scripts/smoke.mjs` | **PASS** |
| `scripts/a11y.mjs` | **PASS** — 26 scans, 0 violations |
| `scripts/verify-layout.mjs` | **PASS — 582/582** |
| `scripts/verify-maps.mjs` | **PASS — 36/36** |
| `scripts/gtm-consent.mjs` (rewritten) | **PASS — 85/85** — no GTM request before permission; none after rejection; loads exactly once after permission; returning-consent auto-load; withdrawal + re-allow; no replay of pre-permission events; no duplicate events; one lead for confirmed submissions; zero leads on manual thank-you, failures and duplicates; Umami independent; no PII; preview-mode guard |
| `scripts/verify-gtm-import.mjs` (new) | **PASS — 41/41** — one Google Tag for `G-EQ9CBESN23`, one GA4 event tag per approved event, `generate_lead` ← `scs_form_confirmed`, no second page-view tag, no dangling references, no duplicates |
| Gallery root cause | **Found and fixed** — the responsive `<img>` carries source `width`/`height` attributes (e.g. 1500×2000) as presentational hints; `.photo-card img` never reset `height`, so the used height stayed at the attribute value and `aspect-ratio: 4/3` was ignored → 2000px-tall narrow images. Fix: `height: auto` (+ `display: block`), plus per-photo focal points and equal TAB columns |
| Gallery evidence | `docs/verification/screenshots/aesthetic/galleries/` (home proof, TAB field, FAQ conditions × 390/768/1440); refreshed `after-final/home-*`, `after-final/tab-*`, `after-final/home-workmanship-*` |
| GTM import file | `docs/gtm/SCS-GA4-container-import.json` — structurally validated against the current GTM export shape (`exportFormatVersion: 2`, `googtag`/`tagId`, `gaawe`/`eventSettingsTable`); manual steps remain the guaranteed path; owner guide in `docs/GTM-GA4-SETUP.md` |
| **Published-container behavior** | **NOT verifiable here** — real tag firing, GA4 Realtime/DebugView and key-event marking require the owner's GTM publish + deployment |

## IndexNow — verification

| Check | Result |
| --- | --- |
| Key file | `public/<key>.txt` (32-char lowercase-hex key, content = filename) — present in `dist/` after build; served locally as HTTP 200 `text/plain`, 32 bytes |
| `npm run verify` | **PASS** — 0 errors / 0 warnings / 0 hints, 16 pages |
| `scripts/links.mjs` | **PASS** — 669 internal URLs, 0 broken |
| Script dry-run (`--range 694ee5c..HEAD --dry-run`) | **PASS** — derived exactly the 7 genuinely-changed canonical URLs from git history (not the sitemap); live verification passed for all (HTTP 200, indexable); no submission sent |
| Automation | `.github/workflows/indexnow.yml` — runs on push to `main` only, waits for the live pages, one batched POST to the shared endpoint; no secrets; does not build/deploy |
| Live key file + real submission | recorded in the release report after deployment |

## Umami Cloud analytics — verification

| Check | Result |
| --- | --- |
| `npm run verify` + built output | **PASS** — 0/0/0; loader + website ID + click listener present in the production build |
| `scripts/links.mjs` / smoke / a11y | **PASS** — 0 broken links; ALL PASSED; 0 violations |
| Preview-mode gate | **PASS** — a `PUBLIC_PREVIEW_MODE=true` build contains **no** Umami loader (and remains noindex); the normal build contains it — preview/test traffic cannot pollute the dashboard |
| Event behavior (real browser, provider mocked — no real submission) | **PASS** — `call-click` on tel links, `text-click` on sms links, `form-success` fires **exactly once and only after Web3Forms confirms success** (none on rejection), real `/thank-you/` redirect preserved |
| PII rule | **PASS** — every `umami.track` call observed carries a single fixed event name; no payloads, no form contents, no numbers |
| Privacy page | Updated: honest Analytics disclosure (Umami, cookieless, aggregate; no universal-consent claims); outdated "no analytics" copy removed |

## $75 Premium AC Maintenance — verification

| Check | Result |
| --- | --- |
| `npm run verify` | **PASS** — 0 errors / 0 warnings / 0 hints, 16 pages |
| `scripts/links.mjs` | **PASS** — 669 internal URLs, 0 broken |
| `scripts/smoke.mjs` | **PASS** |
| `scripts/a11y.mjs` (maintenance page added) | **PASS** — 26 scans, 0 violations |
| Maintenance check suite | **29/29 PASS** — price consistency ("$75 per system, per visit"), all four confirmed cleanings present, exclusions + authorization wording, maintenance vs $50 service-call distinction, no membership language, no positive guarantee claims (honest disclaimer present), homepage promo + preselect link, contact form option + URL preselect verified in browser, services index/homepage/footer listings, contextual links from AC-repair and installation pages, Call/Request CTAs, 0px overflow at 360/768/1440 |
| Screenshots | `docs/verification/screenshots/service-ac-maintenance-{360,1440}.jpg`, `sections/home-maintenance-{360,1440}.jpg` |
| Owner scope approval | **APPROVED by owner; published in release `04e6e7d`** |


## Phase 2A local-SEO metadata — verification

| Check | Result |
| --- | --- |
| `npm run verify` | **PASS** — 0 errors / 0 warnings / 0 hints, 15 pages |
| Built titles/descriptions | Homepage + `/services/ac-repair-diagnostics/` carry the Spring Hill metadata; other service pages unchanged (verified in `dist/`) |
| `scripts/links.mjs` | **PASS** — 607 internal URLs, 0 broken |
| `scripts/smoke.mjs` | **PASS** |
| `scripts/a11y.mjs` | **PASS** — 24 scans, 0 violations |
| Canonical URLs | Unchanged (self-referencing production domain) |

## Visual polish pass — verification

| Check | Result |
| --- | --- |
| `npm run verify` | **PASS** — 0 errors / 0 warnings / 0 hints, 15 pages |
| `scripts/links.mjs` | **PASS** — 607 internal URLs, 0 broken |
| `scripts/smoke.mjs` (360/1440) | **PASS** |
| `scripts/a11y.mjs` (axe-core, 24 scans) | **PASS** — 0 violations |
| Skip link — hidden by default | **PASS** — computed `top:-64px`, not focused, in normal browsing |
| Skip link — keyboard focus | **PASS** — Tab focuses it, slides into view (`top:6px`), Enter jumps to `#main`; documented in `docs/verification/screenshots/skip-link-focused-360.jpg` |
| Skip link — screenshot artifact | **RESOLVED** — the gold bar in earlier captures was a Playwright `captureBeyondViewport` artifact (fixed elements painted into expanded captures; DOM proved hidden). Automation now suppresses the skip link for captures only (`addInitScript` in both screenshot scripts); keyboard behavior untouched and verified separately |
| Mobile action bar clearance | **PASS** — worst gap 254px above the bar at page bottoms across 6 routes at 360px |
| Overflow + image loading (360/768/1440) | **PASS** — 0px overflow; all images loaded on all checked routes |
| CTA integrity | **PASS** — 8 tel / 5 sms / 9 request links, all correctly formed (`tel:+17276615200`, `sms:+17276615200`) |
| Polish check suite | **22/22 PASS** |

## Portfolio proof milestone — verification

| Check | Result |
| --- | --- |
| `npm run verify` | **PASS** — 0 errors / 0 warnings / 0 hints, 15 pages |
| `scripts/links.mjs` | **PASS** — 608 internal URLs, 0 broken |
| `scripts/smoke.mjs` (360/1440) | **PASS** — all conversions intact, 0px overflow |
| `scripts/a11y.mjs` (axe-core, 24 scans) | **PASS** — 0 violations |
| Section geometry probe (360/768/1440) | **PASS** — 3 proof cards, 6 brand boxes, compact map, full map band + CTA, 2 TAB photos, 1 conditions photo; 0px overflow everywhere; no console errors |
| Lazy-loading confirmation (scroll-through) | **PASS** — 6/6 brands, compact map, 2/2 TAB photos, conditions photo all load on scroll |
| Map accuracy | Census 2025 boundaries; county names asserted against `business.ts`; label-fit + north→south geography checks passed (`docs/SERVICE-AREA-MAP.md`) |
| Logo normalization | All 6 manufacturer logos trimmed/normalized to ≤360px, aspect preserved ≤0.34% delta (verified programmatically) |
| Screenshots | Full set (home/service-area/tab/faq at 360/768/1440) + 12 section close-ups in `docs/verification/screenshots/sections/` + labeled contact sheet |
| **Owner visual/crop approval** | **PENDING** — contact sheet + section screenshots for review; agent cannot visually inspect images |
| **Owner facts for `/our-work/`** | **PENDING** — see `docs/PORTFOLIO-APPROVAL.md`; no project entries fabricated |

## Environment

- OS: Windows (PowerShell 5.1 test runner)
- Node v24.19.0, npm 11.17.0
- Astro 5.18.2, TypeScript strictest preset (`exactOptionalPropertyTypes` on)
- Browser checks: Playwright Chromium, axe-core via `@axe-core/playwright`
- Server under test: `astro preview` serving the **production build** (`npm run build`),
  `PUBLIC_PREVIEW_MODE` unset (production settings)

> **Preview-server pitfall (observed this session):** a leftover `astro preview` process can
> keep port 4321 bound with a stale in-memory snapshot while new instances fail to bind —
> making checks silently run against an OLD build. Before trusting any preview-based check,
> ensure the port is free (e.g. `Get-NetTCPConnection -LocalPort 4321`) and confirm the served
> CSS/HTML hash matches `dist/`.

## Build & types

| Check | Result |
| --- | --- |
| `npm run verify` (check + build) | **PASS** — 0 errors, 0 warnings, 0 hints; 14 pages + `sitemap-index.xml` + `robots.txt` |
| Empty `projects`/`reviews` collections | Our Work page **not built**, no nav/footer links to it (verified in `dist/`) — intentional |
| robots.txt (production) | `User-agent: * Allow: /` + sitemap URL — **PASS** |
| `/thank-you/` | `noindex, follow` in production build — **PASS** |
| Sitemap | 12 routes, excludes 404 and thank-you — **PASS** |

## Content extraction (site collection) — render-identity proof

Page copy for home, about, contact, service-area, and TAB was moved from inline markup into
`src/content/site/*.md` (this session). Verification method: snapshot the pre-change `dist/`,
rebuild, then compare all five pages after entity-decoding + whitespace normalization.

| Page | Result |
| --- | --- |
| `/`, `/about/`, `/contact/`, `/service-area/`, `/tab-commissioning-support/` | **RENDER-IDENTICAL** — only HTML entity escaping (e.g. `’` → `&#39;`) and whitespace shifts; zero content differences |

One transcription error (about page pricing card title) was caught by the same diff and fixed
before commit.

## Smoke test (`node scripts/smoke.mjs`)

Real-browser checks against the production build at **360px** and **1440px** — re-run after
every phase this session (recovery, extraction, image system, contrast fix):

| Check | Result |
| --- | --- |
| `/` and `/contact/` HTTP status | 200 both viewports — **PASS** |
| Horizontal overflow | **0px at 360 and 1440** — PASS |
| Gold contact strip visible without opening nav at 360 | **PASS** |
| Sticky action bar at 360 | 3 buttons, 53px tall, body padding reserves space — **PASS** |
| Mobile nav / form validation / tel:/sms: links | **PASS** (8 tel + 5 sms per page) |
| Console/page errors | **None** — PASS |

## Internal link checker (`scripts/links.mjs` — added this session)

| Check | Result |
| --- | --- |
| All `href`, `src`, `srcset` URLs across 14 built pages | **496 internal URLs, 0 broken** — PASS |
| Negative test (poisoned fixture with bad href/src/srcset) | All breakages detected, exit code 1 — **PASS** |

## Accessibility (`node scripts/a11y.mjs` — axe-core, WCAG 2.2 AA)

| Check | Result |
| --- | --- |
| 11 routes × mobile (390px) + desktop (1280px) = 22 scans | **0 violations** — PASS |

A pre-existing defect was found and fixed this session: `.eyebrow` labels on **light**
surfaces used gold (`--c-gold-strong`, contrast 1.97–2.14:1 — below the 4.5:1 minimum, and
against the site's own documented "never gold small text on light surfaces" rule). Light-surface
eyebrows now use `--c-navy` (≈13:1); dark-surface eyebrows keep gold (passing). After the fix:
0 violations across all 22 scans. Report: `docs/verification/a11y-report.json`.

## Image guardrail tool (`scripts/photo.mjs` — added this session)

| Check | Result |
| --- | --- |
| Report mode on oversized fixture (5000×3000, 10 MB) | Both warnings raised (edge >4000px, size >1 MB), exit 1 — **PASS** |
| Dry run without `--write` | No files modified — **PASS** |
| `--resize 2000 --write` | 5000×3000 → **2000×1200** (aspect preserved, `fit: inside`, no crop), 10 253 KB → **611 KB** — **PASS** |
| Recheck after resize | Clean, exit 0 — **PASS** |

## Screenshots (`node scripts/screenshot.mjs`)

Committed set captured at 360/768/1440 including mobile nav-open and form-validation states:
`docs/verification/screenshots/`. **The engineering agent cannot visually inspect images** —
these are rendered for the owner's human review; layout behavior is verified programmatically
(smoke test geometry checks). Owner visual pass: **pending**.

## Form implementation review (static + code inspection)

- Unchanged from the previous session; re-verified present in built HTML: action
  `https://api.web3forms.com/submit`, honeypot `botcheck`, access key rendered.
- Success only after JSON `success: true`; distinct honest failure messages; missing-key
  fallback renders call/text/email, never fake success.

## Text encoding audit (this session)

- Found and fixed pre-existing mojibake (double-encoded UTF-8: `â€™`/`â€"`) in
  `src/pages/services/index.astro` — visible on the live `/services/` page until now.
- `git grep` audit across all tracked files: **no remaining mojibake**.

## Branding (Logo 2) + review QR — this implementation

| Check | Result |
| --- | --- |
| Logo extraction (trim + white→transparent, cluster-anchored un-blend) | 1319×383 content crop; interior colors snap to measured artwork colors (navy rgb(21,45,68), gold rgb(236,191,41)); AA edge band 4.6% — **PASS** |
| Clipping/distortion check (numeric) | All four crop edges show sparse letter-tip density (117/19/16/19 solid px), not straight cuts; zero resampling → zero distortion — **PASS** |
| QR generation (`qrcode` lib, EC-H, 4-module quiet zone) | SVG 61×61 modules + PNG 560px + print 3000px — **PASS** |
| QR independent decode verification (jsQR in browser) | All three generated assets decode to the **exact** `business.reviewsSubmissionUrl` — **PASS** |
| Brand assets in build | All 9 assets (logos, favicon, icons, og, QR×3) present in `dist/` — **PASS** |
| Header/footer geometry (360/768/1440) | Header mark 127×37px, footer 171×50px, **0px overflow at all widths**, logo image loads at 2.6× display (retina-clear) — **PASS** |
| Review page at 360/1440 | QR 259/288px square (scannable), button 74/55px tall with correct g.page URL, 0px overflow — **PASS** |
| `/leave-review/` integration | Footer link, sitemap entry, 576 internal URLs 0 broken (15 pages) — **PASS** |
| Payload | `dist/` 0.67 MB / 35 files (was 0.53 MB / 29): delta is the QR (+52 KB incl. print asset), logos (+24 KB), favicon (+11 KB), og (+27 KB); page-critical additions = one 12 KB header logo image — **no meaningful page-weight regression**; Lighthouse baseline still pending (pre-existing) |

## Not yet verified (pending)

- **Owner visual review** of the screenshot set — now including the new Logo 2 in
  header/footer (light variant), the favicon/icons/OG card, and the `/leave-review/` page.
- **Owner identity confirmation for the Google review destination** — the generated QR and
  button resolve to `business.reviewsSubmissionUrl` (decode-verified); the owner should
  confirm that this Google Business Profile place ID is Sunshine Climate Solutions' own.
- **Lighthouse lab metrics** (LCP/CLS/TBT medians ×3 runs) — runner not yet added; targets
  remain LCP ≤ 2.0s (stretch <1.8s), CLS ≤ 0.05.
- **Real Web3Forms delivery to the inbox** — requires an owner-authorized live submission.
- **Production deployment behavior** (DNS/HTTPS/canonical redirects) — pending deployment
  authorization. Local commits are NOT pushed (pushing `main` triggers the production build).

## Known limitations

- Prelaunch lab results are not real-user Core Web Vitals; field data requires postlaunch
  traffic.
- The `projects`/`reviews` collections are intentionally empty; corresponding UI is hidden.
  Build logs "collection … is empty" notices while they are empty — expected.
- WCAG 2.2 AA: automated scans pass; manual review (keyboard walkthrough, zoom, screen-reader
  pass) by the owner is still recommended before launch.
