import coverManifest from './coverManifest.json';

// Local files are named <slug>-v<Date.now() in ms>.<ext>; Cloudinary URLs carry
// /upload/v<unix seconds>/. Both are upload timestamps, so they can be compared.
const LOCAL_VERSION_RE = /-v(\d{10,})\.[a-z0-9]+$/i;
const CLOUD_VERSION_RE = /\/upload\/v(\d+)\//;

/**
 * Local pixel-art cover for a location slug, if one has been synced into
 * client/public/pixel-art/ (see scripts/generateCoverManifest.mjs). Preferred
 * over Cloudinary's location.coverImage to keep image traffic off Cloudinary's
 * quota; Cloudinary remains the fallback for locations without a local copy.
 *
 * Pass the location's Cloudinary `coverImage` as the second argument so a cover
 * edited through the app (which only updates Cloudinary + the DB in production)
 * is not hidden by an older local file: when the Cloudinary upload is newer than
 * the local file, this returns null and callers fall through to Cloudinary.
 * Local files without a version timestamp can't be compared and always win.
 */
export function getLocalCoverPath(slug, cloudUrl) {
  const filename = coverManifest[slug];
  if (!filename) return null;

  if (cloudUrl) {
    const local = LOCAL_VERSION_RE.exec(filename);
    const cloud = CLOUD_VERSION_RE.exec(cloudUrl);
    if (local && cloud && Number(cloud[1]) * 1000 > Number(local[1])) return null;
  }

  return `/pixel-art/${filename}`;
}
