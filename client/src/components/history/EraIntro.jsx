import { useLayoutEffect, useRef, useState } from 'react';
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
  const ref = useRef(null);
  useFitHead(ref, [era?.key, lang]);
  if (!era) return null;
  const line = HISTORY_ERA_LINES.find(e => e.key === era.key)?.line;
  const loc = f => (f ? convert(f[lang] ?? f.en ?? '') : '');
  return (
    <div ref={ref} className={`history-era-intro ${era.themeClass ?? ''}${opening ? ' is-opening' : ''} ${className}`.trim()}>
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
        {/* Not on phones (history.css): it broke badly in a narrow band. */}
        {line && <p className="history-era-intro__line">{loc(line)}</p>}
      </div>
      <span className="history-era-intro__rule" aria-hidden="true" />
    </div>
  );
}

// Phones (2026-11-14, user's call): the title, and the subtitle with the years,
// each on one line if they can be. history.css makes them nowrap there; each
// shrinks until it fits, down to a floor, and only past that wraps after all.
// Elsewhere they wrap freely, never overflow, and this leaves them alone.
// A subtitle that won't fit at 14px splits instead: the years go to a line of
// their own (is-split), at the normal size.
const FIT = [['.history-era-intro__title', 18], ['.history-era-intro__sub', 14]];
function useFitHead(ref, deps) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const run = () => {
      for (const [selector, min] of FIT) {
        const el = root.querySelector(selector);
        if (!el) continue;
        el.style.removeProperty('font-size');
        el.style.removeProperty('white-space');
        el.classList.remove('is-split');
        let size = parseFloat(getComputedStyle(el).fontSize);
        for (let i = 0; i < 60 && el.scrollWidth > el.clientWidth + 0.5 && size > min; i++) {
          size -= 0.5;
          el.style.setProperty('font-size', `${size}px`, 'important');
        }
        if (el.scrollWidth <= el.clientWidth + 0.5) continue;
        el.style.removeProperty('font-size');
        if (el.classList.contains('history-era-intro__sub')) el.classList.add('is-split');
        else el.style.setProperty('white-space', 'normal', 'important');
      }
    };
    run();
    document.fonts?.ready.then(run);
    document.fonts?.addEventListener?.('loadingdone', run);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(run) : null;
    ro?.observe(root);
    return () => { ro?.disconnect(); document.fonts?.removeEventListener?.('loadingdone', run); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
