// Generates the four-county service-area map SVGs from OFFICIAL U.S. Census
// 2025 cartographic boundary geometry (cb_2025_us_county_500k).
// Outputs:
//   public/images/service-area-map.svg        (full: labeled counties + Gulf)
//   public/images/service-area-map-compact.svg (compact: fills only, HTML key beside)
// Uses the established `shapefile` package; equirectangular projection scaled
// by cos(center latitude). All county geometry comes from the Census file —
// nothing is hand-drawn. See docs/SERVICE-AREA-MAP.md.
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

// Bounding box of the four highlighted counties (+ margin) decides neighbors.
let lonMin = 180, latMin = 90, lonMax = -180, latMax = -90;
const polys = (geom) =>
  geom.type === 'MultiPolygon' ? geom.coordinates : [geom.coordinates];
for (const f of features) {
  if (!HIGHLIGHT[f.properties.GEOID]) continue;
  for (const poly of polys(f.geometry)) {
    for (const ring of poly) {
      for (const [lon, lat] of ring) {
        if (lon < lonMin) lonMin = lon; if (lon > lonMax) lonMax = lon;
        if (lat < latMin) latMin = lat; if (lat > latMax) latMax = lat;
      }
    }
  }
}
console.log(`4-county bbox: lon ${lonMin.toFixed(3)}..${lonMax.toFixed(3)} lat ${latMin.toFixed(3)}..${latMax.toFixed(3)}`);
const MARGIN = 0.55;
const box = { lonMin: lonMin - MARGIN, lonMax: lonMax + MARGIN, latMin: latMin - MARGIN, latMax: latMax + MARGIN };

// Include any FL county whose bbox intersects the expanded box (visual context).
const intersects = (f) => {
  let lo = 180, la = 90, lo2 = -180, la2 = -90;
  for (const poly of polys(f.geometry)) {
    for (const ring of poly) for (const [lon, lat] of ring) {
      if (lon < lo) lo = lon; if (lon > lo2) lo2 = lon;
      if (lat < la) la = lat; if (lat > la2) la2 = lat;
    }
  }
  return lo <= box.lonMax && lo2 >= box.lonMin && la <= box.latMax && la2 >= box.latMin;
};
const region = features.filter(intersects);
console.log(`counties rendered (incl. muted neighbors): ${region.length} (${region.filter((f) => HIGHLIGHT[f.properties.GEOID]).length} highlighted)`);

// Equirectangular projection, units = 1000 per degree, x scaled by cos(center lat).
const lat0 = (box.latMin + box.latMax) / 2;
const K = 1000;
const COS = Math.cos((lat0 * Math.PI) / 180);
const project = (lon, lat) => [ (lon - box.lonMin) * K * COS, (box.latMax - lat) * K ];
const width = (box.lonMax - box.lonMin) * K * COS;
const height = (box.latMax - box.latMin) * K;

const pathFor = (geom) => {
  let d = '';
  let lastX = null, lastY = null;
  for (const poly of polys(geom)) {
    for (const ring of poly) {
      ring.forEach(([lon, lat], i) => {
        const [px, py] = project(lon, lat);
        const x = Math.round(px), y = Math.round(py);
        if (x === lastX && y === lastY) return; // dedupe after rounding (1 km precision)
        lastX = x; lastY = y;
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
        if ((pts[i][1] > y) !== (pts[j][1] > y) && x < ((pts[j][0] - pts[i][0]) * (y - pts[i][1])) / (pts[j][1] - pts[i][1]) + pts[i][0]) inside = !inside;
      }
    }
  }
  return inside;
};
const distToSeg = (px, py, [a, b]) => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy));
};
const labelPoint = (geom) => {
  const segs = allSegments(geom);
  let best = null, bestClear = -1;
  for (let y = 0; y < height; y += height / 120) {
    for (let x = 0; x < width; x += width / 120) {
      if (!pointInPolys(geom, x, y)) continue;
      let clear = Infinity;
      for (const s of segs) {
        const d = distToSeg(x, y, s);
        if (d < clear) clear = d;
        if (clear <= bestClear) break;
      }
      if (clear > bestClear) { bestClear = clear; best = [x, y]; }
    }
  }
  return { point: best, clearance: bestClear };
};

// Build label data + report fit (approx text width ≈ 0.58 * fontsize * chars).
const labelData = [];
for (const f of region) {
  const name = HIGHLIGHT[f.properties.GEOID];
  if (!name) continue;
  const { point, clearance } = labelPoint(f.geometry);
  const fs = Math.round(K * 0.032);
  const textW = name.length * fs * 0.62;
  labelData.push({ name, point, clearance, fontSize: fs, fits: clearance * 2 > textW * 0.75 });
  console.log(`${name}: label clearance ${Math.round(clearance)} units, font ${fs}, textW ≈ ${Math.round(textW)} → fits: ${clearance * 2 > textW * 0.75}`);
}

// Palette (site tokens): navy outline #10263d, gold fill #f4b631 (tinted), muted neighbor #d8e0e8 fill with #b9c6d2 stroke, water #f4f6f8? — water should read as water: soft blue-gray.
const WATER = '#eaf0f5';
const MUTED_FILL = '#ffffff';
const MUTED_STROKE = '#c3cedb';
const HI_FILL = '#f4b631';
const HI_STROKE = '#10263d';

const neighbors = region.filter((f) => !HIGHLIGHT[f.properties.GEOID]);
const highlighted = region.filter((f) => HIGHLIGHT[f.properties.GEOID]);

const neighborPaths = neighbors.map((f) => `<path d="${pathFor(f.geometry)}" fill="${MUTED_FILL}" stroke="${MUTED_STROKE}" stroke-width="3"/>`).join('');
const hiPaths = highlighted.map((f) => `<path d="${pathFor(f.geometry)}" fill="${HI_FILL}" stroke="${HI_STROKE}" stroke-width="6" stroke-linejoin="round"/>`).join('');

const svgHeader = (desc) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.round(width)} ${Math.round(height)}" role="img" aria-labelledby="map-title map-desc"><title id="map-title">Sunshine Climate Solutions service area: Hernando, Pasco, Pinellas and Hillsborough counties, Florida</title><desc id="map-desc">${desc}</desc>`;

// Full variant: labeled.
const gulfLabel = (() => {
  const [gx, gy] = project(box.lonMin + 0.12, latMin - 0.05);
  return `<text x="${gx.toFixed(0)}" y="${gy.toFixed(0)}" font-size="${Math.round(K * 0.026)}" fill="#7d94a8" font-family="Public Sans, Segoe UI, sans-serif" font-weight="600" letter-spacing="2" transform="rotate(-90 ${gx.toFixed(0)} ${gy.toFixed(0)})">GULF OF MEXICO</text>`;
})();
const labels = labelData.map(({ name, point, fontSize }) =>
  `<text x="${point[0].toFixed(0)}" y="${point[1].toFixed(0)}" font-size="${fontSize}" fill="#10263d" font-family="Archivo, Segoe UI, sans-serif" font-weight="700" text-anchor="middle" dominant-baseline="middle">${name.toUpperCase()}</text>`,
).join('');

const fullSvg = `${svgHeader('Map of west-central Florida highlighting Hernando, Pasco, Pinellas and Hillsborough counties, which Sunshine Climate Solutions serves. Neighboring counties are shown for context; the Gulf of Mexico lies to the west.')}\n<rect width="${Math.round(width)}" height="${Math.round(height)}" fill="${WATER}"/>\n${neighborPaths}\n${hiPaths}\n${gulfLabel}\n${labels}\n</svg>`;
fs.writeFileSync('public/images/service-area-map.svg', fullSvg);

// Compact variant: no labels (county names are in the adjacent HTML list).
const compactSvg = `${svgHeader('Compact map highlighting the four served counties in west-central Florida. County names are listed beside this map.')}\n<rect width="${Math.round(width)}" height="${Math.round(height)}" fill="${WATER}"/>\n${neighborPaths}\n${hiPaths}\n</svg>`;
fs.writeFileSync('public/images/service-area-map-compact.svg', compactSvg);

for (const f of ['public/images/service-area-map.svg', 'public/images/service-area-map-compact.svg']) {
  console.log(`${f}: ${Math.round(fs.statSync(f).size / 1024)} KB`);
}

// Verification: geographic sanity — north-to-south order of county centroids.
const centroids = {};
for (const f of highlighted) {
  const { point } = labelPoint(f.geometry);
  centroids[HIGHLIGHT[f.properties.GEOID]] = point;
}
const order = Object.entries(centroids).sort((a, b) => a[1][1] - b[1][1]);
console.log('north→south label order:', order.map(([n]) => n).join(' → '), '(expect Hernando → Pasco → Pinellas/Hillsborough)');
const pinX = centroids['Pinellas'][0], hillX = centroids['Hillsborough'][0];
console.log(`Pinellas west of Hillsborough: ${pinX < hillX}`);

// Verify Census county NAME attributes match business.ts names for the four.
for (const f of region) {
  const short = HIGHLIGHT[f.properties.GEOID];
  if (short && f.properties.NAME !== short) {
    throw new Error(`Census name "${f.properties.NAME}" ≠ business.ts name "${short}"`);
  }
}
console.log('Census NAME matches business.ts for all 4 highlighted counties');
console.log('DONE');
