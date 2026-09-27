# Content collections

This directory powers the site's editable content. Each subfolder is a typed
collection — see `src/content.config.ts` for the schemas and
`docs/CONTENT-GUIDE.md` for step-by-step instructions.

| Folder | Contents | Empty by design? |
| --- | --- | --- |
| `services/` | Residential + commercial service pages | No |
| `faqs/` | FAQ entries shown on `/faq/` | No |
| `projects/` | Portfolio entries (`/our-work/`) | **Yes** — page + nav stay hidden until a genuine entry exists |
| `reviews/` | Customer testimonials (home page) | **Yes** — section stays hidden until genuine review text exists |

Only add genuine content supplied or approved by the owner. Never invent
reviews, project outcomes, certifications, or prices.
