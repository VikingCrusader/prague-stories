import { haversineDistance } from './geolocation';

// What Explore and the Map both ask of a card pack.

// A pack belongs to every district and quarter its cards are in.
export function packInArea(pack, area) {
  if (!area) return true;
  if (area.kind === 'outside') return false;
  if (area.kind === 'district') return pack.districts.includes(area.value);
  return pack.quarters.includes(area.value) && (!area.district || pack.districts.includes(area.district));
}

export function packMatches(pack, search, labels) {
  const trimmed = search.trim();
  const q = trimmed.toLowerCase();
  const named = !trimmed || pack.name.toLowerCase().includes(q)
    || pack.localizedNames?.cz?.toLowerCase().includes(q) || pack.localizedNames?.zh?.includes(trimmed);
  return named && [...labels].every(label => (pack.labels || []).includes(label));
}

// A pack is as far away as the nearest of its cards (`_distance`, left off when unknown).
export function withPackDistance(packs, locations, userPos) {
  if (!userPos) return packs;
  const coordinatesOf = new Map(locations.map(l => [l.slug, l.coordinates]));
  return packs.map(pack => {
    const distances = (pack.memberSlugs || [])
      .map(slug => coordinatesOf.get(slug))
      .filter(Boolean)
      .map(c => haversineDistance(userPos.lat, userPos.lng, c.lat, c.lng));
    return distances.length ? { ...pack, _distance: Math.min(...distances) } : pack;
  });
}

export const nearestPackFirst = (a, b) => (a._distance ?? Infinity) - (b._distance ?? Infinity);
