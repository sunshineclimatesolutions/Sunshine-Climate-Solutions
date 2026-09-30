// Generates platform-ready square avatar exports from the APPROVED Logo 2
// light mark — same composition as public/brand/icon-512.png (navy #10263d
// background, light mark centered at ~62% width), at sizes the social
// platforms accept. These are COPIES/exports only: the approved logo geometry
// is untouched (see docs/marketing/SOCIAL-PROFILE-SETUP.md).
// Outputs:
//   public/brand/social-avatar-400.png   (small upload fields, e.g. LinkedIn min)
//   public/brand/social-avatar-1024.png  (master for profile pictures)
// Usage: node scripts/generate-social-avatars.mjs
import { createRequire } from 'node:module';
const require = createRequire('C:/Websites/Sunshine-Climate-Solutions/scripts/photo.mjs');
const sharp = require('sharp');
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.join('public', 'brand');
const SOURCE = 'brand-source/logo-light-full.png';
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const size of [400, 1024]) {
  const inset = Math.round(size * 0.19);
  const markWidth = size - inset * 2;
  const mark = await sharp(SOURCE).resize({ width: markWidth }).toBuffer();
  const m = await sharp(mark).metadata();
  const out = path.join(OUT_DIR, `social-avatar-${size}.png`);
  await sharp({ create: { width: size, height: size, channels: 4, background: '#10263d' } })
    .composite([
      {
        input: mark,
        left: Math.round((size - m.width) / 2),
        top: Math.round((size - m.height) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`${out}: ${m.width}x${m.height} mark on ${size}x${size} navy`);
}
