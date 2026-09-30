# Keyword master — September 2026

Companion to `KEYWORD-MASTER.csv` (100 rows, same columns). This page explains the method and
the data-quality policy.

## Data-source policy (read first)

| Source | Status in this pass | Consequence |
| --- | --- | --- |
| Google Search Console (queries/pages/clicks/impressions/CTR/position) | **NOT AVAILABLE** — no authenticated access or owner export | Every GSC column is `NOT AVAILABLE`; the weekly SOP in `WEEKLY-SEARCH-CONSOLE-SOP.md` tells the owner how to export and backfill |
| Google Business Profile performance | **NOT AVAILABLE** — no authenticated access | GBP search terms must be exported by the owner |
| Google Keyword Planner volumes/CPC | **NOT AVAILABLE** — no authenticated access | Volume/CPC columns are `NOT AVAILABLE`; never fabricated |
| Public SERP observation | Available, limited | Single non-geo-localized snapshots (Sept 29, 2026). Competition notes are qualitative observations, clearly marked |
| Competitor website scan | Available | Service taxonomy, city-page architecture, content depth (see `COMPETITOR-GAP-ANALYSIS.md`) |
| Owner-confirmed facts (`business.ts`, owner brief) | Authoritative | Services, counties, communities, pricing, hours |

**No number in the CSV is invented.** When a metric could not be verified it says
`NOT AVAILABLE`.

## Cluster summary (rows per cluster)

| Cluster | Rows | P0 | P1 | P2 | P3 | P4 |
| --- | --- | --- | --- | --- | --- | --- |
| Repair (emergency/immediate) | 14 | 3 | 2 | 6 | 3 | 0 |
| Company / local | 9 | 1 | 3 | 1 | 4 | 0 |
| Maintenance | 8 | 0 | 2 | 4 | 2 | 0 |
| Replacement / installation | 8 | 0 | 2 | 4 | 2 | 0 |
| Airflow / ductwork | 12 | 0 | 1 | 6 | 5 | 0 |
| Electrical / diagnostic | 9 | 0 | 0 | 3 | 6 | 0 |
| Commercial | 8 | 0 | 5 | 3 | 0 | 0 |
| TAB / commissioning | 14 | 0 | 2 | 5 | 7 | 0 |
| Brand (repair intent) | 9 | 0 | 0 | 0 | 9 | 0 |
| Geo modifiers (city/company) | 9 | 1 | 0 | 4 | 3 | 1 |

(Totals: 100 rows. P0 = immediate money keywords in the core market; P1 = high commercial
value; P2 = valuable supporting; P3 = informational/supporting; P4 = low priority.)

## What the public SERP observations showed (single snapshot — not rankings)

- **The site did not appear** in any of the 15 observed result sets (non-geo-localized
  environment; not a definitive visibility statement).
- **Templated multi-city lead-generation networks** dominate many generic city queries
  (Spring Hill TN/KS, Wesley Chapel NC wrong-state pollution included).
- Real local competitors observed repeatedly: springhillairconditioning.com, coolairmd.com,
  mariosac.com, cwkair.com, reynoldshs.com, springhillcoolingandheating.com,
  acrepairbrooksville.com, instant-ac.com, balancedair.com, farrellac.com.
- **TAB queries are fragmented** by the acronym ("tab glass", government bid PDFs); the true
  TAB/commissioning intent is thin — a whitespace where Sunshine's page can be the clearest
  match.
- **"ac not cooling"** is dominated by national manufacturer troubleshooting content — an
  informational gap Sunshine now addresses with a genuine diagnostic FAQ.
- Title patterns to compete against: `AC Repair <City> FL | <Company>` — Sunshine's localized
  titles follow the same pattern with an honest differentiator.

## How to refresh this file with real data

1. Owner exports GSC (Queries + Pages, 3 months) and GBP performance CSV.
2. Replace `NOT AVAILABLE` with actuals per keyword; add `Current SCS Page` impressions.
3. Apply the opportunity rules in `WEEKLY-SEARCH-CONSOLE-SOP.md` to re-prioritize.
4. Keyword Planner export fills Volume/Competition/CPC where authenticated access exists.
