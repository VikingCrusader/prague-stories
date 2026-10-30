import { readFileSync } from 'fs';

// Whether a point lies inside Prague's administrative boundary, from the 22
// správní obvody in data/pragueBoundary.json (ČÚZK RÚIAN, simplified ~15 m,
// written by client/scripts/buildPragueAreas.mjs alongside the client's own
// copy in client/src/utils/pragueAreas.json).
const { districts } = JSON.parse(readFileSync(new URL('../data/pragueBoundary.json', import.meta.url), 'utf8'));

// Even-odd ray casting over every ring, so holes (inner rings) count right.
function inRings(rings, lng, lat) {
  let inside = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i];
      const [xj, yj] = ring[j];
      if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
}

const inAnyDistrict = (lat, lng) => districts.some(rings => inRings(rings, lng, lat));

// The simplification leaves thin slivers between neighbouring districts, so
// a point in none is retried ~30 m away in eight directions (as the client's
// areaIn does) before counting as outside.
const NUDGE = 0.0003;
const NUDGES = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

export function inPrague(lat, lng) {
  if (inAnyDistrict(lat, lng)) return true;
  return NUDGES.some(([dy, dx]) => inAnyDistrict(lat + dy * NUDGE, lng + dx * NUDGE * 1.55));
}
