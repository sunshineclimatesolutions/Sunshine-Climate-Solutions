# Weekly marketing scorecard

One place to record the weekly numbers the operating system depends on. Fill it in every
**Friday** (see the weekly production system in `docs/marketing/CONTENT-OPERATING-SYSTEM.md`
§6). About 10 minutes.

**Primary KPIs:** qualified leads, bookings, and revenue. Followers and raw views are
secondary. Record only what is real — leave a cell blank rather than estimate, and label any
estimate as an estimate.

## Production

| Week | Anchor published | Vertical clips | GBP posts | Facebook posts | Nextdoor posts | LinkedIn posts | Field Proof captured | Reviews requested | Reviews received |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | | | |
| 2 | | | | | | | | | |
| 3 | | | | | | | | | |
| 4 | | | | | | | | | |
| 5 | | | | | | | | | |
| 6 | | | | | | | | | |
| 7 | | | | | | | | | |
| 8 | | | | | | | | | |
| 9 | | | | | | | | | |
| 10 | | | | | | | | | |
| 11 | | | | | | | | | |
| 12 | | | | | | | | | |

## Demand

| Week | Calls | Forms | Texts | Qualified leads | Website conversions | GBP calls | GBP website clicks | Commercial conversations |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | | |
| 2 | | | | | | | | |
| 3 | | | | | | | | |
| 4 | | | | | | | | |
| 5 | | | | | | | | |
| 6 | | | | | | | | |
| 7 | | | | | | | | |
| 8 | | | | | | | | |
| 9 | | | | | | | | |
| 10 | | | | | | | | |
| 11 | | | | | | | | |
| 12 | | | | | | | | |

## Sales

| Week | Booked appointments | Estimates issued | Close rate | Closed jobs | Revenue | Gross margin (if available) | Repeat jobs | Referral jobs |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | | |
| 2 | | | | | | | | |
| 3 | | | | | | | | |
| 4 | | | | | | | | |
| 5 | | | | | | | | |
| 6 | | | | | | | | |
| 7 | | | | | | | | |
| 8 | | | | | | | | |
| 9 | | | | | | | | |
| 10 | | | | | | | | |
| 11 | | | | | | | | |
| 12 | | | | | | | | |

## Commercial pipeline

| Week | Qualified accounts added | Accounts contacted | Replies | Project discussions | Bid invitations | Quotes submitted | Wins |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |
| 12 | | | | | | | |

## Fundraiser (support layer — keep separate from HVAC KPIs)

Tracked weekly. The two outbound-click columns come from GA4 (`scs_support_click` with
`support_platform`) / Umami (`support-gofundme-click`, `support-givesendgo-click`) once
analytics permission is given; the contribution and outreach columns are manual entries from
the fundraiser dashboards and the owner's own records. **Do not merge fundraiser
contributions with HVAC operating revenue** — they are different money.

| Week | Support page sessions | GoFundMe outbound clicks | GiveSendGo outbound clicks | GoFundMe contributions (manual) | GiveSendGo contributions (manual) | Total raised (manual) | Campaign shares / meaningful outreach (manual) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |
| 7 | | | | | | | |
| 8 | | | | | | | |
| 9 | | | | | | | |
| 10 | | | | | | | |
| 11 | | | | | | | |
| 12 | | | | | | | |

## Content quality

| Week | YouTube watch time | Video retention | Short completion rate | Website engagement | Landing-page conversion rate |
| --- | --- | --- | --- | --- | --- |
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |
| 6 | | | | | |
| 7 | | | | | |
| 8 | | | | | |
| 9 | | | | | |
| 10 | | | | | |
| 11 | | | | | |
| 12 | | | | | |

## Where the numbers come from

- **Calls / forms / texts, qualified leads, bookings, revenue:** the private lead sheet
  (lead tracking specification in the operating system §12). Keep customer details out of
  analytics tools.
- **Website conversions and events:** GA4 (via the GTM container) —
  `scs_call_click`, `scs_text_click`, `scs_request_click`, `scs_form_start`, `generate_lead`.
- **Search:** the weekly GSC routine in `docs/seo/WEEKLY-SEARCH-CONSOLE-SOP.md`
  (impressions, clicks, CTR, query trends, landing-page trends).
- **GBP:** calls and website clicks from the GBP performance view; search terms; review
  count/rating trend.
- **Social:** platform insights — reach, views, watch time, completion rate, saves, shares,
  comments, profile visits, outbound website clicks.
- **Commercial:** the outreach tracker (accounts, replies, discussions, bids, quotes, wins).

## Review cadence

- **Weekly (Friday):** fill the current week; note one improvement for next week.
- **Monthly:** roll the four weeks into a one-line summary; compare with the previous month.
- **Day 30 / 60 / 90:** apply the decision rules and phase goals in
  `docs/marketing/CONTENT-OPERATING-SYSTEM.md` §18–19; the next 90-day plan follows the
  60–70% proven / 30–40% new rule (§20).
