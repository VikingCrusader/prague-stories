// Which Prague quarter (katastrální území) and district (správní obvod,
// "Praha N") a point lies in, from the boundaries in pragueAreas.json (built
// by scripts/buildPragueAreas.mjs from ČÚZK RÚIAN, the same source as
// Location.quarter/district). Runs on the device, so the user's position is
// never sent anywhere. The ~220 KB boundary file is loaded only on first use.

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

function areaExactly(data, lat, lng) {
  const quarter = data.quarters.find(q => inRings(q.rings, lng, lat))?.name;
  if (!quarter) return null;
  const district = data.districts.find(d => inRings(d.rings, lng, lat))?.name ?? null;
  return { quarter, district };
}

// Simplifying the boundaries leaves thin slivers between neighbours (a
// bridge over the Vltava fell into one), so a point in no quarter is retried
// ~30 m away in eight directions before counting as outside Prague.
const NUDGE = 0.0003;
const NUDGES = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

// { quarter: 'Holešovice', district: 'Praha 7' }, or null outside Prague.
export function areaIn(data, lat, lng) {
  const hit = areaExactly(data, lat, lng);
  if (hit) return hit;
  for (const [dy, dx] of NUDGES) {
    const near = areaExactly(data, lat + dy * NUDGE, lng + dx * NUDGE * 1.55);
    if (near) return near;
  }
  return null;
}

let loading = null;
export function loadPragueAreas() {
  if (!loading) loading = import('./pragueAreas.json').then(m => m.default);
  return loading;
}
