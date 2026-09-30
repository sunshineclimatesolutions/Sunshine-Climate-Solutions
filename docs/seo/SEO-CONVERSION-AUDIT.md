# SEO conversion audit — September 2026

Traffic without calls is useless. This audits whether organic landing pages convert with the
existing conversion architecture (no changes to forms/tracking were made).

## Conversion surface per landing page (from the built inventory)

| Landing page | Call links | Text links | Request path | Above-fold CTA | Trust/pricing on page |
| --- | --- | --- | --- | --- | --- |
| Home | 9 | 5 | Hero "Request Service" + multiple bands | Yes (hero cluster) | Pricing ($50/$75), owner-operated, brands, photos |
| Repair page | ≥2 | ≥2 | Hero + CTA band + Next steps | Yes | $50 waiver, process, brands |
| Maintenance page | ≥2 | ≥2 | Hero + CTA band | Yes | $75 detail, what's included/not included |
| Replacement page | ≥2 | ≥2 | Hero + CTA band | Yes | Free estimates, sizing/duct context |
| Airflow page | ≥2 | ≥2 | Hero + CTA band + Next steps | Yes | Measurement methodology, $50 waiver |
| Commercial page | ≥2 | ≥2 | Hero + CTA band | Yes | Scope, contractor support |
| TAB page | ≥2 | ≥2 | Hero + CTA band | Yes | Scope, process steps, trust chips |
| Spring Hill hub (new) | ≥3 | ≥2 | Hero cluster + service cards + CTA band | Yes | $50/$75, hours, communities, 6 FAQs |
| FAQ page | ≥2 | ≥2 | Conditions CTA + answer links | Partial | Pricing answers on page |

All pages keep the mobile action bar (Call / Text / Request, ≥44px) and the visible gold
contact strip at 360px — verified by `scripts/smoke.mjs` on every run.

## Event mapping (unchanged, verified by `gtm-consent.mjs` 85/85)

| Visitor action | Event | Meaning |
| --- | --- | --- |
| Tap call | `scs_call_click` | Intent only |
| Tap text | `scs_text_click` | Intent only |
| Tap request CTA | `scs_request_click` | Funnel navigation |
| First form interaction | `scs_form_start` | Funnel start |
| Web3Forms-confirmed submission | `scs_form_confirmed` → GA4 `generate_lead` | Confirmed inquiry (the only qualified lead) |

Funnel: SEO landing page → CTA click (`scs_request_click`) → form start → `generate_lead`.
Attribution for organic campaigns rides on the landing-page UTMs (see the UTM system), with
Google Ads relying on auto-tagging (gclid/gbraid/wbraid preserved).

## Findings & recommendations

1. **The hub strengthens the primary-market funnel**: local intent lands on a page with the
   same Call/Request cluster and local FAQs, then routes to the owning service page.
2. **FAQ answers now funnel**: each new diagnostic FAQ links to the repair/airflow page that
   owns the topic — question traffic has a next step.
3. **No friction added**: form length, validation behavior, and thank-you flow are unchanged.
4. **Trust signals are factual**: prices from `business.ts`, no invented ratings, no response
   promises. Keep it that way in any future content.
5. **Recommendation (deferred):** after 30–60 days of GSC data, check whether the hub or the
   service pages earn the calls and whether any landing page shows high impressions with weak
   CTR (use `WEEKLY-SEARCH-CONSOLE-SOP.md`).
