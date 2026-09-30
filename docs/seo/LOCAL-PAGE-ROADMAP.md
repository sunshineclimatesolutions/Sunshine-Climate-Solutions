# Local page roadmap — September 2026

The rule this roadmap exists to enforce: **no near-duplicate city pages.** A dedicated location
page is only justified when it can be genuinely useful beyond swapping a city name.

## Scoring (0–5) — importance to SCS, proximity, demand signal, competition, current visibility, unique content available, revenue potential, local proof available, internal-link value

| City / market | Importance | Proximity | Demand signal | Competition | Current visibility | Unique content | Revenue | Local proof | Link value | Total /45 | Class |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Spring Hill** | 5 | 5 | 4 (observed queries; wrong-state pollution) | 4 | 2 (GBP pin issue) | 4 | 5 | 3 | 5 | **37** | **A — implemented** |
| Brooksville | 4 | 5 | 3 (observed) | 3 | 2 | 3 | 3 | 2 | 4 | 29 | B — deferred |
| New Port Richey / Port Richey | 3 | 4 | 3 (observed) | 2 (templated-heavy) | 1 | 2 | 3 | 1 | 3 | 22 | B — deferred |
| Wesley Chapel | 3 | 3 | 3 (observed) | 2 | 1 | 2 | 3 | 1 | 3 | 21 | B — deferred |
| Tampa (city) | 3 | 2 | 4 | 1 (established firms) | 1 | 2 | 4 | 1 | 3 | 21 | B — deferred |
| Land O' Lakes / Dade City / Zephyrhills | 2 | 3 | 2 | 2 | 1 | 2 | 2 | 1 | 2 | 17 | C |
| Clearwater / St. Petersburg / Largo / Palm Harbor / Dunedin / Safety Harbor / Seminole / Pinellas Park | 2 | 1 | 3 | 1 | 1 | 1 | 2 | 1 | 2 | 14–16 | C |
| Brandon / Riverview / Valrico / Carrollwood / Town 'n' Country / Temple Terrace | 2 | 1 | 2 | 1 | 1 | 1 | 2 | 1 | 2 | 13–15 | C |

Scoring basis: proximity from Spring Hill (home base), observed SERP competition (public
snapshots), revenue potential from service mix, unique-content feasibility without fabricated
local proof. Demand is a qualitative signal only — no volume data was available.

## Classes

### CLASS A — dedicated hub justified now: Spring Hill
Implemented: `/service-area/spring-hill-fl/` (789 words, unique content, six service cards,
six local FAQs, community list, breadcrumbs, `BreadcrumbList` schema). Content is strictly
factual: home market, system types, Florida climate context, pricing/process from
`business.ts`, confirmed communities. No fabricated jobs, counts, response times, or
neighborhood projects.

### CLASS B — support meaningfully, defer dedicated pages
Brooksville, New Port Richey, Wesley Chapel, Tampa:
- Supported today via localized service pages, the service-area page, and the hub's coverage
  notes.
- A dedicated page would currently duplicate service content (thin doorway risk) because no
  unique local proof (photos, jobs, local specifics) exists yet.
- **Revisit when** the owner supplies genuine local assets or verified local data; then score
  again before building. If built, each page must pass the same quality bar as the hub.

### CLASS C — do not target aggressively yet
Pinellas and Hillsborough city-level terms (14 cities) and the remaining Pasco cities:
proximity and competition make these low-ROI; serve them from existing pages and GBP.

## County hubs (Phase 11 evaluation)

**Recommendation: do not build county hubs now.** The `/service-area/` page already lists all
four counties with their communities and links to the hub; separate county pages would repeat
that content with no unique county-level substance (no county-specific data, projects, or
permits). Revisit if genuine county-level content exists (e.g., commercial project
concentration, county-specific requirements).

## Doorway-page risks explicitly avoided

- No `city-swap` templates; exactly one new location page was created, for the primary market.
- No fake offices, addresses, or "serving [city]" boilerplate pages.
- No internal link network built solely to push city pages.
- The hub links out to services; service pages link back to the hub only where natural.
