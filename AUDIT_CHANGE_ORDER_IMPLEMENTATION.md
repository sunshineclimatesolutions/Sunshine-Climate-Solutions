# September 2026 Design & Content Change Order — Implementation Report

**Branch:** `feat/design-content-audit-sep-2026` · **Base:** production `43b2fea` · **Status:** implemented, tested, committed locally — **not deployed; no DNS/Cloudflare changes made**.

## Summary

Implemented the September 2026 design and content change orders on the existing Astro site:
homepage restructure (hero, ribbons, six-card grid with custom multi-color icons, 2×2 steps,
counties 2×2 beside the map, brands at the bottom), centered-copy pass on homepage and inner
pages, Service Area restructure, About editorial fix, Conditions copy nuance, Services hub
updates, and the search-engine favicon set built from the authentic SCS mark. All existing
conversion paths, analytics, forms, maintenance offer, social links and IndexNow were
preserved. Automated acceptance suite: **35/35 PASS**; smoke and axe suites green.

## Files / routes changed

| Area | Files |
| --- | --- |
| Homepage | `src/pages/index.astro`, `src/content/site/home.md` |
| Components | `src/components/ServiceIcon.astro` (new), `ServiceCard.astro`, `Steps` layout in `global.css` |
| Inner pages | `service-area.astro`, `about.astro`, `faq.astro`, `contact.astro`, `services/index.astro` |
| Content | `src/content/site/about.md` (editorial fix), `src/content/site/faq.md` (conditions nuance), `src/content/site/service-area.md` (mapBand removed), `src/content.config.ts` |
| Styles | `src/styles/global.css` (centering utilities, six-card grid, area-duo, about cards, contact-info, faq headings, steps 2×2) |
| Favicon | `scripts/generate-brand-images.mjs` (ICO+PNG generation), `public/favicon.ico`, `public/favicon-48.png`, `public/favicon-96.png`, `public/brand/icon-192.png`, `src/components/BaseHead.astro` |
| Verification | `docs/verification/screenshots/audit/*` (18 shots), section screenshots regenerated |

## Auditor bullet status (Appendix A)

| Requirement | Status |
| --- | --- |
| Remove dashed/yellow label at hero top | **Done** (hero eyebrow removed; brand/logo in nav untouched) |
| Hero headline + supporting positioning | **Done** — "Honest HVAC. Clear solutions. Local service." + "Independently owned heating and cooling service across Tampa Bay…" |
| White-family hero photo | **BLOCKED — asset needed.** No licensed image available; per directive the text-led hero (safe fallback) is retained. Do not hotlink. Aaron to supply a licensed stock photo if desired. |
| Work photos moved to a lower gallery section | **Satisfied** — proof gallery sits below the text hero with captions; `/our-work/` remains hidden until genuine projects are approved |
| Gold $50 banner: shorter, centered, phone + request underneath | **Done** |
| TAB ribbon: centered, compact, buttons underneath | **Done** |
| $75 maintenance ribbon: bigger centered heading/text, Call + Schedule underneath | **Done** (scope copy unchanged — matches the approved $75 page) |
| Six service cards, 3×2 desktop / 2 tablet / 1 mobile, exact icons | **Done** — six uniform cards; custom original SVGs: silver wrench, gray AC unit with gentle fan (reduced-motion safe), blue sparkles, blue airflow, black briefcase, checklist with green ticks |
| Diagnostic icons (magnifier/electric/clipboard/badge) | **Done** — blue-lens magnifier, electric-yellow bolt, brown clipboard, red badge with green check |
| Center homepage headings/copy | **Done** — short copy centered; long prose (about story, FAQ answers) stays left per the directive's readability exception |
| Steps 2×2 (1/2 above 3/4) | **Done** |
| Counties 2×2 beside the map | **Done** (all widths; no overflow at 390) |
| Reviews: remove dashed tab, gray bg, bigger Google button | **Done** ("Read Our Google Reviews", gold, large) |
| Brands at the bottom | **Done** (moved to page bottom; existing normalized logos) |
| Services hub: centered + consistent promo labels | **Done** — centered hero; promo eyebrows already consistent (no overlap); maintenance panel now references the $75 offering |
| Service Area restructure (counties 2×2 + map right; Beyond callout; coverage centered) | **Done** |
| About: centered, 2×2 bigger cards | **Done** |
| FAQ: centered title/categories; questions left | **Done** |
| Conditions: honest dirty-coil nuance | **Done** (may be straightforward cause; other causes exist; diagnosis first; no cost promises) |
| Contact: centered title/options | **Done** |
| Color scheme | **Reasoned departure:** kept the owner-approved navy/gold brand tokens (authoritative per directive §0/§2) rather than #2D4256/#F9C801 approximations |

## Copy decisions

- Hero headline/lead per directive; FAQ/audit typos were already absent except **"control-board gremlins" → "intermittent electrical or control-board faults"** (about page).
- Conditions copy rewritten to the directive's honest framing (no "not a costly fix" promise for every case).
- No fabricated credentials, hours, ratings, or reviews anywhere; business facts remain sourced from `business.ts`.

## Image / logo / brand sources

- **Favicon set:** generated from the authentic mark (`brand-source/logo-dark-full.png`, derived from the owner's approved Logo 2) — white padded square, PNG 48/96/192 + ICO (16/32/48 PNG-embedded entries), stable URLs, correct MIME verified.
- **Custom icons:** original inline SVGs authored for this change order (no third-party icon licenses).
- **Brand marks/social logos:** existing owner-supplied assets, unchanged.
- **Hero photo:** not sourced (no license/approval) — documented blocker above.

## Business facts requiring Aaron's approval

1. Hero lifestyle photograph (licensed stock) — optional; text-led hero is live otherwise.
2. Nothing else: prices, hours, service scope, certifications and areas all reuse the already-approved configuration.

## Tests — actual results

| Check | Result |
| --- | --- |
| `npm run verify` (astro check + build) | **0 errors / 0 warnings / 0 hints, 16 pages** |
| `scripts/links.mjs` | **787 internal URLs, 0 broken** |
| Acceptance suite (layout grids, centering, favicon MIME, CTA ids, overflow 360/390/768/1024/1440, reduced motion, preselect, console) | **35/35 PASS** |
| `scripts/smoke.mjs` | **ALL PASSED** |
| `scripts/a11y.mjs` | **26 scans, 0 violations** |
| Screenshots | `docs/verification/screenshots/audit/` (390/768/1440 × 6 pages) + `sections/` |

## Performance notes

Hero remains text-led (fast LCP); custom icons are small inline SVGs (no requests); favicons are
1–9 KB; no new blocking assets; no client JS growth; fan animation is CSS-only and disabled under
`prefers-reduced-motion`.

## Known blockers

- **Hero lifestyle photo** (see above). Everything else in both appendices is implemented or
  intentionally satisfied by existing approved content.

## Confirmation

**No production deployment, DNS, Cloudflare settings, analytics, or paid services were changed.**
Work is committed on the feature branch only.

## Post-deploy manual steps (after Aaron authorizes)

1. Merge/publish the branch (push to `main` triggers Cloudflare + IndexNow for changed pages).
2. Google Search Console → URL Inspection for `https://sunshineclimatesolutions.com/` →
   **Request Indexing** (favicon eligibility; Google decides if/when the search icon updates
   after recrawl — no immediate change is promised).
3. Verify `/favicon.ico` and `/favicon-48.png` return 200 image responses in production.
