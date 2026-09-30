# Review growth system — September 2026

Legitimate, policy-safe review growth. **No incentives, no gating, no fake reviews, no
soliciting on platforms that prohibit it.** Google is the primary focus; Yelp is treated as a
neutral directory (never solicited — see its policy).

## Principles

1. Ask every customer at the right moment — after the work is done and the customer has
   expressed satisfaction (or at invoice/handoff), never before.
2. Ask once, respectfully. If they decline or ignore, do not pester.
3. Make it frictionless: one tap on the review QR or link, no forms, no account gymnastics.
4. Never condition anything on the review's content or rating.
5. Reply to every review — positive and negative — professionally and without arguing.

## When to ask (technician / owner handoff)

- **Best moment:** on-site, at the end of the visit, after explaining the findings and
  confirming the customer is satisfied. Hand the review card / show the QR.
- **Second-best:** the follow-up message 1–3 days after service (after the invoice settles).
- **Never:** before the work starts; after an unresolved complaint; more than once without a
  fresh visit.

## Review QR / link workflow

- The existing Google review QR (`public/brand/qr-review.png` / `.svg`) and the
  `/leave-review/` page are the canonical paths. **Do not regenerate or replace this QR** — it
  is decode-verified against `business.reviewsSubmissionUrl` in `business.ts`.
- Print the QR on the invoice footer, the referral card, and a small counter card.
- The `/leave-review/` page explains what happens; the button opens Google directly.

## SMS wording (send after service, once)

> Hi [name], thanks for choosing Sunshine Climate Solutions today. If we earned it, a quick
> Google review helps other homeowners find honest HVAC service: [review link]. Either way,
> thanks for the work — Aaron

Keep it short, no pressure, no incentive language.

## Email wording (follow-up, optional)

> Subject: Thanks for the visit — and a small favor
>
> Hi [name],
>
> Thanks again for having us out. If you have a minute, an honest Google review helps neighbors
> find a repair-first HVAC company: [review link]
>
> If anything about the visit needs attention, reply here or call/text (727) 661-5200 — I'd
> rather fix it than have you settle.
>
> — Aaron, Sunshine Climate Solutions

## Response framework

| Review type | Response shape |
| --- | --- |
| 5-star | Thank them specifically (service type if mentioned), no keyword stuffing, no links |
| 4-star | Thank + invite direct contact for anything that fell short |
| 1–3 star | Acknowledge, take responsibility for the experience, move it offline with a phone number, never dispute facts publicly |
| Spam/fake | Report to Google; do not engage |

Reply within a few days; keep replies human and brief.

## Yelp and other platforms

- **Yelp:** do not run a solicited review campaign (platform policy). If a customer reviews
  organically, respond professionally.
- **Nextdoor/Facebook:** do not ask for reviews there; they are channel links, not review
  engines.

## Tracking

- GA4: the review page can be measured via existing events; do not add new tracking without
  owner approval. Review-volume changes should be watched in GBP directly.
- Owner monthly check: new reviews, unanswered reviews, average rating trend, and whether
  review requests are happening at handoff.
