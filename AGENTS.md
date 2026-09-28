# AGENTS.md — Sunshine Climate Solutions Website

Permanent instructions for AI engineering agents (OpenCode and similar) working in this
repository. Read this file fully before making any change. Every statement below reflects the
verified state of the codebase — if reality and this file disagree, resolve it deliberately
with the owner; never silently work around this file.

## Project identity

- Marketing and service-request website for **Sunshine Climate Solutions LLC** (Tampa Bay HVAC).
- Production: **https://sunshineclimatesolutions.com**. Hosting is the owner's GitHub-connected
  Cloudflare project (owner identifies it as Cloudflare Workers). This repository contains **no
  deployment configuration** (no wrangler file, no CI workflows) — deployment settings live in
  the Cloudflare dashboard.
- Repo: `sunshineclimatesolutions/Sunshine-Climate-Solutions`. **`main` is the production branch.**
- Local dev server: http://localhost:4321. Build output: `dist/`.

## Verified architecture — keep it

- **Astro 5, `output: 'static'`, strict TypeScript** (strictest preset). No client framework,
  no CSS framework, no CMS, no database. Do not add dependencies, databases, CMS platforms, or
  paid services without explicit owner approval.
- `trailingSlash: 'always'`; `site` is the production domain; sitemap excludes 404/thank-you.
- **`src/config/business.ts` is the single source of truth for every business fact** (phone,
  email, hours, pricing, service area, brands, payments, license, feature flags). Never
  hard-code any of those values anywhere else; components and pages import from this file.
- **Content collections** defined in `src/content.config.ts` (Zod-validated — a bad frontmatter
  value fails the build with a clear error instead of publishing):
  - `services` (`src/content/services/*.md`) → pages at `/services/<id>/`, cards, footer links.
  - `faqs` (`src/content/faqs/*.md`) → grouped FAQ page by `category`.
  - `site` (`src/content/site/*.md`) → editable copy for the home, about, contact,
    service-area, and TAB pages (one file per page; business facts still come from
    `business.ts`; only supported token is `{serviceCall}`).
  - `projects` (`src/content/projects/*.md`) → portfolio; **intentionally empty**; the Our Work
    page and its nav/footer links are hidden until at least one genuine entry exists.
  - `reviews` (`src/content/reviews/*.md`) → testimonials; **intentionally empty**; review
    sections render only when genuine entries exist.
- Pages are thin wrappers over collections; components are presentation-only and prop-driven
  (`CtaBand.astro` is the reference pattern).
- Styles live in `src/styles/` — `tokens.css` (design tokens), `global.css` (all component
  styles), `fonts.css`. Fonts are self-hosted SIL OFL (Archivo headings, Public Sans body).
- Contact form posts to Web3Forms (public client-side access key by design — safe to commit);
  success is acknowledged only after the provider confirms; every failure path has an honest
  message and a call/text alternative; a missing key renders an honest fallback, never a fake
  success.
- Analytics: Umami Cloud (cookieless, aggregate only) loads from `BaseHead.astro` when
  `business.analytics.umami.websiteId` is set and never in preview mode. Events are fixed-name
  only — `call-click`, `text-click`, `form-success` (fired strictly after Web3Forms confirms).
  **Never send form contents, phone numbers, names, or any personal information to analytics.**
  The privacy page discloses this; keep it accurate if analytics change.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | `astro check` — TypeScript diagnostics (must be 0 errors) |
| `npm run verify` | `check` + `build` — the minimum bar for any change |
| `node scripts/smoke.mjs` | Real-browser smoke test (run `npm run preview` first; needs Playwright Chromium) |
| `node scripts/screenshot.mjs` | Screenshots at 360/768/1440 for owner review |
| `node scripts/screenshot-sections.mjs` | Section close-ups (proof, brands, maps, TAB, conditions) into `docs/verification/screenshots/sections/` |
| `node scripts/a11y.mjs` | axe-core WCAG scan (needs preview server) |
| `node scripts/links.mjs` | Broken internal-link check on `dist/` (run after build) |
| `node scripts/photo.mjs <path>` | Photo guardrails: dimensions/size/format check; `--resize 2000 --write` downscales in place |

Build notices like "The collection 'projects' does not exist or is empty" are **expected and
intentional** while those collections are empty — not errors.

## Git safety and production deployment restrictions

- **Never push without explicit owner approval** — the GitHub↔Cloudflare connection means a push
  to `main` triggers the production deployment.
- Never, without explicit owner authorization: force push, rewrite history, `git reset`,
  `git clean`, `git stash pop`/`drop`, delete branches, or touch Cloudflare settings, DNS, or
  GitHub branch protection. Use `git stash push -m "message"` to save work; apply with
  `git stash apply` (keeps the stash entry).
- Commit small, per approved phase, with a clear message. Review `git diff --stat` and
  `git diff` before committing. Never stage unrelated or untracked files you did not create.
- Do not run automatic dependency upgrades, `npm audit fix`, or unrelated "cleanup."

## Content editing map

| To change… | Edit |
| --- | --- |
| Any business fact (phone, email, hours, pricing, counties, brands, payments, license, flags) | `src/config/business.ts` |
| Home/about/contact/service-area/TAB/FAQ/leave-review page copy or SEO | `src/content/site/<page>.md` |
| Service pages | `src/content/services/*.md` |
| FAQs | `src/content/faqs/*.md` |
| Portfolio entries (photos + story) | `src/content/projects/*.md` + images in `src/content/projects/images/` |
| Customer reviews (genuine only) | `src/content/reviews/*.md` |
| Page copy/markup for static pages | `src/pages/*.astro` |
| Header/footer navigation | `src/components/Header.astro` / `Footer.astro` |

Schemas and how-to: `docs/CONTENT-GUIDE.md`. After content edits run `npm run verify`.

## Photo and image management

- **Project photos** live in `src/content/projects/images/`, **page-copy photos** in
  `src/content/site/images/` — both referenced from frontmatter via `image()` fields so
  Astro's built-in `astro:assets` pipeline optimizes them automatically (responsive,
  dimensions enforced, no distortion). `alt` text is required by the schema; the build
  fails without it. `label: 'before' | 'after'` pairs render as labeled before/after
  comparisons (side by side on desktop, stacked on mobile). Optional `position` field
  sets the focal point (any CSS `object-position` value).
- `public/images/` is for direct-reference assets only (not optimized); `public/brand/`
  holds logo/icons/OG image.
- Naming: lowercase, hyphenated, descriptive — e.g. `air-handler-replacement-spring-hill-before.jpg`.
- Run `node scripts/photo.mjs <path>` to check photos for oversized dimensions (>4000px),
  file size (>1 MB), or wrong format; `--resize 2000 --write` downscales in place
  (good targets: ≤2000px long edge, JPEG, under ~500 KB).
- Never fabricate or stage photos; only genuine owner-supplied work photos.
- When the owner supplies photos anywhere in the project, the agent should run the
  guardrail tool, optimize, rename, place them in the correct collection images directory,
  and wire them into frontmatter with honest alt text.
- Full conventions: `docs/IMAGE-GUIDE.md`.

## Component development standards

- New sections/features are built **only when requested** — no speculative features.
- Reusable sections are prop-driven `.astro` components following the `CtaBand.astro` pattern:
  typed `Props` interface, defaults, no external state, scoped styles added to `global.css`.
- Styling rules: use design tokens only (`src/styles/tokens.css`) — never hard-code colors,
  spacing, or font sizes; gold is never used as small text on light surfaces; focus outlines
  (3px) are never removed; all motion respects `prefers-reduced-motion`; touch targets ≥ 44px;
  no content may depend on JavaScript.
- Icons come from `src/components/Icon.astro` (check its enum before inventing new icon names).
- Preserve the current design until a specific redesign is approved by the owner.

## SEO, accessibility, and performance requirements

- Every page renders through `BaseLayout` → `BaseHead` (canonical URL with trailing slash, meta
  description, Open Graph, `HVACBusiness` JSON-LD built from `business.ts`). New pages must set
  a unique title + description via props; the sitemap and robots.txt are generated.
- `PUBLIC_PREVIEW_MODE=true` is only for non-production preview deployments (adds `noindex` +
  `Disallow: /`). Production must never set it. Production verification: `robots.txt` shows
  `Allow: /` and meta robots is `index, follow`.
- **URLs are permanent** — never change or remove an existing public URL without explicit owner
  approval; there is no redirect mechanism in the static build.
- Targets: WCAG 2.2 AA (automated scans + manual owner pass), mobile LCP ≤ 2.0s, no horizontal
  overflow at 360px, no console errors.

## Business information integrity (non-negotiable)

- **Never fabricate**: reviews, project outcomes, photos, credentials, license numbers,
  certifications, awards, response-time guarantees, 24/7 claims, or superlative claims
  ("best/cheapest"). Empty collections stay empty until the owner supplies genuine content.
- `business.licenseNumber` stays empty until the owner provides the verified number; while
  empty, no license line is rendered (intentional — do not "fix" this).
- Warranty wording stays exactly: "Ask about the workmanship and manufacturer warranty coverage
  included with your proposal."
- The Web3Forms access key is a public client-side identifier by design — it is not a secret.

## Verification and reporting requirements

- Minimum bar for any change: `npm run verify` passes (0 type errors + successful build).
- UI/behavior changes: also run `node scripts/smoke.mjs` against a preview server.
- **Visual honesty rule**: this engineering environment cannot visually inspect images. A
  visual change is verified by rendering it (screenshot script) and inspecting programmatically
  (DOM/geometry assertions, built-HTML checks). Never claim a change "looks right" without
  rendering it; hand screenshots to the owner for human review and say so.
- Report what was tested, the actual results, and anything that could not be tested. Never
  report partial work as complete, and never fake a passing status.

## Known caveats and open items

- Real Web3Forms delivery to the inbox is verified only by an owner-authorized live submission.
- `licenseNumber` is empty (owner input required).
- Branding uses the approved Logo 2 (transparent light/dark variants in `public/brand/`,
  originals preserved in `brand-source/originals/`); regenerate display assets with
  `scripts/generate-brand-images.mjs`. The Google-review QR lives in
  `public/brand/qr-review.*` and is verified by `scripts/generate-review-qr.mjs`
  (decode-checked against `business.reviewsSubmissionUrl`).
- Lighthouse lab metrics and full axe-core scans are documented as pending in
  `docs/VERIFICATION.md`.
- Docs history: the site was originally documented for Cloudflare Pages; the deployment is now
  the owner's GitHub-connected Cloudflare project (see `docs/DEPLOYMENT.md`).
