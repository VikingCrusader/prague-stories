// Vertical, always-visible event list grouped by era — the sidebar replaces
// the earlier horizontal scroll-snap track entirely (see conversation this
// shipped in: browsing-by-click-through-a-list won out over drag-to-scrub).
// Eras with hasContent:false render as a muted, unclickable heading so the
// full six-era roster is still visible even though only Era 1 has events.
export default function HistorySidebar({ eras, events, selectedSlug, onSelectEvent, lang, convert, t }) {
  const eventsByEra = new Map();
  for (const ev of events) {
    if (!eventsByEra.has(ev.era)) eventsByEra.set(ev.era, []);
    eventsByEra.get(ev.era).push(ev);
  }

  return (
    <nav className="history-sidebar">
      {eras.map(era => {
        const eraEvents = eventsByEra.get(era.key) || [];
        return (
          <div key={era.key} className={`history-sidebar__era ${era.themeClass}`}>
            <div className="history-sidebar__era-title">
              {convert(era.title[lang] || era.title.en)}
              {!era.hasContent && (
                <span className="history-sidebar__era-tag">{t('history.comingSoon')}</span>
              )}
            </div>
            {era.hasContent && eraEvents.map(ev => (
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
