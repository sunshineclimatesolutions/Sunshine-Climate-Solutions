# Developer — Start Here

Onboarding path for a developer working on the SCS website repository. **`AGENTS.md` remains
the authoritative set of permanent engineering rules — read it fully and follow it; this page
orients you, it does not replace it.**

Start with `docs/OPERATIONS-HUB.md` for the complete system map.

## Local setup

```bash
npm install
npx playwright install chromium   # optional: only for browser-based verification scripts
npm run dev                       # http://localhost:4321
```

Requirements: Node 20+ (Node 22 LTS recommended), npm 10+.

## Architecture (what exists and why)

- **Astro 5, `output: 'static'`, strict TypeScript.** No client framework, no CSS framework, no
  CMS, no database. Do not add dependencies, databases or paid services without owner approval.
- **Content collections** (Zod-validated in `src/content.config.ts`; a bad frontmatter value
  fails the build):
  - `services` (`src/content/services/*.md`) → `/services/<id>/`
  - `faqs` (`src/content/faqs/*.md`) → grouped FAQ page
  - `site` (`src/content/site/*.md`) → page copy for home, about, contact, service-area,
    spring-hill, TAB, FAQ, leave-review and **support** pages
  - `projects` / `reviews` — intentionally empty until genuine content exists (Our Work and
    review sections stay hidden)
- **Pages are thin wrappers over collections.** Components are presentation-only and
  prop-driven (`CtaBand.astro` is the reference pattern). Styles live in `src/styles/`
  (`tokens.css`, `global.css`, `fonts.css`) — design tokens only, never hard-coded colors.
- **Source directories:**

| Path | Contents |
| --- | --- |
| `src/config/business.ts` | **All business facts + social + fundraising + analytics IDs** (single source of truth) |
| `src/config/marketing-links.ts` | Inbound UTM registry (source of truth for generated docs/QRs) |
| `src/content/` | Content collections (services, faqs, site, projects, reviews) |
| `src/pages/` | Route files (thin wrappers) |
| `src/components/` | Presentation components |
| `src/layouts/` | `BaseLayout` → `BaseHead` (canonical, meta, JSON-LD, analytics) |
| `src/styles/` | Tokens + global styles + fonts |
| `scripts/` | Build/verification/generation tooling (header comments document usage) |
| `docs/` | Documentation (start at `docs/OPERATIONS-HUB.md`) |

## Configuration ownership

- **Business facts:** `src/config/business.ts` only — never hard-code phone, pricing, hours,
  service area, social URLs or analytics IDs elsewhere.
- **Campaign links:** `src/config/marketing-links.ts` only — then regenerate
  (`npm run marketing:links`). Never hand-edit the generated UTM docs or QR files.
- **Analytics:** `business.analytics` (Umami website ID, GTM container ID). The GTM container
  contents are managed in Google's UI (see below), with structural copies in `docs/gtm/`.
- **Owner approvals required:** license number (currently empty — no license line renders),
  founder video URL, new dependencies, design changes, URL changes.

## Consent and analytics architecture (do not break)

- **Basic Consent Mode:** no GTM container request is made until the visitor explicitly allows
  analytics; Consent Mode v2 defaults are all-denied first, then the granted state is applied
  *before* GTM loads. Advertising consent is never granted. The GTM `<noscript>` iframe is
  intentionally omitted.
- **Data-layer events are fixed-name only** and pushed only with permission (nothing is
  replayed): `scs_call_click`, `scs_text_click`, `scs_request_click`, `scs_form_start`,
  `scs_support_click` (allowlisted `support_platform`), `scs_form_confirmed` → GA4
  `generate_lead`.
- **Never send PII** (names, phones, emails, form contents) to any analytics service. Umami is
  cookieless with fixed names.
- Site-side behavior is proven by `node scripts/gtm-consent.mjs` (91/91). Event reference and
  dashboard status: `docs/GTM-GA4-SETUP.md`.

## Three different "deployments" — do not confuse them

| Change | Where it happens | How it takes effect |
| --- | --- | --- |
| Website code/content | This repository | Push to `main` → Cloudflare builds and deploys (owner approval required) |
| Analytics tags/triggers | Google Tag Manager UI | **Submit → Publish** in GTM; independent of site deploys |
| Platform settings (GBP, GSC, Bing, GA4, social) | Respective dashboards | Saved in the platform; never changeable from this repository |

Pushing site code does **not** change GTM, and publishing GTM does **not** change the site.

## Deployment precautions

- **Never push to `main` without explicit owner approval** — it deploys to production.
- Never touch Cloudflare settings, DNS or the GitHub connection from the repository; never
  delete MX/SPF/DKIM records (Google Workspace email) or the AI subdomain tunnel.
- `PUBLIC_PREVIEW_MODE=true` is for preview builds only (noindex + `Disallow: /`); production
  must never set it.
- Full details, environment variables and post-deploy checks: `docs/DEPLOYMENT.md`.

## URL permanence

**URLs are permanent.** There is no redirect mechanism in the static build. Never change or
remove an existing public URL without explicit owner approval. `/support/` is intentionally
`noindex` and excluded from the sitemap (sitemap filter in `astro.config.mjs`).

## SEO architecture

- Every page renders through `BaseLayout` → `BaseHead`: canonical (trailing slash), meta
  description, Open Graph, and `HVACBusiness` JSON-LD built from `business.ts` (`sameAs` only
  from `business.social`; fundraiser URLs are never in structured data).
- New pages must set unique title + description; `verify-seo` enforces uniqueness, canonical
  self-reference, sitemap agreement, JSON-LD validity and breadcrumb/visible-trail agreement.
- Service-page titles use `metaTitle` in the content file; `BaseHead` appends
  " | Sunshine Climate Solutions" — keep final titles within length limits.
- Sitemap/robots are generated; `/404`, `/thank-you/` and `/support/` are excluded.
- Query/page ownership and content strategy: `docs/seo/KEYWORD-TO-PAGE-MAP.md`,
  `docs/seo/90-DAY-CONTENT-PLAN.md`.

## Validation commands

Minimum bar for any change:

```bash
npm run verify                 # astro check (0 errors) + production build
node scripts/links.mjs         # internal links (after build)
```

For UI/behavior changes (run `npm run preview` first):

```bash
node scripts/smoke.mjs
node scripts/verify-layout.mjs
node scripts/a11y.mjs
node scripts/gtm-consent.mjs
```

Other targeted checks: `node scripts/verify-seo.mjs`, `node scripts/verify-maps.mjs`,
`node scripts/verify-gtm-import.mjs`, `npm run marketing:verify`, `node scripts/seo-inventory.mjs`.
None of these run automatically — run them deliberately. Full inventory:
`docs/operations/AUTOMATION-REGISTER.md`.

## Git workflow

- Work on a dedicated branch; keep commits small and scoped.
- Never force-push, rewrite history, `git reset`, `git clean`, or delete branches without
  explicit owner authorization.
- Review `git diff --stat` and `git diff` before committing; never stage unrelated files.
- Push the branch for review; **`main` merges/deploys require explicit owner approval.**

## Production rollback

There is no repository-level deploy command. If a production change is wrong:

1. Fix forward with a new commit (preferred).
2. If a revert is required, `git revert <commit>` on a branch, have the owner approve, then
   merge/push to `main` — Cloudflare rebuilds and the previous content is restored by the new
   build.
3. The previous successful build keeps serving if a build fails.
4. Deployment-level rollback is performed in the Cloudflare dashboard by the owner
   (`docs/DEPLOYMENT.md`).

## Where to go next

- Permanent rules: `AGENTS.md`
- System map: `docs/OPERATIONS-HUB.md`
- Platform status: `docs/operations/PLATFORM-STATUS.md`
- Automation inventory: `docs/operations/AUTOMATION-REGISTER.md`
- Access and ownership: `docs/operations/ACCESS-AND-OWNERSHIP.md`
- Content schemas and how-to: `docs/CONTENT-GUIDE.md`, `docs/IMAGE-GUIDE.md`
