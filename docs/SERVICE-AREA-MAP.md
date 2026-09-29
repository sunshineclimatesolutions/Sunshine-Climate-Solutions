# Service-area map

County-outline maps on the homepage (compact) and `/service-area/` (full).
**Both variants label all four served counties** (September 2026 aesthetic
overhaul): names render inline where the county shape can hold them; Pinellas —
too narrow for its own label — gets a callout over the Gulf of America with a
leader line. Both variants also display the **GULF OF AMERICA** water label
(September 2026 owner change order); it is vertically centered in the western
water column and never renders below the 10px legibility floor.

## Source (authoritative)

- **U.S. Census Bureau 2025 Cartographic Boundary Files**, counties at 1:500,000:
  `https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_county_500k.zip`
- Real boundary geometry only — nothing is hand-drawn. The four highlighted
  counties (Hernando 12053, Pasco 12101, Pinellas 12103, Hillsborough 12057) are
  named from `src/config/business.ts` (`serviceArea.counties`), and the generator
  FAILS the build if the Census county names do not match business.ts.
- 16 neighboring Florida counties are rendered muted for context; the Gulf of
  America is the background. No office pins, no radius claims — informational only.

## Assets

| File | Use |
| --- | --- |
| `public/images/service-area-map.svg` | Full labeled map (`/service-area/` map band) |
| `public/images/service-area-map-compact.svg` | Compact labeled map (homepage county cards) |

Both are lightweight static SVGs (no JavaScript, no API, no cookies). County names
are also present as selectable HTML text next to the map — the image never has
to be interpreted to find coverage.

## Regenerating

```
node scripts/generate-service-area-map.mjs
```

Requires the `shapefile` dev dependency and the Census ZIP extracted to
`%TEMP%\opencode/census`. The script downloads nothing itself — download the
ZIP from the URL above if it is missing, then re-run.

## Verification performed

- Census county `NAME` matches `business.ts` for all four highlighted counties
  (hard assertion in the generator).
- Geographic sanity: label points north→south read Hernando → Pasco →
  Hillsborough → Pinellas; Pinellas renders west of Hillsborough.
- Label fit: every label either fits its county shape (approximate text-box
  containment test) or renders as a west callout with a leader line (Pinellas);
  the generator FAILS if any label would render smaller than 10px at the
  intended display width (full: 448px column, compact: 336px homepage figure).
- Gulf label guard: both variants must display "GULF OF AMERICA" at no less
  than the same 10px floor, and the generator FAILS if the former name appears
  in either output — the old label cannot return through regeneration.
- Accessible `<title>`/`<desc>` on both SVGs (the `<desc>` names the Gulf of
  America); county names duplicated as HTML.
- 0px horizontal overflow at 360/768/1440; lazy-loaded (below the fold) on the
  homepage so the mobile call/text/request actions stay first.
