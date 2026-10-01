// SEO verification against the built output. Run after `npm run build`:
//   node scripts/verify-seo.mjs
// Checks indexability, canonical self-references, title/description/H1
// uniqueness, sitemap↔page agreement, structured-data validity and the
// September 2026 on-page additions (localized service titles, hub page,
// breadcrumbs + BreadcrumbList/Service schema).
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const SITE = 'https://sunshineclimatesolutions.com';
const failures = [];
const check = (name, condition, detail = '') => {
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!condition) failures.push(`${name}${detail ? ` — ${detail}` : ''}`);
};

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found — run npm run build first');
  process.exit(1);
}

const pages = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name === 'index.html' || entry.name === '404.html') pages.push(full);
  }
};
walk(DIST);

const routeFor = (file) => {
  const rel = path.relative(DIST, file).replaceAll('\\', '/');
  if (rel === '404.html') return '/404.html';
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/index\.html$/, '')}`;
};

// Decode HTML entities so length checks measure what search engines display.
const decode = (text) =>
  text
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&#39;', "'")
    .replaceAll('&#x27;', "'")
    .replaceAll('&quot;', '"');

const data = pages.map((file) => {
  const html = fs.readFileSync(file, 'utf8');
  return {
    file,
    route: routeFor(file),
    html,
    title: decode(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? ''),
    description: decode(/<meta name="description" content="([^"]*)"/.exec(html)?.[1] ?? ''),
    canonical: /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1] ?? '',
    robots: /<meta name="robots" content="([^"]+)"/.exec(html)?.[1] ?? '',
    h1s: [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]*>/g, '').trim()),
    jsonLd: [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]),
    imgs: [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]),
  };
});

const indexable = data.filter(
  (p) => p.route !== '/thank-you/' && p.route !== '/404.html' && p.route !== '/support/',
);

// ── Uniqueness ──────────────────────────────────────────────────────────────
const titles = data.map((p) => p.title);
check('no duplicate titles', new Set(titles).size === titles.length);
const descriptions = data.map((p) => p.description);
check('no duplicate meta descriptions', new Set(descriptions).size === descriptions.length);
check('every page has exactly one H1', data.every((p) => p.h1s.length === 1), data.filter((p) => p.h1s.length !== 1).map((p) => p.route).join(', '));
check('every H1 is non-empty', data.every((p) => p.h1s[0]?.length > 0));
check('no duplicate H1s', new Set(data.map((p) => p.h1s[0])).size === data.length);
check(
  'titles stay within 80 characters',
  data.every((p) => p.title.length <= 80),
  data.filter((p) => p.title.length > 80).map((p) => `${p.route} (${p.title.length})`).join(', '),
);
check(
  'meta descriptions stay within 185 characters',
  data.every((p) => p.description.length <= 185),
  data.filter((p) => p.description.length > 185).map((p) => `${p.route} (${p.description.length})`).join(', '),
);

// ── Canonicals + robots ─────────────────────────────────────────────────────
check(
  'every page has a self-referencing canonical with no query string',
  data.every((p) => p.canonical === `${SITE}${p.route === '/404.html' ? '/404/' : p.route}` || p.canonical === `${SITE}${p.route}`),
  data.filter((p) => !p.canonical || p.canonical.includes('?')).map((p) => p.route).join(', '),
);
check(
  'only /thank-you/ and /support/ are noindex',
  data.every((p) =>
    p.route === '/thank-you/' || p.route === '/support/'
      ? p.robots.includes('noindex')
      : p.robots === 'index, follow',
  ),
  data
    .filter(
      (p) =>
        p.robots !== 'index, follow' && p.route !== '/thank-you/' && p.route !== '/support/',
    )
    .map((p) => p.route)
    .join(', '),
);

// ── Sitemap agreement ───────────────────────────────────────────────────────
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf8');
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, ''));
const indexableRoutes = indexable.map((p) => p.route).sort();
check(
  'sitemap contains exactly the indexable pages',
  sitemapPaths.length === indexableRoutes.length && sitemapPaths.every((u) => indexableRoutes.includes(u)),
  `sitemap ${sitemapPaths.length} vs pages ${indexableRoutes.length}`,
);
check('sitemap URLs have no query strings', sitemapPaths.every((u) => !u.includes('?')));

// ── Structured data ─────────────────────────────────────────────────────────
let jsonLdOk = true;
const jsonLdTypes = new Map();
for (const page of data) {
  const types = [];
  for (const block of page.jsonLd) {
    try {
      const parsed = JSON.parse(block);
      types.push(parsed['@type']);
    } catch {
      jsonLdOk = false;
      console.log(`FAIL  JSON-LD does not parse on ${page.route}`);
    }
  }
  jsonLdTypes.set(page.route, types);
}
check('every page has parseable JSON-LD', jsonLdOk);
check(
  'every page carries the HVACBusiness entity',
  [...jsonLdTypes.values()].every((types) => types.includes('HVACBusiness')),
);
check(
  'areaServed includes Spring Hill as a City',
  data[0].jsonLd.some((block) => block.includes('"@type":"City"') && block.includes('"name":"Spring Hill"')),
);
const servicePages = data.filter((p) => p.route.startsWith('/services/') && p.route !== '/services/');
check(
  'service pages carry Service + BreadcrumbList schema',
  servicePages.every((p) => {
    const types = jsonLdTypes.get(p.route);
    return types.includes('Service') && types.includes('BreadcrumbList');
  }),
  servicePages.filter((p) => !jsonLdTypes.get(p.route).includes('Service')).map((p) => p.route).join(', '),
);
const hub = data.find((p) => p.route === '/service-area/spring-hill-fl/');
check('Spring Hill hub exists and is in the sitemap', Boolean(hub) && sitemapPaths.includes('/service-area/spring-hill-fl/'));
check('Spring Hill hub carries BreadcrumbList schema', Boolean(hub) && jsonLdTypes.get(hub.route).includes('BreadcrumbList'));

// ── Structured-data integrity (no fabricated or unsupported markup) ─────────
const allJsonLd = data.flatMap((p) => p.jsonLd);
check('no AggregateRating markup anywhere', allJsonLd.every((b) => !b.includes('AggregateRating')));
check('no Review markup anywhere', allJsonLd.every((b) => !/"@type"\s*:\s*"Review"/.test(b)));
check('no postal address in any JSON-LD', allJsonLd.every((b) => !b.includes('PostalAddress') && !b.includes('"address"')));
check('no geo coordinates in any JSON-LD', allJsonLd.every((b) => !b.includes('GeoCoordinates') && !b.includes('"geo"')));
for (const page of servicePages) {
  const serviceBlocks = page.jsonLd.filter((b) => b.includes('"@type":"Service"'));
  check(`${page.route}: exactly one Service node`, serviceBlocks.length === 1, String(serviceBlocks.length));
  check(
    `${page.route}: Service node references the business entity`,
    serviceBlocks.length === 1 && serviceBlocks[0].includes('/#business'),
  );
}
// Breadcrumb schema must match the visible breadcrumb trail.
for (const page of [...servicePages, hub].filter(Boolean)) {
  const nav = /<nav class="breadcrumbs"[\s\S]*?<\/nav>/.exec(page.html)?.[0] ?? '';
  const visibleItems = (nav.match(/<li/g) ?? []).length;
  const crumbBlock = page.jsonLd.find((b) => b.includes('BreadcrumbList'));
  let jsonItems = 0;
  try {
    jsonItems = (JSON.parse(crumbBlock).itemListElement ?? []).length;
  } catch {
    /* parse failures already reported above */
  }
  check(
    `${page.route}: breadcrumb schema matches visible trail`,
    visibleItems > 0 && visibleItems === jsonItems,
    `visible ${visibleItems} vs schema ${jsonItems}`,
  );
}

// ── Breadcrumbs visible where schema exists ─────────────────────────────────
check(
  'service pages show a visible breadcrumb trail',
  servicePages.every((p) => p.html.includes('class="breadcrumbs"') && p.html.includes('aria-label="Breadcrumb"')),
);
check('hub shows a visible breadcrumb trail', Boolean(hub) && hub.html.includes('class="breadcrumbs"'));

// ── On-page additions ───────────────────────────────────────────────────────
const titleFor = (route) => data.find((p) => p.route === route)?.title ?? '';
check('airflow title localized to Spring Hill', titleFor('/services/airflow-ductwork/').includes('Spring Hill'));
check('replacement title localized to Spring Hill', titleFor('/services/replacement-installation/').includes('Spring Hill'));
check('repair title localized to Spring Hill', titleFor('/services/ac-repair-diagnostics/').includes('Spring Hill'));
check('maintenance title localized to Spring Hill', titleFor('/services/ac-maintenance/').includes('Spring Hill'));
const faq = data.find((p) => p.route === '/faq/');
check(
  'diagnostic FAQs published on /faq/',
  faq.html.includes('running but not cooling') &&
    faq.html.includes('tripping the breaker') &&
    faq.html.includes('freeze up') &&
    faq.html.includes('hotter than the rest') &&
    faq.html.includes('static pressure'),
);
check(
  'hub links to all service pages',
  Boolean(hub) &&
    ['/services/ac-repair-diagnostics/', '/services/ac-maintenance/', '/services/replacement-installation/', '/services/airflow-ductwork/', '/services/commercial-service-maintenance/', '/tab-commissioning-support/'].every(
      (href) => hub.html.includes(href),
    ),
);
check(
  'homepage and service-area page link to the hub',
  data.find((p) => p.route === '/').html.includes('/service-area/spring-hill-fl/') &&
    data.find((p) => p.route === '/service-area/').html.includes('/service-area/spring-hill-fl/'),
);

// ── Images ──────────────────────────────────────────────────────────────────
const imgsMissingAlt = data.flatMap((p) => p.imgs.filter((img) => !/\balt="/.test(img)).map(() => p.route));
check('every image has an alt attribute', imgsMissingAlt.length === 0, imgsMissingAlt.join(', '));

console.log(`\n${failures.length ? `FAILURES:\n${failures.join('\n')}` : 'ALL SEO CHECKS PASSED'}`);
if (failures.length) process.exitCode = 1;
