// Page data kept for the visit (2026-11-12): a page that was already loaded
// shows its figures at once when it is opened again, and refreshes in the
// background. Switching pages no longer waits on a spinner each time. Keys are
// per player, since the lists and figures differ between accounts and guests.
const kept = new Map();

export const pageCache = {
  get: (key) => kept.get(key),
  set: (key, value) => { kept.set(key, value); },
};

export const pageKey = (name, userId) => `${name}:${userId ?? 'guest'}`;
