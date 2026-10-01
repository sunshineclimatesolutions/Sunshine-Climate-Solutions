# Other search ecosystems — September 2026

Google is not the whole search market. Status and owner actions for the rest.

**Classification note:** missing presence on Bing Places / Apple Business Connect does not
prevent Google organic ranking, but establishing the profiles expands search/map visibility and
strengthens entity consistency. These are **external-distribution opportunities**, not
technical SEO defects and not production blockers.

## Current status — October 1, 2026 (owner-confirmed through dashboards)

- **Bing Webmaster Tools: active.** Site Scan identified three over-long service-page titles;
  those titles were shortened, deployed and verified (see the September service-title work in
  `docs/seo/seo-inventory.json` and the title-length checks in `scripts/verify-seo.mjs`).
  IndexNow submissions have succeeded (GitHub Actions runs).
- **Bing Places: published and synchronized with Google Business Profile.** The owner has
  demonstrated the listing is operational. Periodically audit the imported fields
  (name/phone/hours/website) against `business.ts` — see the monthly listing audit in
  `docs/operations/MAINTENANCE-SCHEDULE.md`.
- **Apple Business Connect: status pending owner confirmation** (see
  `docs/operations/PLATFORM-STATUS.md`).
- Current platform register: `docs/operations/PLATFORM-STATUS.md`.

The sections below retain their original September 2026 audit context; the current status above
supersedes the "not observed / verify" instructions.

## Bing / Microsoft (Bing, Copilot, DuckDuckGo partially)

- **IndexNow: working.** `.github/workflows/indexnow.yml` runs on every push to `main` and
  submits changed canonical URLs; runs have succeeded repeatedly (see the Actions history).
  The key file is served from the site root.
- **Bing Places: published** (October 2026) and synchronized from GBP. Historical September
  2026 observation: no listing was observed at audit time — that condition is resolved.
- **Bing Webmaster Tools: active** (October 2026). Historical September 2026 instruction:
  verify the domain and submit `https://sunshineclimatesolutions.com/sitemap-index.xml` —
  completed; IndexNow already covers freshness, and the tools provide Bing query data.

## Apple (Siri, Apple Maps, Spotlight)

- **Apple Business Connect: status pending owner confirmation** (October 2026). Historical
  September 2026 observation: no listing was observed at audit time. If a listing exists or is
  created, use the same canonical NAP; no street address needs to be public for a service-area
  business — Apple supports service-area businesses. Entry point:
  <https://business.apple.com>.

## Facebook / Meta

- Page exists and is linked from the site footer (verified profile URL in `business.ts`).
- Owner action: complete phone/website/hours; use the canonical `/p/` URL in citations.
- **No Meta Pixel installed and none should be added by this pass** (UTM templates for paid
  social are documented in `docs/marketing/UTM-MASTER-LINKS.md`).

## Nextdoor

- Business page exists, consistent phone/website/hours (verified in the citation audit).
- Keep it current; it is also a UTM channel (`nextdoor / organic_social / profile`).

## Directories

- Decision framework: only claim directories that are (a) free or clearly worth the fee,
  (b) editorially legitimate, and (c) consistent with NAP. Avoid paid link packages, mass
  submission services, and review-gated lead networks.
- Priority: Bing Places → Apple → (optional) BBB → (optional) chamber directories.

## What this repository already does for non-Google search

- Clean static HTML, sitemap + robots, canonical apex URLs, IndexNow submissions.
- Structured data (HVACBusiness + Service + BreadcrumbList) that any crawler can parse.
- No JavaScript dependence for content — everything is in the HTML.
