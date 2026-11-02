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
