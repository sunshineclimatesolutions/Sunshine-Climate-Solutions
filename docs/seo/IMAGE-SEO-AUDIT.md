# Image SEO audit — September 2026

Data: `docs/seo/seo-inventory.json` (per-page `img` elements) + built asset sizes.
All images have an `alt` attribute; 126 decorative images use an empty `alt` (correct for
logos, icons, and the map background chrome).

## Content photographs (the images that matter for search and trust)

| File (source) | Dimensions | Format / serving | Pages | Alt text | Decision |
| --- | --- | --- | --- | --- | --- |
| `linehide-and-disconnect.jpg` | 1500×2000 | WebP via `astro:assets`, responsive srcset, lazy | Home (proof) | "Refrigerant line-set concealment (line hide) and electrical disconnect installed beside an outdoor unit" | Keep — descriptive filename + accurate alt. Focal point `50% 45%` set for the 4:3 card crop. |
| `custom-ductboard-supply-plenum.jpg` | 1500×2000 | WebP, responsive, lazy | Home (proof) | "Custom ductboard supply plenum fitted during an HVAC installation" | Keep — renamed from `fabricated-supply-plenum.jpg` in the overhaul (more accurate, less ambiguous). Focal point `50% 62%`. |
| `airflow-measurement-at-grille.jpg` | 1500×2000 | WebP, responsive, lazy | Home (proof), TAB | "Instrument taking an airflow reading at a supply grille…" | Keep. Focal point `50% 48%`. |
| `rooftop-mechanical-equipment.jpg` | 1600×1200 | WebP, responsive, lazy | TAB | "Rooftop mechanical equipment on a commercial project site" | Keep — native 4:3. |
| `dirty-coil-detail.jpg` | 1600×1200 | WebP, responsive, lazy | FAQ (conditions) | "Close view of a visibly soiled coil photographed during an inspection" | Keep — native 4:3. |

Filenames are descriptive and hyphenated; none follow the `IMG_4827.jpg` anti-pattern. Per the
change order, files with already-useful names were **not** renamed for keywords.

## Brand, UI and map assets

- Manufacturer logos (6 files, 16–91 KB): served from `public/images/`, normalized in the
  overhaul; `alt` empty because the surrounding text names the brands. Keep.
- Social logos (Facebook, Nextdoor, Yelp): small, `alt` empty, paired with visible text links.
- `service-area-map.svg` / `service-area-map-compact.svg` (66 KB / 33 KB): hand-built from
  Census geometry, accessible `<title>`/`<desc>`, labels all four counties + GULF OF AMERICA.
  The **alt text carries the SEO value** ("Map of west-central Florida showing Hernando, Pasco,
  Pinellas and Hillsborough counties…") — correct approach for complex images.
- Review QR (`/brand/qr-review.png`) and marketing QRs (`/public/marketing/qr/`): functional
  assets, not search images.

## Recommendations (not implemented)

1. **Largest responsive variants are heavy** (the 1500×2000 proof photos render 512–862 KB at
   the top srcset width). Real browsers pick smaller candidates, but tightening the `quality`
   or the max `widths` in `PhotoCard`/`astro:assets` would trim bytes further. Deferred: any
   change risks visible photo quality; the owner should approve a compression pass.
2. **No new images should be added purely for SEO.** When the owner supplies genuine local
   photos (Spring Hill jobs, equipment details), add them with honest alt text and the
   existing photo guardrails (`node scripts/photo.mjs`).
3. Do not stuff city names into alt text for photos that are not actually location-specific.
