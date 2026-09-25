// Remembers which History Timeline event the reader was on, so /history can
// reopen there. Everyone gets a localStorage copy; signed-in users also get a
// server copy (see HistoryPage), and whichever copy is newer wins.

const KEY = 'historyProgress';

export function loadLocalHistoryProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved && typeof saved.slug === 'string' ? saved : null;
  } catch {
    return null;
  }
}

export function saveLocalHistoryProgress(slug) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ slug, updatedAt: new Date().toISOString() }));
  } catch {
    // Storage unavailable (private mode, quota): progress just isn't kept.
  }
}

/** The newer of two `{ slug, updatedAt }` records (either may be null). */
export function newerHistoryProgress(a, b) {
  if (!a?.slug) return b?.slug ? b : null;
  if (!b?.slug) return a;
  return new Date(b.updatedAt) > new Date(a.updatedAt) ? b : a;
}
