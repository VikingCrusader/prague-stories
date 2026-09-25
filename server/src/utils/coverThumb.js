import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Must match client/scripts/generateCoverManifest.mjs, which produces the same
// thumbs for covers added any other way (and runs before every client build).
const THUMB_WIDTH = 480;

/**
 * Writes the card-sized copy of a local cover to <pixelArtDir>/thumbs/<filename>,
 * which grid cards load instead of the 1024–2048px original. `source` is the
 * image as a Buffer or a file path. Best-effort: a failure is logged, never
 * thrown, since cards fall back to the full-size file when a thumb is missing.
 */
export async function writeCoverThumb(pixelArtDir, filename, source) {
  try {
    const thumbDir = path.join(pixelArtDir, 'thumbs');
    await fs.promises.mkdir(thumbDir, { recursive: true });
    const img = sharp(source).resize({ width: THUMB_WIDTH, withoutEnlargement: true });
    const out = path.join(thumbDir, filename);
    if (/\.webp$/i.test(filename)) await img.webp({ quality: 80 }).toFile(out);
    else await img.jpeg({ quality: 80, mozjpeg: true }).toFile(out);
  } catch (err) {
    console.error(`Failed to write cover thumb for ${filename}:`, err.message);
  }
}

/** Removes the thumb for a local cover file, if any. */
export function removeCoverThumb(pixelArtDir, filename) {
  fs.unlink(path.join(pixelArtDir, 'thumbs', filename), () => {});
}
