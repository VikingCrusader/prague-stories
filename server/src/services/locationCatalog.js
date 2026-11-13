import Location from '../models/Location.js';
import { BIG_BATCH } from '../utils/dbBatch.js';

// Every card without its story, kept in memory (2026-11-13). The profile,
// achievement and pack code used to ask the database for card totals,
// district and quarter counts, the pack cards and, through populate, the card
// behind each check-in: several round trips per request, ~100 ms each from
// far away. Cards change rarely, so they are read once and reused until the
// collection changes. "Changed" is checked on each use with one tiny
// aggregate (count + newest updatedAt, as historyController does), so an edit,
// a seed or a sync shows up on the very next request. A raw driver write that
// doesn't touch updatedAt would not; Mongoose writes do (timestamps: true).
//
// The objects are shared between requests: read them, never change them.

// What any caller needs of a card; the story (description) is left out.
export const CATALOG_FIELDS = 'slug name localizedNames labels addedBy quarter district xpReward rarity coordinates coverImage pixelArtKey';

let cache = null;   // { version, ... }
let loading = null; // { version, promise }

async function catalogVersion() {
  const [r] = await Location.aggregate([
    { $group: { _id: null, n: { $sum: 1 }, latest: { $max: '$updatedAt' } } },
  ]);
  return `${r?.n ?? 0}@${r?.latest?.getTime?.() ?? 0}`;
}

function build(version, docs) {
  const byId = new Map(docs.map(d => [String(d._id), d]));
  const bySlug = new Map(docs.map(d => [d.slug, d]));
  const count = (keep) => docs.reduce((n, d) => n + (keep(d) ? 1 : 0), 0);
  const tally = (keyOf) => {
    const out = new Map();
    for (const d of docs) {
      const k = keyOf(d);
      if (k != null) out.set(k, (out.get(k) || 0) + 1);
    }
    return out;
  };
  const isPrahaN = d => typeof d.district === 'string' && /^Praha \d+$/.test(d.district);
  const has = label => d => (d.labels || []).includes(label);
  const slugsWhere = keep => docs.filter(keep).map(d => d.slug).sort();
  return {
    version,
    docs,
    byId,
    bySlug,
    total: docs.length,
    cityTotal: count(d => !has('outside')(d)),
    landmarkTotal: count(has('landmark')),
    // Per správní obvod (Praha 1–22), and per katastrální území: every card
    // with a quarter, and only those also in a Praha N district.
    districtTotals: tally(d => (isPrahaN(d) ? d.district : null)),
    quarterTotals: tally(d => (typeof d.quarter === 'string' ? d.quarter : null)),
    cityQuarterTotals: tally(d => (typeof d.quarter === 'string' && isPrahaN(d) ? d.quarter : null)),
    legendSlugs: slugsWhere(d => d.rarity === 'legend'),
    embassySlugs: slugsWhere(has('embassy')),
    addedBy: userId => count(d => d.addedBy != null && String(d.addedBy) === String(userId)),
  };
}

// Calls made together (the stats and the packs in one request) share one check.
let checking = null;
function currentVersion() {
  if (!checking) checking = catalogVersion().finally(() => { checking = null; });
  return checking;
}

export async function locationCatalog() {
  const version = await currentVersion();
  if (cache?.version === version) return cache;
  if (loading?.version !== version) {
    const promise = Location.find({}, CATALOG_FIELDS).batchSize(BIG_BATCH).lean()
      .then(docs => {
        const built = build(version, docs);
        // A newer load may have finished first; keep the newest.
        if (!cache || loading?.version === version) cache = built;
        return built;
      })
      .finally(() => { if (loading?.version === version) loading = null; });
    loading = { version, promise };
  }
  return loading.promise;
}

// The card behind each check-in, like populate('location') but from memory.
// A check-in whose card was deleted gets location null, as populate gives.
export function withLocations(checkins, catalog) {
  return checkins.map(ci => ({ ...ci, location: catalog.byId.get(String(ci.location)) ?? null }));
}

// Test hook, like clearHistoryCache: a test's DB reset could otherwise give
// the same count/updatedAt stamp as the data cached before it.
export function clearLocationCatalog() {
  cache = null;
  loading = null;
}
