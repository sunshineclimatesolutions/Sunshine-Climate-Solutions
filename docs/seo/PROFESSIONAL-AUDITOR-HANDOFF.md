# Professional auditor handoff — September 2026

Purpose: make it easy for a professional SEO/content/design auditor to challenge and improve
this strategy. Everything below points at evidence; nothing here claims rankings.

## Priority review list (please challenge each)

1. **Keyword-to-page ownership** — is one primary page per cluster the right assignment?
2. **Cannibalization** — do any pages compete for the same commercial query?
3. **Spring Hill hub** — is it genuinely useful and non-doorway? Should it absorb more?
4. **Meta/title choices** — current localized titles vs. the variants in `ON-PAGE-AUDIT.md`.
5. **Brooksville as the next location page** — justified, or premature?
6. **County-vs-city architecture** — is the single-hub + service-area model right for this
   market, or should county hubs exist?
7. **Commercial/TAB targeting across Tampa Bay** — is the B2B positioning strong enough?
8. **Content depth** — which pages still need genuine depth (not filler)?
9. **Citation consistency** — locality questions (GBP/Yelp) and the thin footprint.
10. **Link opportunities** — realistic local authority paths (`LOCAL-LINK-OPPORTUNITIES.csv`).
11. **Review growth strategy** — policy-safe and practical (`REVIEW-GROWTH-SYSTEM.md`).
12. **Conversion potential from organic traffic** — will these landing pages actually produce
    calls/leads?

**Data limitation to keep in mind:** Search Console query data, GBP search-term data, and
Keyword Planner metrics have **not** been available to this audit. The keyword priorities are
therefore strategic hypotheses (commercial intent + capability + observed competition) until
those actual datasets are incorporated and the master keyword file is backfilled. Do not treat
the current P0–P4 ordering as a quantitative ranking.

## 1. Business objectives

Qualified organic visibility and calls/texts/requests for: AC repair & diagnostics (repair-first),
$75 maintenance visits, replacement/installation, airflow/ductwork, light commercial service,
and TAB/commissioning — primarily from Spring Hill/Hernando County, secondarily across Tampa Bay.

## 2. Confirmed service area

Hernando, Pasco, Pinellas, Hillsborough counties; primary market Spring Hill; communities listed
on `/service-area/`. Source: `src/config/business.ts` + owner brief.

## 3. Current architecture

Astro static site; 17 pages (15 indexable). Service pages own service intent; `/service-area/`
owns county coverage; `/service-area/spring-hill-fl/` is the primary-market hub; `/faq/` owns
question intent; contact/leave-review are conversion pages. Map: `KEYWORD-TO-PAGE-MAP.md`.

## 4. Keyword strategy

100-row universe (`KEYWORD-MASTER.csv`) across repair, company, maintenance, replacement,
airflow, electrical, commercial, TAB, brand, and geo clusters; P0–P4 priorities; one primary
page per cluster with cannibalization rules.

## 5. Research sources

Public SERP observations (single non-geo-localized snapshots, Sept 29, 2026), competitor
website scan, owner-confirmed facts. **No Search Console, GBP performance, or Keyword Planner
data was available** — all such columns read `NOT AVAILABLE`.

## 6. Search Console findings

None available. Owner should export Queries + Pages (3 months) and backfill
`KEYWORD-MASTER.csv`; the weekly process is `WEEKLY-SEARCH-CONSOLE-SOP.md`.

## 7. GBP findings

Public local-business data shows a **locality/geographic inconsistency** (a public place
reference near Tampa/Carrollwood, plus a Yelp city of "brooksville") that should be checked
against the authenticated Google Business Profile. **The actual GBP map pin has not been
independently verified by this audit**, and no pin change should be made based solely on
third-party data. Profile fields are unverifiable without login. Checklist:
`GBP-OPTIMIZATION-CHECKLIST.md`.

## 8. Keyword Planner findings

None available (no authenticated access). Volume/CPC columns are `NOT AVAILABLE` by policy.

## 9. Technical findings

No CRITICAL or HIGH technical defects. Technical items: optional `www → apex` redirect
(canonical mitigates), previously thin service-area page (fixed via hub), 404 meta tidiness,
FAQ-schema decision, thin `/leave-review/`. Separately: one **VERIFY (external)** item (GBP
locality — authenticated profile not yet checked) and one **OPPORTUNITY (external)** item
(Bing Places / Apple Business Connect; does not prevent Google organic ranking). Full table:
`TECHNICAL-SEO-AUDIT.md`.

## 10. On-page changes

Localized airflow/replacement titles + metas; homepage area heading + hub link; 5 diagnostic
FAQs; internal links (repair↔airflow↔TAB, commercial→service-area, hub links); breadcrumbs +
`Service`/`BreadcrumbList` schema on service pages; `City: Spring Hill` in `areaServed`.
BEFORE/PROPOSED/WHY table + title variants for review: `ON-PAGE-AUDIT.md`.

## 11. Proposed location architecture

One hub (Spring Hill) implemented; Brooksville / New Port Richey / Wesley Chapel / Tampa scored
as Class B (deferred until unique local content exists); all other cities Class C. No county
hubs now. Scoring + doorway-risk notes: `LOCAL-PAGE-ROADMAP.md`.

## 12. Pages intentionally NOT created

- No city pages beyond Spring Hill.
- No brand pages (brand list lives on the repair page).
- No component-level pages (capacitor/contactor/etc. are subtopics).
- No county hubs.
- No "authority network" style pages or comparison pages.

## 13. Structured-data decisions

Added Service + BreadcrumbList + City; deliberately no FAQPage, no Review/AggregateRating, no
address/geo, no Product/Offer. `STRUCTURED-DATA-AUDIT.md`.

## 14. Image decisions

No renames for keywords; descriptive filenames preserved; alt text factual; map alt carries the
SEO value; largest responsive variants flagged for a possible future compression pass.
`IMAGE-SEO-AUDIT.md`.

## 15. Internal-link architecture

Header/footer + contextual body links; implemented links listed; future links deferred with
rationale; anchor rules. `INTERNAL-LINK-MAP.md`.

## 16. Content plan

90-day plan mapped to questions/clusters/pages/CTAs (`90-DAY-CONTENT-PLAN.md`); five diagnostic
FAQs already implemented.

## 17. Backlink / local-authority plan

`LOCAL-LINK-OPPORTUNITIES.csv` (chamber, trade school alumnus angle, builders/property
managers, local media, ACCA, BBB). No paid/spam link tactics.

## 18. Review strategy

`docs/marketing/REVIEW-GROWTH-SYSTEM.md` — legitimate request timing, wording, QR workflow,
response framework, Yelp policy. Existing review QR untouched.

## 19. Known limitations

- No GSC/GBP/Planner data; no rankings; no volume data.
- Public SERP snapshots are single non-localized observations, not rankings.
- Field Core Web Vitals unavailable pre-traffic.
- GTM/GA4 verification is site-side (container publication is owner-managed).
- The Spring Hill hub has no genuine local photography yet — a real gap for future depth.

## 20. Questions requiring professional judgment

1. Are the proposed title variants (`ON-PAGE-AUDIT.md`) better than the current localized ones?
2. Should Brooksville get the next location page, or should the hub be expanded first?
3. Is the FAQ → service-page link pattern sufficient, or should key FAQs be answered on the
   owning service pages too (duplication risk vs. depth)?
4. Is the single-hub architecture the right call versus county hubs for this market?
5. Should the largest photo variants be recompressed (quality vs. bytes)?
6. Any local link opportunities we missed (chambers, trade networks, media)?
7. Should `/leave-review/` remain indexable given its thin content?
8. Is the `www → apex` redirect worth requesting from the owner now?
