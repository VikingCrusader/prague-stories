import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Vertical, always-visible event list grouped by era — the sidebar replaces
// the earlier horizontal scroll-snap track entirely (see conversation this
// shipped in: browsing-by-click-through-a-list won out over drag-to-scrub).
// Every era, hasContent or not, renders the same clickable toggle heading
// (2026-08-24) — an era with no seeded events yet just expands to an empty
// list, rather than getting a visually distinct "coming soon" tag/style.
// The full 13-era roster is always visible regardless of how many actually
// hold events yet.
//
// Each era's heading is a collapse/expand toggle, collapsed by default
// (2026-08) — with several eras holding a dozen-plus events each, showing
// every event title at once made the sidebar unusably tall. `expanded`
// tracks which era keys are open; whichever era contains the currently
// active/selected event auto-expands via the effect below, so scroll-spy
// highlighting (see HistoryPage) is never hidden inside a closed section —
// but a user can still manually collapse that same era again afterward,
// since the effect only fires when the *selected era itself* changes, not
// on every render.
export default function HistorySidebar({ eras, events, selectedSlug, onSelectEvent, lang, convert }) {
  const eventsByEra = new Map();
  for (const ev of events) {
    // 'background' cards (see HistoryEvent model) are non-dated explainer
    // asides slotted into the feed at a specific point, not events in their
    // own right — they don't get a nav entry/year slot here, only a place
    // in the scrollable feed (see HistoryPage).
    if (ev.cardType === 'background') continue;
    if (!eventsByEra.has(ev.era)) eventsByEra.set(ev.era, []);
    eventsByEra.get(ev.era).push(ev);
  }

  const selectedEra = events.find(ev => ev.slug === selectedSlug)?.era ?? null;
  const [expanded, setExpanded] = useState(() => new Set(selectedEra ? [selectedEra] : []));

  useEffect(() => {
    if (!selectedEra) return;
    setExpanded(prev => (prev.has(selectedEra) ? prev : new Set(prev).add(selectedEra)));
  }, [selectedEra]);

  // On desktop the sidebar is its own scroll box (history.css). When the
  // reader enters a new era, scroll that box so the era's heading sits at the
  // top; while reading within an era, nudge it just enough to keep the
  // highlighted entry visible. Only the sidebar's own scrollTop is set, never
  // scrollIntoView, which would also scroll the page. On mobile the sidebar
  // doesn't scroll internally, so this is a no-op there.
  const navRef = useRef(null);
  const eraEls = useRef(new Map());
  const lastPinnedEra = useRef(null);
  // Slug the scroll position was last adjusted for, so a manual era toggle
  // (which also re-runs this effect) never moves the sidebar.
  const handledSlug = useRef(null);
  // An entry the reader clicked is already on screen, so its selection never
  // moves the sidebar (moving it mid-click also cut the page's smooth scroll
  // short in Chrome).
  const clickedSlug = useRef(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav || !selectedSlug || selectedSlug === handledSlug.current) return;
    if (nav.scrollHeight <= nav.clientHeight) return;
    const navTop = nav.getBoundingClientRect().top + nav.clientTop;
    const offsetIn = el => el.getBoundingClientRect().top - navTop + nav.scrollTop;
    if (selectedSlug === clickedSlug.current) {
      clickedSlug.current = null;
      handledSlug.current = selectedSlug;
      lastPinnedEra.current = selectedEra;
      return;
    }
    const item = nav.querySelector('.history-sidebar__item--active');
    const eraEl = eraEls.current.get(selectedEra);
    if (!item) return; // era not expanded yet; runs again once it is
    handledSlug.current = selectedSlug;

    const itemTop = offsetIn(item);
    const itemBottom = itemTop + item.offsetHeight;
    let target = nav.scrollTop;
    if (eraEl && lastPinnedEra.current !== selectedEra) {
      lastPinnedEra.current = selectedEra;
      target = offsetIn(eraEl);
      if (itemBottom > target + nav.clientHeight) target = itemTop - nav.clientHeight / 2;
    } else if (itemTop < nav.scrollTop) {
      target = itemTop;
    } else if (itemBottom > nav.scrollTop + nav.clientHeight) {
      target = itemBottom - nav.clientHeight;
    }
    nav.scrollTop = Math.max(0, target);
  }, [selectedSlug, selectedEra, expanded]);

  const toggleEra = key => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <nav className="history-sidebar" ref={navRef}>
      {eras.map(era => {
        const eraEvents = eventsByEra.get(era.key) || [];
        const isOpen = expanded.has(era.key);
        return (
          <div
            key={era.key}
            className={`history-sidebar__era ${era.themeClass}`}
            ref={el => {
              if (el) eraEls.current.set(era.key, el);
              else eraEls.current.delete(era.key);
            }}
          >
            <button
              type="button"
              className="history-sidebar__era-title history-sidebar__era-title--toggle"
              onClick={() => toggleEra(era.key)}
              aria-expanded={isOpen}
            >
              <span
                className={`history-sidebar__era-chevron${isOpen ? ' history-sidebar__era-chevron--open' : ''}`}
                aria-hidden="true"
              >
                ▸
              </span>
              <span className="history-sidebar__era-title-stack">
                <span className="history-sidebar__era-title-text">
                  {convert(era.title[lang] || era.title.en)}
                </span>
                {era.yearRange && (
                  <span className="history-sidebar__era-year-range">
                    {era.yearRange[lang] || era.yearRange.en}
                  </span>
                )}
              </span>
            </button>
            {isOpen && eraEvents.map(ev => (
              <button
                key={ev.slug}
                className={`history-sidebar__item${ev.slug === selectedSlug ? ' history-sidebar__item--active' : ''}`}
                onClick={() => { clickedSlug.current = ev.slug; onSelectEvent(ev); }}
              >
                <span className="history-sidebar__item-year">{Math.trunc(ev.startYear)}</span>{/* startYear can carry a decimal tie-break suffix (e.g. 1254.1) for same-year ordering; only the truncated integer is ever meant to be shown */}
                <span className="history-sidebar__item-title">{convert(ev.title[lang] || ev.title.en)}</span>
              </button>
            ))}
          </div>
        );
      })}
    </nav>
  );
}
