import coverManifest from './coverManifest.json';

/**
 * Local pixel-art cover for a location slug, if one has been synced into
 * client/public/pixel-art/ (see scripts/generateCoverManifest.mjs). Preferred
 * over Cloudinary's location.coverImage to keep image traffic off Cloudinary's
 * quota; Cloudinary remains the fallback for locations without a local copy.
 */
export function getLocalCoverPath(slug) {
  const filename = coverManifest[slug];
  return filename ? `/pixel-art/${filename}` : null;
}
