/**
 * Records the pixel size of every image in client/public/history/ into
 * src/utils/historyImageSizes.json ("/history/<file>" -> [width, height]).
 *
 * History Timeline images load lazily, so HistoryEventSection sets width and
 * height on each <img> from this file to reserve its space up front. Without
 * that, images above a sidebar jump target would load mid-scroll, grow from
 * zero height and push the target section out of place.
 *
 * Runs automatically before `npm run dev` and `npm run build`.
 * Run manually: node scripts/generateHistoryImageSizes.mjs   (from client/)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HISTORY_DIR = path.resolve(__dirname, '../public/history');
const OUT_FILE = path.resolve(__dirname, '../src/utils/historyImageSizes.json');

const IMAGE_RE = /\.(webp|jpg|jpeg|png)$/i;

async function run() {
  const previous = fs.existsSync(OUT_FILE) ? JSON.parse(fs.readFileSync(OUT_FILE, 'utf8')) : {};
  const files = fs.readdirSync(HISTORY_DIR).filter(f => IMAGE_RE.test(f)).sort();

  const sizes = {};
  for (const file of files) {
    const key = `/history/${file}`;
    const { width, height } = await sharp(path.join(HISTORY_DIR, file)).metadata();
    sizes[key] = [width, height];
  }

  const json = JSON.stringify(sizes, null, 2) + '\n';
  if (json !== JSON.stringify(previous, null, 2) + '\n') fs.writeFileSync(OUT_FILE, json, 'utf8');
  console.log(`✓ ${files.length} history image size(s) -> ${path.relative(process.cwd(), OUT_FILE)}`);
}

run();
