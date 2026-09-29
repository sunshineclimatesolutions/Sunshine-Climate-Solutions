// Brand-logo background normalization (September 2026 aesthetic overhaul).
//
// The owner-supplied manufacturer logos arrived with opaque backgrounds; some
// (Goodman, Lennox, Rheem) had a visible gray/white checkerboard baked into the
// pixels, and a previous pass flattened everything to opaque white. This script:
//   1. flood-fills light neutral background (white AND checkerboard gray cells)
//      from every border pixel, preserving interior whites (e.g., Goodman's
//      white lettering, Carrier's inner oval),
//   2. makes the reached background transparent,
//   3. trims to the visible content and adds a small transparent padding,
//   4. caps the longest edge at 360px.
//
// Geometry, colors, and proportions of the manufacturer marks are never
// altered — only the background is removed. Output is verified by re-reading
// the alpha channel (border pixels must be transparent, interior must remain).
//
// Usage: node scripts/normalize-brand-logos.mjs
import sharp from 'sharp';
import fs from 'node:fs';

const DIR = 'public/images';
const files = fs
  .readdirSync(DIR)
  .filter((f) => f.startsWith('brand-') && f.endsWith('.png'))
  .sort();

const LIGHT = 224; // neutral-light threshold (white 255 + checkerboard ~240)
const NEUTRAL_SPREAD = 16; // max channel spread for "neutral" pixels

let failures = 0;
for (const file of files) {
  const path = `${DIR}/${file}`;
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const isBackgroundCandidate = (i) => {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a === 0) return true;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return r >= LIGHT && g >= LIGHT && b >= LIGHT && max - min <= NEUTRAL_SPREAD;
  };

  // Flood fill from all border pixels through background candidates.
  const visited = new Uint8Array(width * height);
  const queue = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (visited[p]) return;
    const i = p * channels;
    if (!isBackgroundCandidate(i)) return;
    visited[p] = 1;
    queue.push(p);
  };
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  }
  while (queue.length > 0) {
    const p = queue.pop();
    const x = p % width;
    const y = (p / width) | 0;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  let removed = 0;
  for (let p = 0; p < width * height; p++) {
    if (visited[p]) {
      data[p * channels + 3] = 0;
      removed++;
    }
  }

  // Content bounding box from remaining opaque pixels.
  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * channels + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX <= minX || maxY <= minY) {
    console.log(`FAIL ${file}: no opaque content found after background removal`);
    failures++;
    continue;
  }
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const pad = Math.max(2, Math.round(Math.max(cw, ch) * 0.03));

  const tmp = `${path}.tmp.png`;
  await sharp(Buffer.from(data), { raw: { width, height, channels } })
    .extract({ left: minX, top: minY, width: cw, height: ch })
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toFile(tmp);

  const trimmed = await sharp(tmp).metadata();
  const scale = Math.min(1, 360 / Math.max(trimmed.width, trimmed.height));
  await sharp(tmp)
    .resize({
      width: Math.round(trimmed.width * scale),
      height: Math.round(trimmed.height * scale),
    })
    .png({ compressionLevel: 9 })
    .toFile(path);
  fs.rmSync(tmp);

  // Verify: border pixels transparent, some interior pixels opaque.
  const check = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const c = check.info.channels;
  const at = (x, y) => check.data[(y * check.info.width + x) * c + 3];
  const borderOpaque =
    at(0, 0) > 0 ||
    at(check.info.width - 1, 0) > 0 ||
    at(0, check.info.height - 1) > 0 ||
    at(check.info.width - 1, check.info.height - 1) > 0;
  let opaque = 0;
  for (let p = 0; p < check.info.width * check.info.height; p++) {
    if (check.data[p * c + 3] > 200) opaque++;
  }
  const ok = !borderOpaque && opaque > 50;
  if (!ok) failures++;
  const m = await sharp(path).metadata();
  console.log(
    `${ok ? 'OK  ' : 'FAIL'} ${file}: removed ${removed} bg px, content ${cw}x${ch} → final ${m.width}x${m.height}, opaque ${opaque}px (${Math.round(fs.statSync(path).size / 1024)} KB)`,
  );
}
console.log(failures === 0 ? 'ALL BRAND LOGOS NORMALIZED' : `${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
