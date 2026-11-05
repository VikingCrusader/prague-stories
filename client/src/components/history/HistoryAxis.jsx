import { useMemo } from 'react';
import { useLang, useConvert } from '../../context/LanguageContext';

// Width of one event on the axis; the track slides by whole nodes, so the
// current one always sits in the middle, under the fixed gold frame.
const NODE_W = 168;

function bareYear(startYear, lang) {
  const year = Math.trunc(startYear);
  if (year >= 0) return String(year);
  if (lang === 'zh') return `前${-year}`;
  return lang === 'cz' ? `${-year} př. n. l.` : `${-year} BC`;
}

// The timeline of the desktop History page: a band of all the eras, each as
// wide as its share of the pages, for long jumps, and below it the events
// themselves on a sliding line.
export default function HistoryAxis({ pages, eras, index, onJump }) {
  const { lang } = useLang();
  const convert = useConvert();
  const loc = (value) => (value ? convert(value[lang] || value.en || '') : '');

  const segments = useMemo(() => eras
    .map(era => ({
      era,
      start: pages.findIndex(p => p.era === era.key),
      count: pages.filter(p => p.era === era.key).length,
    }))
    .filter(s => s.count > 0), [pages, eras]);

  const eraTitle = (page) => loc(eras.find(e => e.key === page.era)?.title);
  const nodeYear = (page) => (page.cardType === 'overview' ? eraTitle(page) : bareYear(page.startYear, lang));
  const current = pages[index];

  return (
    <div className="history-axis">
      <div className="history-axis__eras">
        {segments.map(({ era, start, count }) => {
          const active = current.era === era.key;
          const title = loc(era.title);
          return (
            <button
              key={era.key}
              type="button"
              className={`history-axis__era${active ? ' is-active' : ''}`}
              style={{ flexGrow: count }}
              title={`${title} ${loc(era.yearRange)}`.trim()}
              onClick={() => onJump(pages[start].slug)}
            >
              {active && <span className="history-axis__era-fill" style={{ width: `${((index - start + 1) / count) * 100}%` }} />}
              <span className="history-axis__era-label">{title}</span>
            </button>
          );
        })}
      </div>

      <div className="history-axis__events">
        <div className="history-axis__line" />
        <div className="history-axis__track" style={{ transform: `translateX(${-(index + 0.5) * NODE_W}px)` }}>
          {pages.map((page, i) => (
            <button
              key={page.slug}
              type="button"
              tabIndex={-1}
              className={`history-axis__node${page.cardType === 'overview' ? ' history-axis__node--era' : ''}`}
              style={{ width: NODE_W }}
              title={loc(page.title)}
              onClick={() => i !== index && onJump(page.slug)}
            >
              <span className="history-axis__dot" />
              <span className="history-axis__year">{nodeYear(page)}</span>
              <span className="history-axis__name">{loc(page.title)}</span>
            </button>
          ))}
        </div>
        <div className="history-axis__now" style={{ width: NODE_W - 8 }} title={loc(current.title)}>
          <span className="history-axis__now-year">
            {current.cardType === 'overview' ? eraTitle(current) : loc(current.year)}
          </span>
          <span className="history-axis__now-name">{loc(current.title)}</span>
        </div>
      </div>
    </div>
  );
}
