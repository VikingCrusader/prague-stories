import { Fragment, useEffect, useRef, useState } from 'react';
import { historyAPI } from '../services/api';
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

  useEffect(() => {
    historyAPI.getAll()
      .then(res => {
        setData(res.data);
        // Background cards (see HistoryEvent model) don't have a sidebar
        // entry to highlight, so the initial active slug should skip past
        // any leading one straight to the first real, dated event.
        const firstReal = res.data.events.find(e => e.cardType !== 'background');
        if (firstReal) setActiveSlug(firstReal.slug);
      })
      .finally(() => setLoading(false));
  }, []);

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

  const scrollToEvent = (event) => {
    setActiveSlug(event.slug);
    sectionEls.current.get(event.slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="guide-page history-page">
      <div className="history-header">
        <h1 className="px-title" style={{ fontSize: 13, marginBottom: 6 }}>{t('history.title')}</h1>
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
            selectedSlug={activeSlug}
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
