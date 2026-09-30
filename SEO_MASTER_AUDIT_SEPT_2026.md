# SEO Master Audit — September 2026

**Business:** Sunshine Climate Solutions LLC (HVAC, Spring Hill FL) · **Site:**
https://sunshineclimatesolutions.com · **Branch:** `feat/seo-local-audit` (base `aa88445`) ·
**Production HEAD at audit:** `1080de3` · **Status: NOT DEPLOYED — awaiting owner and
professional auditor approval.**

## EXECUTIVE SUMMARY

The site is technically clean and honestly written; it was simply not yet built for local
search. This pass created the missing search architecture without violating the business's
truthfulness rules: a keyword universe and page map, five diagnostic FAQs, localized titles on
the residential service pages, internal links between sibling intents, `Service` +
`BreadcrumbList` structured data with visible breadcrumbs, and — most importantly — **one
genuinely useful primary-market hub for Spring Hill** instead of a city-page farm. The
highest-impact remaining problems are off-site and owner-controlled: a Google Business Profile
pin that appears ~20 miles south of the market, missing Bing/Apple listings, and a Yelp city
mismatch. No rankings are promised; no data was fabricated.

## CURRENT SEARCH POSITION

- No authenticated Search Console, GBP performance, or Keyword Planner access was available;
  all metrics read `NOT AVAILABLE` (`KEYWORD-MASTER.md` policy).
- In 15 public, non-geo-localized SERP snapshots (Sept 29, 2026), the site did not appear —
  not a definitive visibility statement, but consistent with a new site (LLC filed May 2026)
  and a thin citation footprint.
- Generic city queries are dominated by templated multi-city lead-gen networks and wrong-state
  businesses; real local competitors are identifiable (CWK, Senica, Florida Coast, Mauro's,
  Pronto, SITA, Palmetto).

## WHAT IS ALREADY STRONG

- Technical hygiene: one H1 per page, unique titles/descriptions, clean self-canonicals,
  accurate sitemap/robots, 0 broken links (893 URLs), IndexNow working, HTTPS, 0px overflow.
- Honest, specific content: repair-first process, $50/$75 facts, measurement-driven
  diagnostics — content no local rival publishes in this depth.
- Conversion surface: Call/Text/Request everywhere (mobile bar ≥44px), validated form,
  consent-safe GA4 events (`generate_lead` only after provider confirmation).
- Differentiated capability: TAB/commissioning + residential service in one business — a real
  gap in the local market.

## WHAT IS HOLDING SCS BACK

1. **GBP pin/location** appears ~20 miles off-market (owner fix; highest local impact).
2. **No Bing Places / Apple Business Connect** presence (owner fix).
3. **Thin citation footprint** overall (new business; expected).
4. **Yelp city says "brooksville"** (owner fix).
5. **Previously thin service-area page** and unlocalized residential titles (fixed in this pass).
6. **No GSC/GBP measurement loop yet** (owner export enables it).

## FASTEST WINS (days)

1. Fix GBP pin/service area + complete every profile field (UTM website link ready).
2. Claim Bing Places + Apple Business Connect.
3. Correct Yelp city; complete Facebook details.
4. Start the review request habit at handoff (QR already exists).
5. Owner exports GSC + GBP CSVs to backfill the keyword master.

## 30-DAY PLAN

- Off-site fixes above; GBP posts 2×/month using the exact UTM links.
- Backfill GSC data; run the weekly SOP; identify position 4–10 queries.
- Publish week 1–4 content items from `90-DAY-CONTENT-PLAN.md`.
- Auditor reviews title variants and the hub.

## 60-DAY PLAN

- Publish weeks 5–8 (maintenance + replacement depth; email/SMS outreach with UTM links).
- Decide Brooksville vs. hub expansion based on first GSC data.
- Add RTU terminology to the commercial page if commercial impressions appear.
- Second review-request push; reply to all reviews.

## 90-DAY PLAN

- Publish weeks 9–12 (TAB authority content; contractor outreach).
- Quarterly review: cannibalization check, snippet CTR pass, citation re-audit.
- Re-score location pages with real demand data before building anything new.

## 6-MONTH STRATEGY

- Compounding technical authority (TAB/airflow/commercial) as the differentiator no local
  rival matches; maintenance as recurring revenue; replacement as high ticket.
- Location pages only where unique local proof exists (photos, verified local data).
- Keep all claims auditable; never buy links or reviews.

## Impact / effort table

| Action | Expected mechanism | Potential impact | Effort | Priority | Implemented? | Owner action? | Auditor review? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Fix GBP pin/service area | Correct geo-entity → Maps relevance | High | Low | P0 | No (external) | Yes | No |
| Bing Places + Apple | Non-Google local surfaces | High | Low | P0 | No (external) | Yes | No |
| Yelp city correction | Citation consistency | Medium | Low | P1 | No (external) | Yes | No |
| Spring Hill hub | Primary-market landing page | High | Done | P0 | **Yes** | No | Yes |
| Localized titles (airflow/replacement) | Intent + market match | Medium | Done | P1 | **Yes** | No | Yes (variants) |
| Diagnostic FAQs | Question coverage + funnels | Medium | Done | P1 | **Yes** | No | No |
| Service/Breadcrumb schema + breadcrumbs | Entity clarity, navigation | Low-Med | Done | P2 | **Yes** | No | Yes |
| Internal links (repair↔airflow↔TAB, hub) | Equity flow | Medium | Done | P1 | **Yes** | No | Yes |
| GSC/GBP data backfill | Measurement loop | High (decision quality) | Low | P0 | No | Yes | No |
| 90-day content | Topical authority | Medium-High | Medium | P1 | Partly (5 FAQs) | Partial | Yes |
| Local link outreach | Authority | Medium | Medium | P2 | No | Yes | Yes |
| Review growth system | GBP strength | High | Low ongoing | P1 | System documented | Yes | No |
| Photo compression pass | CWV | Low-Med | Low | P3 | No | No | Yes |
| www→apex redirect | Host consolidation | Low | Low | P3 | No | Yes | No |

## Verification (this pass)

`npm run verify` 0/0/0 · links 893/0 · smoke PASS · a11y 26 scans/0 violations ·
`verify-layout` 582/582 · `verify-maps` 36/36 · `gtm-consent` 85/85 · `marketing:verify`
20/20 + QR · **`verify-seo` 25/25** · before/after screenshots at 390/768/1440 in
`docs/seo/screenshots/`.

**NOT DEPLOYED — AWAITING OWNER AND PROFESSIONAL AUDITOR APPROVAL**
