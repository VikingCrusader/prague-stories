import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { historyAPI, userAPI, saveHistoryProgressOnExit } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { loadLocalHistoryProgress, saveLocalHistoryProgress, newerHistoryProgress } from '../utils/historyProgress';
import { useT, useLang, useConvert, LanguageOverride } from '../context/LanguageContext';
import HistorySidebar from '../components/history/HistorySidebar';
import HistoryEventSection from '../components/history/HistoryEventSection';
import HistoryEraDivider from '../components/history/HistoryEraDivider';
import LocationDetail from '../components/locations/LocationDetail';
import HistoryHero from '../components/history/HistoryHero';
import HistoryBook from '../components/history/HistoryBook';
import AchievementModal from '../components/achievements/AchievementModal';

// Cards with their own sidebar entry. Background and era-overview cards
// have none (see HistorySidebar), so scroll-spy and the initial highlight
// skip them.
// Where a section lands: its scroll-margin-top in history.css.
const SECTION_TOP = 76;

const isNavCard = (event) => event.cardType !== 'background' && event.cardType !== 'overview';

// Desktop reads one event per screen (HistoryBook); phones and narrow windows
// keep the scrolling feed.
const BOOK_QUERY = '(min-width: 1024px)';

function useIsBook() {
  const [isBook, setIsBook] = useState(() => window.matchMedia(BOOK_QUERY).matches);
  useEffect(() => {
    const query = window.matchMedia(BOOK_QUERY);
    const onChange = () => setIsBook(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return isBook;
}

export default function HistoryPage() {
  const isBook = useIsBook();
  // ?event=<slug> links straight to an event and, in the book view, follows
  // the page being read.
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSlug = searchParams.get('event');
  const { lang } = useLang();
  const convert = useConvert();

  const [data, setData] = useState(null);
  // Language `data` is in. The API sends one language only, so right after a
  // language switch `data` is still the old language; the feed keeps
  // rendering in `dataLang` until the new payload arrives (reading the new
  // language's keys from old data found nothing and crashed the page).
  const [dataLang, setDataLang] = useState(null);
  const [loading, setLoading] = useState(true);
  // Which event's sidebar entry is highlighted — driven by scroll position
  // (see the scroll-spy effect below), and also set directly on a sidebar
  // click so the highlight updates immediately rather than waiting for the
  // smooth-scroll to land.
  const [activeSlug, setActiveSlug] = useState(null);
  // Slug of a related landmark opened from a section. Rendering
  // LocationDetail here (same as TreasureHuntPage does) shows the exact same
  // card Explore uses, as an overlay on top of this page — no navigation
  // away.
  const [openLandmarkSlug, setOpenLandmarkSlug] = useState(null);

  // Achievements tied to timeline events, and the one opened from a card.
  const [achievements, setAchievements] = useState([]);
  const [openAchievement, setOpenAchievement] = useState(null);

  const sectionEls = useRef(new Map());
  // Set while a sidebar/link jump is animating. Scroll-spy pauses meanwhile,
  // so the highlight (and the sidebar, which scrolls to follow it) doesn't
  // run through every event passed on the way. The sidebar moving mid-jump
  // also cut Chrome's smooth scroll short, making the jump instant.
  const jumpRef = useRef(null);

  // Reading progress: the page reopens at the event the reader was last on.
  // `resumeSlug` is undefined while still being looked up, null for "start
  // at the top". `restored` flips once the page has scrolled there; progress
  // is only saved after that, so the initial top-of-page highlight never
  // overwrites the saved position.
  const { user } = useAuth();
  const [resumeSlug, setResumeSlug] = useState(undefined);
  const [restored, setRestored] = useState(false);
  const pendingServerSave = useRef(null);

  useEffect(() => {
    if (restored) return;
    const local = loadLocalHistoryProgress();
    if (!user) { setResumeSlug(local?.slug ?? null); return; }
    let cancelled = false;
    userAPI.getHistoryProgress()
      .then(res => res.data, () => null)
      .then(server => {
        if (!cancelled) setResumeSlug(newerHistoryProgress(local, server)?.slug ?? null);
      });
    return () => { cancelled = true; };
  }, [user?._id]);

  useEffect(() => {
    let cancelled = false;
    userAPI.getAchievements()
      .then(res => { if (!cancelled) setAchievements(res.data.achievements); })
      .catch(() => {}); // the cards just go without
    return () => { cancelled = true; };
  }, [user?._id]);

  const events = useMemo(() => {
    if (!data) return [];
    const bySlug = new Map();
    for (const ach of achievements) {
      for (const { slug } of ach.historyEvents ?? []) bySlug.set(slug, [...(bySlug.get(slug) ?? []), ach]);
    }
    return data.events.map(e => (bySlug.has(e.slug) ? { ...e, relatedAchievements: bySlug.get(e.slug) } : e));
  }, [data, achievements]);

  // Our own restore replaces the browser's pixel-offset one, which would
  // land somewhere arbitrary now that the feed arrives asynchronously.
  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return;
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return () => { window.history.scrollRestoration = previous; };
  }, []);

  // The API returns only the current language's text (see historyController),
  // so switching language refetches. The previous language stays on screen
  // until the new payload arrives, rather than flashing the spinner.
  useEffect(() => {
    let cancelled = false;
    historyAPI.getAll(lang)
      .then(res => {
        if (cancelled) return;
        setData(res.data);
        setDataLang(lang);
        // Background cards (see HistoryEvent model) don't have a sidebar
        // entry to highlight, so the initial active slug should skip past
        // any leading one straight to the first real, dated event.
        const firstReal = res.data.events.find(isNavCard);
        if (firstReal) setActiveSlug(prev => prev ?? firstReal.slug);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [lang]);

  // A window narrowed from the book view to the feed: put the feed on the page
  // being read before scroll-spy (next effect) reads the scroll position.
  useEffect(() => {
    if (!isBook && restored && activeSlug) {
      sectionEls.current.get(activeSlug)?.scrollIntoView({ block: 'start' });
    }
  }, [isBook]);

  // Scroll-spy: the sidebar is a persistent nav (sticky, see history.css)
  // sitting next to a normal scrollable feed of every event's full write-up
  // — not a click-to-swap detail pane. As the user scrolls the feed (at the
  // window level — see the overflow-y override in history.css), this keeps
  // the sidebar's highlighted entry in sync with whichever section's top
  // has most recently crossed the trigger line near the top of the
  // viewport, the same way a docs page's table-of-contents tracks scroll
  // position. A plain scroll listener rather than IntersectionObserver: the
  // "active" section here is whichever one the trigger line currently sits
  // inside, which needs a full recheck of every section's position on each
  // scroll rather than just the entries whose intersection just changed.
  useEffect(() => {
    if (!data || isBook) return;
    const TRIGGER_Y = 100; // px from the top of the viewport
    let raf = null;

    const recompute = () => {
      raf = null;
      if (jumpRef.current) return; // a sidebar/link jump is animating
      let current = data.events.find(isNavCard)?.slug ?? null;
      for (const event of data.events) {
        const el = sectionEls.current.get(event.slug);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= TRIGGER_Y) {
          // Background cards have no sidebar entry (see HistorySidebar) —
          // skip past one here rather than making it the "current"
          // highlight, so the sidebar keeps showing whichever real event
          // came before it until the next real event's turn arrives.
          if (isNavCard(event)) current = event.slug;
        } else break; // sections are in document order, so once one is below the line, all later ones are too
      }
      if (current) setActiveSlug(current);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(recompute);
    };

    recompute();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [data, isBook]);

  useEffect(() => {
    if (restored || !data || resumeSlug === undefined) return;
    const target = urlSlug || resumeSlug;
    if (isBook) {
      // Unlike the feed's highlight, a book page can be any card, so a first
      // visit opens on the very first one (the era overview).
      const known = data.events.some(e => e.slug === target);
      setActiveSlug(known ? target : data.events[0]?.slug ?? null);
    } else {
      const el = target && sectionEls.current.get(target);
      if (el) {
        setActiveSlug(target);
        el.scrollIntoView({ block: 'start' });
      }
    }
    setRestored(true);
  }, [data, resumeSlug, restored]);

  // Browser back/forward in the book view, and a link from an achievement
  // opened on this page, in either view.
  useEffect(() => {
    if (!restored || !urlSlug || !data?.events.some(e => e.slug === urlSlug)) return;
    if (isBook) setActiveSlug(urlSlug);
    else scrollToSlug(urlSlug);
  }, [urlSlug]);

  // Next/previous replace the history entry, so Back doesn't step through
  // every page read; a jump (in-text link) pushes one, so Back returns from it.
  const goToPage = (slug, { push = false } = {}) => {
    setActiveSlug(slug);
    setSearchParams({ event: slug }, { replace: !push });
  };

  // Save on every change locally; for signed-in users also to the server,
  // debounced while scrolling and flushed when the page is hidden or left.
  useEffect(() => {
    if (!restored || !activeSlug) return;
    saveLocalHistoryProgress(activeSlug);
    if (!user) return;
    pendingServerSave.current = activeSlug;
    const timer = setTimeout(() => {
      pendingServerSave.current = null;
      userAPI.saveHistoryProgress(activeSlug).catch(() => {});
    }, 2000);
    return () => clearTimeout(timer);
  }, [activeSlug, restored, user]);

  useEffect(() => {
    if (!user) return;
    const flush = () => {
      if (!pendingServerSave.current) return;
      saveHistoryProgressOnExit(pendingServerSave.current);
      pendingServerSave.current = null;
    };
    const onVisibility = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flush);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flush);
      flush();
    };
  }, [user]);

  const scrollToSlug = (slug) => {
    setActiveSlug(slug);
    const el = sectionEls.current.get(slug);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Panels off screen are laid out at a placeholder height
    // (content-visibility, see history.css) until they are scrolled past, so
    // the smooth scroll's destination can drift while it runs. Snap to the
    // real position once the page stops moving. Polled rather than waiting
    // for `scrollend`, which an interrupted earlier scroll can fire right as
    // this one starts. If the reader takes over (wheel, touch, keys), let go.
    jumpRef.current?.cancel();
    const started = performance.now();
    let lastY = window.scrollY;
    let timer = null;
    const finish = snap => {
      clearInterval(timer);
      removeEventListener('wheel', takeOver);
      removeEventListener('touchstart', takeOver);
      removeEventListener('keydown', takeOver);
      const done = () => {
        jumpRef.current = null;
        window.dispatchEvent(new Event('scroll')); // let scroll-spy catch up
      };
      if (!snap) { done(); return; }
      // Landing lays out the panels around the target at their real heights,
      // which can push it away again, by tens of thousands of px on a long
      // jump, so snap until it stays put.
      let frames = 0;
      let still = 0;
      const land = () => {
        if (Math.abs(el.getBoundingClientRect().top - SECTION_TOP) > 8) {
          still = 0;
          el.scrollIntoView({ block: 'start' });
        } else still += 1;
        if (still < 8 && ++frames < 120) requestAnimationFrame(land);
        else done();
      };
      land();
    };
    const takeOver = () => finish(false);
    timer = setInterval(() => {
      const elapsed = performance.now() - started;
      const y = window.scrollY;
      if ((y === lastY && elapsed > 250) || elapsed > 4000) finish(true);
      lastY = y;
    }, 100);
    addEventListener('wheel', takeOver, { passive: true });
    addEventListener('touchstart', takeOver, { passive: true });
    addEventListener('keydown', takeOver);
    jumpRef.current = { cancel: () => finish(false) };
  };
  // Sidebar entries hand over the full event object (see HistorySidebar);
  // in-text cross-reference links inside a summary (see
  // HistoryEventSection's onNavigateToEvent) only ever have a bare slug.
  // Both funnel into the same scrollToSlug so a click either place behaves
  // identically.
  const scrollToEvent = (event) => scrollToSlug(event.slug);

  return (
    <div className={`guide-page history-page${isBook ? ' history-page--book' : ''}`}>
      {loading || (isBook && !restored) ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <div className="spinner" />
        </div>
      ) : data ? (
        <LanguageOverride lang={dataLang}>
        <WithLang>{({ lang: viewLang, convert: viewConvert, t: viewT }) => (
        isBook ? (
          <HistoryBook
            events={events}
            eras={data.eras}
            activeSlug={activeSlug}
            onGo={goToPage}
            onOpenLandmark={setOpenLandmarkSlug}
            onOpenAchievement={setOpenAchievement}
            paused={!!openLandmarkSlug || !!openAchievement}
          />
        ) : (
        <>
        <HistoryHero t={viewT} convert={viewConvert} placement="top" />
        <div className="history-layout">
          <HistorySidebar
            eras={data.eras}
            events={data.events}
            // Held back until the reading position is restored: before that,
            // activeSlug is the first event, and the sidebar would auto-expand
            // era 1 on every reload on top of the era actually being read.
            selectedSlug={restored ? activeSlug : null}
            onSelectEvent={scrollToEvent}
            lang={viewLang}
            convert={viewConvert}
            t={viewT}
          />
          <div className="history-feed">
            <HistoryHero t={viewT} convert={viewConvert} placement="feed" />
            {events.map((event, i) => {
              // Only the sidebar shows era groupings by default — the feed
              // itself is one continuous scroll with no visual break, so a
              // reader would otherwise sail from one era's last event
              // straight into the next era's first with no signal anything
              // changed. Render the divider whenever this event's era
              // differs from the previous event's (or it's the very first
              // event, era === null).
              const eraChanged = i === 0 || event.era !== data.events[i - 1].era;
              const era = eraChanged ? data.eras.find(e => e.key === event.era) : null;
              return (
                <Fragment key={event.slug}>
                  {/* An era that opens with an overview card shows its
                      title, years and tagline inside that card instead. */}
                  {era && event.cardType !== 'overview' && (
                    <HistoryEraDivider era={era} lang={viewLang} convert={viewConvert} />
                  )}
                  <HistoryEventSection
                    event={event}
                    era={era}
                    chapter={data.eras.findIndex(e => e.key === event.era) + 1}
                    onOpenLandmark={setOpenLandmarkSlug}
                    onOpenAchievement={setOpenAchievement}
                    onNavigateToEvent={scrollToSlug}
                    sectionRef={el => {
                      if (el) sectionEls.current.set(event.slug, el);
                      else sectionEls.current.delete(event.slug);
                    }}
                  />
                </Fragment>
              );
            })}
          </div>
        </div>
        </>
        )
        )}</WithLang>
        </LanguageOverride>
      ) : null}

      {openAchievement && <AchievementModal achievement={openAchievement} onClose={() => setOpenAchievement(null)} />}

      {openLandmarkSlug && (
        <LocationDetail
          slug={openLandmarkSlug}
          onClose={() => setOpenLandmarkSlug(null)}
          onCheckIn={() => {}}
        />
      )}
    </div>
  );
}

// Hands the (possibly overridden, see LanguageOverride) language, converter
// and translator of the surrounding context to a render function, for the
// sidebar and era dividers, which take them as props.
function WithLang({ children }) {
  const { lang } = useLang();
  const convert = useConvert();
  const t = useT();
  return children({ lang, convert, t });
}
