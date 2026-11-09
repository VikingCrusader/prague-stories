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

// The lines to draw on a map, as [lat, lng] points: the city's outline (ČÚZK's own,
// pragueCity.json) and the district lines, each edge once. An edge only one district
// uses is either on the city's boundary, which the outline already draws, or beside
// a sliver left by the simplifying (see NUDGE below), which is a district line.
const NEAR_CITY_LINE = 0.0003; // degrees, about 25 m
const LNG_SCALE = Math.cos((50.07 * Math.PI) / 180);

function distanceToSegment([x, y], [a, b]) {
  const ax = a[0] * LNG_SCALE, ay = a[1], dx = b[0] * LNG_SCALE - ax, dy = b[1] - ay;
  const px = x * LNG_SCALE - ax, py = y - ay;
  const t = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - t * dx, py - t * dy);
}

export function boundaryLines(data, city) {
  const citySegments = city.rings.flatMap(ring => ring.map((p, i) => [p, ring[(i + 1) % ring.length]]));
  const onCityLine = ([p, q]) => {
    const middle = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    return citySegments.some(s => distanceToSegment(middle, s) < NEAR_CITY_LINE);
  };
  const edges = new Map();
  for (const district of data.districts) {
    for (const ring of district.rings) {
      for (let i = 0; i < ring.length; i += 1) {
        const a = ring[i], b = ring[(i + 1) % ring.length];
        const [p, q] = a.join() < b.join() ? [a, b] : [b, a];
        const key = `${p.join()}|${q.join()}`;
        const edge = edges.get(key) ?? { ends: [p, q], uses: 0 };
        edge.uses += 1;
        edges.set(key, edge);
      }
    }
  }
  const toLatLng = ([lng, lat]) => [lat, lng];
  return {
    city: city.rings.map(ring => [...ring, ring[0]].map(toLatLng)),
    districts: [...edges.values()]
      .filter(e => e.uses > 1 || !onCityLine(e.ends))
      .map(e => e.ends.map(toLatLng)),
  };
}

// A chosen quarter's boundary as [lat, lng] segments. Chosen within a district,
// only what lies inside that district, like the filter.
export function quarterLines(data, quarterName, districtName) {
  const quarter = data.quarters.find(q => q.name === quarterName);
  if (!quarter) return [];
  const district = districtName && data.districts.find(d => d.name === districtName);
  return quarter.rings.flatMap(ring => ring.flatMap((p, i) => {
    const q = ring[(i + 1) % ring.length];
    if (district && !inRings(district.rings, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2)) return [];
    return [[[p[1], p[0]], [q[1], q[0]]]];
  }));
}

// The districts a quarter really lies in: those holding at least `minShare` of it,
// so a sliver over a border doesn't count.
export function quarterSpread(data, quarterName, minShare = 0.05) {
  const quarter = data.quarters.find(q => q.name === quarterName);
  if (!quarter) return [];
  const box = rings => {
    const pts = rings.flat();
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    return { w: Math.min(...xs), e: Math.max(...xs), s: Math.min(...ys), n: Math.max(...ys) };
  };
  const q = box(quarter.rings);
  const parts = data.districts
    .filter(d => { const b = box(d.rings); return b.w <= q.e && b.e >= q.w && b.s <= q.n && b.n >= q.s; })
    .map(d => ({ district: d.name, area: quartersInDistrict(data, d.name).find(p => p.name === quarterName)?.area ?? 0 }));
  const total = parts.reduce((sum, p) => sum + p.area, 0);
  return parts.filter(p => total && p.area / total >= minShare).map(p => p.district);
}

let loadingCity = null;
export function loadPragueCity() {
  if (!loadingCity) loadingCity = import('./pragueCity.json').then(m => m.default);
  return loadingCity;
}

// The quarters a district is made of, each only as far as it lies inside the
// district (quarters reach over district lines), found by sampling a grid:
// { name, share, center: [lng, lat], width (of lng), bounds: [[s, w], [n, e]] }.
const GRID = 140;
const inDistrictCache = new Map();
export function quartersInDistrict(data, districtName) {
  if (inDistrictCache.has(districtName)) return inDistrictCache.get(districtName);
  const district = data.districts.find(d => d.name === districtName);
  if (!district) return [];
  const box = rings => {
    const pts = rings.flat();
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    return { w: Math.min(...xs), e: Math.max(...xs), s: Math.min(...ys), n: Math.max(...ys) };
  };
  const d = box(district.rings);
  const nearby = data.quarters
    .map(q => ({ q, b: box(q.rings) }))
    .filter(({ b }) => b.w <= d.e && b.e >= d.w && b.s <= d.n && b.n >= d.s);
  const dx = (d.e - d.w) / GRID, dy = (d.n - d.s) / GRID;
  const hits = new Map();
  let total = 0;
  for (let i = 0; i < GRID; i += 1) {
    for (let j = 0; j < GRID; j += 1) {
      const lng = d.w + (i + 0.5) * dx, lat = d.s + (j + 0.5) * dy;
      if (!inRings(district.rings, lng, lat)) continue;
      total += 1;
      const found = nearby.find(({ q, b }) => lng >= b.w && lng <= b.e && lat >= b.s && lat <= b.n && inRings(q.rings, lng, lat));
      if (!found) continue;
      const h = hits.get(found.q.name) ?? { count: 0, sx: 0, sy: 0, w: lng, e: lng, s: lat, n: lat, rings: found.q.rings };
      h.count += 1; h.sx += lng; h.sy += lat;
      h.w = Math.min(h.w, lng); h.e = Math.max(h.e, lng);
      h.s = Math.min(h.s, lat); h.n = Math.max(h.n, lat);
      hits.set(found.q.name, h);
    }
  }
  const list = [...hits].map(([name, h]) => ({
    name,
    rings: h.rings,
    share: h.count / total,
    area: h.count * dx * dy,
    center: [h.sx / h.count, h.sy / h.count],
    width: h.e - h.w + dx,
    bounds: [[h.s - dy / 2, h.w - dx / 2], [h.n + dy / 2, h.e + dx / 2]],
  }));
  inDistrictCache.set(districtName, list);
  return list;
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
