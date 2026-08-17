import { useEffect, useState } from 'react';

// Vertical, always-visible event list grouped by era — the sidebar replaces
// the earlier horizontal scroll-snap track entirely (see conversation this
// shipped in: browsing-by-click-through-a-list won out over drag-to-scrub).
// Eras with hasContent:false render as a muted, unclickable heading so the
// full seven-era roster is still visible even though only two eras have
// events.
//
// Each content era's heading is now a collapse/expand toggle, collapsed by
// default (2026-08) — with seven eras and two of them holding a dozen-plus
// events each, showing every event title at once made the sidebar
// unusably tall. `expanded` tracks which era keys are open; whichever era
// contains the currently active/selected event auto-expands via the effect
// below, so scroll-spy highlighting (see HistoryPage) is never hidden
// inside a closed section — but a user can still manually collapse that
// same era again afterward, since the effect only fires when the *selected
// era itself* changes, not on every render.
export default function HistorySidebar({ eras, events, selectedSlug, onSelectEvent, lang, convert, t }) {
  const eventsByEra = new Map();
  for (const ev of events) {
    if (!eventsByEra.has(ev.era)) eventsByEra.set(ev.era, []);
    eventsByEra.get(ev.era).push(ev);
  }

  const selectedEra = events.find(ev => ev.slug === selectedSlug)?.era ?? null;
  const [expanded, setExpanded] = useState(() => new Set(selectedEra ? [selectedEra] : []));

  useEffect(() => {
    if (!selectedEra) return;
    setExpanded(prev => (prev.has(selectedEra) ? prev : new Set(prev).add(selectedEra)));
  }, [selectedEra]);

  const toggleEra = key => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <nav className="history-sidebar">
      {eras.map(era => {
        const eraEvents = eventsByEra.get(era.key) || [];
        const isOpen = era.hasContent && expanded.has(era.key);
        return (
          <div key={era.key} className={`history-sidebar__era ${era.themeClass}`}>
            {era.hasContent ? (
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
                <span className="history-sidebar__era-title-text">
                  {convert(era.title[lang] || era.title.en)}
                </span>
              </button>
            ) : (
              <div className="history-sidebar__era-title">
                {convert(era.title[lang] || era.title.en)}
                <span className="history-sidebar__era-tag">{t('history.comingSoon')}</span>
              </div>
            )}
            {isOpen && eraEvents.map(ev => (
              <button
                key={ev.slug}
                className={`history-sidebar__item${ev.slug === selectedSlug ? ' history-sidebar__item--active' : ''}`}
                onClick={() => onSelectEvent(ev)}
              >
                <span className="history-sidebar__item-year">{ev.startYear}</span>
                <span className="history-sidebar__item-title">{convert(ev.title[lang] || ev.title.en)}</span>
              </button>
            ))}
          </div>
        );
      })}
    </nav>
  );
}
