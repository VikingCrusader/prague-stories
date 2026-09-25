/**
 * Scans client/public/pixel-art/ and builds a slug -> filename manifest so the
 * frontend can load cover images from the local folder instead of Cloudinary.
 *
 * Files are expected as either `<slug>.<ext>` or `<slug>-v<timestamp>.<ext>`
 * (the versioned form is what cover uploads and externally-generated pixel
 * art both use, as a cache-buster when art gets regenerated for the same
 * location). When multiple files exist for the same slug, the highest
 * version wins.
 *
 * It also writes a small card-sized copy of each mapped cover to
 * public/pixel-art/thumbs/ (same filename). Originals are 1024–2048px, but a
 * grid card shows them at ~180–300 CSS px, so loading originals made mobile
 * Explore download megabytes of images on every visit. Existing thumbs are
 * reused; thumbs whose original is no longer mapped are deleted.
 *
 * Run: npm run generate:covers   (from client/)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PIXEL_ART_DIR = path.resolve(__dirname, '../public/pixel-art');
const THUMB_DIR = path.resolve(PIXEL_ART_DIR, 'thumbs');
const THUMB_WIDTH = 480;
const OUT_FILE = path.resolve(__dirname, '../src/utils/coverManifest.json');

const EXT_RE = /\.(webp|jpg|jpeg|png)$/i;
const VERSIONED_RE = /^(.+)-v(\d{9,})$/;

async function run() {
  const files = fs.readdirSync(PIXEL_ART_DIR).filter(f => EXT_RE.test(f));

  const manifest = {};
  const bestVersion = {};

  for (const file of files) {
    const base = file.replace(EXT_RE, '');
    const versionMatch = base.match(VERSIONED_RE);
    const slug = versionMatch ? versionMatch[1] : base;
    const version = versionMatch ? Number(versionMatch[2]) : 0;

    if (!(slug in bestVersion) || version > bestVersion[slug]) {
      bestVersion[slug] = version;
      manifest[slug] = file;
    }
  }

  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))
  );

  fs.writeFileSync(OUT_FILE, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
  console.log(`✓ ${Object.keys(sorted).length} cover(s) mapped -> ${path.relative(process.cwd(), OUT_FILE)}`);

  await generateThumbs(new Set(Object.values(sorted)));
}

async function generateThumbs(wanted) {
  fs.mkdirSync(THUMB_DIR, { recursive: true });

  let removed = 0;
  for (const file of fs.readdirSync(THUMB_DIR)) {
    if (!wanted.has(file)) { fs.unlinkSync(path.join(THUMB_DIR, file)); removed++; }
  }

  let created = 0;
  for (const file of wanted) {
    const out = path.join(THUMB_DIR, file);
    if (fs.existsSync(out)) continue;
    const img = sharp(path.join(PIXEL_ART_DIR, file)).resize({ width: THUMB_WIDTH, withoutEnlargement: true });
    if (/\.webp$/i.test(file)) await img.webp({ quality: 80 }).toFile(out);
    else await img.jpeg({ quality: 80, mozjpeg: true }).toFile(out);
    created++;
  }
  console.log(`✓ thumbs: ${created} created, ${removed} removed -> ${path.relative(process.cwd(), THUMB_DIR)}`);
}

run();
