// Pages to turn through on /history: every event except background cards and
// era-overview cards, which take no page. Since 2026-11-14 (user's call) an era
// opens with a one-line intro on its first event's page instead of an overview
// page (EraIntro, utils/historyEraLines.js); an old link or reading position
// naming an overview lands on that first page (`redirect`). A background card opens from each page it hangs on:
// the events the server lists in `attachedTo` (data/backgroundHosts.js), or,
// with none, the page before it. Its home, where a link or an old reading
// position naming the card lands, is the first of them.
export function groupPages(events) {
  const pages = events.filter(e => e.cardType !== 'background' && e.cardType !== 'overview');
  const isPage = new Set(pages.map(e => e.slug));
  const home = new Map(); // page slug -> the cards at home there
  const guest = new Map(); // page slug -> the other cards hung on it
  const hostOf = new Map(); // background slug -> its home page's slug

  let before = null;
  for (const e of events) {
    if (e.cardType === 'overview') continue;
    if (e.cardType !== 'background') { before = e.slug; continue; }
    let hosts = (e.attachedTo ?? []).filter(slug => isPage.has(slug));
    if (!hosts.length && before) hosts = [before];
    if (!hosts.length) continue;
    hostOf.set(e.slug, hosts[0]);
    hosts.forEach((slug, i) => {
      const map = i === 0 ? home : guest;
      map.set(slug, [...(map.get(slug) ?? []), e]);
    });
  }

  // A page lists the cards at home on it first.
  const backgrounds = new Map();
  for (const slug of new Set([...home.keys(), ...guest.keys()])) {
    backgrounds.set(slug, [...(home.get(slug) ?? []), ...(guest.get(slug) ?? [])]);
  }
  // Each overview's slug -> the first page of its era.
  const redirect = new Map();
  for (const e of events) {
    if (e.cardType !== 'overview') continue;
    const first = pages.find(p => p.era === e.era);
    if (first) redirect.set(e.slug, first.slug);
  }
  return { pages, backgrounds, hostOf, redirect };
}
