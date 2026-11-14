import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLang, useConvert } from '../../context/LanguageContext';
import { bareYear } from '../../utils/bareYear';

// Width of one event on the axis; the track slides by whole nodes, so the
// current one always sits in the middle, under the fixed gold frame.
const NODE_W = 168;
// The era band slides too, keeping the current era in the middle. Longer eras
// are wider, but every era is wide enough for its name.
const ERA_MIN_W = 170;
const ERA_PAGE_W = 5;
const ERA_GAP = 2;
const eraWidth = (count) => Math.max(ERA_MIN_W, count * ERA_PAGE_W);

const DRAG_THRESHOLD = 5; // px before a press counts as a drag, not a click
const FRICTION_MS = 325; // how quickly a flick dies away

// Drags a sliding band sideways, with a flick carrying on after release. The
// transforms are written straight to the elements, not through React, so a
// drag costs no render; the CSS transition is off while it lasts (.is-dragging).
// `base` is the band's resting position; `total` its full length. A new base (a
// page turn) or recentre() glides back, the transition doing the animation.
function useDragBand(base, total, trackRef, frameRef) {
  const wrapRef = useRef(null);
  const drag = useRef({ offset: 0, down: false, active: false, moved: false, velocity: 0, frame: 0 }).current;
  const limits = useRef({ base, total });
  limits.current = { base, total };

  const paint = () => {
    const { base: at } = limits.current;
    trackRef.current.style.transform = `translate3d(${at + drag.offset}px, 0, 0)`;
    if (frameRef?.current) frameRef.current.style.transform = `translate3d(calc(-50% + ${drag.offset}px), 0, 0)`;
  };
  const clamp = (offset) => {
    const { base: at, total: length } = limits.current;
    return Math.min(-at, Math.max(-length - at, offset));
  };
  const settle = () => {
    cancelAnimationFrame(drag.frame);
    drag.frame = 0;
    wrapRef.current?.classList.remove('is-dragging');
  };
  const recentre = () => {
    settle();
    drag.offset = 0;
    paint();
  };

  useLayoutEffect(recentre, [base]);

  const schedulePaint = () => {
    if (drag.frame) return;
    drag.frame = requestAnimationFrame(() => {
      drag.frame = 0;
      paint();
    });
  };

  const glide = () => {
    let last = performance.now();
    const step = (now) => {
      const elapsed = now - last;
      last = now;
      const offset = clamp(drag.offset + drag.velocity * elapsed);
      const stopped = offset !== drag.offset + drag.velocity * elapsed;
      drag.offset = offset;
      drag.velocity *= Math.exp(-elapsed / FRICTION_MS);
      paint();
      if (stopped || Math.abs(drag.velocity) < 0.02) settle();
      else drag.frame = requestAnimationFrame(step);
    };
    drag.frame = requestAnimationFrame(step);
  };

  const handlers = {
    onPointerDown: (e) => {
      if (e.button !== 0) return;
      settle();
      Object.assign(drag, { down: true, active: false, moved: false, startX: e.clientX, startOffset: drag.offset, lastX: e.clientX, lastT: e.timeStamp, velocity: 0 });
    },
    onPointerMove: (e) => {
      if (!drag.down) return;
      const moved = e.clientX - drag.startX;
      if (!drag.active) {
        if (Math.abs(moved) < DRAG_THRESHOLD) return;
        drag.active = true;
        drag.moved = true;
        wrapRef.current.classList.add('is-dragging');
        wrapRef.current.setPointerCapture(e.pointerId);
      }
      const elapsed = e.timeStamp - drag.lastT;
      if (elapsed > 0) drag.velocity = 0.7 * ((e.clientX - drag.lastX) / elapsed) + 0.3 * drag.velocity;
      drag.lastX = e.clientX;
      drag.lastT = e.timeStamp;
      drag.offset = clamp(drag.startOffset + moved);
      schedulePaint();
    },
    onPointerUp: (e) => {
      if (!drag.down) return;
      drag.down = false;
      if (!drag.active) return;
      drag.active = false;
      cancelAnimationFrame(drag.frame);
      drag.frame = 0;
      paint();
      const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // A pause before letting go means no flick.
      if (calm || e.timeStamp - drag.lastT > 80 || Math.abs(drag.velocity) < 0.05) settle();
      else glide();
    },
    // The click that ends a drag must not count as a click on what's under it.
    onClickCapture: (e) => {
      if (!drag.moved) return;
      drag.moved = false;
      e.preventDefault();
      e.stopPropagation();
    },
  };
  handlers.onPointerCancel = handlers.onPointerUp;

  return { wrapRef, handlers, recentre };
}

// The timeline of the desktop History page: a sliding band of the eras, for
// long jumps, and below it the events themselves on a sliding line.
export default function HistoryAxis({ pages, eras, index, onJump }) {
  const { lang } = useLang();
  const convert = useConvert();
  const loc = (value) => (value ? convert(value[lang] || value.en || '') : '');

  // Eras not written yet stay on the band, greyed out and not clickable.
  const segments = useMemo(() => eras.map(era => ({
    era,
    start: pages.findIndex(p => p.era === era.key),
    count: pages.filter(p => p.era === era.key).length,
  })), [pages, eras]);

  const eraTitle = (page) => loc(eras.find(e => e.key === page.era)?.title);
  const nodeYear = (page) => (page.cardType === 'overview' ? eraTitle(page) : bareYear(page.startYear, lang));
  const current = pages[index];
  const eraAt = segments.findIndex(s => s.era.key === current.era);
  const eraCentre = segments.slice(0, eraAt).reduce((x, s) => x + eraWidth(s.count) + ERA_GAP, 0)
    + eraWidth(segments[eraAt]?.count ?? 0) / 2;
  const erasLength = segments.reduce((x, s) => x + eraWidth(s.count) + ERA_GAP, 0);

  // Entering another era makes its box on the band flash once (2026-11-14),
  // with the chapter head's opening on the page.
  const lastEraRef = useRef(current.era);
  const [flashEra, setFlashEra] = useState(null);
  useEffect(() => {
    if (lastEraRef.current === current.era) return undefined;
    lastEraRef.current = current.era;
    setFlashEra(current.era);
    const timer = setTimeout(() => setFlashEra(null), 1000);
    return () => clearTimeout(timer);
  }, [current.era]);

  const eraTrackRef = useRef(null);
  const nodeTrackRef = useRef(null);
  const frameRef = useRef(null);
  const eraBand = useDragBand(-eraCentre, erasLength, eraTrackRef);
  const nodeBand = useDragBand(-(index + 0.5) * NODE_W, pages.length * NODE_W, nodeTrackRef, frameRef);
  // Any click puts both bands back on the current position.
  const recentre = () => {
    eraBand.recentre();
    nodeBand.recentre();
  };

  return (
    <div className="history-axis">
      <div className="history-axis__eras" ref={eraBand.wrapRef} {...eraBand.handlers}>
        <div className="history-axis__eras-track" ref={eraTrackRef} style={{ gap: ERA_GAP }}>
        {segments.map(({ era, start, count }) => {
          const active = current.era === era.key;
          const title = loc(era.title);
          return (
            <button
              key={era.key}
              type="button"
              className={`history-axis__era${active ? ' is-active' : ''}${flashEra === era.key ? ' is-flashing' : ''}`}
              disabled={count === 0}
              style={{ width: eraWidth(count) }}
              title={`${title} ${loc(era.yearRange)}`.trim()}
              onClick={() => {
                recentre();
                onJump(pages[start].slug);
              }}
            >
              {active && <span className="history-axis__era-fill" style={{ width: `${((index - start + 1) / count) * 100}%` }} />}
              <span className="history-axis__era-label">{title}</span>
              <span className="history-axis__era-years">{loc(era.yearRange)}</span>
            </button>
          );
        })}
        </div>
      </div>

      <div className="history-axis__events" ref={nodeBand.wrapRef} {...nodeBand.handlers}>
        <div className="history-axis__line" />
        <div className="history-axis__track" ref={nodeTrackRef}>
          {pages.map((page, i) => (
            <button
              key={page.slug}
              type="button"
              tabIndex={-1}
              className={`history-axis__node${page.cardType === 'overview' ? ' history-axis__node--era' : ''}`}
              style={{ width: NODE_W }}
              title={loc(page.title)}
              onClick={() => {
                recentre();
                if (i !== index) onJump(page.slug);
              }}
            >
              <span className="history-axis__dot" />
              <span className="history-axis__year">{nodeYear(page)}</span>
              <span className="history-axis__name">{loc(page.title)}</span>
            </button>
          ))}
        </div>
        <div className="history-axis__now" ref={frameRef} style={{ width: NODE_W - 8 }} title={loc(current.title)} onClick={recentre}>
          <span className="history-axis__now-year">
            {current.cardType === 'overview' ? eraTitle(current) : loc(current.year)}
          </span>
          <span className="history-axis__now-name">{loc(current.title)}</span>
        </div>
      </div>
    </div>
  );
}
