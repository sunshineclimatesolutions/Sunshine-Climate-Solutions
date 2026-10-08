// Generates the print-ready Sunshine Climate Solutions business card from the
// editable source (docs/print/business-card/business-card.html), including a
// decode-verified QR code that points to the production website.
//
// Outputs (docs/print/business-card/):
//   qr-website.svg / qr-website-print.png          decode-verified QR (website)
//   business-card-front-bleed-300dpi.png           3.75 × 2.25 in (1125 × 675)
//   business-card-back-bleed-300dpi.png
//   business-card-front-trim-300dpi.png            3.5 × 2 in (1050 × 600)
//   business-card-back-trim-300dpi.png
//   business-card-print.pdf                        2 pages at 3.75 × 2.25 in
//   business-card-presentation.png                 combined front/back review sheet
//
// Usage: node scripts/generate-business-card.mjs
import QRCode from 'qrcode';
import { createRequire } from 'node:module';
const require = createRequire('C:/Websites/Sunshine-Climate-Solutions/scripts/photo.mjs');
const sharp = require('sharp');
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs', 'print', 'business-card');
const SOURCE = path.join(OUT, 'business-card.html');

const SITE_URL = 'https://sunshineclimatesolutions.com/';
const CSS_DPI = 96;
const DPI = 300;
const SCALE = DPI / CSS_DPI; // 3.125
const ART = { w: 3.75, h: 2.25 }; // inches, including 0.125 in bleed
const TRIM = { w: 3.5, h: 2 }; // inches
const BLEED_PX = 0.125 * CSS_DPI; // 12 CSS px
const GAP_PX = 0.25 * CSS_DPI; // screen-only gap between cards

fs.mkdirSync(OUT, { recursive: true });

// ── 1. QR code (website) ─────────────────────────────────────────────────────
const QR_OPTS = {
  errorCorrectionLevel: 'H',
  margin: 4,
  color: { dark: '#203549', light: '#ffffff' },
};
await QRCode.toFile(path.join(OUT, 'qr-website.svg'), SITE_URL, { ...QR_OPTS, type: 'svg' });
await QRCode.toFile(path.join(OUT, 'qr-website-print.png'), SITE_URL, {
  ...QR_OPTS,
  type: 'png',
  width: 1200,
});

// ── 2. Render the card exports ───────────────────────────────────────────────
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: Math.round(ART.w * CSS_DPI), height: Math.round(ART.h * CSS_DPI) },
  deviceScaleFactor: SCALE,
});
await page.goto('file:///' + SOURCE.replace(/\\/g, '/'));
await page.evaluate(() => document.fonts.ready);
const fontsOk = await page.evaluate(
  () => document.fonts.check('700 10pt Archivo') && document.fonts.check('600 10pt "Public Sans"'),
);
await page.waitForTimeout(300);

const front = page.locator('#front');
const back = page.locator('#back');
await front.screenshot({ path: path.join(OUT, 'business-card-front-bleed-300dpi.png') });
await back.screenshot({ path: path.join(OUT, 'business-card-back-bleed-300dpi.png') });

const trimClip = (topPx) => ({
  x: BLEED_PX,
  y: topPx + BLEED_PX,
  width: Math.round(TRIM.w * CSS_DPI),
  height: Math.round(TRIM.h * CSS_DPI),
});
await page.screenshot({
  path: path.join(OUT, 'business-card-front-trim-300dpi.png'),
  clip: trimClip(0),
  fullPage: true,
});
await page.screenshot({
  path: path.join(OUT, 'business-card-back-trim-300dpi.png'),
  clip: trimClip(Math.round(ART.h * CSS_DPI) + GAP_PX),
  fullPage: true,
});

await page.pdf({
  path: path.join(OUT, 'business-card-print.pdf'),
  preferCSSPageSize: true,
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
});

// ── 3. Combined presentation sheet (front + back on a neutral backdrop) ──────
const CARD_W = 1050;
const CARD_H = 600;
const SHEET = { w: 2400, h: 900 };
const frontBuf = fs.readFileSync(path.join(OUT, 'business-card-front-trim-300dpi.png'));
const backBuf = fs.readFileSync(path.join(OUT, 'business-card-back-trim-300dpi.png'));

const withShadow = async (buf, left, top) => {
  const alpha = await sharp(buf).ensureAlpha().extractChannel('alpha').blur(16).toBuffer();
  const shadow = await sharp({
    create: { width: CARD_W, height: CARD_H, channels: 4, background: { r: 16, g: 27, b: 41, alpha: 1 } },
  })
    .joinChannel(alpha)
    .png()
    .toBuffer();
  return [
    { input: shadow, left: left + 14, top: top + 18 },
    { input: await sharp(buf).ensureAlpha().toBuffer(), left, top },
  ];
};

await sharp({
  create: { width: SHEET.w, height: SHEET.h, channels: 3, background: '#e9edf2' },
})
  .composite([
    ...(await withShadow(frontBuf, 130, 150)),
    ...(await withShadow(backBuf, 1220, 150)),
  ])
  .png()
  .toFile(path.join(OUT, 'business-card-presentation.png'));

// ── 4. Independent QR decode verification (jsQR in a real browser) ───────────
const verifyPage = await (await browser.newContext()).newPage();
try {
  await verifyPage.addScriptTag({ url: 'https://unpkg.com/jsqr@1.4.0/dist/jsQR.js' });
  const decode = async (pngBuffer) =>
    verifyPage.evaluate(async (dataUrl) => {
      const img = new Image();
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = dataUrl;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      const d = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
      const result = window.jsQR(d.data, canvas.width, canvas.height);
      return result ? result.data : null;
    }, `data:image/png;base64,${pngBuffer.toString('base64')}`);

  const qrPng = fs.readFileSync(path.join(OUT, 'qr-website-print.png'));
  const qrSvgRendered = await sharp(path.join(OUT, 'qr-website.svg')).resize({ width: 600 }).png().toBuffer();
  const decodedPng = await decode(qrPng);
  const decodedSvg = await decode(qrSvgRendered);
  const qrOk = decodedPng === SITE_URL && decodedSvg === SITE_URL;
  console.log(`QR decode (print PNG): ${decodedPng === SITE_URL ? 'EXACT MATCH' : `MISMATCH: ${decodedPng}`}`);
  console.log(`QR decode (SVG render): ${decodedSvg === SITE_URL ? 'EXACT MATCH' : `MISMATCH: ${decodedSvg}`}`);
  if (!qrOk) process.exitCode = 1;
} finally {
  await browser.close();
}

// ── 5. Summary ───────────────────────────────────────────────────────────────
const report = async (file) => {
  const m = await sharp(path.join(OUT, file)).metadata();
  const kb = Math.round(fs.statSync(path.join(OUT, file)).size / 1024);
  console.log(`${file} — ${m.width}×${m.height} px (${kb} KB)`);
};
console.log(`fonts loaded in renderer: ${fontsOk ? 'yes' : 'NO — fallback used!'}`);
for (const f of [
  'business-card-front-bleed-300dpi.png',
  'business-card-back-bleed-300dpi.png',
  'business-card-front-trim-300dpi.png',
  'business-card-back-trim-300dpi.png',
  'business-card-presentation.png',
]) {
  await report(f);
}
console.log(`business-card-print.pdf — ${Math.round(fs.statSync(path.join(OUT, 'business-card-print.pdf')).size / 1024)} KB`);
console.log('DONE');
