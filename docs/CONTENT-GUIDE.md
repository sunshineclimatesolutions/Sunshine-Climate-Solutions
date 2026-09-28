# Content guide

How to edit site content. Schemas live in `src/content.config.ts` — if frontmatter is wrong,
`npm run build` fails with a clear error instead of publishing broken content.

## Page copy (home, about, contact, service-area, TAB) — `src/content/site/*.md`

The editable text of the five main pages lives in one Markdown file per page, validated by the
`site` collection schema:

| File | Controls |
| --- | --- |
| `src/content/site/home.md` | Hero, services/diagnostics/TAB/offer/about/reviews/process/final section copy, SEO |
| `src/content/site/about.md` | Hero, info-card titles, story sections, closing CTA copy, SEO |
| `src/content/site/contact.md` | Hero, section headings, process heading, SEO |
| `src/content/site/service-area.md` | Hero, counties + communities list, coverage section, CTA copy, SEO |
| `src/content/site/tab.md` | Hero, scope-of-work cards, process steps, field-photo visuals, CTA copy, SEO |
| `src/content/site/faq.md` | FAQ page SEO + educational "conditions we investigate" section |
| `src/content/site/leave-review.md` | Google review page: thank-you copy, QR note, button label, SEO |

Rules:

- Business facts (phone, email, hours, pricing, license) are **not** duplicated here — they
  render from `src/config/business.ts` inside the page markup.
- The only supported token is `{serviceCall}` (about.md) — replaced from `business.pricing` at
  build time.
- Pages fail the build with a clear message if a required section is missing from the file.
- After editing, run `npm run verify`.

## Central business facts — `src/config/business.ts`

Phone, email, hours, pricing, counties, brands, payments, and flags live in this one file.
After editing it, run `npm run verify` to rebuild.

```ts
licenseNumber: '',          // e.g. 'CAC1819888' — renders in footer, About, Contact
web3forms: {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? 'c6385a71-…',
},
```

- **License:** leave empty until verified; no license line is shown while it's blank.
- **Form key:** a public client-side identifier (safe to commit). Set
  `PUBLIC_WEB3FORMS_ACCESS_KEY` in the Cloudflare build environment to override without
  touching code.
- **flags.financingPromo:** keep `false` until Klarna merchant availability is confirmed.

## Adding a project (shows the Our Work page + nav)

1. Drop the photos into `src/content/projects/images/` (web-sized JPG/PNG/WebP).
2. Create `src/content/projects/my-project.md`:

```md
---
title: 'Air handler replacement — no-cooling call'
category: 'residential-installation'   # residential-repair | residential-installation | airflow-ductwork | diagnostics | commercial | tab | deficiency-findings | other
city: 'Spring Hill'
summary: 'Short blurb used on the Our Work grid.'   # optional
outcome: 'Verified cooling restored and temperatures even across both floors.'
order: 1
photos:
  - image: './images/air-handler-before.jpg'
    alt: 'Old air handler with rusted cabinet'
    label: 'before'                     # before | after | during | detail | other
  - image: './images/air-handler-after.jpg'
    alt: 'New air handler installed and sealed'
    label: 'after'
---

The problem the customer called about.

**Work performed.** What was done and why.

**What we verified.** How the result was confirmed.
```

3. `photos[].image` is relative to the .md file (Astro optimizes these images automatically).
   `before`/`after` pairs render as labeled side-by-side (stacked on mobile). Everything else
   renders in a photo grid.
4. Rebuild. The Our Work page, its nav/footer links, and homepage highlights appear
   automatically once at least one entry exists — no code changes.

**Only genuine, owner-approved projects.** Never stage photos or invent outcomes.

## Adding a review (shows the homepage reviews section)

Create `src/content/reviews/1-short-quote.md`:

```md
---
quote: 'Explained exactly what was wrong and gave me the choice. Repair worked great.'
author: 'Maria H.'
context: 'AC repair — New Port Richey'   # optional
source: 'google'                        # google | direct | other
order: 1
---
```

Only use genuine review text the customer agreed to display (e.g., copied from your Google
reviews). The Google Business Profile link is shown regardless.

## Adding an FAQ

Create `src/content/faqs/my-question.md`:

```md
---
question: 'What is a duct traverse?'
category: 'commercial'   # pricing | process | service-area | repairs | brands | payments | warranty | communication | commercial
order: 4
---

Answer body — plain Markdown, links allowed.
```
## Adding a service page

Create `src/content/services/new-service.md` with frontmatter
(`title`, `summary`, `metaDescription`, `icon` = wrench | thermometer | wind | briefcase | shield,
`order`) — the page, card, and footer link appear automatically at
`/services/<filename>/`. Optional `metaTitle` overrides the default
`"<title> in Tampa Bay"` SEO title — use it only where a specific local search intent
justifies different wording (e.g. `ac-repair-diagnostics.md` targets Spring Hill).

## What NOT to put in content

Per owner direction: no invented reviews, prices, certifications, response-time guarantees,
24/7 claims, or "best/cheapest" claims. Warranty wording stays exactly:
"Ask about the workmanship and manufacturer warranty coverage included with your proposal."
