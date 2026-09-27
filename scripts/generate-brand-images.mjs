// Generates first-party brand raster assets from the provisional SCS mark:
//   public/brand/icon-180.png   (apple-touch-icon)
//   public/brand/icon-512.png   (structured-data / org icon)
//   public/brand/og-default.png (social sharing card)
// Usage: node scripts/generate-brand-images.mjs  (requires: npm i -D playwright)
// Env: BASE_URL (default http://localhost:4321) — used to load the self-hosted fonts.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const OUT_DIR = path.join('public', 'brand');
fs.mkdirSync(OUT_DIR, { recursive: true });

const faviconSvg = fs.readFileSync(path.join('public', 'favicon.svg'), 'utf8');

const browser = await chromium.launch();

try {
  // Square icons rendered from the favicon SVG (navy rounded square + monogram)
  for (const size of [180, 512]) {
    const context = await browser.newContext({
      viewport: { width: size, height: size },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    await page.setContent(
      `<!doctype html><html><head><style>
        html,body{margin:0;padding:0;background:transparent}
        svg{width:${size}px;height:${size}px;display:block}
      </style></head><body>${faviconSvg}</body></html>`,
    );
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(OUT_DIR, `icon-${size}.png`) });
    await context.close();
    console.log(`icon-${size}.png written`);
  }

  // Social sharing card 1200x630, rendered with the site's self-hosted fonts.
  const context = await browser.newContext({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>
      @font-face{font-family:'Archivo';src:url('${BASE}/fonts/archivo-var-latin.woff2') format('woff2');font-weight:500 800;font-display:block}
      @font-face{font-family:'Public Sans';src:url('${BASE}/fonts/publicsans-var-latin.woff2') format('woff2');font-weight:400 700;font-display:block}
      html,body{margin:0;padding:0}
      body{width:1200px;height:630px;background:#10263d;color:#fff;font-family:'Public Sans',sans-serif;display:flex;align-items:center}
      .wrap{padding:0 80px}
      .eyebrow{color:#f4b631;font-family:'Archivo',sans-serif;font-weight:700;font-size:26px;letter-spacing:.12em;text-transform:uppercase;margin:0 0 18px}
      h1{font-family:'Archivo',sans-serif;font-weight:800;font-size:88px;line-height:1.02;letter-spacing:-.02em;margin:0 0 24px;max-width:9ch}
      h1 span{color:#f4b631}
      .sub{font-size:30px;line-height:1.4;color:#c9d6e3;margin:0 0 34px;max-width:26ch}
      .phone{display:inline-block;background:#f4b631;color:#10263d;font-family:'Archivo',sans-serif;font-weight:800;font-size:34px;padding:18px 34px;border-radius:12px}
      .arc{position:absolute;right:-80px;top:-60px;width:520px;opacity:.35}
    </style></head><body>
      <svg class="arc" viewBox="0 0 400 400" fill="none" stroke="#f4b631" stroke-width="2">
        <circle cx="200" cy="200" r="150"></circle>
        <circle cx="200" cy="200" r="110" stroke-dasharray="4 14"></circle>
        <circle cx="200" cy="200" r="55"></circle>
      </svg>
      <div class="wrap">
        <p class="eyebrow">Sunshine Climate Solutions</p>
        <h1>Honest AC repair. <span>Clear answers.</span></h1>
        <p class="sub">Owner-operated heating and cooling service across Tampa Bay.</p>
        <div class="phone">(727) 661-5200</div>
      </div>
    </body></html>`,
  );
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUT_DIR, 'og-default.png') });
  await context.close();
  console.log('og-default.png written');
} finally {
  await browser.close();
}
