# Content operating system

Recurring production and distribution rules for the Sunshine Climate Solutions organic
content program. This is the **how** — what gets made each week, how it is repurposed, what
is allowed to be published, how performance is measured, and how decisions are made.
Strategy and query/page mapping: `docs/seo/90-DAY-CONTENT-PLAN.md`. Execution tracker:
`docs/marketing/90-DAY-CONTENT-CALENDAR.csv`.

## The weekly cadence (repeat every week)

1. **1 anchor piece per week**
   - normally a 4–8 minute YouTube video, or
   - alternatively a meaningful field/job walkthrough.
2. **3–4 short vertical clips** cut from the anchor subject — Instagram Reels, TikTok,
   YouTube Shorts, Facebook Reels.
3. **1 Google Business Profile post** (local intent, photos, one link using the prepared GBP
   UTM).
4. **1 Facebook / Nextdoor homeowner-focused post.**
5. **2–3 lightweight distribution posts** — X, Gab, Parler (short text + link where
   applicable).
6. **1 field-proof asset** — photo, instrument reading, workmanship detail, before/after
   condition, or diagnostic observation (see FIELD PROOF below).
7. **Continuous legitimate Google review requests** after completed work (the QR and
   `/leave-review/` funnel already exist; never solicit Yelp reviews).
8. **One website SEO/content improvement every 1–2 weeks — only where justified.** Justified
   means: a real query trend, a GSC opportunity, or a genuine content gap on the owning page.
   No speculative edits, no new pages without the roadmap rules.

### Repurpose, do not multiply production

One anchor subject per week feeds every platform. Do not film unique footage for every
channel. The anchor is cut into vertical shorts, the stills become Field Proof and GBP
photos, the explanation becomes the Facebook/Nextdoor post, and the key line becomes the
X/Gab/Parler post. **~12 core subjects produce roughly 80–100 distributed assets across the
90 days.**

## FIELD PROOF (permanent recurring series)

For legitimate jobs where recording is appropriate, capture:

- one real photograph,
- one 10–30 second vertical clip,
- one meaningful measurement,
- one plain-language explanation.

Examples: static pressure reading, airflow reading, duct restriction, return-air issue,
condensate condition, electrical measurement, installation/workmanship detail, before/after
repair condition.

**Rules (non-negotiable):**

- No fabricated results, ever.
- Do not expose customer names or addresses.
- Avoid license plates and any private information.
- Do not identify a customer or location without permission.
- Measurements must be genuine.
- Explain context — never present an isolated number as a universal standard.

**Distribution:** Instagram, TikTok, YouTube Shorts, Facebook, Nextdoor, GBP, X, Gab,
Parler — and LinkedIn once the Company Page is live, where professionally relevant
(commercial/TAB proof).

## Content creation rules

**HOOK FIRST.** Avoid "Hey guys, Aaron here…". Prefer:
"This AC is running nonstop, but the house still isn't cooling." or
"This number tells me this duct system has a problem."

**SHOW FIRST, EXPLAIN SECOND.** Prioritize tools, equipment, readings, field conditions and
workmanship over generic talking-head advertising.

**ONE CTA PER PIECE.** Examples:
"Call or text if your AC is doing this."
"Request airflow diagnostics."
"Schedule the $75 maintenance visit."
"Request a free replacement estimate."
"Contact us about TAB support."
Do not stack six CTAs.

**Safety:** never publish unsafe DIY electrical, refrigerant, or combustion instructions.
Explain diagnostic reasoning, not procedures that can injure someone.

**Honesty:** no fabricated jobs, results, reviews, counts, response times or superlatives.
Warranty wording stays exactly as approved on the website.

## Platform roles

| Platform | Role |
| --- | --- |
| Google Business Profile | Local purchase intent / Maps / reviews / photos |
| Website + Google Search | Long-term query capture / service pages / lead conversion |
| YouTube | Searchable long-form authority + Shorts |
| Instagram | Reels / visual proof / brand trust |
| TikTok | Discovery / short-form education |
| Facebook | Homeowners / local community / proof |
| Nextdoor | Neighborhood / local service intent |
| LinkedIn | Commercial HVAC / TAB / property managers / contractors (pending Company Page) |
| X | Technical snippets / distribution |
| Gab | Secondary distribution |
| Parler | Secondary distribution |
| Yelp | Directory / citation presence — **no solicited review campaign** |
| Bing / Apple | Local search/map distribution once approved |

**DO NOT devote equal production effort to every platform.** Primary creation platforms:
**YouTube + vertical video**. Everything else is intelligent repurposing. If a platform
produces reach but no website actions or leads, reduce effort there (see decision rules).

## UTM rules

- Every post, video description or profile field that links to the website uses the **exact
  prepared link** from `docs/marketing/UTM-MASTER-LINKS.md` / the owner cheat sheet
  `WHERE-TO-PASTE-UTM-LINKS.md`.
- **Do not invent one-off UTM naming.** Where a platform/service link does not exist yet,
  add it to `src/config/marketing-links.ts` first and regenerate the docs
  (`npm run marketing:links`) — never hand-build a URL.
- Do not add UTMs to internal site navigation, canonicals, the sitemap, `tel:`/`sms:`/
  `mailto:` links, or the Google-review QR.
- Google Ads remains auto-tagged (`gclid`/`gbraid`/`wbraid`) and separate — no manual ad
  UTMs.
- Current prepared link mapping for content posts: Facebook and Nextdoor have per-service
  post links; GBP has repair/maintenance/commercial post links; email and SMS have service
  links; YouTube has the channel/profile link (also used in video descriptions); other
  platforms have profile links until service-specific entries are added.

## 90-day output targets (realistic)

- 12 anchor videos
- 36–48 short vertical videos
- 12 GBP posts
- 12 Facebook/Nextdoor local posts
- 12+ Field Proof posts
- 3 email/SMS campaigns
- 5–8 justified website content improvements
- continuous legitimate Google review requests
- one formal 90-day performance review

## Measurement — 30/60/90 scoreboard

**Website / GA4:** sessions by source/medium; landing page; `scs_call_click`;
`scs_text_click`; `scs_request_click`; `scs_form_start`; `generate_lead`; lead conversion
rate.

**Search:** GSC impressions, clicks, CTR, query trends, landing-page trends; GBP search
terms/interactions; review count and rating trend.

**Social:** reach; views; average watch time where available; completion rate where
available; saves; shares; comments; profile visits; outbound website clicks.

**Business:** inquiries; booked calls; sold jobs; revenue when available; source reported by
the customer.

**Followers are a secondary KPI.** Leads, bookings and revenue are primary. Report honestly
— no metric is invented or estimated without labeling it as such.

## Decision rules

- **Day 30:** identify the best hooks/topics/platforms.
- **Day 60:** double down on the content generating qualified traffic and actions.
- **Day 90:** rank topics/channels by (1) qualified leads, (2) booked jobs if tracked,
  (3) website conversion rate, (4) traffic, (5) engagement/watch behavior.
- **Repurpose winning topics** instead of constantly inventing new content.
- If one platform produces reach but no website actions/leads, **reduce effort** there.
- If one topic produces strong GSC impressions or social traffic, **expand that cluster on
  the owning page** — never by creating duplicate pages.
