// IndexNow submission tool — zero dependencies (Node 20+ built-ins only).
//
// Notifies participating search engines (Bing, Yandex, Seznam, Naver, …) about
// genuinely new, updated or deleted canonical URLs on the production site.
//
// Usage:
//   node scripts/indexnow.mjs --range <fromSha>..<toSha> [--base URL] [--wait] [--dry-run]
//   node scripts/indexnow.mjs --urls "https://…/a/,https://…/b/" [--base URL] [--dry-run]
//
// Key handling: the IndexNow key is read from the Option-1 verification file in
// public/ (public/<key>.txt, content = key). The key is public by design.
//
// Behavior:
//   - Maps changed repository files to the canonical URLs they affect.
//   - Verifies each URL is actually live (HTTP 200, not noindex) before submitting.
//   - Excludes preview/localhost/tracking-query/noindex URLs by construction.
//   - Submits ONE batched request to the shared endpoint (no per-engine calls).
//   - Logs every URL and the HTTP response; retries once on 429/5xx.
//   - Never repeats unchanged pages: submissions come from git commit ranges.
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const DEFAULT_BASE = 'https://sunshineclimatesolutions.com';
const EXCLUDED_PATHS = new Set(['/thank-you/', '/404/']);

// ── CLI ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? args[i + 1] : undefined;
};
const base = (value('--base') ?? DEFAULT_BASE).replace(/\/$/, '');
const range = value('--range');
const urlsArg = value('--urls');
const dryRun = flag('--dry-run');
const wait = flag('--wait');
if (!range && !urlsArg) {
  console.log('Usage: node scripts/indexnow.mjs --range <from>..<to> | --urls "url1,url2" [--base URL] [--wait] [--dry-run]');
  process.exit(1);
}

// ── Key (Option 1: root verification file in public/) ────────────────────────
const keyFile = fs
  .readdirSync('public')
  .find((f) => /^[a-zA-Z0-9-]{8,128}\.txt$/.test(f));
if (!keyFile) {
  console.error('No IndexNow key file found in public/ (expected public/<key>.txt).');
  process.exit(1);
}
const key = fs.readFileSync(path.join('public', keyFile), 'utf8').trim();
if (!/^[a-zA-Z0-9-]{8,128}$/.test(key) || path.basename(keyFile, '.txt') !== key) {
  console.error('Key file invalid: content must equal the file name (Option 1).');
  process.exit(1);
}
const keyLocation = `${base}/${key}.txt`;
console.log(`IndexNow key loaded from public/${keyFile} (keyLocation: ${keyLocation})`);

// ── File → canonical URL mapping ─────────────────────────────────────────────
const SITE_PAGE_URLS = {
  'home.md': '/',
  'about.md': '/about/',
  'contact.md': '/contact/',
  'service-area.md': '/service-area/',
  'faq.md': '/faq/',
  'leave-review.md': '/leave-review/',
  'tab.md': '/tab-commissioning-support/',
};
const STATIC_PAGE_URLS = {
  'src/pages/index.astro': ['/'],
  'src/pages/about.astro': ['/about/'],
  'src/pages/contact.astro': ['/contact/'],
  'src/pages/faq.astro': ['/faq/'],
  'src/pages/privacy.astro': ['/privacy/'],
  'src/pages/service-area.astro': ['/service-area/'],
  'src/pages/tab-commissioning-support.astro': ['/tab-commissioning-support/'],
  'src/pages/leave-review.astro': ['/leave-review/'],
  'src/pages/services/index.astro': ['/services/'],
  'src/pages/services/[slug].astro': ['/services/'],
};

const urlsForFile = (file) => {
  const f = file.replace(/\\/g, '/');
  if (f.startsWith('src/content/site/')) {
    const name = f.slice('src/content/site/'.length);
    return SITE_PAGE_URLS[name] ? [SITE_PAGE_URLS[name]] : [];
  }
  if (f.startsWith('src/content/services/')) {
    const id = path.basename(f, '.md');
    return [`/services/${id}/`, '/services/'];
  }
  if (f.startsWith('src/content/faqs/')) return ['/faq/'];
  if (f.startsWith('src/content/reviews/')) return ['/'];
  if (f.startsWith('src/content/projects/')) return ['/our-work/'];
  if (f === 'src/components/ContactForm.astro') return ['/contact/'];
  return STATIC_PAGE_URLS[f] ?? [];
};

// ── Determine candidate URLs ─────────────────────────────────────────────────
let candidates = new Set();
if (urlsArg) {
  for (const u of urlsArg.split(',').map((s) => s.trim()).filter(Boolean)) candidates.add(u);
} else {
  const [from, to] = range.split('..');
  if (!from || !to || /^0+$/.test(from)) {
    console.log('No usable commit range (first push or missing parent) — nothing to submit.');
    process.exit(0);
  }
  let files = [];
  try {
    files = execSync(`git diff --name-only --diff-filter=ACDMR ${from}..${to}`, { encoding: 'utf8' })
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  } catch (e) {
    console.error('git diff failed:', e.message);
    process.exit(1);
  }
  for (const file of files) {
    for (const u of urlsForFile(file)) {
      const full = u.startsWith('http') ? u : base + u;
      candidates.add(full);
    }
  }
}

// ── Exclusions: base host, no query strings, no excluded paths ───────────────
const eligible = [...candidates]
  .filter((u) => {
    if (!u.startsWith(base + '/')) return false;
    const parsed = new URL(u);
    if (parsed.search) return false; // tracking-query URLs never submitted
    if (EXCLUDED_PATHS.has(parsed.pathname)) return false;
    return true;
  })
  .sort();

if (eligible.length === 0) {
  console.log('No eligible canonical URLs changed in this range — nothing to submit.');
  process.exit(0);
}
console.log(`Candidate URLs (${eligible.length}):\n  ${eligible.join('\n  ')}`);

// ── Live verification (optionally waiting for the deployment) ────────────────
const verifyAll = async () => {
  const failures = [];
  for (const url of eligible) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'SunshineClimateSolutions-IndexNow/1.0' } });
      if (res.status !== 200) {
        failures.push(`${url} → HTTP ${res.status}`);
        continue;
      }
      const html = await res.text();
      if (/name="robots"[^>]*noindex/i.test(html)) {
        failures.push(`${url} → noindex (excluded)`);
      }
    } catch (e) {
      failures.push(`${url} → fetch error: ${e.message}`);
    }
  }
  return failures;
};

let failures = await verifyAll();
if (failures.length && wait) {
  const deadline = Date.now() + 6 * 60 * 1000;
  console.log(`Waiting for deployment (${failures.length} URL(s) not ready yet)…`);
  while (failures.length && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 15000));
    failures = await verifyAll();
    console.log(`  re-check: ${failures.length} still failing`);
  }
}
if (failures.length) {
  console.error('Live verification failed — NOT submitting:\n  ' + failures.join('\n  '));
  process.exit(1);
}
console.log('Live verification passed: every candidate URL responds 200 and is indexable.');

if (dryRun) {
  console.log('Dry run — no submission sent.');
  process.exit(0);
}

// ── Submit (one batched request to the shared endpoint) ──────────────────────
const body = JSON.stringify({ host: new URL(base).host, key, keyLocation, urlList: eligible });
const attempt = async () => {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
  });
  const text = await res.text().catch(() => '');
  return { status: res.status, text: text.slice(0, 300) };
};

let result = await attempt();
console.log(`IndexNow response: HTTP ${result.status}${result.text ? ' — ' + result.text : ''}`);
if ((result.status === 429 || result.status >= 500) && !dryRun) {
  console.log('Rate-limited or server error — retrying once in 30s…');
  await new Promise((r) => setTimeout(r, 30000));
  result = await attempt();
  console.log(`IndexNow retry response: HTTP ${result.status}${result.text ? ' — ' + result.text : ''}`);
}
if (result.status !== 200 && result.status !== 202) {
  console.error('Submission failed.');
  process.exit(1);
}
console.log(`Submitted ${eligible.length} URL(s). HTTP ${result.status} confirms receipt${result.status === 202 ? ' (key verification pending)' : ''} — receipt does not guarantee indexing.`);
