// Service-area map regression guard (September 2026 Gulf of America change
// order). Run AFTER `npm run build`:
//   node scripts/verify-maps.mjs
// Asserts the generated SVGs and the built pages carry "Gulf of America",
// never the former label, and that all four county labels are present.
import fs from 'node:fs';

const failures = [];
const check = (name, condition, detail = '') => {
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

const maps = [
  'public/images/service-area-map.svg',
  'public/images/service-area-map-compact.svg',
  'dist/images/service-area-map.svg',
  'dist/images/service-area-map-compact.svg',
];
const counties = ['HERNANDO', 'PASCO', 'PINELLAS', 'HILLSBOROUGH'];

for (const file of maps) {
  if (!fs.existsSync(file)) {
    check(`${file} exists`, false, 'run npm run build first');
    continue;
  }
  const svg = fs.readFileSync(file, 'utf8');
  check(`${file} displays GULF OF AMERICA`, svg.includes('GULF OF AMERICA'));
  check(`${file} does not contain the former label`, !svg.includes('GULF OF MEXICO'));
  for (const county of counties) {
    check(`${file} labels ${county}`, svg.includes(`>${county}<`));
  }
  check(`${file} has an accessible title`, svg.includes('<title id="map-title">'));
  check(`${file} desc names the Gulf of America`, svg.includes('Gulf of America'));
}

const pages = [
  ['dist/service-area/index.html', 'Gulf of America for context'],
  ['dist/index.html', 'Gulf of America to the west'],
];
for (const [file, phrase] of pages) {
  if (!fs.existsSync(file)) {
    check(`${file} exists`, false, 'run npm run build first');
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  check(`${file} alt text names the Gulf of America`, html.includes(phrase));
  check(`${file} has no former Gulf label`, !html.includes('Gulf of Mexico'));
}

console.log(`\n${failures.length ? `FAILURES:\n${failures.join('\n')}` : 'ALL MAP CHECKS PASSED'}`);
if (failures.length) process.exitCode = 1;
