// A History event's single year, as the timeline labels it (fractional
// startYears only order events within a year).
export function bareYear(startYear, lang) {
  const year = Math.trunc(startYear);
  if (year >= 0) return String(year);
  if (lang === 'zh') return `前${-year}`;
  return lang === 'cz' ? `${-year} př. n. l.` : `${-year} BC`;
}
