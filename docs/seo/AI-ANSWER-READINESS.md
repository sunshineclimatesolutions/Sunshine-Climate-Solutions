# AI / answer-engine readiness — September 2026

No gimmicks. The site is already structurally easy for search engines and answer systems to
understand; this records what exists and what was deliberately **not** done.

## What the site provides

- **Clear entity:** `HVACBusiness` JSON-LD with name, legal name, phone, hours, service area
  (Spring Hill + four counties), verified `sameAs` profiles, and a stable `@id`.
- **Clear services:** one page per service with plain-language scope, process, and pricing
  facts sourced from `business.ts`; `Service` + `BreadcrumbList` schema on service pages.
- **Clear geography:** service-area page with counties and communities; the Spring Hill hub
  with local context; `City: Spring Hill` in `areaServed`.
- **Factual FAQs:** question-shaped headings (`<details>`) with concise, expert answers — ideal
  extraction material for answer systems.
- **Crawlable HTML:** all content is server-rendered; no JavaScript dependence for content.
- **Semantic headings and meaningful internal links** (see `INTERNAL-LINK-MAP.md`).
- **No hidden text, no keyword stuffing, no doorway pages.**

## Deliberate decisions

- **No `llms.txt`.** There is no evidence it changes AI visibility; adding nonstandard files
  for a trend is not justified. Revisit only if a major platform documents support.
- **No FAQPage markup.** Google restricts FAQ rich results; the visible FAQ HTML still serves
  answer systems. See `STRUCTURED-DATA-AUDIT.md`.
- **No synthetic content farms.** Content stays owner-reviewable and factual.
- **No AI-generated claims.** Every added sentence is derived from owner-confirmed facts or
  general HVAC knowledge without fabricated specifics.

## Practical next steps (owner)

1. Keep GBP, Bing, and Apple profiles complete — answer systems lean on knowledge graphs and
   directories, not only the site.
2. Publish the 90-day content plan items — clear technical explanations are what AI answers
   cite.
3. Keep NAP consistent (`CITATION-AUDIT.md`).
