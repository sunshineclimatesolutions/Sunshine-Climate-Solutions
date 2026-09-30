# On-page SEO audit — September 2026

Per-page review with the implemented changes (BEFORE → PROPOSED/IMPLEMENTED → WHY → target
cluster). Everything not listed was audited and left unchanged deliberately (titles already
unique, localized where it matters, one H1 per page, descriptive anchors, honest CTAs).

## Implemented changes

| Page | Element | Before | After | Why | Target cluster |
| --- | --- | --- | --- | --- | --- |
| `/` (home) | Area section heading | "Proudly Serving Tampa Bay" | "Proudly Serving Spring Hill & Tampa Bay" | Primary market named in a natural heading (homepage title already carried it) | hvac spring hill, hvac company spring hill |
| `/` (home) | Area section links | Single "View our service area" link | + "HVAC service in Spring Hill" link to the hub | Internal-link path from the strongest page to the primary-market hub | spring hill hvac |
| `/services/ac-repair-diagnostics/` | Body links | Maintenance link only | + airflow & ductwork link; + Spring Hill hub link in Next steps | Repair/airflow are sibling intents; hub link for local depth | ac repair spring hill, weak airflow |
| `/services/airflow-ductwork/` | Title | (fallback) "Airflow & Ductwork in Tampa Bay" | `metaTitle: "Airflow & Ductwork in Spring Hill & Tampa Bay"` | Front-loads intent + primary market | ductwork repair spring hill |
| `/services/airflow-ductwork/` | Meta description | "…in Tampa Bay:" | "…in Spring Hill and across Tampa Bay:" | Same intent, localized | ductwork repair spring hill |
| `/services/airflow-ductwork/` | Body links | — | + AC repair link; + TAB link | Sibling-intent flow (repair ↔ airflow ↔ TAB) | airflow diagnostics |
| `/services/replacement-installation/` | Title | (fallback) "Replacements & Installations in Tampa Bay" | `metaTitle: "AC Replacement & Installation in Spring Hill & Tampa Bay"` | Adds the money term "AC replacement" + primary market | ac replacement spring hill |
| `/services/replacement-installation/` | Meta description | "…across Tampa Bay." | "…in Spring Hill and across Tampa Bay." | Localized | ac installation spring hill |
| `/services/replacement-installation/` | Body | — | Ductwork paragraph linking airflow page | Repair-vs-replace decisions involve ducts; natural cross-link | ac replacement |
| `/services/commercial-service-maintenance/` | Body | — | Service-area link in the owner paragraph | Commercial → service area (Phase 12 model) | commercial hvac tampa |
| `/services/*` (all 5) | Breadcrumbs + schema | None | Visible breadcrumb trail + matching `BreadcrumbList` + `Service` node | Discoverability + entity clarity; markup matches visible trail | — |
| `/service-area/` | Counties section | No primary-market path | Hub note + link to Spring Hill hub | Connects county overview to the primary-market hub | spring hill service area |
| `/faq/` | FAQ entries | 17 entries / 1044 words | +5 diagnostic FAQs (running-not-cooling, breaker trips, freeze-up, one room hotter, static pressure) → 1429 words | Answers genuine high-intent questions with real diagnostic expertise; supports repair/airflow clusters | ac not cooling, ac tripping breaker, ac freezing, hot room, static pressure |
| `/service-area/spring-hill-fl/` | New page | — | 789-word primary-market hub (unique content, 6 service cards, 6 FAQs, communities, breadcrumbs) | Primary-market coverage without a doorway page; see `LOCAL-PAGE-ROADMAP.md` for the scoring | hvac spring hill, ac repair spring hill |
| Site-wide | `areaServed` schema | Counties + Tampa Bay | + `City: Spring Hill` | Entity clarity for the home market | — |

## Titles — current state and variants for professional review

All titles render as `<title> | Sunshine Climate Solutions` (brand appended by `BaseHead`).
Variants are proposals only (Phase 27) — implement after auditor review if preferred.

| Page | Current (rendered) | Variants to consider |
| --- | --- | --- |
| Home | Sunshine Climate Solutions \| HVAC Service in Spring Hill & Tampa Bay | (1) HVAC Repair & Maintenance in Spring Hill, FL \| Sunshine Climate Solutions (2) AC Repair, Maintenance & Installation in Spring Hill \| SCS |
| AC repair | AC Repair in Spring Hill & Tampa Bay \| … | (1) AC Repair Spring Hill FL \| Same-Day Diagnostics & Clear Pricing (2) AC Not Cooling? Repair & Diagnostics in Spring Hill \| … |
| Maintenance | AC Maintenance in Spring Hill & Tampa Bay \| … | (1) $75 AC Maintenance in Spring Hill \| Coil, Drain & System Check (2) AC Tune-Up & Maintenance Spring Hill FL \| … |
| Replacement | AC Replacement & Installation in Spring Hill & Tampa Bay \| … | (1) AC Replacement & Installation Spring Hill FL \| Free Estimates (2) Repair vs Replace? AC Installation in Spring Hill \| … |
| Airflow | Airflow & Ductwork in Spring Hill & Tampa Bay \| … | (1) Ductwork Repair & Airflow Diagnostics Spring Hill FL \| … (2) Hot Rooms & Weak Airflow? Duct Repair in Spring Hill \| … |
| Commercial | Commercial Service & Maintenance in Tampa Bay \| … | (1) Commercial HVAC Service & Maintenance Tampa Bay \| RTUs & Light Commercial (2) Commercial HVAC Tampa \| Maintenance & Subcontractor Support |
| TAB | TAB & Commissioning Support in Tampa Bay \| … | (1) TAB Contractor Tampa \| Testing, Adjusting & Balancing Support (2) Air Balancing, Duct Traverses & Commissioning \| Tampa Bay |
| Spring Hill hub | HVAC Service in Spring Hill, FL \| … | (1) HVAC Company in Spring Hill, FL \| Repair, Maintenance & Installation (2) Spring Hill HVAC Service \| Owner-Operated, Repair-First |

Rules kept: no "#1", "best", "cheapest", "highest rated"; no county stuffing; no clickbait.

## Opening paragraphs / intent match

- Homepage hero remains brand-led by design ("Honest HVAC. Expert Diagnostics. Clear
  Solutions.") with the Spring Hill + Tampa Bay context in the title, area section, and hub
  link. The owner's directive: the hero does not need every keyword.
- Service pages open with the customer problem in plain language (verified in each body), not
  keyword lists.
- The new hub opens with the market + service + operator identity in one sentence.

## Not changed (audited, deliberate)

- `/services/` hub, `/about/`, `/contact/`, `/faq/` titles and descriptions — already unique,
  intent-matched, and localized where appropriate.
- `/leave-review/` — conversion page; thin but intentional.
- Privacy/thank-you/404 — no search intent; left alone.
