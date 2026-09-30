# Internal link map — September 2026

Principles: descriptive anchors (no "click here"), no exact-match stuffing, every important
page reachable within two clicks, and no UTM parameters on internal links (verified by
`marketing:verify`).

## Current architecture

- **Header nav (desktop + mobile):** Home (logo), Services, TAB & Commissioning, Service Area,
  About, FAQ, Contact. Request Service CTA on every page.
- **Footer (every page):** all five service pages, TAB, About, Service Area, FAQ, Contact,
  Privacy, Analytics preferences; Call / Text / Email; Google reviews link.
- **Homepage:** service cards → each service page; TAB band → TAB page; maintenance band →
  maintenance page; area section → service area **+ new Spring Hill hub**; brands → no links;
  final CTA → contact.
- **Service pages:** breadcrumb (Services / current) → services hub; contextual body links
  (see below); CTA band → contact.
- **Service area page:** counties → (new) Spring Hill hub; beyond/coverage panels → call/text.
- **FAQ page:** answers link to service pages where relevant (maintenance, repair, airflow).

## Links implemented in this pass

| From | To | Anchor | Rationale |
| --- | --- | --- | --- |
| Home (area section) | `/service-area/spring-hill-fl/` | "HVAC service in Spring Hill" | Strongest page → primary-market hub |
| Service area (counties) | `/service-area/spring-hill-fl/` | "HVAC service in Spring Hill" | County overview → primary-market hub |
| AC repair body | `/services/airflow-ductwork/` | "airflow & ductwork" | Sibling intent (weak airflow ≠ refrigeration) |
| AC repair body | `/service-area/spring-hill-fl/` | "HVAC service in Spring Hill" | Local depth for the home market |
| Airflow body | `/services/ac-repair-diagnostics/` | "AC repair & diagnostics" | Reverse sibling link |
| Airflow body | `/tab-commissioning-support/` | "TAB and commissioning support" | Measurement discipline → B2B path |
| Replacement body | `/services/airflow-ductwork/` | "airflow & ductwork" | Ducts matter in replacement decisions |
| Commercial body | `/service-area/` | "service area" | Commercial coverage clarity |
| FAQ answers (new) | repair / airflow pages | descriptive | Question → service path |
| Spring Hill hub | all five service pages + TAB, service area, contact | service-card anchors | Hub distributes to every service |

## Recommended future links (not implemented — need owner/auditor approval)

| From | To | Anchor idea | Why deferred |
| --- | --- | --- | --- |
| Maintenance page | Spring Hill hub | "maintenance visits in Spring Hill" | Avoid over-linking the hub before it has traffic data |
| TAB page | Commercial page | "commercial service and maintenance" | TAB page already links via CTA band context; add after auditor review |
| Airflow page | Spring Hill hub | "airflow diagnostics in Spring Hill" | Keep hub inbound links focused for now |
| About page | TAB page | "TAB and commissioning support" | About is a trust page; low equity transfer |
| Service area page | individual service pages | contextual county/service sentences | Would need new unique copy per county — deferred to avoid thin text |

## Anchor-text rules for future content

- Vary anchors: "AC repair in Spring Hill", "our maintenance visit", "how airflow is measured".
- Never link the same target repeatedly with the identical exact-match anchor on one page.
- Links inside body copy must read naturally in the sentence; never append link lists.
- Never link to a page that does not answer the linked anchor's intent.
