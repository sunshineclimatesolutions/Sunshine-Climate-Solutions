# Verification

What has actually been tested, where, and what remains unverified. This file is updated as
verification continues. **Last updated: Logo 2 branding + Google review QR implementation
(branch `brand-logo2-review`).**

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
