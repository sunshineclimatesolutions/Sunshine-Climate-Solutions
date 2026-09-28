# Image guide

How photographs are managed on this site. The short version: **drop photos anywhere in the
project and tell OpenCode where they should go** — OpenCode optimizes, renames, places, and
wires them in. This document describes the conventions it follows, in case you edit manually.

## Where photos live

| Location | Used for | Optimized? |
| --- | --- | --- |
| `src/content/projects/images/` | Project portfolio photos (before/after, detail) | Yes — Astro's image pipeline |
| `src/content/site/images/` | Photos embedded in page copy (e.g. a future homepage photo) | Yes — Astro's image pipeline |
| `public/images/` | Direct-reference assets only (rare; not processed) | No |
| `public/brand/` | Logo, icons, OG image | No |

**Prefer the first two locations.** Photos referenced from content frontmatter go through
Astro's built-in optimizer: responsive sizes are generated automatically, dimensions are
enforced (no distortion/stretching), and the build **fails** if `alt` text is missing.

## Naming

lowercase, hyphenated, descriptive — include the job and, for before/after pairs, the label:

- `air-handler-replacement-spring-hill-before.jpg`
- `air-handler-replacement-spring-hill-after.jpg`
- `duct-traverse-report-tampa-detail.jpg`

## Adding project photos (portfolio / before-and-after)

1. Copy the photos into `src/content/projects/images/`.
2. Run the guardrail tool (below) and fix any warnings.
3. Reference them from the project entry's frontmatter (`src/content/projects/<entry>.md`):

```md
photos:
  - image: './images/air-handler-replacement-spring-hill-before.jpg'
    alt: 'Rusted original air handler cabinet in a Spring Hill garage'
    label: 'before'          # before | after | during | detail | other
  - image: './images/air-handler-replacement-spring-hill-after.jpg'
    alt: 'New air handler installed, sealed, and connected'
    label: 'after'
    position: 'center 30%'   # optional focal point (CSS object-position)
```

- `before`/`after` pairs render as labeled side-by-side comparisons (stacked on mobile).
- `position` is an optional focal point — any CSS `object-position` value
  (`center 30%`, `top left`, …) — for when the important part of the photo is off-center.
- Full project-entry instructions: `docs/CONTENT-GUIDE.md`.

## Alt text rules

- **Required** — the build fails without it (no exceptions).
- Describe what is actually visible and relevant: "New air handler installed and sealed" —
  not "photo of our great work".
- Never stuff keywords or marketing claims into alt text.

## Guardrail tool — `scripts/photo.mjs`

Zero extra dependencies (uses the image library Astro already ships). Checks every photo
for size/dimension/format problems before it reaches the website:

```bash
node scripts/photo.mjs <file-or-directory>          # report + warnings (exit 1 if any)
node scripts/photo.mjs <file> --resize 2000         # dry run
node scripts/photo.mjs <file> --resize 2000 --write # downscale in place (JPEG, q82)
node scripts/photo.mjs <file> --resize 2000 --write --jpeg-quality 80
```

Warnings it gives:

- any edge longer than **4000px** → downscale with `--resize 2000 --write`
- file larger than **1 MB** → compress or downscale
- format outside JPEG/PNG/WebP → convert to JPEG

Targets for a good web photo: **≤ 2000px long edge, JPEG, under ~500 KB**. Modern phone
photos are usually fine after `--resize 2000 --write`.

## What Astro handles automatically

- Responsive `srcset` variants (visitors download a size appropriate to their screen).
- Enforced dimensions — photos can never stretch or distort.
- `loading="lazy"` on in-page photos.
- Cropping protection: full photos are shown; `position` only adjusts the focal point when
  a container crops for layout.

## Integrity rules

- **Genuine owner-supplied photos only.** Never stage, fabricate, or AI-generate work photos.
- Before/after photos must be of the same job, honestly labeled.
- If a photo isn't good enough to show honestly, don't publish it.
