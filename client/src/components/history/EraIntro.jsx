import { useState } from 'react';
import { HISTORY_ERA_LINES } from '../../utils/historyEraLines';
import { chapterLabel, enteringEra } from '../../utils/eraChapter';

// The chapter head an era opens with, on its first event's page (2026-11-14,
// user's call: it replaced the era-overview page). A band in the era's colour
// with rules either side: the chapter (第七章 / Chapter VII), the era's title
// large (blackletter in English and Czech), its years, and the same plain
// line the Guide shows (utils/historyEraLines.js). Reached from another era it
// plays a short opening (the band unfolds, a glint crosses the title), never
// when paging back within the era. `era.themeClass` sets --era-accent.
export default function EraIntro({ era, chapter, lang, convert, className = '' }) {
  const [opening] = useState(() => !!era && enteringEra(era.key));
  if (!era) return null;
  const line = HISTORY_ERA_LINES.find(e => e.key === era.key)?.line;
  const loc = f => (f ? convert(f[lang] ?? f.en ?? '') : '');
  return (
    <div className={`history-era-intro ${era.themeClass ?? ''}${opening ? ' is-opening' : ''} ${className}`.trim()}>
      <span className="history-era-intro__rule" aria-hidden="true" />
      <div className="history-era-intro__body">
        {/* The chapter and the title in one face and colour, centred; the years
            go to the line below, so nothing pushes the heading off centre. */}
        <p className="history-era-intro__head">
          <strong className="history-era-intro__title">
            <span className="history-era-intro__chapter">{chapterLabel(chapter, lang)}</span>
            {loc(era.title)}
          </strong>
        </p>
        {/* Second line: the era's subtitle (its overview card's title) and
            its years, apart from the title; the plain line goes under them. */}
        {(era.subtitle || era.yearRange) && (
          <p className="history-era-intro__sub">
            {era.subtitle && <span className="history-era-intro__subtitle">{loc(era.subtitle)}</span>}
            {era.yearRange && <span className="history-era-intro__years">{loc(era.yearRange)}</span>}
          </p>
        )}
        {line && <p className="history-era-intro__line">{loc(line)}</p>}
      </div>
      <span className="history-era-intro__rule" aria-hidden="true" />
    </div>
  );
}
