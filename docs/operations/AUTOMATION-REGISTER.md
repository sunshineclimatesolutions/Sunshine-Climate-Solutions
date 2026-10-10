# Automation Register

Every actual automation or scripted workflow in the SCS repository and ecosystem — what it
does, how it is triggered, how to verify it, and what happens when it fails.

**Nothing in this register is aspirational.** If a process is manual or planned, it is listed
in the last section as manual/planned. Do not describe a workflow as automated unless it is
documented here with a real trigger.

Last reviewed: **October 1, 2026**

---

## A. Automatic / event-driven workflows

### A1. Cloudflare production deployment

| Field | Detail |
| --- | --- |
| Purpose | Build and publish the website to production |
| Trigger | Push to `main` (GitHub-connected Cloudflare project) |
| Mode | **Automatic (external platform)** — configuration lives in the Cloudflare dashboard, not in this repository |
| Source | Cloudflare project settings (owner); build `npm run build`, output `dist/`, Node 20+ |
| Dependencies | GitHub `main`; Cloudflare project connection; environment variables (`PUBLIC_PREVIEW_MODE` must be unset/false in production) |
| Inputs / outputs | Input: repository commit. Output: deployed static site on `https://sunshineclimatesolutions.com` |
| How to verify | Open the deployment log in Cloudflare; confirm the live page reflects the commit; run `node scripts/smoke.mjs` with `BASE_URL=https://sunshineclimatesolutions.com` |
| Failure behavior | A failed build never affects the live site — the previous build keeps serving |
| Retry | Fix the build locally (`npm run verify`), commit, push again |
| Owner responsibility | Review deployments; never change Cloudflare settings/DNS/GitHub connection from the repo |
| Recovery / rollback | Revert the offending commit on `main` (forward-fix) — there is no repository-level deploy command; see `docs/DEPLOYMENT.md` |

**Preview builds (pull requests): DISABLED by owner (2026-10-01).** "Builds for Preview
branches" is turned off in the Cloudflare dashboard; production builds remain enabled and
unchanged. Historical failure (preserved for troubleshooting): the **Astro build step
succeeded** (18 pages), but the subsequent preview deploy step (`npx wrangler preview`) failed
with *"Your Wrangler configuration is missing a `previews` block to run this command"* because
the repository intentionally contains no Wrangler configuration. Future preview deployments
require a separately approved configuration project — `docs/DEPLOYMENT.md` → Preview
deployments.

### A2. IndexNow submissions

| Field | Detail |
| --- | --- |
| Purpose | Notify participating engines (Bing, Yandex, Seznam, Naver, …) about changed canonical URLs |
| Trigger | Push to `main` — GitHub Actions workflow `.github/workflows/indexnow.yml` |
| Mode | **Automatic** (GitHub Actions) + **manual** runs of the same script |
| Source | `.github/workflows/indexnow.yml` → `scripts/indexnow.mjs` |
| Dependencies | GitHub Actions enabled; IndexNow key file in `public/<key>.txt` (public by design); production URLs live before submission |
| Inputs / outputs | Input: commit range (`BEFORE..AFTER`). Output: one batched POST to `https://api.indexnow.org/indexnow`; logs each URL + HTTP response |
| How to verify | GitHub Actions run log (`gh run list --workflow IndexNow`); success = workflow green and "Submitted N URL(s)" with HTTP 200 |
| Failure behavior | Workflow exits non-zero on submission failure; the site is unaffected. First push after history rewrite is skipped by design |
| Retry | Re-run the workflow, or manually: `node scripts/indexnow.mjs --range <before>..<after> --wait` |
| Owner responsibility | None for routine runs; approve pushes to `main` |
| Recovery / rollback | None needed — IndexNow is a notification only; it never modifies the site |
| Notes | The script maps changed files → canonical URLs, verifies each URL is live (HTTP 200, not `noindex`), excludes `/thank-you/`, `/404/` and preview hosts, and retries once on 429/5xx. Full details: `docs/INDEXNOW.md` |

### A3. Browser analytics events (GTM → GA4, Umami)

| Field | Detail |
| --- | --- |
| Purpose | Measure CTAs and leads without collecting personal information |
| Trigger | Visitor action (tel/sms/request click, form start, confirmed submission, fundraiser click) **and** analytics permission |
| Mode | **Event-driven in the browser** (site code); container publishing is manual in GTM |
| Source | `src/components/BaseHead.astro` (data-layer pushes + Umami calls); GTM container `GTM-MBGJ8SLD` → GA4 `G-EQ9CBESN23` |
| Dependencies | Visitor consent (Basic Consent Mode); published GTM container; GA4 property |
| Inputs / outputs | Input: allowlisted event name + allowlisted parameter (`cta_slot`, `service_category`, `support_platform`). Output: GA4 events; Umami fixed-name events |
| How to verify | GA4 Realtime/DebugView with GTM Preview; `node scripts/gtm-consent.mjs` proves site-side behavior (91/91) |
| Failure behavior | No permission → no Google request at all (by design). Missing/misconfigured GTM tag → event never reaches GA4 (site unaffected) |
| Retry | Events are not queued or replayed; the visitor can repeat the action |
| Owner responsibility | Keep the container published after changes; verify new tags in Preview before publishing |
| Recovery / rollback | Re-import the full container or patch file (`docs/gtm/`); see `docs/GTM-GA4-SETUP.md` |

### A4. Web3Forms submission flow

| Field | Detail |
| --- | --- |
| Purpose | Deliver service requests to the owner inbox |
| Trigger | Visitor submits the request form on `/contact/` |
| Mode | **Event-driven (third-party service)** |
| Source | `src/components/ContactForm.astro` → `https://api.web3forms.com/submit`; public access key in `business.ts` (override `PUBLIC_WEB3FORMS_ACCESS_KEY`) |
| Dependencies | Web3Forms service availability; valid access key; owner inbox |
| Inputs / outputs | Input: form fields. Output: email to `owner@sunshineclimatesolutions.com`; success only after provider confirms; a single-use session receipt enables `generate_lead` on `/thank-you/` |
| How to verify | Owner-authorized live test submission; inbox arrival; GA4 `generate_lead` in Realtime (with consent) |
| Failure behavior | Honest error message on the form + call/text alternative; no fake success; no receipt written |
| Retry | Visitor resubmits; duplicate-submit protection sends exactly one provider request |
| Owner responsibility | Monitor inbox and spam folder; rotate the key if abused (update `business.ts` / Cloudflare env) |
| Recovery / rollback | Fallback contact paths (call/text/email) always remain visible |

### A5. Bing Places ↔ Google Business Profile sync

| Field | Detail |
| --- | --- |
| Purpose | Keep the Bing local listing consistent with GBP |
| Trigger | Platform-side synchronization (owner-confirmed active) |
| Mode | **Automatic (external platform)** |
| Source | Bing Places dashboard (owner) |
| Dependencies | GBP fields current; Bing Places published |
| Inputs / outputs | Input: GBP data. Output: Bing Places listing |
| How to verify | Periodically compare Bing Places fields (name/phone/hours/website) against `business.ts` and the GBP |
| Failure behavior | Platform-side; no repository impact |
| Retry | Manual correction in the Bing Places dashboard |
| Owner responsibility | Periodic field audit (monthly per `docs/operations/MAINTENANCE-SCHEDULE.md`) |
| Recovery / rollback | Manual edits in the platform dashboard |

---

## B. Manually executed scripts (run by owner/agent, no scheduler)

All scripts run from the repository root with Node 20+. They are **not** scheduled; run them
deliberately. Script header comments document usage.

### B1. Marketing link + QR generation — `scripts/generate-marketing-links.mjs`

- **Purpose:** regenerate the UTM master docs and campaign QR assets from the registry.
- **Trigger:** manual — `npm run marketing:links` (also generates missing QRs), `npm run marketing:qr` (force-regenerate all QRs), `npm run marketing:verify` (check-only + attribution tests).
- **Source of truth:** `src/config/marketing-links.ts`.
- **Outputs:** `docs/marketing/UTM-MASTER-LINKS.md`, `UTM-MASTER-LINKS.csv`, `WHERE-TO-PASTE-UTM-LINKS.md`, `public/marketing/qr/*.svg|.png|-print.png`.
- **Verify:** the generator decodes every QR with an independent decoder; `npm run marketing:verify` also checks document drift, PII rules and (with a preview server) live attribution.
- **Failure behavior:** validation errors abort without writing; QR decode mismatches abort non-zero.
- **Retry:** fix the registry/config and re-run.
- **Owner responsibility:** use the generated URLs; never hand-edit generated docs.
- **Recovery:** re-run `npm run marketing:links` (idempotent).

### B2. Review QR generation — `scripts/generate-review-qr.mjs`

- **Purpose:** regenerate the Google-review QR assets from `business.reviewsSubmissionUrl` and decode-verify them.
- **Trigger:** manual.
- **Outputs:** `public/brand/qr-review.svg|.png|-print.png`.
- **Failure behavior:** decode mismatch exits non-zero.
- **Note:** do not change the review destination without regenerating and re-verifying.

### B3. Brand and social image generation

- `scripts/generate-brand-images.mjs` — regenerates `public/favicon.*`, `public/brand/icon-180.png`, `icon-192.png`, `icon-512.png`, `og-default-2026-10.png` from approved `brand-source/` originals. The social-card filename is date-versioned on purpose: link-preview caches (iMessage, Facebook, LinkedIn, X) key on the image URL, so a card change must publish at a new filename and `src/components/BaseHead.astro` must be updated in the same change.
- `scripts/generate-social-avatars.mjs` — generates `public/brand/social-avatar-400.png` / `-1024.png` from the approved mark.
- `scripts/generate-service-area-map.mjs` — regenerates the county map SVGs from official U.S. Census geometry (outputs in `public/images/`).
- `scripts/normalize-brand-logos.mjs` — brand-logo background normalization (historical maintenance utility).
- **Trigger:** manual, only when the underlying assets change.
- **Owner responsibility:** never regenerate brand assets without owner approval; the approved logo geometry is not to be modified.

### B4. Quality assurance scripts (manual, run around changes)

| Script | What it proves | Requires |
| --- | --- | --- |
| `npm run verify` | TypeScript diagnostics (0 errors) + production build | Node |
| `node scripts/links.mjs` | No broken internal links in `dist/` | `npm run build` first |
| `node scripts/verify-seo.mjs` | Titles/descriptions/H1 uniqueness, canonicals, robots, sitemap agreement, JSON-LD, breadcrumbs | build |
| `node scripts/verify-maps.mjs` | Gulf of America label + county labels in map SVGs and pages | build |
| `node scripts/verify-layout.mjs` | 390/768/1440 layout invariants, typography, buttons, images, overflow (needs preview) | `npm run preview` |
| `node scripts/a11y.mjs` | axe-core WCAG 2.2 AA scan across routes (needs preview) | preview |
| `node scripts/smoke.mjs` | Home/contact CTAs, action bar, no console errors (needs preview) | preview |
| `node scripts/gtm-consent.mjs` | Consent ordering, event gating, allowlists, no PII, preview guard (needs preview) | preview |
| `node scripts/verify-attribution.mjs` | UTM/canonical/sitemap hygiene + live attribution behavior (needs preview) | preview |
| `node scripts/verify-gtm-import.mjs` | Structural validation of both GTM JSON files, including required `measurementIdOverride` | Node |
| `node scripts/seo-inventory.mjs` | Per-page SEO facts → `docs/seo/seo-inventory.json` | build |
| `node scripts/indexnow.mjs …` | Manual IndexNow submissions | live site |

- **Automatic vs manual:** only IndexNow (A2) and the Cloudflare deployment (A1) run without a
  human. **Every QA check above is manual** — run them deliberately; they do not run in CI.
- **Failure behavior:** scripts exit non-zero and print the failing checks.
- **Owner responsibility:** agents run these before/after changes; the owner may ask for a
  verification report at any time.

### B5. Screenshot evidence scripts (manual)

- `scripts/screenshot.mjs` (360/768/1440 page set), `screenshot-sections.mjs`,
  `screenshot-aesthetic.mjs`, `screenshot-galleries.mjs`, `screenshot-maps.mjs`,
  `seo-screenshots.mjs before|after`.
- **Purpose:** owner visual review; evidence for documentation.
- **Outputs:** `docs/verification/screenshots/`, `docs/seo/screenshots/` (some sets committed,
  superseded sets intentionally untracked).
- **Requires:** preview server (except map captures that read assets).

---

## C. Manual / planned processes (no automation exists)

These are real operational tasks with **no automated integration** in this repository. Do not
describe them as automated.

| Process | Current mode | Authoritative documentation |
| --- | --- | --- |
| Social publishing (all platforms) | Manual — no scheduler connected | `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §4–6 |
| Content production (video, posts, Field Proof) | Manual | `docs/seo/90-DAY-CONTENT-PLAN.md`, `docs/marketing/CONTENT-OPERATING-SYSTEM.md` |
| Google review requests and replies | Manual | `docs/marketing/REVIEW-GROWTH-SYSTEM.md` |
| Lead follow-up and estimate sequence | Manual (private lead sheet) | `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §12–13 |
| Commercial/TAB outreach | Manual | `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §14 |
| Fundraiser reconciliation (contributions) | Manual (platform dashboards) | `docs/marketing/WEEKLY-MARKETING-SCORECARD.md` |
| Weekly KPI capture | Manual | `docs/marketing/WEEKLY-MARKETING-SCORECARD.md` |
| Search Console / GBP routines | Manual | `docs/seo/WEEKLY-SEARCH-CONSOLE-SOP.md`, `docs/seo/GBP-OPTIMIZATION-CHECKLIST.md` |
| Citation/listing consistency audits | Manual | `docs/seo/CITATION-AUDIT.md` |
| Paid media | **Not launched** — readiness rules only | `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §15 |
| CRM integration | **Not implemented** | — |
