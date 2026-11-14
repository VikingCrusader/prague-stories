// Chapter labels for the History page's era intros (2026-11-14): 第七章 in
// Chinese, Chapter 7 / Kapitola 7 in English and Czech (Arabic numerals: Roman
// ones read as "VJJ" in the blackletter, user's call).
const ZH_DIGITS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
export function zhNumber(n) {
  if (n < 10) return ZH_DIGITS[n];
  const tens = Math.floor(n / 10);
  return `${tens === 1 ? '' : ZH_DIGITS[tens]}十${ZH_DIGITS[n % 10]}`;
}
export function roman(n) {
  const table = [[10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  for (const [v, s] of table) while (n >= v) { out += s; n -= v; }
  return out;
}
export function chapterLabel(n, lang) {
  if (lang === 'zh') return `第${zhNumber(n)}章`;
  return `${lang === 'cz' ? 'Kapitola' : 'Chapter'} ${n}`;
}

// The era the reader was last on. HistoryBook and HistoryPaged note it on
// every page; an era intro plays its opening only when it is reached from
// another era (or on arrival), not when paging back within its own era. The
// intro reads it before the page notes the new one (a child's effects run
// before its parent's).
let lastEra = null;
export const noteEra = (key) => { lastEra = key; };
export const enteringEra = (key) => lastEra !== key;
