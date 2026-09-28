# Content guide

How to edit site content. **The easiest way is Pages CMS** — see `docs/PAGES-CMS.md` to edit
services, FAQs, reviews, projects, page text, SEO metadata, and photos in a visual editor
with no code or Git knowledge needed. This guide covers the same content from the file side;
both paths edit the same files.

Schemas live in `src/content.config.ts` — if frontmatter is wrong, `npm run build` fails with
a clear error instead of publishing broken content.

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
  `PUBLIC_WEB3FORMS_ACCESS_KEY` in Cloudflare Pages to override without touching code.
- **flags.financingPromo:** keep `false` until Klarna merchant availability is confirmed.

## Adding a project (shows the Our Work page + nav)

1. Put the photos in the media library folder `public/images/` (Pages CMS uploads them there
   automatically; web-sized JPG/PNG/WebP, e.g. 1200–1600px wide).
2. Create `src/content/projects/my-project.md`:

```md
---
title: 'Air handler replacement — no-cooling call'
category: 'residential-installation'   # residential-repair | residential-installation | airflow-ductwork | diagnostics | commercial | tab | deficiency-findings | other
city: 'Spring Hill'
summary: 'Short blurb used on the Our Work grid.'   # optional
outcome: 'Verified cooling restored and temperatures even across both floors.'
featured: false
order: 1
photos:
  - image: '/images/air-handler-before.jpg'
    alt: 'Old air handler with rusted cabinet'
    label: 'before'                     # before | after | during | detail | other
    width: 1600                          # optional but recommended — prevents page shift
    height: 1067
  - image: '/images/air-handler-after.jpg'
    alt: 'New air handler installed and sealed'
    label: 'after'
    width: 1600
    height: 1067
---

The problem the customer called about.

**Work performed.** What was done and why.

**What we verified.** How the result was confirmed.
```

3. `photos[].image` is a media-library URL (`/images/<file>`). `before`/`after` pairs render as
   labeled side-by-side (stacked on mobile); everything else renders in a photo grid.
   Optional `width`/`height` (pixels, from your photo's file info) prevent layout shifting.
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
(`title`, `summary`, `metaDescription`, `icon` = wrench | thermometer | wind | briefcase,
`order`) — the page, card, and footer link appear automatically at `/services/<filename>/`.

## What NOT to put in content

Per owner direction: no invented reviews, prices, certifications, response-time guarantees,
24/7 claims, or "best/cheapest" claims. Warranty wording stays exactly:
"Ask about the workmanship and manufacturer warranty coverage included with your proposal."

## Local-development note: deleting content files

Astro's incremental content store occasionally keeps a deleted entry in local development
builds. If you delete a content file locally and the built site still shows it, clear the
store and rebuild:

```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules/.astro
npm run build

# macOS / Linux
rm -rf node_modules/.astro && npm run build
```

Cloudflare Pages and Pages CMS builds are always clean (fresh install) and are not affected.
