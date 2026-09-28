# Service-area map

County-outline maps on the homepage (compact) and `/service-area/` (full).

## Source (authoritative)

- **U.S. Census Bureau 2025 Cartographic Boundary Files**, counties at 1:500,000:
  `https://www2.census.gov/geo/tiger/GENZ2025/shp/cb_2025_us_county_500k.zip`
- Real boundary geometry only — nothing is hand-drawn. The four highlighted
  counties (Hernando 12053, Pasco 12101, Pinellas 12103, Hillsborough 12057) are
  named from `src/config/business.ts` (`serviceArea.counties`), and the generator
  FAILS the build if the Census county names do not match business.ts.
- 16 neighboring Florida counties are rendered muted for context; the Gulf of
  Mexico is the background. No office pins, no radius claims — informational only.

## Assets

| File | Use |
| --- | --- |
| `public/images/service-area-map.svg` | Full labeled map (`/service-area/` map band) |
| `public/images/service-area-map-compact.svg` | Compact map beside the homepage county cards |

Both are lightweight static SVGs (no JavaScript, no API, no cookies). County names
are always present as selectable HTML text next to the map — the image never has
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
  Hillsborough/Pinellas; Pinellas renders west of Hillsborough.
- Label fit: every county label's in-polygon clearance exceeds its text width
  (no labels placed in water or overlapping borders).
- Accessible `<title>`/`<desc>` on both SVGs; county names duplicated as HTML.
- 0px horizontal overflow at 360/768/1440; lazy-loaded (below the fold) on the
  homepage so the mobile call/text/request actions stay first.
