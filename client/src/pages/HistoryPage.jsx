import { Fragment, useEffect, useRef, useState } from 'react';
import { historyAPI, userAPI, saveHistoryProgressOnExit } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { loadLocalHistoryProgress, saveLocalHistoryProgress, newerHistoryProgress } from '../utils/historyProgress';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import HistorySidebar from '../components/history/HistorySidebar';
import HistoryEventSection from '../components/history/HistoryEventSection';
import HistoryEraDivider from '../components/history/HistoryEraDivider';
import LocationDetail from '../components/locations/LocationDetail';

export default function HistoryPage() {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Which event's sidebar entry is highlighted — driven by scroll position
  // (see the scroll-spy effect below), and also set directly on a sidebar
  // click so the highlight updates immediately rather than waiting for the
  // smooth-scroll to land.
  const [activeSlug, setActiveSlug] = useState(null);
  // Slug of a related landmark opened from a section. Rendering
  // LocationDetail here (same as RandomDrawPage does) shows the exact same
  // card Explore uses, as an overlay on top of this page — no navigation
  // away.
  const [openLandmarkSlug, setOpenLandmarkSlug] = useState(null);

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
        // Background cards (see HistoryEvent model) don't have a sidebar
        // entry to highlight, so the initial active slug should skip past
        // any leading one straight to the first real, dated event.
        const firstReal = res.data.events.find(e => e.cardType !== 'background');
        if (firstReal) setActiveSlug(prev => prev ?? firstReal.slug);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [lang]);

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
    if (!data) return;
    const TRIGGER_Y = 100; // px from the top of the viewport
    let raf = null;

    const recompute = () => {
      raf = null;
      if (jumpRef.current) return; // a sidebar/link jump is animating
      let current = data.events.find(e => e.cardType !== 'background')?.slug ?? null;
      for (const event of data.events) {
        const el = sectionEls.current.get(event.slug);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= TRIGGER_Y) {
          // Background cards have no sidebar entry (see HistorySidebar) —
          // skip past one here rather than making it the "current"
          // highlight, so the sidebar keeps showing whichever real event
          // came before it until the next real event's turn arrives.
          if (event.cardType !== 'background') current = event.slug;
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
  }, [data]);

  useEffect(() => {
    if (restored || !data || resumeSlug === undefined) return;
    const el = resumeSlug && sectionEls.current.get(resumeSlug);
    if (el) {
      setActiveSlug(resumeSlug);
      el.scrollIntoView({ block: 'start' });
    }
    setRestored(true);
  }, [data, resumeSlug, restored]);

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
    }, 3000);
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
      jumpRef.current = null;
      if (snap) el.scrollIntoView({ block: 'start' });
      window.dispatchEvent(new Event('scroll')); // let scroll-spy catch up
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
    <div className="guide-page history-page">
      <div className="history-header">
        <h1 className="px-title" style={{ fontSize: 22, marginBottom: 6 }}>{t('history.title')}</h1>
        <p className="guide-intro">{t('history.tagline')}</p>
        <p className="history-drag-hint">{t('history.dragHint')}</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <div className="spinner" />
        </div>
      ) : data ? (
        <div className="history-layout">
          <HistorySidebar
            eras={data.eras}
            events={data.events}
            // Held back until the reading position is restored: before that,
            // activeSlug is the first event, and the sidebar would auto-expand
            // era 1 on every reload on top of the era actually being read.
            selectedSlug={restored ? activeSlug : null}
            onSelectEvent={scrollToEvent}
            lang={lang}
            convert={convert}
            t={t}
          />
          <div className="history-feed">
            {data.events.map((event, i) => {
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
                  {era && <HistoryEraDivider era={era} lang={lang} convert={convert} />}
                  <HistoryEventSection
                    event={event}
                    onOpenLandmark={setOpenLandmarkSlug}
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
      ) : null}

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
