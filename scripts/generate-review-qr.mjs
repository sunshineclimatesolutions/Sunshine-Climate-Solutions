// Generates the Google-review QR from the EXACT destination URL using the
// established `qrcode` library, then verifies the generated codes by decoding
// them with jsQR (independent decoder) in a real browser.
// Outputs:
//   public/brand/qr-review.svg        (scalable, web + print)
//   public/brand/qr-review.png        (web, 560px)
//   public/brand/qr-review-print.png  (print, 3000px)
import QRCode from 'qrcode';
import { createRequire } from 'node:module';
const require = createRequire('C:/Websites/Sunshine-Climate-Solutions/scripts/photo.mjs');
const sharp = require('sharp');
import fs from 'node:fs';
import { chromium } from 'playwright';

const URL =
  'https://g.page/r/CTXPJRFuZT-tEAE/review?utm_source=gbp&utm_medium=reviews&utm_campaign=qr';
const OPTS = { errorCorrectionLevel: 'H', margin: 4, color: { dark: '#10263d', light: '#ffffff' } };

// 1. Generate.
await QRCode.toString(URL, { ...OPTS, type: 'svg' }).then((svg) =>
  fs.writeFileSync('public/brand/qr-review.svg', svg),
);
await QRCode.toFile('public/brand/qr-review.png', URL, { ...OPTS, type: 'png', width: 560 });
await QRCode.toFile('public/brand/qr-review-print.png', URL, { ...OPTS, type: 'png', width: 3000 });
for (const f of ['qr-review.svg', 'qr-review.png', 'qr-review-print.png']) {
  const m = await sharp(`public/brand/${f}`).metadata();
  console.log(`${f}: ${m.width}x${m.height} ${Math.round(fs.statSync(`public/brand/${f}`).size / 1024)} KB`);
}

// 2. Independent decode verification (jsQR via browser).
const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();
try {
  await page.addScriptTag({ url: 'https://unpkg.com/jsqr@1.4.0/dist/jsQR.js' });
  const decode = async (file) => {
    const b64 = fs.readFileSync(file).toString('base64');
    return await page.evaluate(async (dataUrl) => {
      const img = new Image();
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = dataUrl; });
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const result = window.jsQR(d.data, canvas.width, canvas.height);
      return result ? result.data : null;
    }, `data:image/png;base64,${b64}`);
  };

  let allOk = true;
  for (const f of ['public/brand/qr-review.png', 'public/brand/qr-review-print.png']) {
    const decoded = await decode(f);
    const ok = decoded === URL;
    allOk = allOk && ok;
    console.log(`decode ${f}: ${ok ? 'EXACT MATCH' : 'MISMATCH: ' + decoded}`);
  }
  // Decode the SVG too (rendered to PNG first).
  const svgPng = await sharp('public/brand/qr-review.svg').resize({ width: 560 }).png().toBuffer();
  const tmp = 'C:/Users/thoma/AppData/Local/Temp/opencode/qr-svg-render.png';
  fs.writeFileSync(tmp, svgPng);
  const decodedSvg = await decode(tmp);
  const okSvg = decodedSvg === URL;
  allOk = allOk && okSvg;
  console.log(`decode qr-review.svg (rendered): ${okSvg ? 'EXACT MATCH' : 'MISMATCH: ' + decodedSvg}`);
  console.log(allOk ? 'QR VERIFICATION: PASS — all generated assets resolve to the exact destination URL' : 'QR VERIFICATION: FAIL');
  process.exitCode = allOk ? 0 : 1;
} finally {
  await browser.close();
}
