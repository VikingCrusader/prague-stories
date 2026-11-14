import { pageCache, pageKey } from '../utils/pageCache';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { historyAPI, userAPI, saveHistoryProgressOnExit } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { loadLocalHistoryProgress, saveLocalHistoryProgress, newerHistoryProgress } from '../utils/historyProgress';
import { useLang, LanguageOverride } from '../context/LanguageContext';
import { IS_APPLE } from '../utils/fitPage';
import LocationDetail from '../components/locations/LocationDetail';
import PackDetail from '../components/packs/PackDetail';
import { usePacks } from '../hooks/usePacks';
import HistoryBook from '../components/history/HistoryBook';
import HistoryPaged from '../components/history/HistoryPaged';
import AchievementModal from '../components/achievements/AchievementModal';

// One event per screen with everything in view (HistoryBook) on a 2K screen or
// larger, and on Macs and iPads (2026-11-08, user's call; iPadOS reports itself
// as a Mac, an iPhone is too narrow to match). Other screens below 2K get the
// scrolling layout, one event at a time (HistoryPaged).
const BOOK_QUERY = IS_APPLE ? '(min-width: 1024px) and (min-height: 600px)' : '(min-width: 2400px) and (min-height: 1200px)';

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

// Whether a refetched payload is what is already on screen. A few ms for the
// whole timeline, far less than drawing the book again.
const sameJSON = (a, b) => a === b || JSON.stringify(a) === JSON.stringify(b);

export default function HistoryPage() {
  const isBook = useIsBook();
  // ?event=<slug> links straight to an event and follows the page being read.
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSlug = searchParams.get('event');
  const { lang } = useLang();

  const [data, setData] = useState(() => pageCache.get(`history:${lang}`) ?? null);
  // Language `data` is in. The API sends one language only, so right after a
  // language switch `data` is still the old language; the feed keeps
  // rendering in `dataLang` until the new payload arrives (reading the new
  // language's keys from old data found nothing and crashed the page).
  const [dataLang, setDataLang] = useState(() => (pageCache.get(`history:${lang}`) ? lang : null));
  // The event being read.
  const [activeSlug, setActiveSlug] = useState(null);
  // Slug of a related landmark opened from a section. Rendering
  // LocationDetail here (same as TreasureHuntPage does) shows the exact same
  // card Explore uses, as an overlay on top of this page — no navigation
  // away.
  const [openLandmarkSlug, setOpenLandmarkSlug] = useState(null);
  const [openPackSlug, setOpenPackSlug] = useState(null);
  const packs = usePacks();

  // Achievements tied to timeline events, and the one opened from a card.
  // Kept for the visit (shared with the Achievements page and the profile), so
  // a return to History draws the book once, with them, as it turns in.
  const { user } = useAuth();
  const achKey = pageKey('achievements', user?._id);
  const keptAchievements = () => (pageCache.get(achKey) ?? pageCache.get(pageKey('dashboard', user?._id))?.achData)?.achievements ?? [];
  const [achievements, setAchievements] = useState(keptAchievements);
  const [openAchievement, setOpenAchievement] = useState(null);

  // Reading progress: the page reopens at the event the reader was last on.
  // `resumeSlug` is undefined while still being looked up, null for "start
  // at the top". `restored` flips once the page is on it; progress is only
  // saved after that, so the initial page never overwrites the saved position.
  // Coming back within the same visit, the page this reader was on is already
  // known (it was saved on every change): start there at once, instead of
  // turning in blank while the server is asked (2026-11-13).
  const posKey = pageKey('historyPos', user?._id);
  const [resumeSlug, setResumeSlug] = useState(() => pageCache.get(posKey));
  const [restored, setRestored] = useState(false);
  const pendingServerSave = useRef(null);

  useEffect(() => {
    if (restored || resumeSlug !== undefined) return;
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

  // Refreshed in the background; the book is only drawn again if they changed.
  useEffect(() => {
    let cancelled = false;
    userAPI.getAchievements()
      .then(res => {
        pageCache.set(achKey, res.data);
        if (cancelled) return;
        setAchievements(prev => (sameJSON(prev, res.data.achievements) ? prev : res.data.achievements));
      })
      .catch(() => {}); // the cards just go without
    return () => { cancelled = true; };
  }, [user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const events = useMemo(() => {
    if (!data) return [];
    const bySlug = new Map();
    for (const ach of achievements) {
      for (const { slug } of ach.historyEvents ?? []) bySlug.set(slug, [...(bySlug.get(slug) ?? []), ach]);
    }
    const packBySlug = new Map(packs.map(p => [p.slug, p]));
    return data.events.map(e => ({
      ...e,
      ...(bySlug.has(e.slug) ? { relatedAchievements: bySlug.get(e.slug) } : null),
      relatedLandmarks: e.relatedLandmarks.map(r => (r.landmark.isPack && packBySlug.has(r.landmark.slug)
        ? { ...r, landmark: { ...r.landmark, ...packBySlug.get(r.landmark.slug) } }
        : r)),
    }));
  }, [data, achievements, packs]);
  // Each era's subtitle is its overview card's title (era-guide-<key>): the
  // overview cards take no page any more, but EraIntro still shows it.
  const eras = useMemo(() => {
    if (!data) return [];
    const overviews = new Map(data.events.filter(e => e.cardType === 'overview').map(e => [e.era, e]));
    return data.eras.map(era => (overviews.has(era.key) ? { ...era, subtitle: overviews.get(era.key).title } : era));
  }, [data]);
  const openLandmark = slug => {
    const isPack = events.some(e => e.relatedLandmarks.some(r => r.landmark.isPack && r.landmark.slug === slug));
    (isPack ? setOpenPackSlug : setOpenLandmarkSlug)(slug);
  };

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
        // The same content as the copy already shown (the usual case on a
        // return): keep it, so the whole book isn't drawn again for nothing.
        const kept = pageCache.get(`history:${lang}`);
        if (kept && sameJSON(kept, res.data)) {
          setData(kept);
        } else {
          pageCache.set(`history:${lang}`, res.data);
          setData(res.data);
        }
        setDataLang(lang);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [lang]);

  useEffect(() => {
    if (restored || !data || resumeSlug === undefined) return;
    const target = urlSlug || resumeSlug;
    const known = data.events.some(e => e.slug === target);
    setActiveSlug(known ? target : data.events[0]?.slug ?? null);
    setRestored(true);
  }, [data, resumeSlug, restored]);

  // Browser back/forward, and a link from an achievement opened on this page.
  useEffect(() => {
    if (!restored || !urlSlug || !data?.events.some(e => e.slug === urlSlug)) return;
    setActiveSlug(urlSlug);
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
    pageCache.set(posKey, activeSlug);
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

  return (
    <div className={`guide-page history-page${isBook ? ' history-page--book' : ''}`}>
      {!restored ? null : data ? (
        <LanguageOverride lang={dataLang}>
        {(() => {
          const View = isBook ? HistoryBook : HistoryPaged;
          return (
            <View
              events={events}
              eras={eras}
              activeSlug={activeSlug}
              onGo={goToPage}
              onOpenLandmark={openLandmark}
              onOpenAchievement={setOpenAchievement}
              paused={!!openLandmarkSlug || !!openPackSlug || !!openAchievement}
            />
          );
        })()}
        </LanguageOverride>
      ) : null}

      {openAchievement && <AchievementModal achievement={openAchievement} onClose={() => setOpenAchievement(null)} />}

      {openPackSlug && <PackDetail slug={openPackSlug} onClose={() => setOpenPackSlug(null)} />}

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
