# Verification

What has actually been tested, where, and what remains unverified. This file is updated as
verification continues. **Last updated after the initial build + smoke test (pre-deployment).**

## Environment

- OS: Windows (PowerShell 5.1 test runner)
- Node v24.19.0, npm 11.17.0
- Astro 5.18.2, TypeScript strictest preset
- Browser checks: Playwright Chromium (installed via `npx playwright install chromium`)
- Server under test: `astro preview` serving the **production build** (`npm run build`),
  `PUBLIC_PREVIEW_MODE` unset (production settings)

## Build & types

| Check | Result |
| --- | --- |
| `npx astro check` (strictest TS) | **0 errors, 0 warnings** (31 files) |
| `npm run build` | **PASS** — 14 pages + `sitemap-index.xml` + `robots.txt` |
| Empty `projects`/`reviews` collections | Our Work page **not built**, no nav/footer links to it (verified in `dist/`) |
| `dist/our-work` absent | **PASS** |
| robots.txt (production) | `User-agent: * Allow: /` + sitemap URL — **PASS** |
| robots.txt (preview build, `PUBLIC_PREVIEW_MODE=true`) | `Disallow: /` — **PASS** (separate build, then rebuilt production) |
| Preview build meta robots | `noindex, follow` on every page — **PASS** |
| `/thank-you/` | `noindex, follow` in production build — **PASS** |
| Sitemap | 12 routes, excludes 404 and thank-you — **PASS** |

## Smoke test (`node scripts/smoke.mjs` — committed)

Real-browser checks against the production build at **360px** and **1440px**:

| Check | Result |
| --- | --- |
| `/` and `/contact/` HTTP status | 200 both viewports — **PASS** |
| Horizontal overflow (scrollWidth vs clientWidth) | **0px at 360 and 1440** — PASS (initially 119px at 360 from header actions; fixed by hiding duplicate desktop phone/CTA on mobile) |
| Gold contact strip (full phone number) visible without opening nav at 360 | **PASS** |
| Sticky action bar at 360 | 3 buttons (Call/Text/Request), 53px tall, body padding reserves space — **PASS** |
| Action bar hides when a form field is focused | **PASS** (data-keyboard=open set) |
| Form validation (empty submit at 360) | ≥4 linked field errors shown — **PASS** |
| Mobile nav | Opens (aria-expanded=true), panel visible, closes on Escape — **PASS** |
| tel:/sms: links present | 8 tel + 5 sms per page — **PASS** |
| Console/page errors (both pages, both widths) | **None** — PASS |

## Form implementation review (static + code inspection)

- Form action `https://api.web3forms.com/submit`, honeypot `botcheck`, access key rendered —
  verified present in built HTML.
- Success only after JSON `success: true` (provider acceptance); 429/5xx/network/timeout each
  produce distinct, honest messages with call/text alternatives; field values preserved on
  failure; double-submit prevented; status announced via `role="status"` `aria-live="polite"`.
- Missing-key state: renders honest call/text/email fallback, never simulates success (code
  path committed in `ContactForm.astro`).

## Not yet verified (planned post-push)

- **Lighthouse lab metrics** (LCP/CLS/TBT medians ×3 runs) — deferred per deadline; targets
  are LCP ≤ 2.0s (stretch <1.8s) and CLS ≤ 0.05 in documented repeatable mobile lab testing;
  the runner will be added with the post-push verification pass.
- **Full axe-core WCAG 2.2 AA scans** across routes — script committed (`scripts/a11y.mjs`),
  not yet run.
- **Screenshots at 360/768/1440** — script committed (`scripts/screenshot.mjs`), not yet run.
  Note: the engineering model in this session cannot visually inspect images, so screenshots
  are captured for the owner's review and layout behavior is verified programmatically instead.
- **Real Web3Forms delivery to the inbox** — requires an owner-authorized live submission.
  Endpoint, payload shape, and response handling are implemented per Web3Forms' current
  documented API and exercised only against mocks so far.
- **Production deployment behavior** (DNS/HTTPS/canonical redirects) — pending deployment
  authorization.

## Known limitations

- Prelaunch lab results are not real-user Core Web Vitals; field data requires postlaunch
  traffic.
- The `projects`/`reviews` collections are intentionally empty; corresponding UI is hidden.
  Build logs "collection … is empty" notices while they are empty — expected.
- WCAG 2.2 AA conformance is not certified; automated checks are necessary but not sufficient,
  and manual review by the owner is recommended before launch (see PRE-LAUNCH-CHECKLIST).

## Pages CMS integration (branch `pages-cms` — pending owner approval)

What was verified locally on the branch:

| Check | Result |
| --- | --- |
| `.pages.yml` matches current Pages CMS 2.x documentation | **PASS** — config reference checked against pagescms.org/docs (media input/output, content groups/collections/files, `body` key, `list` fields, select/image options) |
| `.pages.yml` parses as valid YAML | **PASS** (js-yaml) |
| CMS field names/categories match Astro schemas (`src/content.config.ts`) | **PASS** — services, FAQs, reviews, projects, site |
| Simulated hero-photo upload (`public/images/…` + `heroImage` field) | **PASS** — `<img src="/images/…" alt=…>` rendered, file copied to `dist/` |
| Simulated CMS review entry | **PASS** — CMS-shaped frontmatter rendered on the homepage |
| Simulated CMS project entry with media-library photo + width/height | **PASS** — Our Work page + detail page built, image rendered with dimensions, sitemap updated |
| Test content removed after simulation | **PASS** — no fabricated testimonials/photos/projects shipped; clean rebuild = 14 pages, Our Work hidden again |
| Regression: `astro check` | **PASS** — 0 errors |
| Regression: production build + smoke test | **PASS** — 14 pages, all smoke checks green |
| Stale Astro content store after local file deletions | Documented — clear `node_modules/.astro` locally (see CONTENT-GUIDE); CI/CMS builds are always clean and unaffected |
| Live connection to app.pagescms.org | **Not yet verified** — owner action: install the Pages CMS GitHub App and open the repo (see `docs/PAGES-CMS.md`). Editing in the CMS UI itself could not be exercised without that connection; the config was validated against the current documented format instead. |
