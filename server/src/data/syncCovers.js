/**
 * Downloads any Cloudinary cover images that are missing from the local
 * client/public/pixel-art/ folder.
 *
 * Run: npm run sync:covers
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

  console.log(`Found ${locations.length} location(s) with Cloudinary covers.\n`);

  let downloaded = 0;
  let skipped = 0;

  for (const loc of locations) {
    const existing = fs.readdirSync(PIXEL_ART_DIR)
      .find(f => f.startsWith(loc.slug));

    if (existing) {
      console.log(`  skip  ${loc.slug}  (${existing} already exists)`);
      skipped++;
      continue;
    }

    const dest = path.join(PIXEL_ART_DIR, `${loc.slug}-v${Date.now()}.webp`);
    process.stdout.write(`  dl    ${loc.slug} ... `);
    try {
      await download(loc.coverImage, dest);
      console.log('done');
      downloaded++;
    } catch (err) {
      console.log(`FAILED — ${err.message}`);
    }
  }

  console.log(`\nDone. ${downloaded} downloaded, ${skipped} skipped.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
