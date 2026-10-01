# Maintenance Schedule

Recurring operational responsibilities for the SCS website, marketing ecosystem, analytics and
listings. **None of these tasks happen automatically** — every item is human work unless it
links to an automation in `docs/operations/AUTOMATION-REGISTER.md`.

Each item is marked:

- **[E] Established** — already documented as an owner/team procedure elsewhere in the repo.
- **[R] Recommended addition** — proposed here to complete the operating rhythm; adopt at the
  owner's discretion.

Last reviewed: **October 1, 2026**

## Daily

| Task | Mode | How | Source |
| --- | --- | --- | --- |
| Respond to customer inquiries (calls, texts, form requests) during business hours | [E] | Owner inbox + phone; private lead sheet | `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §12 |
| Watch for time-sensitive form-delivery failures | [E] | If no form emails arrive, check Web3Forms + spam; the form shows an honest error and call/text alternative | `README.md`, `docs/GTM-GA4-SETUP.md` |
| Address operational website issues | [E] | Broken page/CTA noticed in the field → report to developer/agent; quick checks via `node scripts/links.mjs` / `smoke.mjs` | `AGENTS.md` |
| Spot-check that the site is up | [R] | Load the homepage and `/contact/` from a phone; confirm CTA bar works | — |

## Weekly

| Task | Mode | How | Source |
| --- | --- | --- | --- |
| GBP updates (posts, photos, Q&A, review replies) | [E] | 2–3 posts/week rotation (problem → Field Proof → offer), job photos, answer questions, reply to every review | `docs/seo/GBP-OPTIMIZATION-CHECKLIST.md`, `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §9 |
| Review requests and responses | [E] | After completed work: confirm satisfaction → direct link 30–60 min later → one reminder at 2–3 days → stop | `docs/marketing/REVIEW-GROWTH-SYSTEM.md` |
| Content production (anchor + verticals + Field Proof) | [E] | Monday plan → Tuesday film → Wednesday clips → Thursday distribution | `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §6 |
| Lead-source tracking | [E] | Update the private lead sheet (UTM when present; ask "how did you find us?" when not) | `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §12 |
| Search Console checks | [E] | 20–30 min routine: queries/pages, indexing, sitemap, opportunity rules | `docs/seo/WEEKLY-SEARCH-CONSOLE-SOP.md` |
| Weekly scorecard | [E] | Fill Production / Demand / Sales / Commercial / Content quality / Fundraiser rows | `docs/marketing/WEEKLY-MARKETING-SCORECARD.md` |
| Commercial/TAB outreach (when active) | [E] | ~10–20 qualified accounts/week; no mass spam | `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §14 |
| Estimate follow-ups | [E] | Day 0/1/3/7/30 sequence for open estimates | `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §13 |

## Monthly

| Task | Mode | How | Source |
| --- | --- | --- | --- |
| Listing consistency audit (GBP, Bing Places, Facebook, Nextdoor, Yelp) | [E] | Compare name/phone/hours/website against `business.ts`; Bing Places syncs from GBP — audit imported fields; never solicit Yelp reviews | `docs/seo/CITATION-AUDIT.md`, `docs/seo/GBP-OPTIMIZATION-CHECKLIST.md` |
| SEO and search performance review | [E] | GSC query/page trends, new opportunities, cannibalization checks | `docs/seo/WEEKLY-SEARCH-CONSOLE-SOP.md`, `docs/seo/RANK-MONITORING-PLAN.md` |
| GBP photo refresh | [E] | Add genuine field photos (never stock) | `docs/seo/GBP-OPTIMIZATION-CHECKLIST.md` |
| Technical monitoring | [R] | `npm run verify` + `node scripts/links.mjs` + `verify-seo.mjs` on a fresh build; watch Cloudflare deployment logs | `docs/operations/AUTOMATION-REGISTER.md` §B4 |
| Analytics quality check | [R] | Confirm consent behavior (`gtm-consent.mjs`), events arriving in GA4 Realtime, custom dimensions present, no PII | `docs/GTM-GA4-SETUP.md` |
| Marketing channel performance review | [E] | Roll the four weekly scorecards into a monthly summary; compare with the previous month; apply decision rules | `docs/marketing/WEEKLY-MARKETING-SCORECARD.md`, `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §18 |
| Content and Field Proof results | [E] | Identify top topics/channels by qualified leads, not vanity metrics | `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §18–19 |
| Access/permission audit (when warranted) | [R] | Review platform user lists; remove stale users; confirm 2FA | `docs/operations/ACCESS-AND-OWNERSHIP.md` |
| Email/SMS reactivation campaigns | [E] | ~2 quality emails/month per the operating system | `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §4 |

## After each production deployment

Every push to `main` deploys. After a deployment:

| Check | Mode | How | Source |
| --- | --- | --- | --- |
| Build/deployment verification | [E] | Confirm the Cloudflare deployment completed; live page reflects the change | `docs/DEPLOYMENT.md` |
| Core customer CTA smoke test | [E] | Call/Text/Request actions work from a phone; action bar intact | `docs/DEPLOYMENT.md`, `node scripts/smoke.mjs` |
| Form functionality | [E] | Owner-authorized live test submission when the form or provider changed; confirm arrival; delete the test email | `docs/DEPLOYMENT.md` |
| Robots / canonical / sitemap integrity | [E] | `robots.txt` = `Allow: /`; page meta `index, follow`; sitemap present and excludes `/404`, `/thank-you/`, `/support/` | `docs/DEPLOYMENT.md`, `node scripts/verify-seo.mjs` |
| IndexNow workflow outcome | [E] | Check the GitHub Actions run for the push (`gh run list --workflow IndexNow`); re-run manually if needed | `docs/INDEXNOW.md` |
| Regression suites | [R] | `links`, `verify-seo`, `verify-layout`, `a11y`, `gtm-consent` when the change touched those areas | `docs/operations/AUTOMATION-REGISTER.md` §B4 |

## Quarterly / as-needed

- Full citation/NAP re-audit and directory decisions (`docs/seo/CITATION-AUDIT.md`).
- Re-score location-page opportunities with real demand data (`docs/seo/LOCAL-PAGE-ROADMAP.md`).
- Review the 90-day plan against results and apply the next-90-day rule (60–70% proven / 30–40%
  new) — `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §20.
- Confirm platform status entries and owner actions in `docs/operations/PLATFORM-STATUS.md`.
- Rotate the Web3Forms key if abuse is suspected; update `business.ts`/Cloudflare env and test.
