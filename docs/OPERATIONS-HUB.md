# Operations Hub — Sunshine Climate Solutions

**Primary documentation entry point for the complete SCS operating system** — the website,
marketing ecosystem, analytics, fundraising layer, external platforms, automation and
operational workflows.

A new marketer, developer, SEO specialist or agency should be able to start here and find the
authoritative source for every system without interviewing the owner about anything already
documented.

Last reviewed: **October 1, 2026** · Repository: `sunshineclimatesolutions/Sunshine-Climate-Solutions` · Production: <https://sunshineclimatesolutions.com>

## 1. Executive overview

Sunshine Climate Solutions LLC is an owner-operated HVAC company based in Spring Hill, Florida,
serving residential and light-commercial customers across Hernando, Pasco, Pinellas and
Hillsborough counties. The differentiators are technical: measurement-driven diagnostics,
airflow/static-pressure work, electrical/control diagnosis, airflow and TAB instrumentation,
repair-first recommendations and honest explanations. The company is also building a
commercial/TAB services pipeline (contractors, property managers, engineers, facility teams).

This repository is the company's **website and marketing system**:

- A static Astro marketing site with service pages, a service-area hub, a request form and a
  privacy/consent system.
- A content-driven marketing operating system (90-day plan, weekly workflow, calendar,
  scorecard, review workflow).
- A UTM/QR attribution system with a central registry.
- Consent-gated analytics (Google Tag Manager → GA4, plus cookieless Umami).
- A separate, noindexed fundraising layer (`/support/`) with its own tracking.
- SEO/local-search documentation and historical audits.
- This operations documentation set: platform status, automation inventory, onboarding paths,
  access/ownership guidance and maintenance schedule.

**Documentation philosophy:** source-of-truth files (code/config) are authoritative; generated
documents are regenerated, never hand-edited; current operational status lives in
`docs/operations/PLATFORM-STATUS.md`; dated audits stay historical. See §12 and the governance
rules in `docs/operations/PLATFORM-STATUS.md`.

## 2. Architecture at a glance

```text
                        OWNER / FIELD WORK
                               │
   ┌───────────────────────────┼───────────────────────────────┐
   │                           │                               │
 WEBSITE                    SEARCH / LOCAL                  SOCIAL
 Astro static               Google Search (GSC domain)      Facebook · Instagram
 GitHub main → Cloudflare   Google Business Profile         TikTok · YouTube
 business.ts = facts        Bing Webmaster + Bing Places    X · Nextdoor · Yelp
 content collections        Apple Business Connect (pend.)  Gab · Parler
 service + support pages    IndexNow freshness               LinkedIn (pending)
   │                           │                               │
   └───────────────┬───────────┴───────────────┬───────────────┘
                   │                           │
              ANALYTICS                    LEADS
     GTM GTM-MBGJ8SLD → GA4 G-EQ9CBESN23     Web3Forms → owner inbox
     Umami (cookieless)                       private lead sheet → follow-up
     consent-gated (Basic Consent Mode)       estimate sequence → booked job
                   │                           │
             FUNDRAISING                    CONTENT
     /support/ (noindex) → GoFundMe         90-day plan → weekly workflow
     GiveSendGo · tracked clicks            calendar · scorecard · Field Proof
     independent QR campaign                reviews via /leave-review/
```

Every arrow above maps to an authoritative document — see §12.

## 3. Business identity and source of truth

**`src/config/business.ts` is the single source of truth for every business fact.** Never
hard-code these values anywhere else, and never invent replacements:

| Fact | Current value (source of truth) |
| --- | --- |
| Business name / legal name | Sunshine Climate Solutions / Sunshine Climate Solutions LLC |
| Production URL | `https://sunshineclimatesolutions.com` |
| Phone | (727) 661-5200 (`tel:` / `sms:` links) |
| Email | `owner@sunshineclimatesolutions.com` |
| Hours | 7:30 AM – 7:30 PM, every day |
| Pricing | $50 service call (waived with repair), $75/system/visit maintenance, free estimates |
| Service area | Hernando, Pasco, Pinellas, Hillsborough counties; Spring Hill home market |
| License number | **empty — owner input required** (no license line renders while empty) |
| Social profiles | Facebook, Instagram, TikTok, YouTube, X, Nextdoor, Yelp, Gab, Parler (LinkedIn empty/pending) |
| Fundraising | GoFundMe + GiveSendGo URLs; `founderVideoUrl` empty until supplied |
| Analytics | Umami website ID, GTM container `GTM-MBGJ8SLD` (public client-side IDs) |
| Web3Forms | public client-side access key (safe to commit by design) |
| Feature flags | `financingPromo: false` |

Owner-approved founder disclosures (name, background, faith/community motivation, ~$25,000
founder investment) are published **only** on `/support/`, with explicit owner approval
(October 2026). Structured data still omits the `founder` Person property; do not expand owner
disclosures elsewhere without owner approval. See §9 and
`docs/operations/ACCESS-AND-OWNERSHIP.md`.

## 4. Website and deployment architecture

- **Astro 5, `output: 'static'`, strict TypeScript.** No client framework, no CSS framework, no
  CMS, no database. Pages are thin wrappers over content collections; components are
  presentation-only and prop-driven.
- **Content collections** (`src/content.config.ts`, Zod-validated): `services`, `faqs`, `site`,
  `projects` (intentionally empty — Our Work hidden), `reviews` (intentionally empty).
- **Pages:** `/`, `/services/`, five service pages, `/service-area/`, `/service-area/spring-hill-fl/`,
  `/tab-commissioning-support/`, `/about/`, `/faq/`, `/contact/`, `/leave-review/`, `/privacy/`,
  `/support/` (noindex), `/thank-you/` (noindex), custom 404.
- **Deployment:** the GitHub repo is connected to the owner's Cloudflare project. **Pushes to
  `main` trigger production builds** (build `npm run build`, output `dist/`, Node 20+).
  Deployment settings, DNS and the GitHub connection live in the Cloudflare dashboard — never
  change them from this repository.
- **URLs are permanent.** There is no redirect mechanism in the static build; never change or
  remove a public URL without explicit owner approval.
- **Preview safety:** `PUBLIC_PREVIEW_MODE=true` produces a noindex build (`robots.txt:
  Disallow: /`). Production must never set it.
- Full details and rollback: `docs/DEPLOYMENT.md`. Developer onboarding:
  `docs/operations/DEVELOPER-START-HERE.md`. Permanent agent instructions: `AGENTS.md`.

## 5. Search and local listings

| Surface | Role | Authoritative documentation |
| --- | --- | --- |
| Google Search (organic) | Long-term query capture via service pages + Spring Hill hub | `docs/seo/KEYWORD-TO-PAGE-MAP.md`, `docs/seo/90-DAY-CONTENT-PLAN.md` |
| Google Search Console | Domain property (verified); query/page performance | `docs/seo/WEEKLY-SEARCH-CONSOLE-SOP.md` |
| Google Business Profile | Local conversion, reviews, photos, posts | `docs/seo/GBP-OPTIMIZATION-CHECKLIST.md` |
| Bing Webmaster Tools | Bing/Copilot visibility; Site Scan; IndexNow | `docs/INDEXNOW.md`, `docs/seo/OTHER-SEARCH-CHANNELS.md` |
| Bing Places | Local listing, synchronized from GBP | `docs/seo/OTHER-SEARCH-CHANNELS.md`, `docs/operations/PLATFORM-STATUS.md` |
| Apple Business Connect | Apple Maps/Siri presence | **Pending owner confirmation** — `docs/seo/OTHER-SEARCH-CHANNELS.md` |
| IndexNow | Freshness notifications for changed URLs | `docs/INDEXNOW.md`, `.github/workflows/indexnow.yml` |
| Citation/NAP consistency | Directory consistency, Yelp locality, Facebook fields | `docs/seo/CITATION-AUDIT.md`, `docs/seo/CITATION-AUDIT.csv` |

Current platform status (verified vs owner-confirmed vs pending) is maintained only in
`docs/operations/PLATFORM-STATUS.md`. Historical audits keep their original dated findings.

## 6. Social platforms and publishing

- **Configured public profiles** (footer + structured data, sourced from `business.ts`):
  Facebook, Instagram, TikTok, YouTube, X, Nextdoor, Yelp, Gab, Parler.
- **Pending:** LinkedIn Company Page (no public URL — nothing is published). Known eligibility
  rule (official LinkedIn docs, checked 2026-10-01): the personal account needs **more than one
  connection** (≥2 accepted connections) to create a Company Page; other blockers may apply.
- **TikTok business verification: owner-confirmed completed (2026-10-01)** — verified business
  status in TikTok Business Suite ("Verify your business — Good to go!"); the configured
  website is the tracked TikTok profile URL. Business Suite exposes features including
  Analytics, Creative Hub, Leads Manager and message settings/labels (availability only — not a
  claim that lead-gen or messaging is enabled). This is **business verification, not a public
  blue-check**. Remaining owner actions: review Leads Manager, configure message
  labels/automation, verify street-address visibility (service-area business). Details:
  `docs/marketing/SOCIAL-PROFILE-SETUP.md`.
- **Setup and bios:** `docs/marketing/SOCIAL-PROFILE-SETUP.md`; **icon/asset provenance:**
  `docs/marketing/SOCIAL-ASSET-SOURCES.md`.
- **Publishing rules and cadence:** `docs/marketing/CONTENT-OPERATING-SYSTEM.md` (platform role
  matrix, weekly production system, fundraising distribution rules).
- **Tracking:** profile website fields use the prepared profile UTM links; fundraiser posts use
  the platform-specific `/support/` links. Exact URLs:
  `docs/marketing/WHERE-TO-PASTE-UTM-LINKS.md` (generated).
- **No social scheduler or publishing automation exists** — publishing is manual (see §11).

## 7. Analytics and attribution

- **Google Tag Manager** container `GTM-MBGJ8SLD` loads **only after the visitor allows
  analytics** (Basic Consent Mode; Consent Mode v2 defaults all-denied first, advertising
  always denied). GA4 measurement ID `G-EQ9CBESN23` is configured inside the container — the
  site never loads gtag.js directly.
- **Umami Cloud** (cookieless, aggregate only) loads independently and records fixed event
  names.
- **Events:** `scs_call_click`, `scs_text_click`, `scs_request_click`, `scs_form_start`,
  `scs_form_confirmed` → GA4 `generate_lead`, `scs_support_click` (fundraiser outbound). Full
  reference, parameters, allowlists, consent behavior and tag/trigger mapping:
  `docs/GTM-GA4-SETUP.md` (Event reference + CURRENT STATUS).
- **GA4 custom dimensions (event-scoped, owner-confirmed created):** `Support platform`
  (`support_platform`), `Service category` (`service_category`), `CTA slot` (`cta_slot`).
- **Key event:** `generate_lead` (owner-confirmed configured).
- **UTM/attribution system:** source of truth `src/config/marketing-links.ts`; generated
  master registry `docs/marketing/UTM-MASTER-LINKS.md` / `.csv`; owner cheat sheet
  `docs/marketing/WHERE-TO-PASTE-UTM-LINKS.md`; attribution behavior is proven by
  `scripts/verify-attribution.mjs`. Never invent UTM naming; never hand-edit generated docs.
- **Honest limits:** a click is not a call; a form start is not a submission; a confirmed lead
  is not a paying customer; a fundraiser outbound click is not a donation. Donation/donor data
  is never measured through website analytics.
- **Lead records** live in a private owner-maintained sheet (specification in
  `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §12) — never in analytics tools.

## 8. Lead acquisition and follow-up

1. **CTA** — every service path funnels to CALL / TEXT / REQUEST SERVICE.
2. **Form** — posts to Web3Forms; success is acknowledged only after the provider confirms;
   failure paths show honest errors and call/text alternatives.
3. **Confirmed lead event** — a single-use session receipt on `/thank-you/` emits
   `scs_form_confirmed` → GA4 `generate_lead` (only with analytics permission).
4. **Follow-up** — owner responds during business hours; residential estimate sequence is
   Day 0/1/3/7/30 (`docs/marketing/CONTENT-OPERATING-SYSTEM.md` §13).
5. **Attribution** — UTM when present, "how did you find us?" when not; private lead sheet
   fields per the specification (§12 of the operating system).
6. **Reviews/referrals** — `docs/marketing/REVIEW-GROWTH-SYSTEM.md`.

There is **no CRM integration** — the lead sheet and follow-up are manual (see §11).

## 9. Fundraising architecture

- **Page:** `/support/` — intentionally `noindex, follow`, excluded from the sitemap, direct/
  social/email/referral traffic only. Content lives in `src/content/site/support.md`; layout in
  `src/pages/support.astro`.
- **Campaign URLs:** GoFundMe + GiveSendGo in `business.fundraising`; optional
  `founderVideoUrl` renders the founder-video section only when set.
- **Inbound tracking:** platform-specific `/support/` links in `src/config/marketing-links.ts`
  (`*_support_*` entries) plus the independent print QR `support-campaign`.
- **Outbound tracking:** fundraiser buttons carry `data-support-platform`; consented clicks push
  `scs_support_click` with allowlisted `support_platform` (`gofundme` | `givesendgo`); Umami
  records `support-gofundme-click` / `support-givesendgo-click`.
- **Separation rule:** the fundraiser layer never appears in the service funnel (no banner,
  popup, service-page CTA or global mobile-bar change). The only site references are the
  low-prominence footer link, one About-page note, and `/support/` itself.
- **Donations are not tracked by the website.** Contribution totals are manual entries in the
  weekly scorecard (fundraiser section).
- Distribution strategy and ratios: `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §23.

## 10. Content production and review management

- **Strategy / 12-week map:** `docs/seo/90-DAY-CONTENT-PLAN.md`.
- **Execution manual (two engines, weekly workflow, platform roles, SOPs, measurement,
  decision rules):** `docs/marketing/CONTENT-OPERATING-SYSTEM.md`.
- **Weekly tracker:** `docs/marketing/90-DAY-CONTENT-CALENDAR.csv`.
- **Weekly KPIs:** `docs/marketing/WEEKLY-MARKETING-SCORECARD.md` (customer KPIs and fundraiser
  KPIs are kept separate).
- **Reviews/referrals:** `docs/marketing/REVIEW-GROWTH-SYSTEM.md`.
- **SEO quality gates:** `scripts/verify-seo.mjs`, `docs/seo/ON-PAGE-AUDIT.md`,
  `docs/seo/STRUCTURED-DATA-AUDIT.md`, `docs/seo/INTERNAL-LINK-MAP.md`.

All content production, publishing and review requests are **manual owner/team work** — no
automation exists for them.

## 11. Automation inventory (summary)

Full details, triggers, failure behavior and recovery: `docs/operations/AUTOMATION-REGISTER.md`.

| Automation | Mode | Trigger | Source |
| --- | --- | --- | --- |
| Cloudflare production deployment | Automatic (external) | Push to `main` | Cloudflare dashboard (GitHub connection) |
| IndexNow submissions | Automatic (GitHub Actions) | Push to `main` | `.github/workflows/indexnow.yml` + `scripts/indexnow.mjs` |
| Marketing link/QR generation | Manual | Owner/agent runs `npm run marketing:links` | `scripts/generate-marketing-links.mjs` |
| Review QR generation | Manual | `node scripts/generate-review-qr.mjs` | `scripts/generate-review-qr.mjs` |
| Brand/social image generation | Manual | Owner/agent runs scripts | `scripts/generate-brand-images.mjs`, `generate-social-avatars.mjs` |
| Quality assurance (build, links, SEO, a11y, layout, analytics, attribution, GTM import) | Manual | Agent runs before/after changes | `scripts/*.mjs` (see register) |
| Browser analytics events (GTM/GA4/Umami) | Event-driven in the browser | Visitor action + consent | `src/components/BaseHead.astro`, GTM container |
| Web3Forms submission flow | Event-driven (third party) | Form submit | `src/components/ContactForm.astro`, Web3Forms |
| Bing Places sync from GBP | Automatic (external) | Platform sync | Bing Places dashboard |
| Social publishing, content production, reviews, lead follow-up, fundraiser reconciliation, CRM, weekly scorecards | **Manual / planned** | — | No automation exists |

## 12. Documentation directory

**Entry points**

- `README.md` — repository overview, START HERE, role navigation
- `docs/OPERATIONS-HUB.md` — this document
- `docs/operations/PLATFORM-STATUS.md` — live platform status register
- `docs/operations/AUTOMATION-REGISTER.md` — automation inventory
- `docs/operations/MARKETER-START-HERE.md` — marketing onboarding
- `docs/operations/DEVELOPER-START-HERE.md` — developer onboarding
- `docs/operations/ACCESS-AND-OWNERSHIP.md` — access, roles, onboarding/offboarding
- `docs/operations/MAINTENANCE-SCHEDULE.md` — recurring operational schedule

**Business & website**

- `src/config/business.ts` — business facts (source of truth)
- `docs/CONTENT-GUIDE.md`, `docs/IMAGE-GUIDE.md`, `docs/DESIGN-SYSTEM.md`
- `docs/DEPLOYMENT.md`, `docs/VERIFICATION.md`, `docs/PRE-LAUNCH-CHECKLIST.md`

**Marketing system**

- `docs/seo/90-DAY-CONTENT-PLAN.md`, `docs/marketing/CONTENT-OPERATING-SYSTEM.md`
- `docs/marketing/90-DAY-CONTENT-CALENDAR.csv`, `docs/marketing/WEEKLY-MARKETING-SCORECARD.md`
- `docs/marketing/REVIEW-GROWTH-SYSTEM.md`
- `docs/marketing/SOCIAL-PROFILE-SETUP.md`, `docs/marketing/SOCIAL-ASSET-SOURCES.md`
- `src/config/marketing-links.ts` → generated: `docs/marketing/UTM-MASTER-LINKS.md`,
  `UTM-MASTER-LINKS.csv`, `WHERE-TO-PASTE-UTM-LINKS.md`

**Analytics**

- `docs/GTM-GA4-SETUP.md` — events, consent, import files, current status, diagnosis
- `docs/gtm/SCS-GA4-container-import.json`, `docs/gtm/SCS-support-tracking-patch.json`
- `docs/seo/WEEKLY-SEARCH-CONSOLE-SOP.md`

**SEO & local search**

- `docs/seo/KEYWORD-TO-PAGE-MAP.md`, `KEYWORD-MASTER.md/.csv`, `ON-PAGE-AUDIT.md`,
  `INTERNAL-LINK-MAP.md`, `STRUCTURED-DATA-AUDIT.md`, `LOCAL-PAGE-ROADMAP.md`,
  `TECHNICAL-SEO-AUDIT.md`, `SEO-BASELINE.md`, `SEO-CONVERSION-AUDIT.md`,
  `RANK-MONITORING-PLAN.md`, `AI-ANSWER-READINESS.md`, `COMPETITOR-GAP-ANALYSIS.md`,
  `IMAGE-SEO-AUDIT.md`, `LOCAL-LINK-OPPORTUNITIES.csv`, `CITATION-AUDIT.md/.csv`,
  `GBP-OPTIMIZATION-CHECKLIST.md`, `OTHER-SEARCH-CHANNELS.md`
- `SEO_MASTER_AUDIT_SEPT_2026.md` (root) — historical September 2026 audit snapshot

**Automation & scripts**

- `.github/workflows/indexnow.yml`, `scripts/` (each script's header comment documents usage)
- `docs/INDEXNOW.md`

### Documentation governance

- Existing source-of-truth files (code/config) remain authoritative.
- Generated marketing documents are **regenerated, never manually edited**
  (`npm run marketing:links`).
- Current operational status lives **only** in `docs/operations/PLATFORM-STATUS.md`.
- Historical audit results stay historical; correct current guidance instead of rewriting
  dated records.
- Changes to external dashboards require a dated status update based on owner confirmation or
  external verification — never convert owner-reported settings into code-verified facts.
- No workflow is described as automated without evidence of its implementation and trigger
  (`docs/operations/AUTOMATION-REGISTER.md`).
- New systems must be added to this hub.
- Documentation references must use actual repository paths.
- No unsupported business, marketing or legal claims; no credentials, donor records or
  customer PII anywhere in the repository.

## 13. Role-specific onboarding

| Role | Start here | Then |
| --- | --- | --- |
| **Owner** | `docs/operations/PLATFORM-STATUS.md` (outstanding actions) | `docs/operations/MAINTENANCE-SCHEDULE.md`, `docs/operations/ACCESS-AND-OWNERSHIP.md` |
| **Marketer** | `docs/operations/MARKETER-START-HERE.md` | `docs/seo/90-DAY-CONTENT-PLAN.md`, `docs/marketing/CONTENT-OPERATING-SYSTEM.md`, `docs/marketing/WHERE-TO-PASTE-UTM-LINKS.md` |
| **Developer** | `docs/operations/DEVELOPER-START-HERE.md` | `AGENTS.md`, `docs/DEPLOYMENT.md`, `src/content.config.ts` |
| **SEO specialist** | `docs/seo/90-DAY-CONTENT-PLAN.md` | `docs/seo/KEYWORD-TO-PAGE-MAP.md`, `docs/seo/WEEKLY-SEARCH-CONSOLE-SOP.md`, `docs/seo/GBP-OPTIMIZATION-CHECKLIST.md` |
| **Analytics specialist** | `docs/GTM-GA4-SETUP.md` | `docs/gtm/` JSON files, `docs/marketing/UTM-MASTER-LINKS.md`, `scripts/verify-attribution.mjs` |

## 14. Current status and outstanding work

**Live and confirmed (owner-confirmed through dashboards, October 1, 2026):**

- Website live on the canonical domain; deployment through the GitHub-connected Cloudflare
  project; IndexNow submissions succeeding.
- GTM support-tracking patch imported into a dedicated workspace and **published** (import
  preview: 1 tag / 1 trigger / 1 variable added, 0 modifications, 0 deletions; fundraiser
  tracking tests passed).
- GA4 property operational and collecting events; `generate_lead` tested and configured as a
  key event; all three event-scoped custom dimensions created.
- Google Business Profile active and linked to GA4 through Google's interface.
- Search Console domain property verified, homepage indexed, search activity recording;
  original verified owner on a personal Google account, with the SCS business Google account
  granted ownership access.
- Bing Webmaster Tools active (long-title Site Scan findings corrected and deployed); Bing
  Places published and synchronized from GBP.
- Fundraising page live, noindexed, excluded from the sitemap, with Google + Umami outbound
  events working.
- **TikTok business verification completed** (owner-confirmed 2026-10-01; business verification
  status — not a public blue-check).

**Pending or unverified (see `docs/operations/PLATFORM-STATUS.md` for the register):**

- GA4 ↔ Search Console association — pending the owner's final confirmation of submission.
- GA4 Enhanced Measurement form interactions disabled? Data retention 14 months? Web stream URL
  set to the canonical non-www domain? Custom Explorations created? (owner confirmations)
- LinkedIn Company Page — pending; official eligibility rule checked 2026-10-01 (personal
  account needs more than one connection, i.e. ≥2 accepted connections; other blockers may
  apply). Owner steps in `docs/marketing/SOCIAL-PROFILE-SETUP.md`. Apple Business Connect
  status also pending owner confirmation.
- Publicly displayable contractor license number.
- TikTok follow-ups: Leads Manager configuration, message labels/automation, street-address
  visibility review.

## 15. Operational troubleshooting and escalation

| Symptom | First checks | Escalation |
| --- | --- | --- |
| Form submissions not arriving | Web3Forms dashboard/service status; spam folder; `PUBLIC_WEB3FORMS_ACCESS_KEY` in the Cloudflare environment; test with an owner-controlled submission | Owner (Web3Forms account) |
| No analytics events in GA4 | Consent state (events only fire after "Allow analytics"); GTM Preview/Tag Assistant; container published?; check the event reference in `docs/GTM-GA4-SETUP.md` | Owner (GTM/GA4 dashboards) |
| GTM tag changes not taking effect | Publishing a container is separate from deploying the site — changes require Submit → Publish in GTM | Owner |
| Site content change not visible | Was `main` pushed and the Cloudflare deployment completed? Check the deployment log in Cloudflare; hard-refresh/cache | Owner (Cloudflare dashboard) |
| PR preview build fails (`npx wrangler preview`) | Confirmed: the Astro build succeeds, but the preview deploy step needs a Wrangler `previews` block the repository intentionally doesn't have; production is unaffected. Options: disable Preview Builds for docs-only PRs, or configure Worker Previews (owner/Cloudflare-side) | Owner (Cloudflare dashboard) — `docs/DEPLOYMENT.md` |
| Broken internal link / SEO regression | `node scripts/links.mjs`, `node scripts/verify-seo.mjs` (after `npm run build`) | Developer/agent |
| IndexNow workflow failed | GitHub Actions run log; re-run manually with `node scripts/indexnow.mjs --range <before>..<after> --wait` | Developer/agent |
| UTM/QR docs out of date | Regenerate: `npm run marketing:links`; verify: `npm run marketing:verify` | Developer/agent |
| Fundraiser tracking not firing | Button `data-support-platform` attributes; consent; GTM support tag published; see `docs/GTM-GA4-SETUP.md` | Owner + developer |
| Review QR not working | Re-run `node scripts/generate-review-qr.mjs` (decode-verified) | Developer/agent |
| Search visibility concern | GSC performance + URL Inspection; GBP performance; see `docs/seo/WEEKLY-SEARCH-CONSOLE-SOP.md` | Owner + SEO specialist |

**Escalation rules:** the repository can change website code and documentation; it cannot
change GTM/GA4/GBP/GSC/Bing dashboards, Cloudflare settings, DNS, or third-party profiles.
Those require the owner (see `docs/operations/ACCESS-AND-OWNERSHIP.md`). Never push to `main`
without explicit owner approval — it deploys to production.
