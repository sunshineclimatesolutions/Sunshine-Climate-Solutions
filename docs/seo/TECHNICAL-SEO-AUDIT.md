# Technical SEO audit — September 2026

Method: built output inspection (`scripts/seo-inventory.mjs`), the project's automated suites
(links, a11y, layout, smoke, GTM/consent, maps, marketing), live production checks
(https://sunshineclimatesolutions.com, read-only), and the documented history in
`docs/VERIFICATION.md`. No SEO-tool scores were chased; every finding states its business impact.

Severity: **CRITICAL / HIGH / MEDIUM / LOW / INFORMATIONAL**

## Findings

| # | Severity | Finding | Impact | Action |
| --- | --- | --- | --- | --- |
| 1 | HIGH | **Google Business Profile pin appears to resolve near Tampa/Carrollwood (~28.11, -82.54), ~20 miles south of Spring Hill** (citation research, Sept 2026). For a service-area business Google may approximate the pin, but a wrong city anchor weakens Maps relevance for Spring Hill searches — the primary market. | Local pack visibility for the home market | **Owner action:** open the GBP, confirm/repair the service-area and address display. Repo cannot change this. |
| 2 | HIGH | **No Bing Places / Apple Business Connect presence observed** (public search). Bing/Copilot and Siri/Apple Maps are blind to the business. | Lost non-Google local visibility | **Owner action:** create/claim both (guide: `docs/seo/OTHER-SEARCH-CHANNELS.md`). |
| 3 | MEDIUM | **www host serves the site directly (HTTP 200, no host redirect).** Canonical tags correctly point to the apex, so duplicate-index risk is mitigated, but a redirect is the cleaner signal. | Minor duplicate-host dilution | **Owner action (optional):** add the documented `www → apex` Redirect Rule in Cloudflare (`docs/DEPLOYMENT.md`). Not changed here (no Cloudflare authorization). |
| 4 | MEDIUM | **`/service-area/` was the thinnest indexable page (206 words).** Thin coverage pages are weak targets for coverage queries and waste internal-link equity. | Service-area query coverage | **Implemented:** primary-market hub `/service-area/spring-hill-fl/` (789 words, unique content) + hub links from homepage and service-area; service-area page retained as the county-level overview. |
| 5 | MEDIUM | **Yelp listing slug says “brooksville” while every other citation says Spring Hill** (public observation). Inconsistent locality signals across citations. | Citation consistency / entity clarity | **Owner action:** correct the Yelp city/address display (no solicited Yelp reviews — policy). |
| 6 | LOW | **404 page emits `meta robots: index, follow`** but is served with HTTP 404, so it cannot be indexed; canonical points at `/404/`. Harmless but untidy. | None material | Documented; no change (status code governs). |
| 7 | LOW | **FAQ structured data not emitted.** Google restricts FAQ rich results to authoritative government/health sites; adding markup without eligible rich results adds risk with no gain. | None | Deliberate decision (`STRUCTURED-DATA-AUDIT.md`). |
| 8 | INFORMATIONAL | **IndexNow is working** — `.github/workflows/indexnow.yml` succeeded on the latest `main` push (verified via GitHub Actions). Bing receives changed URLs automatically. | Non-Google freshness | Keep. |
| 9 | INFORMATIONAL | **Core Web Vitals history:** the September overhaul fixed a font-swap CLS regression with metric-matched fallback fonts + fixed header strip height (homepage lab CLS 0.184 → 0.077; maintenance 0.362 → 0.033). Fonts are preloaded; images are sized, lazy-loaded, and served as responsive WebP. | LCP/CLS stability | Keep; field data requires post-launch traffic. |
| 10 | INFORMATIONAL | **Crawl hygiene verified:** every page reachable within 2 clicks (header/footer), no orphans, no pagination, no redirect chains, trailing slashes consistent (`trailingSlash: 'always'`), sitemap fresh (regenerated each build), canonical self-references clean. | — | Keep. |
| 11 | INFORMATIONAL | **UTM/canonical separation verified** (`marketing:verify`): inbound UTMs survive page load, ad click IDs (gclid/gbraid/wbraid/gad_*) are preserved, internal navigation never manufactures or persists UTMs, canonicals/sitemap/tel-sms-mailto links stay clean. | Attribution integrity | Keep. |
| 12 | LOW | **Thin `/leave-review/` (81 words)** — intentional conversion page, noindexed? No: it is indexable and in the sitemap. It targets review-intent traffic; thin but functional. | Negligible | Keep as is; not a search-intent page. |

## What was checked and found clean

HTTP 200 on all indexable routes; self-canonicals with trailing slash; no duplicate titles,
descriptions, or H1s; exactly one H1 per page; no accidental noindex (only `/thank-you/` is
noindex by design); no broken internal links (893 URLs, 0 broken); no redirect chains or loops;
images all have `alt` attributes (126 decorative empty alts are intentional); viewport meta
correct; mobile has 0px horizontal overflow at 390/768/1440; no console errors beyond the
expected 404 test route; consent/analytics unchanged.

## Items intentionally not addressed here

- **Field Core Web Vitals** (real-user LCP/INP/CLS) require post-launch traffic; lab checks only.
- **Rankings, keyword volumes, and Search Console metrics** — no authenticated access in this
  environment; see `KEYWORD-MASTER.md` for the NOT AVAILABLE policy.
- **GBP, Yelp, Bing, Apple** — external platforms; owner actions documented, never automated.
