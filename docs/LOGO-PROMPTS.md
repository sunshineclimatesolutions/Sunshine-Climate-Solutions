# Branding — final logo

**Status: implemented.** The provisional SCS wordmark has been replaced with the owner's
approved **Logo 2** (bold, angular navy SCS letters with a horizontal gold stripe).

- Original artwork (unmodified): `brand-source/originals/logo2.jpg` (and `logo1.jpg`,
  the unused alternate — do not use unless the owner requests it).
- Transparent variants (dark for light surfaces, light for the navy header/footer),
  extracted from the original with background and margins removed:
  `brand-source/logo-dark-full.png`, `brand-source/logo-light-full.png`.
- Website assets: `public/brand/logo-dark.png`, `public/brand/logo-light.png` (331×96),
  `public/favicon.svg`, `public/brand/icon-180.png`, `public/brand/icon-512.png`,
  `public/brand/og-coverphoto-2026-10.jpg` (date-versioned social card built from the
  owner's coverphoto artwork — bump the filename and `src/components/BaseHead.astro`
  together when the card changes).
- Regenerate display assets: `node scripts/generate-brand-images.mjs`.
- Google review QR (destination in `business.reviewsSubmissionUrl`):
  `public/brand/qr-review.svg` / `.png` / `-print.png` — regenerate + decode-verify with
  `node scripts/generate-review-qr.mjs`.

Historical note: this file previously contained Ideogram prompts for generating a new
logo, which are no longer needed — the owner supplied the final artwork.
