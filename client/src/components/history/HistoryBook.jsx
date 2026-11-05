import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import HistoryEventSection, {
  EventTitle, EventHook, EventSummary, EventImages, EventImageCaptions, EventReferences, EventLandmarks,
} from './HistoryEventSection';
import HistoryAxis from './HistoryAxis';

// Must match the page and axis animations in history.css.
const TURN_MS = 500;

// The landmark panel turns pages instead of scrolling. All cards are rendered
// once and measured: rows too tall for the panel are scaled down to fit, then
// split into pages of whole rows. A resize measures again.
const MIN_LANDMARK_ZOOM = 0.6;

function LandmarkPager({ event, onOpenLandmark }) {
  const t = useT();
  const panelRef = useRef(null);
  const sizeRef = useRef('');
  const [pages, setPages] = useState(null);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const size = `${Math.round(width)}x${Math.round(height)}`;
      if (size !== sizeRef.current) {
        sizeRef.current = size;
        setZoom(1);
        setPages(null);
      }
    });
    observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (pages) return;
    const panel = panelRef.current;
    const bottom = panel.getBoundingClientRect().bottom - parseFloat(getComputedStyle(panel).paddingBottom);
    const rows = [];
    panel.querySelectorAll('.history-landmark-item').forEach((el, i) => {
      const { top, bottom: rowBottom } = el.getBoundingClientRect();
      const row = rows[rows.length - 1];
      if (row && Math.abs(row.top - top) < 2) {
        row.end = i + 1;
        row.bottom = Math.max(row.bottom, rowBottom);
      } else rows.push({ start: i, end: i + 1, top, bottom: rowBottom });
    });
    const room = bottom - (rows[0]?.top ?? 0);
    const tallest = Math.max(...rows.map(row => row.bottom - row.top));
    if (zoom === 1 && tallest > room) {
      setZoom(Math.max(MIN_LANDMARK_ZOOM, (room / tallest) * 0.97));
      return; // measure again at the new size
    }
    const next = [];
    for (const row of rows) {
      const last = next[next.length - 1];
      if (last && row.bottom - last.top <= room) last.end = row.end;
      else next.push({ start: row.start, end: row.end, top: row.top });
    }
    setPages(next);
    setPage(p => Math.min(p, Math.max(0, next.length - 1)));
  }, [pages, zoom]);

  const shown = pages?.[page];
  const landmarks = shown ? event.relatedLandmarks.slice(shown.start, shown.end) : event.relatedLandmarks;

  return (
    <div className="history-book__panel history-book__links" ref={panelRef} style={{ '--landmark-zoom': zoom }}>
      {pages?.length > 1 && (
        <div className="history-book__links-pager">
          <button type="button" aria-label={t('history.prevPage')} disabled={page === 0} onClick={() => setPage(page - 1)}>‹</button>
          <span>{page + 1} / {pages.length}</span>
          <button type="button" aria-label={t('history.nextPage')} disabled={page === pages.length - 1} onClick={() => setPage(page + 1)}>›</button>
        </div>
      )}
      <EventLandmarks event={{ ...event, relatedLandmarks: landmarks }} onOpenLandmark={onOpenLandmark} />
    </div>
  );
}

// A background card shown over the right column, so the event's text stays
// readable beside it. `cards` are the ones to switch between.
function BackgroundWindow({ cards, openSlug, onOpen, onClose, onNavigateToEvent }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const card = cards.find(c => c.slug === openSlug);
  if (!card) return null;
  return (
    <aside className="history-book__float">
      <div className="history-book__float-bar">
        <div className="history-book__float-tabs">
          {cards.length > 1 && cards.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              className={c.slug === openSlug ? 'is-active' : ''}
              title={convert(c.title[lang] || c.title.en)}
              onClick={() => onOpen(c.slug)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button type="button" className="history-book__float-close" aria-label={t('history.collapseCard')} onClick={onClose}>×</button>
      </div>
      <div className="history-book__float-body" key={card.slug}>
        <EventTitle event={card} />
        <EventHook event={card} />
        <EventSummary event={card} onNavigateToEvent={onNavigateToEvent} />
        <EventImages event={card} />
        <EventReferences event={card} />
      </div>
    </aside>
  );
}

// One of the page's images enlarged over the right column.
function ImageWindow({ event, shown, onShow, onClose }) {
  const t = useT();
  const { lang } = useLang();
  const caption = event.imageCaptions?.[shown];
  return (
    <aside className="history-book__float history-book__float--image">
      <div className="history-book__float-bar">
        <div className="history-book__float-tabs">
          {event.images.length > 1 && event.images.map((src, i) => (
            <button key={src} type="button" className={i === shown ? 'is-active' : ''} onClick={() => onShow(i)}>{i + 1}</button>
          ))}
        </div>
        <button type="button" className="history-book__float-close" aria-label={t('history.collapseCard')} onClick={onClose}>×</button>
      </div>
      <div className="history-book__zoom">
        <img src={event.images[shown]} alt="" />
        {(caption?.[lang] || caption?.en) && (
          <div className="history-book__zoom-caption"><EventImageCaptions event={{ imageCaptions: [caption] }} /></div>
        )}
      </div>
    </aside>
  );
}

// The desktop History page: one event per screen, turned with the buttons or
// the arrow keys, never by scrolling the page. Everything fits the window;
// only a panel whose content is too long scrolls, inside itself. Phones keep
// the scrolling feed (see HistoryPage).
//
// Background cards take no page: each belongs to the page before it and opens
// in a floating window from a button there, or from an in-text link anywhere.
export default function HistoryBook({ events, eras, activeSlug, onGo, onOpenLandmark, paused }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const rootRef = useRef(null);

  const { pages, backgrounds, hostOf } = useMemo(() => {
    const pages = [];
    const backgrounds = new Map(); // page slug -> its background cards
    const hostOf = new Map(); // background slug -> page slug
    for (const e of events) {
      if (e.cardType !== 'background') { pages.push(e); continue; }
      const host = pages[pages.length - 1]?.slug;
      if (!host) continue;
      hostOf.set(e.slug, host);
      backgrounds.set(host, [...(backgrounds.get(host) ?? []), e]);
    }
    return { pages, backgrounds, hostOf };
  }, [events]);

  // An old reading position or a link can still name a background card:
  // show the page it belongs to, with the card open.
  const pageSlug = hostOf.get(activeSlug) ?? activeSlug;
  const found = pages.findIndex(e => e.slug === pageSlug);
  const index = found < 0 ? 0 : found;
  const event = pages[index];
  const prev = pages[index - 1];
  const next = pages[index + 1];

  // While a page turns, the old one stays on screen and slides out as the new
  // one slides in. Set during render, so the old page is never unmounted.
  const [turn, setTurn] = useState(null);
  const [shownIndex, setShownIndex] = useState(index);
  if (index !== shownIndex) {
    setShownIndex(index);
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTurn(pages[shownIndex] && !calm ? { from: pages[shownIndex], dir: index > shownIndex ? 1 : -1 } : null);
  }
  useEffect(() => {
    if (!turn) return undefined;
    const timer = setTimeout(() => setTurn(null), TURN_MS);
    return () => clearTimeout(timer);
  }, [turn]);

  // The images of the pages either side, so they are there when turned to.
  useEffect(() => {
    for (const page of [pages[index + 1], pages[index - 1]]) {
      page?.images?.forEach((src) => { new Image().src = src; });
    }
  }, [index, pages]);

  const [openBackground, setOpenBackground] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null); // index into the page's images
  useEffect(() => {
    setOpenBackground(hostOf.has(activeSlug) ? activeSlug : null);
    setZoomedImage(null);
  }, [activeSlug, hostOf]);

  // Fill the window below the navbar, whose height varies a little by language.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const fit = () => {
      const el = rootRef.current;
      if (el) el.style.height = `${window.innerHeight - el.getBoundingClientRect().top - window.scrollY}px`;
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (paused || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'Escape') {
        setOpenBackground(null);
        setZoomedImage(null);
      }
      if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowRight' && next) onGo(next.slug);
      if (e.key === 'ArrowLeft' && prev) onGo(prev.slug);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paused, prev?.slug, next?.slug]);

  if (!event) return null;

  // An in-text link to a background card opens it here instead of turning the page.
  const jump = (slug) => {
    if (hostOf.has(slug)) {
      setZoomedImage(null);
      setOpenBackground(slug);
    } else onGo(slug, { push: true });
  };
  const ownBackgrounds = backgrounds.get(event.slug) ?? [];
  const linked = openBackground && !ownBackgrounds.some(c => c.slug === openBackground)
    ? events.find(e => e.slug === openBackground)
    : null;
  const windowCards = linked ? [...ownBackgrounds, linked] : ownBackgrounds;
  // Beside the landmarks: the page's background cards, one button each.
  const backgroundPanel = (page) => {
    const cards = backgrounds.get(page.slug);
    if (!cards) return null;
    return (
      <div className="history-book__panel history-book__bg">
        <div className="history-event__landmarks-label">{t('history.backgroundLabel')}</div>
        {cards.map(card => (
          <button
            key={card.slug}
            type="button"
            className="history-book__bg-button"
            aria-expanded={openBackground === card.slug}
            onClick={() => setOpenBackground(openBackground === card.slug ? null : card.slug)}
          >
            {convert(card.title[lang] || card.title.en)}
          </button>
        ))}
      </div>
    );
  };
  const backgroundWindow = (
    <BackgroundWindow
      cards={windowCards}
      openSlug={openBackground}
      onOpen={setOpenBackground}
      onClose={() => setOpenBackground(null)}
      onNavigateToEvent={jump}
    />
  );

  const renderPage = (ev, current) => {
    const hasImages = ev.images?.length > 0;
    const hasLandmarks = ev.relatedLandmarks?.length > 0;
    const hasReferences = ev.referenceMaps?.links?.length > 0;
    const pageEra = eras.findIndex(e => e.key === ev.era);
    const turnClass = turn ? ` history-book__page--${current ? 'in' : 'out'}-${turn.dir > 0 ? 'next' : 'prev'}` : '';
    return ev.cardType === 'overview' ? (
        <div key={ev.slug} className={`history-book__page history-book__page--overview${turnClass}`} aria-hidden={!current}>
          <HistoryEventSection
            event={ev}
            era={eras[pageEra]}
            chapter={pageEra + 1}
            onOpenLandmark={onOpenLandmark}
            onNavigateToEvent={jump}
          />
          {backgroundPanel(ev)}
          {current && backgroundWindow}
        </div>
      ) : (
        <div key={ev.slug} className={`history-book__page${turnClass}`} aria-hidden={!current}>
          <div className="history-book__columns">
            <div className="history-book__main">
              <header className="history-book__panel history-book__head">
                <EventTitle event={ev} />
                <EventHook event={ev} />
              </header>
              <div className="history-book__panel history-book__text">
                <EventSummary event={ev} onNavigateToEvent={jump} />
              </div>
              {hasReferences && hasLandmarks && (
                <div className="history-book__panel history-book__refs"><EventReferences event={ev} /></div>
              )}
            </div>
            <div className="history-book__side">
              {hasImages && (
                // One column per image, each with its caption in its own panel below.
                <div className="history-book__gallery">
                  {ev.images.map((src, i) => {
                    const caption = ev.imageCaptions?.[i];
                    const one = { images: [src], imageCaptions: [caption] };
                    return (
                      <Fragment key={src}>
                        <div
                          className="history-book__panel history-book__images"
                          style={{ gridColumn: i + 1, gridRow: 1 }}
                          role="button"
                          tabIndex={0}
                          onClick={() => setZoomedImage(i)}
                          onKeyDown={(e) => { if (e.key === 'Enter') setZoomedImage(i); }}
                        >
                          <EventImages event={one} captions={false} />
                        </div>
                        {(caption?.[lang] || caption?.en) && (
                          <div className="history-book__panel history-book__captions" style={{ gridColumn: i + 1, gridRow: 2 }}>
                            <EventImageCaptions event={one} />
                          </div>
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              )}
              <div className="history-book__bottom">
                {hasReferences && !hasLandmarks && (
                  <div className="history-book__panel history-book__refs history-book__refs--fill">
                    <EventReferences event={ev} />
                  </div>
                )}
                {hasLandmarks && <LandmarkPager event={ev} onOpenLandmark={onOpenLandmark} />}
                {/* A card with nothing here keeps the panel, so the layout stays the same. */}
                {!hasLandmarks && !hasReferences && (
                  <div className="history-book__panel history-book__links">
                    <p className="history-book__no-landmarks">
                      {t('history.noLandmarks')}
                    </p>
                  </div>
                )}
                {backgroundPanel(ev)}
              </div>
            </div>
          </div>
          {current && backgroundWindow}
          {current && zoomedImage !== null && !openBackground && ev.images?.[zoomedImage] && (
            <ImageWindow event={ev} shown={zoomedImage} onShow={setZoomedImage} onClose={() => setZoomedImage(null)} />
          )}
        </div>
      );
  };

  return (
    <div className="history-book" ref={rootRef}>
      <HistoryAxis pages={pages} eras={eras} index={index} onJump={(slug) => onGo(slug, { push: true })} />

      <div className="history-book__stage">
        {[turn?.from, event].filter(Boolean).map(page => renderPage(page, page === event))}
      </div>

      <nav className="history-book__nav">
        <button type="button" className="history-book__turn" disabled={!prev} onClick={() => onGo(prev.slug)}>
          ‹ {t('history.prevPage')}
        </button>
        <span className="history-book__count">{index + 1} / {pages.length}</span>
        <button type="button" className="history-book__turn" disabled={!next} onClick={() => onGo(next.slug)}>
          {t('history.nextPage')} ›
        </button>
      </nav>
    </div>
  );
}
