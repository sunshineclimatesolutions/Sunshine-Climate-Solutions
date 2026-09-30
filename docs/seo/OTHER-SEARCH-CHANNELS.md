# Other search ecosystems — September 2026

Google is not the whole search market. Status and owner actions for the rest.

## Bing / Microsoft (Bing, Copilot, DuckDuckGo partially)

- **IndexNow: working.** `.github/workflows/indexnow.yml` runs on every push to `main` and
  submits changed canonical URLs; the latest run (commit `1080de3`) succeeded. The key file is
  served from the site root.
- **Bing Places: no listing observed.** Owner action: create/claim at
  <https://www.bing.com/forbusiness> (Google import is supported). Use the same canonical NAP
  as `CITATION-AUDIT.md` and the GBP UTM website link.
- **Bing Webmaster Tools:** verify the domain (can import from GSC) and submit
  `https://sunshineclimatesolutions.com/sitemap-index.xml`. IndexNow already covers freshness,
  but the tools give query data for Bing.

## Apple (Siri, Apple Maps, Spotlight)

- **Apple Business Connect: no listing observed.** Owner action: create the location at
  <https://business.apple.com> (free). Use the same canonical NAP; no street address needs to
  be public for a service-area business — Apple supports service-area businesses.

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
