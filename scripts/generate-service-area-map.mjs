// Generates the four-county service-area map SVGs from OFFICIAL U.S. Census
// 2025 cartographic boundary geometry (cb_2025_us_county_500k).
// Outputs:
//   public/images/service-area-map.svg         (full: labeled counties + Gulf of America context)
//   public/images/service-area-map-compact.svg (compact: tighter crop, labeled counties)
// Both variants label ALL FOUR counties. Narrow shapes that cannot hold their
// own label (Pinellas) get a callout label over the Gulf of America with a
// leader line. Uses the established `shapefile` package; equirectangular
// projection scaled by cos(center latitude). All county geometry comes from the
// Census file — nothing is hand-drawn. See docs/SERVICE-AREA-MAP.md.
import shapefile from 'shapefile';
import fs from 'node:fs';

const SHP = 'C:/Users/thoma/AppData/Local/Temp/opencode/census/cb_2025_us_county_500k.shp';
const DBF = 'C:/Users/thoma/AppData/Local/Temp/opencode/census/cb_2025_us_county_500k.dbf';

// The four primary counties — names come from src/config/business.ts (single
// source of truth); GEOIDs are the Census identifiers for those same counties.
const businessTs = fs.readFileSync('src/config/business.ts', 'utf8');
const countiesMatch = businessTs.match(/counties:\s*\[([^\]]+)\]/);
if (!countiesMatch) throw new Error('Could not read serviceArea.counties from src/config/business.ts');
const COUNTY_NAMES = [...countiesMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
const NAME_TO_GEOID = {
  'Hernando County': '12053',
  'Pasco County': '12101',
  'Pinellas County': '12103',
  'Hillsborough County': '12057',
};
const HIGHLIGHT = {};
for (const fullName of COUNTY_NAMES) {
  const geoid = NAME_TO_GEOID[fullName];
  if (!geoid) throw new Error(`No Census GEOID mapped for business.ts county: ${fullName}`);
  HIGHLIGHT[geoid] = fullName.replace(' County', '');
}

const source = await shapefile.open(SHP, DBF);
const features = [];
while (true) {
  const { done, value } = await source.read();
  if (done) break;
  if (value.properties.STATEFP === '12') features.push(value); // Florida only
}
console.log(`Florida counties in file: ${features.length}`);

const polys = (geom) => (geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates]);

// Bounding box of the four highlighted counties.
let lonMin = 180,
  latMin = 90,
  lonMax = -180,
  latMax = -90;
for (const f of features) {
  if (!HIGHLIGHT[f.properties.GEOID]) continue;
  for (const poly of polys(f.geometry)) {
    for (const ring of poly) {
      for (const [lon, lat] of ring) {
        if (lon < lonMin) lonMin = lon;
        if (lon > lonMax) lonMax = lon;
        if (lat < latMin) latMin = lat;
        if (lat > latMax) latMax = lat;
      }
    }
  }
}
console.log(
  `4-county bbox: lon ${lonMin.toFixed(3)}..${lonMax.toFixed(3)} lat ${latMin.toFixed(3)}..${latMax.toFixed(3)}`,
);

// Palette (site tokens): charcoal outline #2d4256, gold fill #f4b631,
// muted neighbor #ffffff fill with #c3cedb stroke, water soft blue-gray.
const WATER = '#eaf0f5';
const MUTED_FILL = '#ffffff';
const MUTED_STROKE = '#c3cedb';
const HI_FILL = '#f4b631';
const HI_STROKE = '#2d4256';
const LABEL_INK = '#203549';
// Geographic water label. MUST be "Gulf of America" per the September 2026
// owner change order; guarded below so the old name can never return.
const GULF_LABEL = 'GULF OF AMERICA';
const OLD_GULF_LABEL = 'GULF OF MEXICO';
const GULF_INK = '#7d94a8';

// Intended display widths (px) used for the legibility floor.
const DISPLAY = { full: 448, compact: 336 };

// Approx text width for Archivo bold ≈ 0.62 * font-size * chars.
const textWidth = (name, fs) => name.length * fs * 0.62;

function renderMap({
  name: variantName,
  box,
  labelFontUnits,
  withGulfLabel,
  gulfFontUnits,
  labelCalloutSide,
}) {
  const lat0 = (box.latMin + box.latMax) / 2;
  const K = 1000;
  const COS = Math.cos((lat0 * Math.PI) / 180);
  const project = (lon, lat) => [(lon - box.lonMin) * K * COS, (box.latMax - lat) * K];
  const width = (box.lonMax - box.lonMin) * K * COS;
  const height = (box.latMax - box.latMin) * K;

  const bboxOf = (f) => {
    let lo = 180,
      la = 90,
      lo2 = -180,
      la2 = -90;
    for (const poly of polys(f.geometry)) {
      for (const ring of poly) {
        for (const [lon, lat] of ring) {
          if (lon < lo) lo = lon;
          if (lon > lo2) lo2 = lon;
          if (lat < la) la = lat;
          if (lat > la2) la2 = lat;
        }
      }
    }
    return [lo, la, lo2, la2];
  };
  const intersects = (f) => {
    const [lo, la, lo2, la2] = bboxOf(f);
    return lo <= box.lonMax && lo2 >= box.lonMin && la <= box.latMax && la2 >= box.latMin;
  };
  const region = features.filter(intersects);

  const pathFor = (geom) => {
    let d = '';
    let lastX = null,
      lastY = null;
    for (const poly of polys(geom)) {
      for (const ring of poly) {
        ring.forEach(([lon, lat], i) => {
          const [px, py] = project(lon, lat);
          const x = Math.round(px),
            y = Math.round(py);
          if (x === lastX && y === lastY) return; // dedupe after rounding (1 km precision)
          lastX = x;
          lastY = y;
          d += `${i === 0 ? 'M' : 'L'}${x} ${y}`;
        });
        d += 'Z';
      }
    }
    return d;
  };

  // Interior label point: sample a grid inside the county, choose the point with
  // the greatest minimum distance to any polygon edge segment (approx clearance).
  const allSegments = (geom) => {
    const segs = [];
    for (const poly of polys(geom)) {
      for (const ring of poly) {
        const pts = ring.map(([lon, lat]) => project(lon, lat));
        for (let i = 0; i < pts.length - 1; i++) segs.push([pts[i], pts[i + 1]]);
      }
    }
    return segs;
  };
  const pointInPolys = (geom, x, y) => {
    let inside = false;
    for (const poly of polys(geom)) {
      for (const ring of poly) {
        const pts = ring.map(([lon, lat]) => project(lon, lat));
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
          if (
            pts[i][1] > y !== pts[j][1] > y &&
            x < ((pts[j][0] - pts[i][0]) * (y - pts[i][1])) / (pts[j][1] - pts[i][1]) + pts[i][0]
          )
            inside = !inside;
        }
      }
    }
    return inside;
  };
  const distToSeg = (px, py, [a, b]) => {
    const dx = b[0] - a[0],
      dy = b[1] - a[1];
    const t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
  };
  const labelPoint = (geom, textW, fs) => {
    const segs = allSegments(geom);
    // Approximate text box fit: sample the box corners/edges inside the polygon.
    const boxFits = (x, y) => {
      const hw = textW / 2;
      const hh = fs * 0.55;
      for (const sx of [x - hw, x, x + hw]) {
        for (const sy of [y - hh, y, y + hh]) {
          if (!pointInPolys(geom, sx, sy)) return false;
        }
      }
      return true;
    };
    let best = null,
      bestClear = -1; // max-clearance fallback (callout anchor)
    let fitPoint = null,
      fitClear = -1; // best point whose text box fits
    for (let y = 0; y < height; y += height / 160) {
      for (let x = 0; x < width; x += width / 160) {
        if (!pointInPolys(geom, x, y)) continue;
        let clear = Infinity;
        for (const s of segs) {
          const d = distToSeg(x, y, s);
          if (d < clear) clear = d;
          if (clear <= bestClear && clear <= fitClear) break;
        }
        if (clear > bestClear) {
          bestClear = clear;
          best = [x, y];
        }
        if (clear > fitClear && boxFits(x, y)) {
          fitClear = clear;
          fitPoint = [x, y];
        }
      }
    }
    return { point: fitPoint ?? best, clearance: fitPoint ? fitClear : bestClear, fits: Boolean(fitPoint) };
  };

  const neighbors = region.filter((f) => !HIGHLIGHT[f.properties.GEOID]);
  const highlighted = region.filter((f) => HIGHLIGHT[f.properties.GEOID]);
  const neighborPaths = neighbors
    .map((f) => `<path d="${pathFor(f.geometry)}" fill="${MUTED_FILL}" stroke="${MUTED_STROKE}" stroke-width="3"/>`)
    .join('');
  const hiPaths = highlighted
    .map(
      (f) =>
        `<path d="${pathFor(f.geometry)}" fill="${HI_FILL}" stroke="${HI_STROKE}" stroke-width="6" stroke-linejoin="round"/>`,
    )
    .join('');

  // Labels: inline when the name fits with clearance, otherwise a callout on
  // the requested side with a leader line into the county.
  const labelData = [];
  let labels = '';
  for (const f of highlighted) {
    const name = HIGHLIGHT[f.properties.GEOID];
    const fs = labelFontUnits;
    const textW = textWidth(name, fs);
    const { point, clearance, fits } = labelPoint(f.geometry, textW, fs);
    labelData.push({ name, point, clearance, fontSize: fs, fits });
    console.log(
      `${variantName}: ${name} clearance ${Math.round(clearance)} textW ${Math.round(textW)} fits ${fits} at (${point[0].toFixed(0)}, ${point[1].toFixed(0)})`,
    );
    const label = name.toUpperCase();
    const textAttrs = `font-size="${fs}" fill="${LABEL_INK}" font-family="Archivo, Segoe UI, sans-serif" font-weight="700" dominant-baseline="middle"`;
    if (fits) {
      labels += `<text x="${point[0].toFixed(0)}" y="${point[1].toFixed(0)}" text-anchor="middle" ${textAttrs}>${label}</text>`;
    } else {
      // West callout (over the Gulf) with a leader line to the label point.
      const side = labelCalloutSide === 'east' ? 1 : -1;
      const gap = 20;
      const anchorX = point[0] + side * (clearance + gap);
      const anchor = side < 0 ? 'end' : 'start';
      const leaderEnd = point[0] + side * 6;
      const leaderStart = anchorX - side * 6;
      const textX = anchorX;
      labels += `<line x1="${leaderStart.toFixed(0)}" y1="${point[1].toFixed(0)}" x2="${leaderEnd.toFixed(0)}" y2="${point[1].toFixed(0)}" stroke="${LABEL_INK}" stroke-width="3"/>`;
      labels += `<text x="${textX.toFixed(0)}" y="${point[1].toFixed(0)}" text-anchor="${anchor}" ${textAttrs}>${label}</text>`;
    }
  }

  // The water label sits in the western Gulf column, vertically centered on the
  // canvas so the longer "GULF OF AMERICA" text can never clip, and never
  // renders below the same 10px floor the county labels must meet at the
  // intended display width.
  const gulfFloor = DISPLAY[variantName]
    ? Math.ceil((10 * 1.02) / (DISPLAY[variantName] / width))
    : 0;
  const gulfFont = gulfFontUnits ?? Math.max(Math.round(K * 0.026), gulfFloor);
  const gulfLabel = withGulfLabel
    ? (() => {
        const [gx] = project(box.lonMin + 0.12, latMin - 0.05);
        const gy = height / 2;
        return `<text x="${gx.toFixed(0)}" y="${gy.toFixed(0)}" text-anchor="middle" dominant-baseline="middle" font-size="${gulfFont}" fill="${GULF_INK}" font-family="Public Sans, Segoe UI, sans-serif" font-weight="600" letter-spacing="2" transform="rotate(-90 ${gx.toFixed(0)} ${gy.toFixed(0)})">${GULF_LABEL}</text>`;
      })()
    : '';

  const w = Math.round(width);
  const h = Math.round(height);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="map-title map-desc"><title id="map-title">Sunshine Climate Solutions service area: Hernando, Pasco, Pinellas and Hillsborough counties, Florida</title><desc id="map-desc">Map of west-central Florida highlighting Hernando, Pasco, Pinellas and Hillsborough counties, which Sunshine Climate Solutions serves, with each county name labeled and the Gulf of America shown to the west.</desc>\n<rect width="${w}" height="${h}" fill="${WATER}"/>\n${neighborPaths}\n${hiPaths}\n${gulfLabel}\n${labels}\n</svg>`;

  return {
    svg,
    labelData,
    width: w,
    height: h,
    highlighted,
    gulf: withGulfLabel ? { label: GULF_LABEL, fontSize: gulfFont } : null,
  };
}

// Full variant: current extent (context neighbors + Gulf label), labels for all four.
const MARGIN = 0.55;
const fullBox = {
  lonMin: lonMin - MARGIN,
  lonMax: lonMax + MARGIN,
  latMin: latMin - MARGIN,
  latMax: latMax + MARGIN,
};
const full = renderMap({
  name: 'full',
  box: fullBox,
  labelFontUnits: 40,
  withGulfLabel: true,
  labelCalloutSide: 'west',
});
fs.writeFileSync('public/images/service-area-map.svg', full.svg);

// Compact variant: tighter crop around the four counties (extra Gulf margin on
// the west holds the Pinellas callout), larger labels for small display sizes.
// The Gulf of America label is included with a font size computed to stay above
// the 10px legibility floor at the intended 336px homepage display width.
const compactBox = {
  lonMin: lonMin - 0.5,
  lonMax: lonMax + 0.15,
  latMin: latMin - 0.2,
  latMax: latMax + 0.15,
};
const compact = renderMap({
  name: 'compact',
  box: compactBox,
  labelFontUnits: 52,
  withGulfLabel: true,
  labelCalloutSide: 'west',
});
fs.writeFileSync('public/images/service-area-map-compact.svg', compact.svg);

for (const f of ['public/images/service-area-map.svg', 'public/images/service-area-map-compact.svg']) {
  console.log(`${f}: ${Math.round(fs.statSync(f).size / 1024)} KB`);
}

// Legibility check at the intended display sizes (full: 28rem column,
// compact: 21rem homepage figure). Report rendered label px.
for (const [key, variant] of [
  ['full', full],
  ['compact', compact],
]) {
  const scale = DISPLAY[key] / variant.width;
  const rows = variant.labelData
    .map((d) => `${d.name}: font ${d.fontSize} units → ${(d.fontSize * scale).toFixed(1)}px rendered${d.fits ? '' : ' (callout)'}`)
    .join(' | ');
  console.log(`${key} map ${variant.width}x${variant.height} @${DISPLAY[key]}px: ${rows}`);
  if (variant.labelData.some((d) => d.fontSize * scale < 10)) {
    throw new Error(`${key} map label too small at intended display size`);
  }
  if (variant.gulf) {
    const rendered = variant.gulf.fontSize * scale;
    console.log(
      `${key} gulf label "${variant.gulf.label}": font ${variant.gulf.fontSize} units → ${rendered.toFixed(1)}px rendered`,
    );
    if (rendered < 10) {
      throw new Error(`${key} map Gulf label too small at intended display size`);
    }
  }
}

// Guard (September 2026 owner change order): both maps must display
// "GULF OF AMERICA" and the old name must never reappear after regeneration.
for (const [file, variant] of [
  ['public/images/service-area-map.svg', full],
  ['public/images/service-area-map-compact.svg', compact],
]) {
  const svg = fs.readFileSync(file, 'utf8');
  if (svg.includes(OLD_GULF_LABEL)) {
    throw new Error(`${file} still contains "${OLD_GULF_LABEL}"`);
  }
  if (variant.gulf && !svg.includes(variant.gulf.label)) {
    throw new Error(`${file} is missing "${variant.gulf.label}"`);
  }
}
console.log(`Gulf label guard passed: both maps display "${GULF_LABEL}"`);

// Verification: geographic sanity — north-to-south order of county centroids
// (expect Hernando → Pasco → Pinellas/Hillsborough), from the full map labels.
const order = [...full.labelData].sort((a, b) => a.point[1] - b.point[1]);
console.log('north→south label order:', order.map((d) => d.name).join(' → '));
const pin = full.labelData.find((d) => d.name === 'Pinellas');
const hill = full.labelData.find((d) => d.name === 'Hillsborough');
console.log(`Pinellas west of Hillsborough: ${pin.point[0] < hill.point[0]}`);

// Verify Census county NAME attributes match business.ts names for the four.
for (const f of full.highlighted) {
  const short = HIGHLIGHT[f.properties.GEOID];
  if (short && f.properties.NAME !== short) {
    throw new Error(`Census name "${f.properties.NAME}" ≠ business.ts name "${short}"`);
  }
}
console.log('Census NAME matches business.ts for all 4 highlighted counties');
console.log('DONE');
