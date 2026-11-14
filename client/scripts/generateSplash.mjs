// Builds the launch-screen images (2026-11-12):
//   public/brand/splash-emblem.webp    the emblem at 400 px, for the boot splash
//   public/brand/splash-wordmark.webp  "Praguedex" in gold blackletter,
//                                      used by the boot splash in index.html
//                                      (an image, so the font can't flash in late)
//   public/brand/splash/*.png          iOS apple-touch-startup-image files, one
//                                      per device size (the <link> tags in
//                                      index.html must list the same sizes)
// iOS shows a white screen while an installed web app starts unless it gets a
// startup image of exactly the device's pixel size. Android builds its own
// splash from manifest.json (background_color + icon + name).
//
// Run from client/: node scripts/generateSplash.mjs  (needs network for the
// Google font and Playwright's Chromium). Rerun only if the design changes.
import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');
const outDir = path.join(pub, 'brand', 'splash');
fs.mkdirSync(outDir, { recursive: true });

// Portrait CSS width x height and pixel ratio of each device class.
export const SPLASH_DEVICES = [
  [440, 956, 3], [430, 932, 3], [428, 926, 3], [414, 896, 3], [414, 896, 2],
  [402, 874, 3], [393, 852, 3], [390, 844, 3], [375, 812, 3], [414, 736, 3],
  [375, 667, 2], [1024, 1366, 2], [834, 1194, 2], [820, 1180, 2], [810, 1080, 2],
  [768, 1024, 2], [744, 1133, 2],
];

const emblem = 'data:image/webp;base64,' +
  fs.readFileSync(path.join(pub, 'pixel-art', 'pack-emblem.webp')).toString('base64');

sharp.cache(false);
await sharp(path.join(pub, 'pixel-art', 'pack-emblem.webp')).resize({ width: 400 }).webp({ quality: 88 })
  .toFile(path.join(pub, 'brand', 'splash-emblem.webp'));

const browser = await chromium.launch();

// 1. The wordmark, transparent, rendered large and then scaled down.
{
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  await page.setContent(`<!doctype html><html><head>
    <link href="https://fonts.googleapis.com/css2?family=Manufacturing+Consent&display=block" rel="stylesheet">
    <style>
      html, body { margin: 0; background: transparent; }
      #w { display: inline-block; padding: 10px 24px 22px; font: 140px/1.15 "Manufacturing Consent", serif;
        background: linear-gradient(180deg, #f6e2a8 0%, #e2bd6c 45%, #b5843a 100%);
        -webkit-background-clip: text; background-clip: text; color: transparent; white-space: nowrap; }
    </style></head><body><span id="w">Praguedex</span></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const png = await page.locator('#w').screenshot({ omitBackground: true });
  await sharp(png).trim().resize({ width: 900 }).webp({ quality: 92 })
    .toFile(path.join(pub, 'brand', 'splash-wordmark.webp'));
  await page.close();
}
const wordmark = 'data:image/webp;base64,' +
  fs.readFileSync(path.join(pub, 'brand', 'splash-wordmark.webp')).toString('base64');

// 2. One startup image per device, drawn with the same layout as index.html.
const splashHtml = `<!doctype html><html><head><style>
  html, body { margin: 0; height: 100%; }
  body { background: radial-gradient(circle at 50% 44%, #1d2348 0%, #111428 62%);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4vh; }
  .e { width: min(52vw, 40vh, 340px); }
  .w { width: min(66vw, 46vh, 440px); }
</style></head><body><img class="e" src="${emblem}"><img class="w" src="${wordmark}"></body></html>`;

for (const [w, h, dpr] of SPLASH_DEVICES) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr });
  await page.setContent(splashHtml);
  await page.waitForTimeout(100);
  const file = path.join(outDir, `splash-${w * dpr}x${h * dpr}.png`);
  const png = await page.screenshot();
  await sharp(png).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(file);
  await page.close();
  console.log('✓', path.relative(root, file));
}

await browser.close();
