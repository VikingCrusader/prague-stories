// Prague wall-clock time for a moment, as { y, m, d, h, min, s }.
const PRAGUE_PARTS = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Prague', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});
function pragueParts(date) {
  const p = Object.fromEntries(PRAGUE_PARTS.formatToParts(date).map(x => [x.type, Number(x.value)]));
  return { y: p.year, m: p.month, d: p.day, h: p.hour, min: p.minute, s: p.second };
}

// How far Prague is ahead of UTC at a moment (1 h in winter, 2 h in summer).
function pragueOffsetMs(date) {
  const p = pragueParts(date);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s) - Math.floor(date.getTime() / 1000) * 1000;
}

// Monday 0:00 in Prague of the week `now` falls in (the profile's "This
// week" card resets then, 2026-11-03, user's call). Weeks start on Monday,
// as Czech calendars do.
export function startOfPragueWeek(now = new Date()) {
  const p = pragueParts(now);
  const weekday = new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay(); // 0 = Sunday
  const mondayAsUtc = Date.UTC(p.y, p.m - 1, p.d - ((weekday + 6) % 7));
  // Prague midnight that Monday: subtract the offset in force then (checked
  // twice, since the guess may sit on the other side of a DST switch).
  let t = mondayAsUtc - pragueOffsetMs(new Date(mondayAsUtc));
  t = mondayAsUtc - pragueOffsetMs(new Date(t));
  return new Date(t);
}
