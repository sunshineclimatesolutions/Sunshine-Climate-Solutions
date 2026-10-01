# Structured data / entity audit — September 2026

> **Current scope update — October 2026:** the structured-data decisions below are unchanged —
> the `HVACBusiness` entity still intentionally omits the `founder` Person property. However,
> the owner has since approved publishing founder disclosures (name, background, faith/community
> motivation, ~$25,000 founder investment) **on `/support/` only**. The "anonymity directive"
> wording in this September 2026 audit therefore describes the **structured-data scope**, not a
> site-wide identity policy. Do not expand owner disclosures to schema or other pages without
> explicit owner approval (`AGENTS.md` → Business information integrity).

## Current state (baseline)

Every page emits one global `HVACBusiness` JSON-LD block from `BaseHead.astro`:

- `@type: HVACBusiness`, `@id: https://sunshineclimatesolutions.com/#business`
- `name`, `legalName`, `url`, `telephone`, `email`, `image`, `logo`, `priceRange: $$`
- `sameAs`: verified profiles only (Facebook, Nextdoor, Yelp) — no Google review links
- `openingHoursSpecification`: 7 days, 07:30–19:30 (from `business.ts`)
- `areaServed`: counties + Tampa Bay
- The owner's name is deliberately not published (September 2026 anonymity directive).

No review, rating, price, address, or geo data is fabricated — the business is a
service-area operation and no public address is published.

## Changes implemented in this pass

| Change | Why | Risk |
| --- | --- | --- |
| `areaServed` now leads with `City: Spring Hill` before the four counties + Tampa Bay | Primary-market entity clarity; truthful (Spring Hill is the home market per owner) | None |
| Service pages emit `Service` (`name`, `serviceType`, `url`, `provider → #business`, `areaServed`) | Describes what the page actually is; ties services to the business entity | Low — values come from page content |
| Service pages + Spring Hill hub emit `BreadcrumbList` that **matches the visible breadcrumb trail** | Google's breadcrumb guidance requires the markup to reflect visible navigation | None (visible trail added first) |

Validation method: every page's JSON-LD blocks are parsed with `JSON.parse` by
`scripts/verify-seo.mjs`; `@type` values and breadcrumb positions are asserted. No external
validator was available in this environment — flagged for the professional auditor.

## Deliberate decisions (and why)

- **No FAQPage markup.** Google limits FAQ rich results to authoritative government/health
  sites. The FAQ content stays as visible, well-structured HTML (`<details>`), which still
  helps answer engines and users without markup risk.
- **No `AggregateRating` / `Review` markup.** The reviews collection is intentionally empty and
  the owner has not supplied verified review data; marking up non-existent reviews is a spam
  violation.
- **No `LocalBusiness.address` / `geo`.** No public address exists (service-area business);
  inventing one is prohibited. The state registry address is not published on the site by owner
  choice.
- **No `Product`/`Offer` for pricing.** `$50`/`$75` are service-call and per-visit service
  prices, not products; the visible copy already states them factually.
- **No `WebSite`/SearchAction.** The site has no on-site search; a sitelinks searchbox is
  inapplicable.
- **No `Person` for the owner.** Anonymity directive.

## Consistency check

Schema values are sourced from `business.ts` (single source of truth) or from the same content
the page renders (Service names, breadcrumbs), so markup cannot drift from visible content.
`docs/seo/KEYWORD-MASTER.md` and `docs/GTM-GA4-SETUP.md` carry the entity identifiers used for
GA4/GBP consistency.
