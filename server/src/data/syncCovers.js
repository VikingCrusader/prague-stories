/**
 * Downloads Cloudinary cover images down into client/public/pixel-art/, so
 * the local-first cover loader (see CLAUDE.md) has an up-to-date copy.
 *
 * Two modes:
 *   node src/data/syncCovers.js            fills in local files that are
 *                                           missing entirely (skips any slug
 *                                           that already has a local file,
 *                                           however stale)
 *   node src/data/syncCovers.js --refresh   re-downloads the CURRENT
 *                                           Cloudinary image for every
 *                                           location that has one, replacing
 *                                           whatever local file(s) already
 *                                           exist for that slug — use this
 *                                           after editing covers through the
 *                                           app, since local always wins over
 *                                           Cloudinary once a manifest entry
 *                                           exists
 *
 * Either mode writes `<slug>-v<timestamp>.webp`, the same cache-busting
 * naming convention the dev-mode upload endpoint uses. Run
 * `npm run generate:covers` (client/) afterward to rebuild the manifest.
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PIXEL_ART_DIR = path.resolve(__dirname, '../../../client/public/pixel-art');
const REFRESH = process.argv.includes('--refresh');

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Matches `<slug>.<ext>` or `<slug>-v<timestamp>.<ext>` for this exact slug
// only (not slugs that merely start with the same characters).
function localFilesFor(slug) {
  const re = new RegExp(`^${escapeRegExp(slug)}(-v\\d{9,})?\\.(webp|jpg|jpeg|png)$`, 'i');
  return fs.readdirSync(PIXEL_ART_DIR).filter(f => re.test(f));
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', err => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  await connectDB();

  const locations = await Location.find({
    coverImage: { $regex: 'cloudinary\\.com' },
  }).lean();

  console.log(`Found ${locations.length} location(s) with Cloudinary covers. Mode: ${REFRESH ? 'refresh (overwrite existing)' : 'fill gaps only'}\n`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const loc of locations) {
    const existing = localFilesFor(loc.slug);

    if (existing.length && !REFRESH) {
      console.log(`  skip  ${loc.slug}  (${existing[0]} already exists)`);
      skipped++;
      continue;
    }

    const dest = path.join(PIXEL_ART_DIR, `${loc.slug}-v${Date.now()}.webp`);
    process.stdout.write(`  dl    ${loc.slug} ... `);
    try {
      await download(loc.coverImage, dest);
      // Remove older local file(s) for this slug so generate:covers doesn't
      // just fall back to picking the new one by version — no stale files
      // left lingering in the folder either.
      for (const f of existing) {
        if (path.join(PIXEL_ART_DIR, f) !== dest) fs.unlinkSync(path.join(PIXEL_ART_DIR, f));
      }
      console.log('done');
      downloaded++;
    } catch (err) {
      console.log(`FAILED — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${downloaded} downloaded, ${skipped} skipped, ${failed} failed.`);
  console.log('Now run `npm run generate:covers` from client/ to rebuild the manifest.');
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => { console.error(err); process.exit(1); });
