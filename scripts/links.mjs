// Internal link checker: crawls every built HTML file in dist/ and verifies that
// all internal hrefs, srcs, and srcset URLs resolve to real files in dist/.
// External links, anchors, and special schemes (mailto:/tel:/sms:/data:) are skipped.
//
// Usage: node scripts/links.mjs     (run after `npm run build`)
// Exit code: 0 = no broken links, 1 = broken links found.
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const problems = [];
let checked = 0;
let htmlFiles = 0;

const walk = (dir, out) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else if (entry.name.endsWith('.html')) out.push(p);
  }
};

const files = [];
walk(DIST, files);
htmlFiles = files.length;

const stripParts = (url) => url.split('#')[0].split('?')[0];

// A URL is "absolute" if it starts with "/" (site-root-relative) — otherwise
// it is relative to the current file's directory.
const resolves = (file, raw) => {
  const target = stripParts(raw);
  if (!target || target === '/') return fs.existsSync(path.join(DIST, 'index.html'));
  const base = target.startsWith('/') ? DIST : path.dirname(file);
  const clean = target.replace(/^\//, '').replace(/\/$/, '');
  const candidate = path.join(base, clean);
  return (
    fs.existsSync(candidate) ||
    fs.existsSync(path.join(candidate, 'index.html'))
  );
};

const check = (file, raw, kind) => {
  if (!raw) return;
  if (/^(https?:|mailto:|tel:|sms:|data:|javascript:|\/\/)/i.test(raw)) return;
  if (raw.startsWith('#')) return;
  checked++;
  if (!resolves(file, raw)) {
    problems.push(`${path.relative(process.cwd(), file)}: ${kind}="${raw}" → not found in dist/`);
  }
};

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) check(file, m[1], m[0].split('=')[0]);
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      check(file, part.trim().split(/\s+/)[0], 'srcset');
    }
  }
}

console.log(`Checked ${checked} internal URL(s) across ${htmlFiles} built HTML file(s).`);
if (problems.length > 0) {
  console.log('BROKEN LINKS:');
  for (const p of problems) console.log(`  ${p}`);
  process.exit(1);
}
console.log('No broken internal links.');
