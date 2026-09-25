import HistoryEvent from '../models/HistoryEvent.js';
import Location from '../models/Location.js';
import CheckIn from '../models/CheckIn.js';
import { HISTORY_ERAS } from '../data/historyEras.js';

// Single read endpoint for the whole History Timeline: the era roster (all
// six, including the five not seeded yet) plus every HistoryEvent, sorted
// for the scrub. Unlike GET /api/locations, this doesn't split list/detail —
// event copy is a few short hand-written sentences, not a heavy lazily
// generated description, so there's nothing worth deferring.
//
// relatedLandmarks are stored as bare slugs on the event; here they're
// resolved against the live locations collection in one batched query and
// enriched with everything LocationCard needs to render the exact same
// mystery/revealed card Explore uses (name, localizedNames, coordinates,
// rarity, labels, pixelArtKey, coverImage, xpReward, unlocked) — the History
// page renders these landmarks with that real component, not a bespoke
// chip. `unlocked` is computed the same way getLocations does it: false for
// a guest, true when the authenticated user (via optionalAuth) already has
// a CheckIn against it. A slug that doesn't resolve to a real Location is
// dropped rather than sent to the client as a dead link.
//
// The payload is mostly trilingual prose (~2.5 MB with every language), so the
// client passes `?lang=` and gets only that language: every `{ en, cz, zh }`
// object is collapsed to `{ [lang]: value }`, pre-applying the frontend's own
// `x[lang] || x.en` fallback. Without `lang`, all languages are returned.
const LANGS = ['en', 'cz', 'zh'];

// Only the fields LocationCard renders; LocationDetail fetches the full doc
// by slug when a card is opened.
const LANDMARK_FIELDS = 'slug name localizedNames labels pixelArtKey rarity xpReward coverImage coordinates';

function isLocalized(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.includes('en') && keys.every(k => LANGS.includes(k));
}

function pickLang(value, lang) {
  if (lang === 'all') return value;
  if (isLocalized(value)) return { [lang]: value[lang] || value.en };
  if (Array.isArray(value)) return value.map(v => pickLang(v, lang));
  if (value && typeof value === 'object' && value.constructor === Object) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, pickLang(v, lang)]));
  }
  return value;
}

// Every request used to pull all events (~2.5 MB of trilingual prose) from
// Atlas, which alone took most of a second. The assembled payload is now kept
// in memory, per language, and reused until the data changes. "Changed" is
// checked on each request with two tiny aggregates (document count + newest
// updatedAt, for events and locations), so a seed-script or updateOne sync
// shows up on the very next request. Per-user `unlocked` flags are applied
// on top of the cached payload.
let cache = { version: null, byLang: new Map() };

async function dataVersion() {
  const stamp = model => model.aggregate([
    { $group: { _id: null, n: { $sum: 1 }, latest: { $max: '$updatedAt' } } },
  ]).then(([r]) => `${r?.n ?? 0}@${r?.latest?.getTime?.() ?? 0}`);
  const [events, locations] = await Promise.all([stamp(HistoryEvent), stamp(Location)]);
  return `${events}|${locations}`;
}

async function buildPayload() {
  const events = await HistoryEvent.find().sort({ startYear: 1 }).lean();

  const allSlugs = [...new Set(events.flatMap(e => e.relatedLandmarks.map(r => r.slug)))];
  const locations = await Location.find(
    { slug: { $in: allSlugs } },
    LANDMARK_FIELDS
  ).lean();
  const locationBySlug = new Map(locations.map(loc => [loc.slug, { ...loc, unlocked: false }]));

  const enrichedEvents = events.map(event => ({
    ...event,
    relatedLandmarks: event.relatedLandmarks
      .filter(r => locationBySlug.has(r.slug))
      .map(r => ({ relation: r.relation, landmark: locationBySlug.get(r.slug) })),
  }));

  // Round-trip through JSON so ObjectIds/Dates become plain values, which
  // pickLang (and the cache) can treat as ordinary data.
  return JSON.parse(JSON.stringify({ eras: HISTORY_ERAS, events: enrichedEvents }));
}

async function getCachedPayload(lang) {
  const version = await dataVersion();
  if (version !== cache.version) {
    cache = { version, byLang: new Map([['all', await buildPayload()]]) };
  }
  if (!cache.byLang.has(lang)) cache.byLang.set(lang, pickLang(cache.byLang.get('all'), lang));
  return cache.byLang.get(lang);
}

// Test hook: the in-memory cache would otherwise outlive a test's DB reset
// whenever two tests happen to produce the same count/updatedAt stamp.
export function clearHistoryCache() {
  cache = { version: null, byLang: new Map() };
}

export async function getHistoryEvents(req, res, next) {
  try {
    const lang = LANGS.includes(req.query.lang) ? req.query.lang : 'all';
    const payload = await getCachedPayload(lang);

    let body = payload;
    if (req.user) {
      const checkins = await CheckIn.find({ user: req.user._id }).select('location').lean();
      const checkedIn = new Set(checkins.map(c => c.location.toString()));
      if (checkedIn.size > 0) {
        body = {
          ...payload,
          events: payload.events.map(event => ({
            ...event,
            relatedLandmarks: event.relatedLandmarks.map(r => (
              checkedIn.has(r.landmark._id)
                ? { ...r, landmark: { ...r.landmark, unlocked: true } }
                : r
            )),
          })),
        };
      }
    }

    // Short private cache: lets a reload render from the browser cache while
    // the next request revalidates. Private because `unlocked` is per-user.
    res.set('Cache-Control', 'private, max-age=60, stale-while-revalidate=86400');
    res.json(body);
  } catch (err) {
    next(err);
  }
}
