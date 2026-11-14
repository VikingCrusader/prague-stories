// Puts the "Praguedex" wordmark on the card back (2026-11-14, user's call:
// the space under the emblem looked empty).
//   in:  brand-src/card-back-plain.webp  the back without text (keep it)
//        public/brand/splash-wordmark.webp  from scripts/generateSplash.mjs
//   out: public/brand/card-back.webp
// Run from client/ after generateSplash.mjs: node scripts/stampCardBack.mjs
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plain = path.join(root, 'brand-src', 'card-back-plain.webp');
const wordmark = path.join(root, 'public', 'brand', 'splash-wordmark.webp');
const out = path.join(root, 'public', 'brand', 'card-back.webp');

const WIDTH = 290;      // between the bottom scrollwork on either side
const CENTER_Y = 812;   // in the band between the emblem and the bottom ornament

sharp.cache(false);
const { width: W } = await sharp(plain).metadata();
const mark = await sharp(wordmark).resize({ width: WIDTH }).png().toBuffer();
const { height: h } = await sharp(mark).metadata();
// A soft dark shadow so the gold reads on the navy like the emblem does.
const shadow = await sharp(mark)
  .ensureAlpha()
  .linear([0, 0, 0, 0.75], [0, 0, 0, 0])
  .blur(3)
  .png()
  .toBuffer();
const left = Math.round((W - WIDTH) / 2);
const top = Math.round(CENTER_Y - h / 2);
await sharp(plain)
  .composite([
    { input: shadow, left, top: top + 3 },
    { input: mark, left, top },
  ])
  .webp({ quality: 90 })
  .toFile(out);
console.log('✓', path.relative(root, out));
