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
 * Run: npm run generate:covers   (from client/)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PIXEL_ART_DIR = path.resolve(__dirname, '../public/pixel-art');
const OUT_FILE = path.resolve(__dirname, '../src/utils/coverManifest.json');

const EXT_RE = /\.(webp|jpg|jpeg|png)$/i;
const VERSIONED_RE = /^(.+)-v(\d{9,})$/;

function run() {
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
}

run();
