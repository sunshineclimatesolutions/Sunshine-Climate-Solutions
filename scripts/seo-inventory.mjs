// SEO page inventory — extracts the on-page facts of every built page into
// docs/seo/seo-inventory.json (and prints a summary). Used for the baseline,
// the technical/on-page audits and duplicate-content checks.
//
// Usage: npm run build first, then: node scripts/seo-inventory.mjs
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
if (!fs.existsSync(DIST)) {
  console.error('dist/ not found — run npm run build first');
  process.exit(1);
}

const decode = (text) =>
  text
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&nbsp;', ' ');

const stripTags = (html) => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

const pages = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'index.html') pages.push(full);
    else if (entry.name === '404.html') pages.push(full);
  }
};
walk(DIST);

const routeFor = (file) => {
  const rel = path.relative(DIST, file).replaceAll('\\', '/');
  if (rel === '404.html') return '/404.html';
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/index\.html$/, '')}`;
};

const inventory = pages
  .map((file) => {
    const html = fs.readFileSync(file, 'utf8');
    const route = routeFor(file);
    const main = /<main[^>]*>([\s\S]*?)<\/main>/.exec(html)?.[1] ?? '';
    const title = decode(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '');
    const description = decode(
      /<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? '',
    );
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? '';
    const robots = /<meta name="robots" content="([^"]+)"/.exec(html)?.[1] ?? '';
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => stripTags(m[1]));
    const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => stripTags(m[1]));
    const h3s = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => stripTags(m[1]));
    const schemaTypes = [...html.matchAll(/"@type":"([^"]+)"/g)].map((m) => m[1]);
    const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(
      (m) => m[1],
    );
    const images = [...html.matchAll(/<img\b([^>]*)>/g)].map((m) => {
      const attrs = m[1];
      const attr = (name) => new RegExp(`${name}="([^"]*)"`).exec(attrs)?.[1] ?? '';
      return {
        src: attr('src'),
        alt: attr('alt'),
        loading: attr('loading') || 'eager',
        width: attr('width'),
        height: attr('height'),
        hasAlt: /\balt="/.test(attrs),
      };
    });
    const links = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => {
      const href = /href="([^"]*)"/.exec(m[1])?.[1] ?? '';
      return { href, anchor: stripTags(m[2]).slice(0, 80) };
    });
    const internalLinks = links.filter((l) => l.href.startsWith('/'));
    const externalLinks = links.filter((l) => /^https?:/.test(l.href));

    return {
      route,
      title,
      titleLength: title.length,
      description,
      descriptionLength: description.length,
      canonical,
      robots,
      h1: h1s,
      h2Count: h2s.length,
      h3Count: h3s.length,
      h2s,
      wordCount: stripTags(main).split(' ').filter(Boolean).length,
      schemaTypes: [...new Set(schemaTypes)],
      jsonLdBlocks: jsonLdBlocks.length,
      images,
      imagesMissingAlt: images.filter((img) => !img.hasAlt).length,
      internalLinks: internalLinks.length,
      externalLinks: externalLinks.length,
      internalLinkTargets: [...new Set(internalLinks.map((l) => l.href))].sort(),
      externalLinkTargets: [...new Set(externalLinks.map((l) => l.href))].sort(),
    };
  })
  .sort((a, b) => a.route.localeCompare(b.route));

const sitemap = fs.readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const robotsTxt = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf8');

const output = {
  generatedAt: new Date().toISOString(),
  productionHead: '1080de335396e5278f1931ee79233eff619a7646',
  pageCount: inventory.length,
  sitemapUrls,
  robotsTxt: robotsTxt.trim().split('\n'),
  pages: inventory,
};

fs.mkdirSync(path.join('docs', 'seo'), { recursive: true });
fs.writeFileSync(path.join('docs', 'seo', 'seo-inventory.json'), `${JSON.stringify(output, null, 2)}\n`);

// ── Summary ─────────────────────────────────────────────────────────────────
console.log(`pages: ${inventory.length} | sitemap: ${sitemapUrls.length}`);
for (const page of inventory) {
  console.log(
    `${page.route.padEnd(48)} words=${String(page.wordCount).padStart(4)} h1=${page.h1.length} h2=${page.h2Count} imgs=${page.images.length} links=${page.internalLinks} schema=${page.schemaTypes.join('+') || 'none'}`,
  );
}
const missingAlt = inventory.flatMap((p) => p.images.filter((i) => !i.hasAlt).map(() => p.route));
console.log(`images missing alt attribute: ${missingAlt.length ? missingAlt.join(', ') : 'none'}`);
const emptyAlt = inventory.flatMap((p) =>
  p.images.filter((i) => i.hasAlt && i.alt === '').map((i) => `${p.route} ${i.src}`),
);
console.log(`decorative (empty) alts: ${emptyAlt.length}`);
console.log('wrote docs/seo/seo-inventory.json');
