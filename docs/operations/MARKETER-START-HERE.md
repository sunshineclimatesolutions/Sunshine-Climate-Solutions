# Marketer — Start Here

Onboarding path for a marketing professional joining Sunshine Climate Solutions. Read this
first, then follow the linked authoritative documents. Nothing here duplicates their full
content.

Start with `docs/OPERATIONS-HUB.md` for the complete system map.

## The business in one page

- **What SCS sells:** AC repair & diagnostics; $75/system/visit Premium AC Maintenance;
  replacement & installation; airflow & ductwork troubleshooting; light-commercial service &
  maintenance; TAB (Testing, Adjusting & Balancing) & commissioning support.
- **Core markets:** Spring Hill (home market) and the Tampa Bay area — Hernando, Pasco,
  Pinellas and Hillsborough counties. Central Florida projects considered by scope.
- **Differentiators:** measurement-driven diagnostics (static pressure, measured airflow,
  electrical testing, refrigerant readings), repair-first recommendations, clear explanations,
  real field instrumentation, and a commercial/TAB capability most local competitors lack.
- **Residential audiences:** emergency/no-cool homeowners; comfort/airflow homeowners;
  maintenance customers; replacement shoppers.
- **Commercial audiences:** property managers, facility managers, mechanical contractors, GCs,
  engineers, gyms, retail, churches, restaurants, offices.
- **Pricing facts (never invent):** $50 service call (waived when the repair proceeds), $75 per
  system per maintenance visit, free estimates. Source of truth: `src/config/business.ts`.

## Answers to the first questions

| Question | Answer |
| --- | --- |
| Where is the content strategy? | `docs/seo/90-DAY-CONTENT-PLAN.md` (two engines, 12 anchor themes, owning pages, CTAs) |
| Where is the execution manual? | `docs/marketing/CONTENT-OPERATING-SYSTEM.md` (weekly workflow, platform roles, SOPs, decision rules) |
| Where is the publishing calendar? | `docs/marketing/90-DAY-CONTENT-CALENDAR.csv` (week-by-week tracker) |
| Where are the campaign URLs? | `docs/marketing/WHERE-TO-PASTE-UTM-LINKS.md` (owner cheat sheet, generated) and `docs/marketing/UTM-MASTER-LINKS.md` (full registry) |
| Which campaign URLs must never be edited manually? | **All generated UTM documents and QR assets.** Source of truth is `src/config/marketing-links.ts`; regenerate with `npm run marketing:links`; validate with `npm run marketing:verify` |
| Where are the QR assets? | `public/marketing/qr/` (campaign QRs, generated) and `public/brand/qr-review.*` (Google review QR, verified) |
| How are leads tracked? | Private owner lead sheet — specification in `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §12. Never in analytics tools |
| How are campaign results measured? | GA4 events + Umami + the weekly scorecard: `docs/marketing/WEEKLY-MARKETING-SCORECARD.md`; event reference in `docs/GTM-GA4-SETUP.md` |
| How should reviews be requested? | `docs/marketing/REVIEW-GROWTH-SYSTEM.md` — confirm satisfaction, direct link 30–60 min after completion, one reminder after 2–3 days, then stop. Never gate, incentivize or fabricate |
| How is fundraising separated from customer acquisition? | Separate noindex `/support/` layer with its own links/events; never mixed into service CTAs. `docs/OPERATIONS-HUB.md` §9, `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §23 |
| What are the weekly reporting expectations? | Fill `docs/marketing/WEEKLY-MARKETING-SCORECARD.md` every Friday; search detail via `docs/seo/WEEKLY-SEARCH-CONSOLE-SOP.md` |
| What is prohibited? | Fabricated reviews/outcomes/photos/credentials/measurements, fake urgency, competitor attacks, unsafe DIY instructions, keyword stuffing, doorway pages, invented pricing or claims. `AGENTS.md` (Business information integrity), `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §23 guardrails |

## Social profiles — current state

- **Configured and published** (footer + structured data, from `business.ts`): Facebook,
  Instagram, TikTok, YouTube, X, Nextdoor, Yelp, Gab, Parler.
- **Pending:** LinkedIn Company Page (no public URL — do not publish or infer one).
- Bios, brand block and visual specs: `docs/marketing/SOCIAL-PROFILE-SETUP.md`.
- Icon/asset provenance: `docs/marketing/SOCIAL-ASSET-SOURCES.md`.

## The rules you must not break

1. **One owning page per query cluster** — never create doorway or duplicate city/service
   pages (`docs/seo/KEYWORD-TO-PAGE-MAP.md`).
2. **One primary CTA per content item** — call, text or request service; nothing stacked.
3. **No fabricated anything** — reviews, jobs, counts, measurements, savings, availability.
   Field measurements always carry context and are never presented as universal standards.
4. **Field Proof is never staged** (`docs/marketing/CONTENT-OPERATING-SYSTEM.md` §8).
5. **Never invent UTM names** — use the prepared registry links only.
6. **Fundraising stays separate** from the service funnel.
7. **No paid media without the readiness checklist** (§15 of the operating system).
8. **Never push to `main` without owner approval** — it deploys to production.

## First day

- [ ] Read `docs/OPERATIONS-HUB.md` end to end.
- [ ] Read `docs/marketing/MARKETER-START-HERE` companion docs: `docs/seo/90-DAY-CONTENT-PLAN.md`
      and `docs/marketing/CONTENT-OPERATING-SYSTEM.md`.
- [ ] Skim `src/config/business.ts` (facts) and `docs/marketing/WHERE-TO-PASTE-UTM-LINKS.md`
      (links).
- [ ] Review the current platform status: `docs/operations/PLATFORM-STATUS.md`.
- [ ] Look at the live site and `/support/` so you know what customers see.

## First week

- [ ] Study the 12-week calendar and pick up the current week's anchor in
      `docs/marketing/90-DAY-CONTENT-CALENDAR.csv`.
- [ ] Read the review workflow and the current review status (GBP).
- [ ] Walk the weekly production system (Monday plan → Friday revenue/optimization) once with
      the owner.
- [ ] Fill the weekly scorecard for the current week (`docs/marketing/WEEKLY-MARKETING-SCORECARD.md`).
- [ ] Review `docs/seo/ON-PAGE-AUDIT.md` and `docs/seo/RANK-MONITORING-PLAN.md` to understand
      current SEO priorities.
- [ ] Confirm with the owner: LinkedIn timing, founder video, any campaign you plan to run.

## Where results come from (honest measurement)

- A **click** is not a call; a **form start** is not a submission; a **confirmed lead** is not a
  paying customer; a **fundraiser click** is not a donation.
- GA4 key event: `generate_lead` (confirmed website inquiry).
- Contribution totals are **manual** entries — the website never measures donations.
- Detailed event reference and verification steps: `docs/GTM-GA4-SETUP.md`.
