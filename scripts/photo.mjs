// Photo guardrail tool — reports dimensions, file size, format, and warns about
// photos that are oversized or in the wrong format for the website. Can also
// downscale + re-encode oversized photos in place (only with --write).
//
// Zero extra dependencies: uses the `sharp` package Astro already bundles.
//
// Usage:
//   node scripts/photo.mjs <file-or-directory>          report + warnings
//   node scripts/photo.mjs <file> --resize 2000 --write downscale in place
//     (re-encodes as JPEG quality 82; use --jpeg-quality N to change)
//
// Warnings:
//   - any edge longer than 4000px  (downscale: --resize 2000 --write)
//   - file larger than 1 MB
//   - format outside JPEG/PNG/WebP (convert to JPEG first)
//
// Exit code: 0 = clean, 1 = warnings or failures (usable as a build gate).
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const MAX_EDGE = 4000;
const MAX_BYTES = 1024 * 1024;
const OK_FORMATS = new Set(['jpeg', 'png', 'webp']);

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const valueOf = (name) => {
  const i = args.indexOf(name);
  return i !== -1 ? Number(args[i + 1]) : undefined;
};
const maxWidth = valueOf('--resize');
const quality = valueOf('--jpeg-quality') ?? 82;
const write = flags.has('--write');

// First positional argument that is not a flag and not a flag value.
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    if (args[i] === '--resize' || args[i] === '--jpeg-quality') i++;
    continue;
  }
  if (i > 0 && (args[i - 1] === '--resize' || args[i - 1] === '--jpeg-quality')) continue;
  positional.push(args[i]);
}
const target = positional[0];

if (!target) {
  console.log('Usage: node scripts/photo.mjs <file-or-directory> [--resize <maxWidth> --jpeg-quality <N>] [--write]');
  process.exit(1);
}

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff', '.heic', '.heif']);
const collect = (t) => {
  const stat = fs.statSync(t);
  if (stat.isFile()) return [t];
  return fs
    .readdirSync(t, { recursive: true, withFileTypes: false })
    .map((f) => path.join(t, f))
    .filter((f) => fs.statSync(f).isFile() && IMAGE_EXT.has(path.extname(f).toLowerCase()));
};

const files = collect(target);
if (files.length === 0) {
  console.log('No image files found.');
  process.exit(1);
}

let warnings = 0;
let failures = 0;

for (const file of files) {
  const bytes = fs.statSync(file).size;
  const rel = path.relative(process.cwd(), file);
  try {
    const meta = await sharp(file).metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    const format = meta.format ?? 'unknown';
    const notes = [];
    if (Math.max(w, h) > MAX_EDGE) notes.push(`edge ${Math.max(w, h)}px > ${MAX_EDGE}px — downscale with --resize 2000 --write`);
    if (bytes > MAX_BYTES) notes.push(`${(bytes / 1024).toFixed(0)} KB > 1 MB — compress or downscale`);
    if (!OK_FORMATS.has(format)) notes.push(`format "${format}" — convert to JPEG (or PNG/WebP)`);
    const status = notes.length > 0 ? 'WARN' : 'ok';
    if (notes.length > 0) warnings++;
    console.log(
      `${status.padEnd(4)} ${rel}  ${w}x${h}  ${(bytes / 1024).toFixed(0)} KB  ${format}${notes.length ? '\n     - ' + notes.join('\n     - ') : ''}`,
    );

    if (maxWidth && write) {
      const tmp = file + '.tmp.jpg';
      await sharp(file)
        .rotate()
        .resize({ width: maxWidth, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality, mozjpeg: true })
        .toFile(tmp);
      fs.rmSync(file);
      fs.renameSync(tmp, file);
      const newBytes = fs.statSync(file).size;
      console.log(`     resized → ${Math.min(maxWidth, w)}px wide, JPEG q${quality}, ${(newBytes / 1024).toFixed(0)} KB (in place)`);
    } else if (maxWidth && !write) {
      console.log('     (dry run — add --write to resize in place)');
    }
  } catch (error) {
    failures++;
    console.log(`FAIL ${rel}  ${error.message}`);
  }
}

console.log(`\n${files.length} image(s): ${warnings} warning(s), ${failures} failure(s)`);
process.exit(warnings + failures > 0 ? 1 : 0);
