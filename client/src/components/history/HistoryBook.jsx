import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import HistoryEventSection, {
  EventTitle, EventHook, EventSummary, EventImages, EventImageCaptions, EventReferences, EventLandmarks, EventAchievements,
} from './HistoryEventSection';
import HistoryAxis from './HistoryAxis';
import { groupPages } from '../../utils/historyPages';

// "Wikipedia: <article>", the name read from the link (.../wiki/Great_Fire_of_Prague).
// The few links to other sites just show the site.
export function wikipediaLabel(url, prefix) {
  try {
    const { hostname, pathname, hash } = new URL(url);
    if (!hostname.endsWith('wikipedia.org')) return hostname;
    const title = decodeURIComponent(pathname.split('/').pop()).replace(/_/g, ' ');
    const section = decodeURIComponent(hash.slice(1)).replace(/_/g, ' ');
    return `${prefix}${title}${section ? `: ${section}` : ''}`;
  } catch {
    return url;
  }
}

// Must match the page and axis animations in history.css.
const TURN_MS = 500;

// The landmark panel turns pages instead of scrolling. All cards are rendered
// once and measured: cards too tall for the panel are scaled down to fit, then
// split into pages of whole rows; with room to spare they grow to fill the
// panel, up to MAX_LANDMARK_ZOOM. Only the cards scale: captions keep their size
// and a fixed height (history.css), so a long caption can't shrink anything.
// A resize measures again.
const MIN_LANDMARK_ZOOM = 0.55;
const MAX_LANDMARK_ZOOM = 1.45;
const CAPTION_LINE = 20; // px, as in history.css

function LandmarkPager({ event, onOpenLandmark }) {
  const t = useT();
  const panelRef = useRef(null);
  const sizeRef = useRef('');
  const grownRef = useRef(false);
  const [pages, setPages] = useState(null);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [captionLines, setCaptionLines] = useState(4);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const size = `${Math.round(width)}x${Math.round(height)}`;
      if (size !== sizeRef.current) {
        sizeRef.current = size;
        grownRef.current = false;
        setZoom(1);
        setCaptionLines(4);
        setPages(null);
      }
    });
    const panel = panelRef.current;
    observer.observe(panel);
    // A card grows when its cover arrives, which the observer doesn't see.
    const onImageLoad = () => {
      if (panel.scrollHeight > panel.clientHeight + 1) setPages(null);
    };
    panel.addEventListener('load', onImageLoad, true);
    return () => {
      observer.disconnect();
      panel.removeEventListener('load', onImageLoad, true);
    };
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
    const room = bottom - (rows[0]?.top ?? 0) - 3; // a little spare, or a stray scrollbar can appear
    const tallest = Math.max(...rows.map(row => row.bottom - row.top));
    if (tallest > room + 1 && zoom > MIN_LANDMARK_ZOOM) {
      const card = Math.max(...[...panel.querySelectorAll('.loc-card')].map(el => el.getBoundingClientRect().height));
      const roomForCard = room - (tallest - card);
      // Short of space, two caption lines leave the cards a sensible size.
      const tighten = captionLines === 4 && (roomForCard / card) * zoom < 0.7;
      if (tighten) setCaptionLines(2);
      const fit = zoom * ((roomForCard + (tighten ? 2 * CAPTION_LINE : 0)) / card) * 0.97;
      setZoom(Math.max(MIN_LANDMARK_ZOOM, Math.min(fit, zoom)));
      return; // measure again at the new size
    }
    if (zoom === 1 && !grownRef.current && rows.length) {
      grownRef.current = true;
      const gap = rows[1] ? rows[1].top - rows[0].bottom : 12;
      const perPage = Math.min(rows.length, Math.max(1, Math.floor((room + gap) / (tallest + gap))));
      const card = Math.max(...[...panel.querySelectorAll('.loc-card')].map(el => el.getBoundingClientRect().height));
      const grow = ((room - gap * (perPage - 1)) / perPage - (tallest - card)) / card;
      if (grow > 1.03) {
        setZoom(Math.min(MAX_LANDMARK_ZOOM, grow * 0.98));
        return; // measure again at the new size
      }
    }
    const next = [];
    for (const row of rows) {
      const last = next[next.length - 1];
      if (last && row.bottom - last.top <= room) last.end = row.end;
      else next.push({ start: row.start, end: row.end, top: row.top });
    }
    setPages(next);
    setPage(p => Math.min(p, Math.max(0, next.length - 1)));
  }, [pages, zoom, captionLines]);

  const shown = pages?.[page];
  const landmarks = shown ? event.relatedLandmarks.slice(shown.start, shown.end) : event.relatedLandmarks;

  return (
    <div className="history-book__panel history-book__links" ref={panelRef} style={{ '--landmark-zoom': zoom, '--caption-lines': captionLines }}>
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
        <EventTitle event={card} link={false} />
        <EventHook event={card} />
        <EventSummary event={card} onNavigateToEvent={onNavigateToEvent} />
        <EventImages event={card} />
        <EventReferences event={card} />
        {card.wikipediaUrl && (
          <a className="history-book__wiki" href={card.wikipediaUrl} target="_blank" rel="noopener noreferrer">
            {wikipediaLabel(card.wikipediaUrl, t('history.wikipediaPrefix'))}
          </a>
        )}
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

export { groupPages };

// The History page on a 2K screen or larger: one event per screen, turned with
// the buttons or the arrow keys, never by scrolling the page. Everything fits
// the window; only a panel whose content is too long scrolls, inside itself.
// Smaller screens use HistoryPaged.
//
// Background cards take no page: each opens in a floating window from a button
// on the pages it hangs on (utils/historyPages.js), or from an in-text link
// anywhere.
export default function HistoryBook({ events, eras, activeSlug, onGo, onOpenLandmark, onOpenAchievement, paused }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const rootRef = useRef(null);

  const { pages, backgrounds, hostOf } = useMemo(() => groupPages(events), [events]);

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
  // Everything to read on from a page: its background cards, references and
  // Wikipedia. Beside a lone image, otherwise beside the landmarks.
  const hasMore = (page) => !!(backgrounds.get(page.slug) || page.referenceMaps?.links?.length || page.wikipediaUrl);
  const hasSidePanels = (page) => hasMore(page) || page.relatedAchievements?.length > 0;
  const morePanel = (page) => {
    if (!hasMore(page)) return null;
    const cards = backgrounds.get(page.slug);
    return (
      <div className="history-book__panel history-book__more">
        <div className="history-event__landmarks-label">{t('history.readMore')}</div>
        {cards && <span className="history-event__reference-maps-label">{t('history.backgroundLabel')}</span>}
        {cards?.map(card => (
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
        <EventReferences event={page} />
        {page.wikipediaUrl && (
          <a className="history-book__wiki" href={page.wikipediaUrl} target="_blank" rel="noopener noreferrer">
            {wikipediaLabel(page.wikipediaUrl, t('history.wikipediaPrefix'))}
          </a>
        )}
      </div>
    );
  };
  // Read-more above, the page's achievements below, each its own panel.
  const sidePanels = (page, style) => {
    if (!hasSidePanels(page)) return null;
    return (
      <div className="history-book__more-col" style={style}>
        {morePanel(page)}
        {page.relatedAchievements?.length > 0 && (
          <div className="history-book__panel history-book__ach">
            <EventAchievements event={page} onOpen={onOpenAchievement} />
          </div>
        )}
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
    // A lone image leaves room beside it for the side panels.
    const moreBeside = ev.images?.length === 1 && hasSidePanels(ev);
    const hasLandmarks = ev.relatedLandmarks?.length > 0;
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
          {morePanel(ev)}
          {current && backgroundWindow}
        </div>
      ) : (
        <div key={ev.slug} className={`history-book__page${turnClass}`} aria-hidden={!current}>
          <div className="history-book__columns">
            <div className="history-book__main">
              <header className="history-book__panel history-book__head">
                <EventTitle event={ev} link={false} />
                <EventHook event={ev} />
              </header>
              <div className="history-book__panel history-book__text">
                <EventSummary event={ev} onNavigateToEvent={jump} />
              </div>
            </div>
            <div className="history-book__side">
              {hasImages && (
                // One column per image, each with its caption in its own panel below.
                <div className={`history-book__gallery${moreBeside ? ' history-book__gallery--side' : ''}`}>
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
                  {moreBeside && sidePanels(ev, { gridColumn: 2, gridRow: '1 / 3' })}
                </div>
              )}
              <div className="history-book__bottom">
                {hasLandmarks ? (
                  <LandmarkPager event={ev} onOpenLandmark={onOpenLandmark} />
                ) : (
                  <div className="history-book__panel history-book__links">
                    <p className="history-book__no-landmarks">{t('history.noLandmarks')}</p>
                  </div>
                )}
                {!moreBeside && sidePanels(ev)}
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
