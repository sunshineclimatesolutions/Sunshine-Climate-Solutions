# Platform Status Register

Live operational status for every external platform and service in the SCS ecosystem.
**This is the only place current operational status is maintained.** Historical audits keep
their original dated findings (see the Historical section).

Last reviewed: **October 1, 2026**

## How to read this register

Status classes:

- **Verified (repo)** — verifiable from repository configuration/code.
- **Owner-confirmed** — confirmed by the owner through the platform dashboard (screenshot or
  explicit statement), not independently observable from the repository.
- **Pending verification** — believed configured but awaiting final owner confirmation or
  evidence.
- **Pending setup** — not yet created/configured.
- **Historical** — dated audit observations retained for context; not current status.

Rules:

- Never convert an owner-reported external setting into a code-verified fact.
- Update a status only with actual evidence (owner confirmation or external verification) and
  record the date.
- Never record personal account emails, credentials, tokens or recovery information here (see
  `docs/operations/ACCESS-AND-OWNERSHIP.md`).

---

## Verified through repository configuration

| Platform / service | Purpose | Public URL / safe entry point | Ownership role | Status | Verification source | Last confirmed | Dependencies | Outstanding owner actions | Authoritative docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Production website | Marketing + service requests | <https://sunshineclimatesolutions.com> | Owner (Cloudflare + GitHub) | **Verified** — static build, canonical apex, `index, follow` | `npm run verify`, `scripts/verify-seo.mjs`, live checks | 2026-10-01 | Cloudflare project + GitHub `main` | — | `README.md`, `docs/DEPLOYMENT.md` |
| Website deployment pipeline | Push-to-production | Cloudflare dashboard (owner) | Owner | **Verified** — GitHub-connected; pushes to `main` deploy | `docs/DEPLOYMENT.md`; deployment observed | 2026-10-01 | GitHub `main`; Cloudflare project | Never push without approval | `docs/DEPLOYMENT.md`, `docs/operations/AUTOMATION-REGISTER.md` |
| IndexNow workflow | Freshness notifications to Bing/Yandex/etc. | `.github/workflows/indexnow.yml` | Owner (GitHub) | **Verified** — runs on `main` pushes; key public by design | Workflow file; successful Actions runs | 2026-10-01 | GitHub Actions enabled; live URLs | — | `docs/INDEXNOW.md` |
| UTM / campaign link registry | Inbound attribution | `src/config/marketing-links.ts` | Repo | **Verified** — 60 links, 11 QR assets, generated docs current | `npm run marketing:verify` | 2026-10-01 | — | Never hand-edit generated docs | `docs/marketing/UTM-MASTER-LINKS.md` |
| Review QR system | Google review requests | `/leave-review/`, `public/brand/qr-review.*` | Repo | **Verified** — decode-checked against `business.reviewsSubmissionUrl` | `scripts/generate-review-qr.mjs` | 2026-10-01 | Google review link unchanged | — | `docs/marketing/REVIEW-GROWTH-SYSTEM.md` |
| Fundraising page | Support layer (noindex) | <https://sunshineclimatesolutions.com/support/> | Repo | **Verified** — `noindex, follow`, excluded from sitemap, outbound events wired | `scripts/verify-seo.mjs`, `gtm-consent.mjs` | 2026-10-01 | GTM support tag for GA4 events | — | `docs/OPERATIONS-HUB.md` §9 |
| Fundraiser outbound tracking | Platform split (`gofundme`/`givesendgo`) | `/support/` buttons | Repo | **Verified site-side**; GTM/GA4 forwarding owner-confirmed | `gtm-consent.mjs` 91/91; owner GTM tests | 2026-10-01 | Consent; published GTM container | — | `docs/GTM-GA4-SETUP.md` |
| Consent / privacy system | Basic Consent Mode + privacy page | Site-wide | Repo | **Verified** — no Google request before permission | `gtm-consent.mjs` 91/91 | 2026-10-01 | GTM container ID configured | Keep privacy page accurate | `docs/GTM-GA4-SETUP.md`, `src/pages/privacy.astro` |
| Web3Forms request flow | Lead capture | `/contact/` | Owner (Web3Forms account) | **Verified site-side**; live inbox delivery owner-verified only | Built HTML; `gtm-consent.mjs` provider interception | 2026-10-01 | Public access key; Web3Forms service | Test live delivery after key rotation | `README.md`, `docs/GTM-GA4-SETUP.md` |
| Social profile links | Footer + `sameAs` | `business.social` in `business.ts` | Owner (platform accounts) | **Verified in code** (9 profiles published) | Built HTML + schema checks | 2026-10-01 | Platform accounts remain active | Keep URLs current | `docs/marketing/SOCIAL-PROFILE-SETUP.md` |

---

## Owner-confirmed through external dashboards (October 1, 2026)

Owner-confirmed results from dashboard screenshots/statements. These are **not** independently
obtainable from the repository.

| Platform / service | Purpose | Public URL / safe entry point | Ownership role | Status | Verification source | Last confirmed | Dependencies | Outstanding owner actions | Authoritative docs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Google Tag Manager | Analytics container `GTM-MBGJ8SLD` | <https://tagmanager.google.com> | Owner | **Owner-confirmed** — support-tracking patch imported into a dedicated workspace; preview showed 1 tag / 1 trigger / 1 variable added, 0 modifications, 0 deletions; both fundraiser tests passed; **published** | Owner dashboard screenshots/statement | 2026-10-01 | GA4 `G-EQ9CBESN23` | — | `docs/GTM-GA4-SETUP.md` |
| Google Analytics 4 | Measurement `G-EQ9CBESN23` | <https://analytics.google.com> | Owner | **Owner-confirmed** — property operational; `page_view`, `scs_call_click`, `scs_text_click`, `scs_request_click`, `scs_form_start` and other standard events arriving; `generate_lead` tested and visible in Realtime key events; configured as a **key event**; fundraiser forwarding tested and published | Owner dashboard screenshots/statement | 2026-10-01 | Published GTM container | See pending verifications below | `docs/GTM-GA4-SETUP.md` |
| GA4 custom dimensions | Report by event parameters | GA4 Admin → Custom definitions | Owner | **Owner-confirmed** — all three event-scoped dimensions created: `Support platform` → `support_platform`, `Service category` → `service_category`, `CTA slot` → `cta_slot` | Owner dashboard statement | 2026-10-01 | Events arriving | — | `docs/GTM-GA4-SETUP.md` |
| Google Business Profile | Local conversion, reviews, photos | <https://business.google.com> | Owner | **Owner-confirmed** — active profile; GA4 link reported successfully created through Google's interface; business facts governed by `business.ts` | Owner dashboard statement | 2026-10-01 | Verified profile access | Periodically verify service-area/category fields; never move the pin without authenticated evidence | `docs/seo/GBP-OPTIMIZATION-CHECKLIST.md` |
| Google Search Console | Organic performance | <https://search.google.com/search-console> | Original verified owner (personal Google account) + SCS business account granted ownership | **Owner-confirmed** — DOMAIN property verified; canonical homepage confirmed indexed (URL Inspection); search activity recording | Owner dashboard screenshots/statement | 2026-10-01 | Domain DNS verification | Confirm the final GA4 ↔ Search Console association submission (see pending) | `docs/seo/WEEKLY-SEARCH-CONSOLE-SOP.md` |
| Bing Webmaster Tools | Bing/Copilot visibility, Site Scan, IndexNow | <https://www.bing.com/webmasters> | Owner | **Owner-confirmed** — active; Site Scan identified three over-long service titles (corrected, deployed, verified); IndexNow submissions succeeding | Owner dashboard statement; repo title fixes deployed | 2026-10-01 | IndexNow key served | — | `docs/seo/OTHER-SEARCH-CHANNELS.md` |
| Bing Places | Local listing (synced from GBP) | <https://www.bing.com/forbusiness> | Owner | **Owner-confirmed** — published and synchronized with Google Business Profile; listing demonstrated operational | Owner dashboard statement/demonstration | 2026-10-01 | GBP fields; sync audits | Periodically audit imported fields (name/phone/hours/website) | `docs/seo/OTHER-SEARCH-CHANNELS.md` |
| Umami Cloud | Cookieless analytics | <https://cloud.umami.is> | Owner | **Verified site-side**; dashboard delivery previously confirmed by owner (website ID configured) | Built HTML; `gtm-consent.mjs` | 2026-10-01 | Public website ID | — | `docs/GTM-GA4-SETUP.md` |

---

## Pending external verification

| Platform / service | Purpose | Safe entry point | Status | Verification source | Last confirmed | Outstanding owner actions | Authoritative docs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| GA4 ↔ Search Console association | Query data in GA4 | GA4 Admin → Product links → Search Console Links | **Pending final confirmation** — the domain property now appears in the linking wizard with Next available; the association must not be recorded as complete until the owner confirms the final submission or supplies the linked-products screen | Owner statement; last screenshot showed property selected, Next enabled | 2026-10-01 | Complete the submission and confirm the linked-products screen | `docs/GTM-GA4-SETUP.md` |
| GA4 Enhanced Measurement form interactions | Avoid double-counting the custom form events | GA4 Admin → Data streams → Enhanced measurement | **Pending owner confirmation** — recommended OFF (the validated custom flow replaces it) | Not yet confirmed | — | Confirm/turn Form interactions OFF | `docs/GTM-GA4-SETUP.md` |
| GA4 data retention | Data-history window | GA4 Admin → Data settings | **Pending owner confirmation** — recommended 14 months | Not yet confirmed | — | Confirm/set 14 months | `docs/GTM-GA4-SETUP.md` |
| GA4 web stream URL | Canonical stream domain | GA4 Admin → Data streams | **Pending owner confirmation** — recommended canonical apex (non-www) | Not yet confirmed | — | Confirm stream URL | `docs/GTM-GA4-SETUP.md` |
| GA4 custom Explorations | Deeper reporting views | GA4 Explore | **Pending owner confirmation** — planned, not required for operation | Not yet confirmed | — | Create when useful | `docs/GTM-GA4-SETUP.md` |
| Apple Business Connect | Apple Maps/Siri presence | <https://business.apple.com> | **Pending owner confirmation** — status unknown to the repository | Not yet confirmed | — | Confirm whether a listing exists/was created | `docs/seo/OTHER-SEARCH-CHANNELS.md` |

---

## Pending setup

| Platform / service | Purpose | Safe entry point | Status | Outstanding owner actions | Authoritative docs |
| --- | --- | --- | --- | --- | --- |
| LinkedIn Company Page | Commercial/TAB credibility | <https://www.linkedin.com> | **Pending** — no approved public Company Page URL; nothing is published on the website or in structured data; the prepared UTM entry stays `pending` | Create/verify the Company Page, then supply the final public URL | `docs/marketing/SOCIAL-PROFILE-SETUP.md`, `src/config/marketing-links.ts` |
| Public contractor license number | Footer/About license line | Florida DBPR (owner) | **Pending** — `business.licenseNumber` intentionally empty; no license line renders | Provide the verified number exactly as it should be shown | `src/config/business.ts`, `AGENTS.md` |
| Owner founder video | `/support/` founder-video section | YouTube (owner) | **Pending** — `business.fundraising.founderVideoUrl` empty; the section renders only when set | Supply the approved public video URL | `src/config/business.ts`, `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §23 |

Do not invent CRM, social-scheduler or advertising accounts — none are configured in this
repository.

---

## Historical (dated audit findings — retained for context)

| Item | Original observation | Date | Where recorded |
| --- | --- | --- | --- |
| Bing Places | "No listing observed" (local-distribution opportunity) | Sept 2026 | `docs/seo/CITATION-AUDIT.md`, `docs/seo/CITATION-AUDIT.csv`, `docs/seo/OTHER-SEARCH-CHANNELS.md`, `docs/seo/TECHNICAL-SEO-AUDIT.md` |
| Apple Business Connect | "No listing observed" | Sept 2026 | same as above |
| GBP locality/pin | Public data showed a locality inconsistency; authenticated profile not verified by the audit | Sept 2026 | `docs/seo/TECHNICAL-SEO-AUDIT.md`, `docs/seo/CITATION-AUDIT.md` |
| Yelp locality | URL slug/city says "brooksville" | Sept 2026 | `docs/seo/CITATION-AUDIT.md`, `docs/seo/CITATION-AUDIT.csv` |
| Facebook page URL | Old numeric-ID page URL recorded | Sept 2026 | `docs/seo/CITATION-AUDIT.csv` (post-audit note: URL has since changed; current URL in `business.ts`) |
| GTM import failure | First support-tracking import rejected (`measurementIdOverride` empty); corrected and re-imported successfully | 2026-10-01 | `docs/GTM-GA4-SETUP.md` (Import failure history) |
| Master SEO audit | September 2026 audit snapshot | Sept 2026 | `SEO_MASTER_AUDIT_SEPT_2026.md` (annotated historical snapshot) |

Historical entries are **not** current status. When an owner action changes one of them, update
the relevant section above with a dated entry and leave the historical record intact.
