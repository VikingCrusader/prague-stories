// A prominent banner HistoryPage's feed renders whenever the era changes
// from one event to the next (see HistoryPage's render loop) — the feed
// itself otherwise has no visual break between eras, only the sidebar does
// (grouped headings), so without this a reader scrolling straight through
// the page would sail from "seven-legendary-dukes" (era 1, year 800)
// straight into "borivoj-first-duke" (era 2, year 870) with no signal
// anything changed. `era.themeClass` sets --era-accent (see history.css) so
// each divider picks up its own colour — the one place in the app that
// per-era palette still actually renders; the sidebar deliberately doesn't
// (see HistorySidebar's comment). `tagline` and `yearRange` are both
// optional on older/incomplete era data, so this renders fine without
// either.
export default function HistoryEraDivider({ era, lang, convert }) {
  return (
    <div className={`history-era-divider ${era.themeClass}`}>
      <div className="history-era-divider__line" />
      <div className="history-era-divider__body">
        <h2 className="history-era-divider__title">
          {convert(era.title[lang] || era.title.en)}
        </h2>
        {era.yearRange && (
          <p className="history-era-divider__years">
            {convert(era.yearRange[lang] || era.yearRange.en)}
          </p>
        )}
        {era.tagline && (
          <p className="history-era-divider__tagline">
            {convert(era.tagline[lang] || era.tagline.en)}
          </p>
        )}
      </div>
      <div className="history-era-divider__line" />
    </div>
  );
}
