import { locationAPI } from '../services/api';

// One place that fetches a card's full detail (GET /api/locations/:slug), shared
// by the detail views and the hover preview, so a card hovered or pressed just
// before it opens is fetched once. The last answer is kept for the visit and
// shown at once the next time; a request younger than FRESH_MS is reused,
// anything older is fetched again. Keyed by the signed-in token as well, since
// the story and the collected state differ per player.
const FRESH_MS = 30000;
const cached = new Map(); // key -> the last full card
const requests = new Map(); // key -> { promise, at }

const keyOf = (slug) => {
  let token = '';
  try { token = localStorage.getItem('token') || ''; } catch { /* no storage */ }
  return `${slug}|${token}`;
};

export const peekLocation = (slug) => cached.get(keyOf(slug)) ?? null;

export function loadLocation(slug, { fresh = false } = {}) {
  const key = keyOf(slug);
  const running = requests.get(key);
  if (!fresh && running && Date.now() - running.at < FRESH_MS) return running.promise;
  const entry = { at: Date.now() };
  entry.promise = locationAPI.getOne(slug).then(
    (res) => {
      cached.set(key, res.data);
      return res.data;
    },
    (err) => {
      if (requests.get(key) === entry) requests.delete(key); // try again next time
      throw err;
    },
  );
  requests.set(key, entry);
  return entry.promise;
}

// Start the request early (a mouse press on a card); errors wait for the real load.
export function prefetchLocation(slug) {
  loadLocation(slug).catch(() => {});
}

// After an edit: the kept copy is out of date.
export function forgetLocation(slug) {
  const key = keyOf(slug);
  cached.delete(key);
  requests.delete(key);
}

// What a detail view can show before the request is back: the list's card
// (`preview`, no story) over whatever was kept from an earlier visit.
export function initialLocation(slug, preview) {
  const kept = peekLocation(slug);
  if (!preview || preview.slug !== slug) return kept;
  return { ...kept, ...preview, checkedInAt: preview._checkedInAt ?? kept?.checkedInAt };
}
