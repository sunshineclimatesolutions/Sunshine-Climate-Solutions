# Professional auditor handoff — September 2026

Purpose: make it easy for a professional SEO/content/design auditor to challenge and improve
this strategy. Everything below points at evidence; nothing here claims rankings.

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

Pin appears near Tampa/Carrollwood (~20 mi from Spring Hill) — highest-impact owner fix.
Profile fields unverifiable without login. Checklist: `GBP-OPTIMIZATION-CHECKLIST.md`.

## 8. Keyword Planner findings

None available (no authenticated access). Volume/CPC columns are `NOT AVAILABLE` by policy.

## 9. Technical findings

12 findings, no CRITICAL. Highlights: GBP pin (HIGH), Bing/Apple absence (HIGH), www redirect
(optional, canonical mitigates), thin service-area page (fixed via hub), Yelp city mismatch.
Full table: `TECHNICAL-SEO-AUDIT.md`.

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
