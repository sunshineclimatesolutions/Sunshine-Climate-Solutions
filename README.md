# Sunshine Climate Solutions — Website

Marketing and service-request website for Sunshine Climate Solutions LLC.
Static site built with [Astro](https://astro.build) (static output, strict TypeScript, no client framework).

- **Production domain:** https://sunshineclimatesolutions.com
- **Local preview:** http://localhost:4321
- **Build output:** `dist/` (deploy this directory)

## START HERE

**Complete operating-system documentation: [`docs/OPERATIONS-HUB.md`](docs/OPERATIONS-HUB.md)** —
architecture, business facts, website/deployment, search and local listings, social platforms,
analytics, leads, fundraising, content/reviews, automation, onboarding and current status.

Role-based entry points:

| Role | Start here |
| --- | --- |
| Owner | [`docs/operations/PLATFORM-STATUS.md`](docs/operations/PLATFORM-STATUS.md) (outstanding actions) + [`docs/operations/MAINTENANCE-SCHEDULE.md`](docs/operations/MAINTENANCE-SCHEDULE.md) |
| Marketer | [`docs/operations/MARKETER-START-HERE.md`](docs/operations/MARKETER-START-HERE.md) |
| Developer | [`docs/operations/DEVELOPER-START-HERE.md`](docs/operations/DEVELOPER-START-HERE.md) + [`AGENTS.md`](AGENTS.md) |
| SEO specialist | [`docs/seo/90-DAY-CONTENT-PLAN.md`](docs/seo/90-DAY-CONTENT-PLAN.md) + [`docs/seo/KEYWORD-TO-PAGE-MAP.md`](docs/seo/KEYWORD-TO-PAGE-MAP.md) |
| Analytics specialist | [`docs/GTM-GA4-SETUP.md`](docs/GTM-GA4-SETUP.md) |

## Requirements

- Node.js **20 or newer** (Node 22 LTS recommended). `node -v` to check.
- npm 10+ (ships with Node).

## Setup

```bash
npm install
npx playwright install chromium   # optional: only for the verification scripts
```

## Everyday commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload at http://localhost:4321 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves the production build at http://localhost:4321 |
| `npm run check` | Astro + TypeScript diagnostics |
| `npm run verify` | `check` + `build` in one go |
| `node scripts/smoke.mjs` | Quick mobile/desktop smoke test (run `npm run preview` first) |
| `node scripts/photo.mjs <path>` | Photo size/format guardrails; `--resize 2000 --write` downscales in place |
| `node scripts/links.mjs` | Broken internal-link check on the built site (run after `npm run build`) |

Optional deeper verification (after `npm run preview`):

```bash
node scripts/screenshot.mjs   # screenshots at 360/768/1440 → docs/verification/screenshots
node scripts/a11y.mjs         # axe-core WCAG 2.2 AA scan → docs/verification/a11y-report.json
node scripts/generate-brand-images.mjs  # regenerates public/brand PNGs from the provisional mark
node scripts/smoke.mjs        # quick mobile/desktop smoke test (see docs/VERIFICATION.md)
```

(Lighthouse performance runs are documented in `docs/VERIFICATION.md` and will be added with
the full post-push verification pass.)

## Editing content (no code changes needed)

All editable business facts live in **`src/config/business.ts`** — phone, email, hours, pricing,
counties, brands, payment options, feature flags, and:

- **License number** (`licenseNumber`): enter the verified Florida CAC number here. It then
  renders in the footer on every page and near the top of About and Contact. Leave empty until
  verified — the site renders no license line while it's blank.
- **Web3Forms access key** (`web3forms.accessKey`): public client-side submission identifier
  (safe to commit — Web3Forms keys are designed for client-side use). Override per-environment
  with `PUBLIC_WEB3FORMS_ACCESS_KEY` (see `.env.example`).

Editable collections (Markdown, validated at build time):

| Path | Content |
| --- | --- |
| `src/content/services/*.md` | Residential/commercial service pages |
| `src/content/faqs/*.md` | FAQ entries, grouped by `category` |
| `src/content/projects/*.md` | Portfolio entries — **Our Work page + nav stay hidden until a genuine entry exists** |
| `src/content/reviews/*.md` | Testimonials — hidden until genuine review text exists |

Schemas and step-by-step instructions: **`docs/CONTENT-GUIDE.md`**.

## Forms

The contact form posts to Web3Forms (`https://api.web3forms.com/submit`) and delivers to
`owner@sunshineclimatesolutions.com`. The form only renders when an access key is configured;
otherwise an honest "call/text/email" fallback shows — no fake success states. Submission
success is only acknowledged after the provider confirms acceptance.

## Preview vs production indexing

- Production build: normal indexing (`index, follow`) + `robots.txt` with sitemap.
- Preview builds: set `PUBLIC_PREVIEW_MODE=true` (e.g. in the Cloudflare preview environment)
  → every page gets `noindex` meta and `robots.txt` becomes `Disallow: /`.
  **Must remain unset/false for the production deployment.** Details: `docs/DEPLOYMENT.md`.

## Deployment

GitHub-connected Cloudflare project (Workers): build `npm run build`, output `dist/`, Node 20+.
Pushes to `main` trigger the production deployment. Full details, DNS cautions, and rollback
instructions: **`docs/DEPLOYMENT.md`**.

## Docs index

**Repository & operations**

- **`AGENTS.md`** — permanent instructions for AI engineering agents (read first)
- `docs/OPERATIONS-HUB.md` — complete operating-system entry point
- `docs/operations/PLATFORM-STATUS.md` — live platform status register
- `docs/operations/AUTOMATION-REGISTER.md` — automations and scripted workflows
- `docs/operations/MARKETER-START-HERE.md` / `DEVELOPER-START-HERE.md` — role onboarding
- `docs/operations/ACCESS-AND-OWNERSHIP.md` — access, roles, agency onboarding/offboarding
- `docs/operations/MAINTENANCE-SCHEDULE.md` — daily/weekly/monthly/post-deploy cadence

**Website & content**

- `docs/CONTENT-GUIDE.md` — adding/editing services, FAQs, projects, reviews, page copy
- `docs/IMAGE-GUIDE.md` — photo management, naming, alt text, before/after, guardrails
- `docs/PRE-LAUNCH-CHECKLIST.md` — launch blockers and verification status
- `docs/VERIFICATION.md` — what has been tested, results, and known limitations
- `docs/DEPLOYMENT.md` — Cloudflare deployment, indexing, DNS cautions, rollback
- `docs/DESIGN-SYSTEM.md` — design tokens and typography
- `docs/LOGO-PROMPTS.md` — three ready-to-paste Ideogram prompts for the final logo

**Marketing system (canonical)**

- `docs/seo/90-DAY-CONTENT-PLAN.md` — **strategy**: two engines, audiences, 12-week campaign
  map, query/page ownership, CTAs, Field Proof requirements
- `docs/marketing/CONTENT-OPERATING-SYSTEM.md` — **execution manual**: weekly production
  workflow, platform roles, SOPs, follow-up, measurement, decision rules
- `docs/marketing/90-DAY-CONTENT-CALENDAR.csv` — week-by-week execution tracker
- `docs/marketing/WEEKLY-MARKETING-SCORECARD.md` — weekly KPI capture (customer + fundraiser)
- `docs/marketing/REVIEW-GROWTH-SYSTEM.md` — review and referral workflow
- `docs/marketing/SOCIAL-PROFILE-SETUP.md` — social bios, brand block, visual specs
- `docs/marketing/SOCIAL-ASSET-SOURCES.md` — social icon/avatar provenance
- `docs/marketing/UTM-MASTER-LINKS.md` / `.csv` / `WHERE-TO-PASTE-UTM-LINKS.md` — generated UTM
  registry and owner cheat sheet (source of truth: `src/config/marketing-links.ts`; regenerate
  with `npm run marketing:links`)

**Analytics & automation**

- `docs/GTM-GA4-SETUP.md` — consent architecture, event reference, GTM import files, current
  status and diagnosis
- `docs/gtm/SCS-GA4-container-import.json` / `SCS-support-tracking-patch.json` — structural GTM
  import files (validated by `node scripts/verify-gtm-import.mjs`)
- `docs/INDEXNOW.md` — IndexNow submission tooling and workflow
- `.github/workflows/indexnow.yml` — the only repository workflow (runs on `main` pushes)

**SEO & local search**

- `docs/seo/KEYWORD-TO-PAGE-MAP.md`, `KEYWORD-MASTER.md`, `ON-PAGE-AUDIT.md`,
  `INTERNAL-LINK-MAP.md`, `STRUCTURED-DATA-AUDIT.md`, `LOCAL-PAGE-ROADMAP.md`,
  `TECHNICAL-SEO-AUDIT.md`, `SEO-BASELINE.md`, `RANK-MONITORING-PLAN.md`,
  `WEEKLY-SEARCH-CONSOLE-SOP.md`, `GBP-OPTIMIZATION-CHECKLIST.md`,
  `OTHER-SEARCH-CHANNELS.md`, `CITATION-AUDIT.md`, `LOCAL-LINK-OPPORTUNITIES.csv`
- `SEO_MASTER_AUDIT_SEPT_2026.md` — historical September 2026 audit snapshot (annotated)

## Notes

- Fonts (Archivo, Public Sans) are self-hosted under SIL OFL — see `public/fonts/`.
- Branding uses the **approved Logo 2** (owner-supplied): bold angular SCS letters with a
  gold stripe. Transparent variants, favicons and social images are generated from
  `brand-source/` originals — see `docs/IMAGE-GUIDE.md` and `scripts/generate-brand-images.mjs`.
- Expected build notices: while `projects`/`reviews` collections are empty, the build logs
  "The collection … does not exist or is empty" — that is intentional (the pages stay hidden
  until real content exists) and does not affect the output.
