// Helpers shared by the achievement list, its detail modal and the
// dashboard's rarest-achievements row.

// An achievement's text field in the current language (`name`, `flavor`,
// `description`), falling back to English.
export function achField(ach, field, lang) {
  const local = lang === 'zh' ? ach[`${field}_zh`] : lang === 'cz' ? ach[`${field}_cz`] : null;
  return local ?? ach[field] ?? '';
}

// 12.5 → "12.5", 50 → "50" ("12,5" in Czech).
export function formatPercent(n, lang) {
  const v = Math.round((n ?? 0) * 10) / 10;
  return v.toLocaleString(lang === 'cz' ? 'cs-CZ' : 'en-US', { maximumFractionDigits: 1 });
}

export function formatAchDate(d, lang) {
  if (!d) return '';
  const locale = lang === 'cz' ? 'cs-CZ' : lang === 'zh' ? 'zh-CN' : 'en-GB';
  return new Date(d).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

// Steam-like order: unlocked first (newest first), then locked by how far
// along the user is, then by how common the achievement is.
export function sortAchievements(list) {
  const frac = a => (a.progress ? a.progress.current / a.progress.target : 0);
  return [...list].sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    if (a.unlocked) return new Date(b.unlockedAt || 0) - new Date(a.unlockedAt || 0);
    return frac(b) - frac(a) || (b.unlockRate ?? 0) - (a.unlockRate ?? 0);
  });
}

// The locked achievements the player has started, nearest to done first; among
// equals, the one with the fewest steps left.
export function closestAchievements(list, n) {
  const frac = a => a.progress.current / a.progress.target;
  const left = a => a.progress.target - a.progress.current;
  return list
    .filter(a => !a.unlocked && a.progress?.target > 0 && a.progress.current > 0 && a.progress.current < a.progress.target)
    .sort((a, b) => frac(b) - frac(a) || left(a) - left(b))
    .slice(0, n);
}

// The share of players who have an achievement is hidden for now (2026-11-02,
// user's call: with few players the numbers mean little). The server still
// sends unlockRate, and the dashboard still uses it to pick the rarest ones;
// set this to true to show it again on the list, the detail and the tiles.
export const SHOW_UNLOCK_RATE = false;
