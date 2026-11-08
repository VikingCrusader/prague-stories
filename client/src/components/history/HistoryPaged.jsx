import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import HistoryAxis from './HistoryAxis';
import HistoryEraDivider from './HistoryEraDivider';
import HistoryEventSection, {
  EventTitle, EventHook, EventSummary, EventImages, EventReferences, EventLandmarks, EventAchievements,
} from './HistoryEventSection';
import HistoryHero from './HistoryHero';
import { groupPages, wikipediaLabel } from './HistoryBook';

// How far past the end of a page the finger has to pull to turn it.
const PULL_TO_TURN = 90;
// Text and the rest side by side; below this they stack (history.css).
const COLUMNS_QUERY = '(min-width: 1024px)';
const BLOCK_GAP = 20; // px above a block moved into a column, as in history.css
// The columns may grow this much to take a block in: about what one more panel
// across the bottom would cost anyway.
const MAX_GROW = 120;

function useColumns() {
  const [columns, setColumns] = useState(() => window.matchMedia(COLUMNS_QUERY).matches);
  useEffect(() => {
    const query = window.matchMedia(COLUMNS_QUERY);
    const onChange = () => setColumns(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return columns;
}

// A block's height inside another panel, from a hidden copy put there.
function heightIn(panel, el, width) {
  const copy = el.cloneNode(true);
  copy.style.cssText = `position:absolute;visibility:hidden;left:0;top:0;width:${width}px`;
  panel.append(copy);
  const { height } = copy.getBoundingClientRect();
  copy.remove();
  return height;
}

function innerBox(el) {
  const style = getComputedStyle(el);
  return {
    bottom: el.getBoundingClientRect().bottom - parseFloat(style.paddingBottom) - parseFloat(style.borderBottomWidth),
    width: el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
  };
}

// Whole rows of cards up to nine a page (the row lengths are in history.css); more
// than that turn pages. The panel keeps the first page's height, so a short last
// page doesn't move what is under it. Remounted to measure again.
function LandmarkWall({ event, onOpenLandmark, panelRef }) {
  const t = useT();
  const perPage = window.matchMedia('(min-width: 1700px)').matches || !window.matchMedia('(min-width: 1250px)').matches ? 8 : 9;
  const [page, setPage] = useState(0);
  const [minHeight, setMinHeight] = useState(undefined);
  const pages = Math.ceil(event.relatedLandmarks.length / perPage);
  useLayoutEffect(() => {
    if (pages > 1) setMinHeight(panelRef.current.getBoundingClientRect().height);
  }, []);
  const shown = event.relatedLandmarks.slice(page * perPage, (page + 1) * perPage);
  return (
    <div className="history-book__panel history-book__links" ref={panelRef} style={{ minHeight }}>
      {pages > 1 && (
        <div className="history-book__links-pager">
          <button type="button" aria-label={t('history.prevPage')} disabled={page === 0} onClick={() => setPage(page - 1)}>‹</button>
          <span>{page + 1} / {pages}</span>
          <button type="button" aria-label={t('history.nextPage')} disabled={page === pages - 1} onClick={() => setPage(page + 1)}>›</button>
        </div>
      )}
      <EventLandmarks event={{ ...event, relatedLandmarks: shown }} onOpenLandmark={onOpenLandmark} />
    </div>
  );
}

// One event's page. Keyed by event, so its placements start afresh.
//
// The text is on the left, the images and landmarks on the right, the two the
// same height (the right may run past the text). Related achievements and
// reading go where there is room: under the landmarks if they left some, else
// under a short text, else (if the columns can't stretch a little to take them)
// across the bottom. Everything starts at the bottom,
// is measured, and moves before the browser paints.
function EventPage({ event, eras, activeSlug, ownBackgrounds, hostOf, onGo, onOpenLandmark, onOpenAchievement, firstOfEra }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const columns = useColumns();
  const pageEra = eras.findIndex(e => e.key === event.era);

  const sectionEls = useRef(new Map());
  const [openCards, setOpenCards] = useState(() => new Set());
  const scrollToCard = useRef(null);
  useEffect(() => {
    const slug = scrollToCard.current;
    scrollToCard.current = null;
    if (slug) sectionEls.current.get(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [openCards]);
  useLayoutEffect(() => {
    const card = hostOf.has(activeSlug) && sectionEls.current.get(activeSlug);
    if (card) card.scrollIntoView({ block: 'start' });
  }, [activeSlug]);

  // In-text links: a background card on this page opens under the columns.
  const openCard = (slug) => {
    scrollToCard.current = slug;
    setOpenCards(open => new Set(open).add(slug));
  };
  const jump = (slug) => {
    if (hostOf.get(slug) === event.slug) openCard(slug);
    else onGo(slug, { push: true });
  };
  const closeCard = (slug) => setOpenCards(open => {
    const next = new Set(open);
    next.delete(slug);
    return next;
  });
  const isOpen = (slug) => openCards.has(slug) || slug === activeSlug;

  const section = (card) => (
    <HistoryEventSection
      key={card.slug}
      event={card}
      era={eras[pageEra]}
      chapter={pageEra + 1}
      onOpenLandmark={onOpenLandmark}
      onOpenAchievement={onOpenAchievement}
      onNavigateToEvent={jump}
      sectionRef={(el) => {
        if (el) sectionEls.current.set(card.slug, el);
        else sectionEls.current.delete(card.slug);
      }}
    />
  );

  const hasAchievements = event.relatedAchievements?.length > 0;
  const hasReading = ownBackgrounds.length > 0 || event.referenceMaps?.links?.length > 0 || !!event.wikipediaUrl;
  const hasLandmarks = event.relatedLandmarks?.length > 0;
  const hasImages = event.images?.length > 0;
  const hasSide = hasImages || hasLandmarks;

  // Where the movable blocks are: null while measuring (all at the bottom).
  const [spots, setSpots] = useState(null);
  const spotsRef = useRef(null);
  spotsRef.current = spots;
  const [measureRun, setMeasureRun] = useState(0);
  const textPanel = useRef(null);
  const textBody = useRef(null);
  const sidePanel = useRef(null);
  const imagesRef = useRef(null);
  const landmarksRef = useRef(null);
  const achBlock = useRef(null);
  const readBlock = useRef(null);

  const place = () => {
    if (spotsRef.current || !columns) return;
    const result = { ach: 'bottom', read: 'bottom' };
    if (hasSide && textPanel.current && sidePanel.current) {
      const text = innerBox(textPanel.current);
      const side = innerBox(sidePanel.current);
      let freeText = text.bottom - textBody.current.getBoundingClientRect().bottom;
      let freeSide = side.bottom - (landmarksRef.current ?? imagesRef.current).getBoundingClientRect().bottom;
      for (const [key, block] of [['ach', achBlock.current], ['read', readBlock.current]]) {
        if (!block) continue;
        const inSide = heightIn(sidePanel.current, block, side.width) + BLOCK_GAP;
        const inText = heightIn(textPanel.current, block, text.width) + BLOCK_GAP;
        if (inSide <= freeSide) {
          result[key] = 'side';
          freeSide -= inSide;
        } else if (inText <= freeText) {
          result[key] = 'text';
          freeText -= inText;
        } else if (Math.min(inSide - freeSide, inText - freeText) <= MAX_GROW) {
          const growth = Math.min(inSide - freeSide, inText - freeText);
          if (inSide - freeSide === growth) {
            result[key] = 'side';
            freeSide = 0;
            freeText += growth;
          } else {
            result[key] = 'text';
            freeText = 0;
            freeSide += growth;
          }
        }
      }
    }
    spotsRef.current = result;
    setSpots(result);
  };

  useLayoutEffect(() => {
    if (columns) place();
  }, [columns, measureRun]);

  // Measure again when the width changes, once the web fonts are in, or when a
  // landmark's cover arriving makes the cards taller.
  const columnsEl = useRef(null);
  useEffect(() => {
    const again = () => {
      spotsRef.current = null;
      setSpots(null);
      setMeasureRun(n => n + 1);
    };
    let live = true;
    document.fonts?.ready.then(() => { if (live) again(); });
    let width = columnsEl.current?.clientWidth;
    const observer = new ResizeObserver(() => {
      const now = columnsEl.current?.clientWidth;
      if (now === width) return;
      width = now;
      again();
    });
    if (columnsEl.current) observer.observe(columnsEl.current);
    const side = sidePanel.current;
    let height = landmarksRef.current?.getBoundingClientRect().height;
    const onImageLoad = () => {
      const now = landmarksRef.current?.getBoundingClientRect().height;
      if (now === undefined || Math.abs(now - height) < 1) return;
      height = now;
      again();
    };
    side?.addEventListener('load', onImageLoad, true);
    return () => {
      live = false;
      observer.disconnect();
      side?.removeEventListener('load', onImageLoad, true);
    };
  }, []);

  const achievements = hasAchievements && (
    <div className="history-paged__block" ref={achBlock}>
      <EventAchievements event={event} onOpen={onOpenAchievement} />
    </div>
  );
  const reading = hasReading && (
    <div className="history-paged__block history-paged__reading" ref={readBlock}>
      <div className="history-event__landmarks-label">{t('history.readMore')}</div>
      <div className="history-paged__reading-links">
        {ownBackgrounds.map(card => (
          <button
            key={card.slug}
            type="button"
            className="history-book__bg-button"
            aria-expanded={isOpen(card.slug)}
            onClick={() => (isOpen(card.slug) ? closeCard(card.slug) : openCard(card.slug))}
          >
            {t('history.backgroundLabel')}: {convert(card.title[lang] || card.title.en)}
          </button>
        ))}
        <EventReferences event={event} />
        {event.wikipediaUrl && (
          <a className="history-book__wiki" href={event.wikipediaUrl} target="_blank" rel="noopener noreferrer">
            {wikipediaLabel(event.wikipediaUrl, t('history.wikipediaPrefix'))}
          </a>
        )}
      </div>
    </div>
  );
  const at = (spot) => [
    (spots?.ach ?? 'bottom') === spot ? <div key="ach">{achievements}</div> : null,
    (spots?.read ?? 'bottom') === spot ? <div key="read">{reading}</div> : null,
  ];
  const bottomHasSomething = ((spots?.ach ?? 'bottom') === 'bottom' && hasAchievements)
    || ((spots?.read ?? 'bottom') === 'bottom' && hasReading);
  const shownCards = ownBackgrounds.filter(card => isOpen(card.slug));

  return (
    <div className="history-paged__page">
      {firstOfEra && event.cardType !== 'overview' && (
        <HistoryEraDivider era={eras[pageEra]} lang={lang} convert={convert} />
      )}
      {event.cardType === 'overview' ? section(event) : (
        <div className={`history-paged__columns${hasSide ? '' : ' history-paged__columns--solo'}`} ref={columnsEl}>
          <div className={`history-detail-panel history-detail-panel--${event.tone} history-paged__text`} ref={textPanel}>
            <div ref={textBody}>
              <EventTitle event={event} />
              <EventHook event={event} />
              <EventSummary event={event} onNavigateToEvent={jump} />
            </div>
            {at('text')}
          </div>
          {hasSide && (
            <aside
              className={`history-detail-panel history-detail-panel--${event.tone} history-paged__side`}
              ref={sidePanel}
            >
              {hasImages && (
                <div className="history-paged__images" ref={imagesRef}>
                  <EventImages event={event} />
                </div>
              )}
              {hasLandmarks && (columns
                ? <LandmarkWall key={measureRun} event={event} onOpenLandmark={onOpenLandmark} panelRef={landmarksRef} />
                : <EventLandmarks event={event} onOpenLandmark={onOpenLandmark} />)}
              {at('side')}
            </aside>
          )}
        </div>
      )}
      {bottomHasSomething && <section className="history-detail-panel history-paged__bottom">{at('bottom')}</section>}
      {shownCards.map(section)}
    </div>
  );
}

// Below a 2K screen (2026-11-08, user's calls): one event at a time under the
// timeline, on a normal page that scrolls as far as it needs to; on narrow
// screens everything stacks. Pages turn with the buttons, the arrow keys, or on
// a phone by pulling on past the end of the page.
export default function HistoryPaged({ events, eras, activeSlug, onGo, onOpenLandmark, onOpenAchievement, paused }) {
  const t = useT();
  const convert = useConvert();
  const { pages, backgrounds, hostOf } = groupPages(events);
  const pageSlug = hostOf.get(activeSlug) ?? activeSlug;
  const found = pages.findIndex(e => e.slug === pageSlug);
  const index = found < 0 ? 0 : found;
  const event = pages[index];
  const prev = pages[index - 1];
  const next = pages[index + 1];
  const nextSlug = next?.slug;

  // A new page starts at its top (unless a link named one of its background cards).
  useLayoutEffect(() => {
    if (!hostOf.has(activeSlug)) window.scrollTo(0, 0);
  }, [activeSlug]);

  useEffect(() => {
    const onKey = (e) => {
      if (paused || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
      if (e.key === 'ArrowRight' && next) onGo(next.slug);
      if (e.key === 'ArrowLeft' && prev) onGo(prev.slug);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paused, prev?.slug, next?.slug]);

  // Pull on past the bottom. The pull counts from where the finger was when the
  // page reached its end, so one long drag can scroll down and then turn.
  const [pull, setPull] = useState(0);
  useEffect(() => {
    setPull(0);
    if (!nextSlug || paused) return undefined;
    let from = null;
    let distance = 0;
    const atEnd = () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    const fingerY = (e) => e.touches[0].clientY;
    const reset = () => { from = null; distance = 0; setPull(0); };
    const onStart = (e) => {
      reset();
      if (e.touches.length === 1 && !e.target.closest?.('.history-axis') && atEnd()) from = fingerY(e);
    };
    const onMove = (e) => {
      if (e.touches.length !== 1 || e.target.closest?.('.history-axis')) return;
      if (from === null) {
        if (atEnd()) from = fingerY(e);
        return;
      }
      distance = Math.max(0, from - fingerY(e));
      setPull(distance);
    };
    const onEnd = () => {
      const turn = distance >= PULL_TO_TURN;
      reset();
      if (turn) onGo(nextSlug);
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
    window.addEventListener('touchcancel', reset);
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', reset);
    };
  }, [nextSlug, paused]);

  if (!event) return null;

  return (
    <div className="history-paged">
      {index === 0 && <HistoryHero t={t} convert={convert} />}
      <HistoryAxis pages={pages} eras={eras} index={index} onJump={(slug) => onGo(slug, { push: true })} />
      <EventPage
        key={event.slug}
        event={event}
        eras={eras}
        activeSlug={activeSlug}
        ownBackgrounds={backgrounds.get(event.slug) ?? []}
        hostOf={hostOf}
        onGo={onGo}
        onOpenLandmark={onOpenLandmark}
        onOpenAchievement={onOpenAchievement}
        firstOfEra={index === 0 || pages[index - 1].era !== event.era}
      />
      <nav className="history-book__nav">
        <button type="button" className="history-book__turn" disabled={!prev} onClick={() => onGo(prev.slug)}>
          ‹ {t('history.prevPage')}
        </button>
        <span className="history-book__count">{index + 1} / {pages.length}</span>
        <button type="button" className="history-book__turn" disabled={!next} onClick={() => onGo(next.slug)}>
          {t('history.nextPage')} ›
        </button>
      </nav>
      {next && (
        <div className="history-paged__pull" aria-hidden="true">
          <span className="history-paged__pull-bar" style={{ width: `${Math.min(100, (pull / PULL_TO_TURN) * 100)}%` }} />
          <span>{t(pull >= PULL_TO_TURN ? 'history.releaseToTurn' : 'history.pullToTurn')}</span>
        </div>
      )}
    </div>
  );
}
