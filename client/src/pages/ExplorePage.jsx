import { useState, useEffect, useLayoutEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { locationAPI, userAPI } from '../services/api';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import { quarterName } from '../utils/pragueQuarters';
import { AREA_BLURBS } from '../utils/areaBlurbs';
import AreaGuideModal from '../components/locations/AreaGuideModal';
import { RARITY_BLURB } from '../utils/rarityBlurbs';
import { RARITY_LABEL } from '../utils/rarity';
import { RARITY_QUIP, EXPLORE_TIPS } from '../utils/filterBlurbs';
import { areaIn, loadPragueAreas } from '../utils/pragueAreas';
import { useAuth } from '../context/AuthContext';
import { useUserPosition } from '../hooks/useUserPosition';
import { haversineDistance, NEARBY_REVEAL_M, formatDistance } from '../utils/geolocation';
import LocationGrid from '../components/locations/LocationGrid';
import LocationDetail from '../components/locations/LocationDetail';
import ToastContainer from '../components/shared/Toast';
import { useFitOneLine } from '../hooks/useFitOneLine';
import ScopeToggle, { isInCity } from '../components/locations/ScopeToggle';
import AreaFilter, { matchesArea } from '../components/locations/AreaFilter';
import ExploreMap from '../components/locations/ExploreMap';
import ExploreApplied from '../components/locations/ExploreApplied';
import AchievementModal from '../components/achievements/AchievementModal';
import LevelsModal from '../components/dashboard/LevelsModal';
import { closestAchievements } from '../utils/achievementText';
import { EXPLORE_SIDE_QUERY } from '../utils/exploreLayout';

let toastId = 0;

// The title, filters and a map in a side column, the cards taking the rest of the
// width (2026-11-08, user's call); pixelart.css makes it compact below 2K.
function useMedia(queryText) {
  const [matches, setMatches] = useState(() => window.matchMedia(queryText).matches);
  useEffect(() => {
    const query = window.matchMedia(queryText);
    const onChange = () => setMatches(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [queryText]);
  return matches;
}

export default function ExplorePage() {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const { user, guest } = useAuth();
  const { state, search } = useLocation();
  const navigate = useNavigate();
  const wide = useMedia(EXPLORE_SIDE_QUERY);
  // Below 2K the column scrolls and the map can be folded away.
  const belowTwoK = useMedia('(max-width: 2399px)');
  const [filterSlot, setFilterSlot] = useState(null);
  const [appliedSlot, setAppliedSlot] = useState(null);
  const [tip] = useState(() => EXPLORE_TIPS[Math.floor(Math.random() * EXPLORE_TIPS.length)]);
  const userPos                          = useUserPosition();
  const [locations, setLocations]       = useState([]);
  const [areaGuide, setAreaGuide]       = useState(null);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [autoCheckIn, setAutoCheckIn]   = useState(false);
  // "My Collections" is on (reported by LocationGrid): the header then adds a
  // line about holding a card to admire it (CardShowcase).
  const [inCollection, setInCollection] = useState(false);
  // The rarity picked in LocationGrid's filter (one at a time), or null: its
  // description (the Guide's line) shows under the title.
  const [rarity, setRarity]             = useState(null);
  // Default to the city proper: cards tagged `outside` lie beyond Prague's
  // administrative boundary (day trips), shown only on "Show all".
  const [cityOnly, setCityOnly]         = useState(() => !state?.showAll);
  // District / historical-quarter filter; only offered in "City only" mode.
  // A link's state can open it on one district or quarter (the profile's
  // rows send { district: 'Praha 7' } or { quarter: 'Holešovice' }, 2026-11-04).
  const [area, setArea]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [toasts, setToasts]             = useState([]);
  // Filters to open with, from a link's state (the profile's expedition
  // strip sends { showAll: true, rarity: 'expedition' } from its empty
  // nudge); read once.
  const [initialFilter] = useState(() => (state?.rarity || state?.label
    ? { rarity: state.rarity ?? null, label: state.label ?? null }
    : null));

  // Refetched when the signed-in user changes, e.g. when a sign-in that
  // was retried in the background (AuthContext) lands after the first load.
  const userId = user?._id;
  useEffect(() => {
    locationAPI.getAll()
      .then(res => setLocations(res.data))
      .finally(() => setLoading(false));
  }, [userId]);

  // The side column sits right under the navbar, which is taller on some widths.
  useLayoutEffect(() => {
    const nav = document.querySelector('.navbar');
    if (!wide || !nav) return undefined;
    const root = document.documentElement;
    const measure = () => root.style.setProperty('--navbar-h', `${nav.offsetHeight}px`);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    return () => { ro.disconnect(); root.style.removeProperty('--navbar-h'); };
  }, [wide]);

  // The "Next up" card on a 2K screen; read again after each new card.
  const [achData, setAchData] = useState(null);
  const [openAch, setOpenAch] = useState(null);
  const [levelsOpen, setLevelsOpen] = useState(false);
  const [huntStatus, setHuntStatus] = useState(null);
  const [reading, setReading] = useState(null);
  // No position on purpose: with one, this call also stores the clues walking brought.
  const refreshHunt = useCallback(() => {
    userAPI.getRandomDraw().then(res => setHuntStatus(res.data)).catch(() => {});
  }, []);
  const collectedCount = useMemo(() => locations.filter(l => l.unlocked).length, [locations]);
  useEffect(() => {
    if (!wide || !userId || loading) return undefined;
    let stale = false;
    userAPI.getAchievements().then(res => { if (!stale) setAchData(res.data); }).catch(() => {});
    refreshHunt();
    return () => { stale = true; };
  }, [wide, userId, loading, collectedCount, refreshHunt]);
  useEffect(() => {
    if (!wide || !userId) return;
    userAPI.getHistoryProgress(true).then(res => setReading(res.data.summary)).catch(() => {});
  }, [wide, userId]);

  useEffect(() => {
    if (state?.openSlug) {
      setSelectedSlug(state.openSlug);
      setAutoCheckIn(!!state.autoCheckIn);
      navigate('.', { replace: true, state: null });
    }
  }, [state?.openSlug]);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const checkinSlug = params.get('checkin');
    if (checkinSlug) {
      setSelectedSlug(checkinSlug);
      setAutoCheckIn(true);
      navigate('.', { replace: true, search: '' });
    }
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleCheckIn = (slug, result) => {
    setLocations(prev => prev.map(l => l.slug === slug ? { ...l, unlocked: true, _checkedInAt: new Date().toISOString() } : l));
    addToast(`+${result.xpEarned} XP earned! ${result.levelInfo.title}`);
  };

  const handleUpdate = (updatedLoc) => {
    setLocations(prev => prev.map(l => l.slug === updatedLoc.slug ? { ...l, ...updatedLoc } : l));
    addToast('Location updated.', 'success');
  };

  const sortedAll = useMemo(() => {
    if (!userPos) return locations;
    return [...locations]
      .map(l => ({
        ...l,
        _distance: haversineDistance(userPos.lat, userPos.lng, l.coordinates.lat, l.coordinates.lng),
      }))
      .sort((a, b) => a._distance - b._distance);
  }, [locations, userPos]);

  const hasCollected = useMemo(() => locations.some(l => l.unlocked), [locations]);

  // City only / area filter. "My Collections" always lists every collected
  // card, city or outside, and hides both controls (it gets sortedAll);
  // leaving it brings back the scope and area picked before.
  // On a 2K screen the map filters whatever is shown, My Collections included.
  const sortedLocations = useMemo(
    () => (cityOnly
      ? sortedAll.filter(l => isInCity(l) && matchesArea(l, area))
      : wide ? sortedAll.filter(l => matchesArea(l, area)) : sortedAll),
    [sortedAll, cityOnly, area, wide],
  );
  const collectionLocations = useMemo(
    () => (wide ? sortedAll.filter(l => matchesArea(l, area)) : sortedAll),
    [sortedAll, area, wide],
  );

  // Tapping a locked card within NEARBY_REVEAL_M (the wobbling lock) opens
  // the detail and collects it, the same flow as the 50 m notification
  // (autoCheckIn). Read through a ref so the handler stays stable for memo'd cards.
  const latest = useRef({});
  latest.current = { sortedAll, user };

  const handleCardClick = useCallback((slug) => {
    const { sortedAll: locs, user: u } = latest.current;
    const loc = locs.find(l => l.slug === slug);
    const nearby = loc && !loc.unlocked && loc._distance != null && loc._distance <= NEARBY_REVEAL_M;
    setAutoCheckIn(!!(u && nearby));
    setSelectedSlug(slug);
  }, []);

  // Where the signed-in user is standing ("Prague 7, Holešovice"), shown
  // under the "Collect every card" title in place of the intro line. Worked
  // out on the device from the quarter/district boundaries (loaded the first
  // time a position is known). Guests, users without a position and users
  // outside Prague keep the intro line.
  const [areasData, setAreasData] = useState(null);
  const hasPos = !!userPos;
  useEffect(() => {
    if (user && hasPos && !areasData) loadPragueAreas().then(setAreasData).catch(() => {});
  }, [user, hasPos, areasData]);
  const myArea = useMemo(
    () => (user && areasData && userPos ? areaIn(areasData, userPos.lat, userPos.lng) : null),
    [user, areasData, userPos?.lat, userPos?.lng],
  );
  // Chinese adds the Czech name in brackets, unless that would only fit a
  // phone's row at a tiny size (compact, set by the fit below).
  const [compact, setCompact] = useState(false);
  let hereText = null;
  let hereKey = null;
  let hereParts = null;
  if (myArea) {
    const quarter = quarterName(myArea.quarter, lang);
    const district = myArea.district ? t('detail.district', { n: myArea.district.slice(6) }) : null;
    hereKey = `${lang}|${myArea.district}|${myArea.quarter}`;
    // The district and the quarter are separate buttons, each opening its own
    // guide (AreaGuideModal; an area without one yet says it is coming).
    const quarterText = lang === 'zh' && !compact ? `${quarter}（${myArea.quarter}）` : quarter;
    hereParts = {
      district: district && { kind: 'district', value: myArea.district, text: district },
      sep: lang === 'zh' ? '，' : ', ',
      quarter: { kind: 'quarter', value: myArea.quarter, text: quarterText },
    };
    hereText = `${district ? district + hereParts.sep : ''}${quarterText}`;
  }
  useEffect(() => { setCompact(false); }, [hereKey]);

  // The badge stays on one line: if the text doesn't fit the row (long
  // quarter names on a phone), its font shrinks until it does. Should Chinese
  // need less than 14px, the bracketed Czech name is dropped instead.
  const hereRef = useRef(null);
  useLayoutEffect(() => {
    const el = hereRef.current;
    if (!el) return undefined;
    const fit = () => {
      el.style.removeProperty('font-size');
      let size = parseFloat(getComputedStyle(el).fontSize);
      for (let i = 0; i < 24 && el.scrollWidth > el.clientWidth && size > 11; i++) {
        size -= 0.5;
        el.style.setProperty('font-size', `${size}px`, 'important');
      }
      if (lang === 'zh' && !compact && (size < 14 || el.scrollWidth > el.clientWidth)) setCompact(true);
    };
    fit();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    ro?.observe(el.parentElement);
    document.fonts?.ready.then(fit);
    return () => ro?.disconnect();
  }, [hereText, lang, compact]);

  // With an area picked, the title becomes the area's name plus a short intro.
  const areaActive = wide ? area : cityOnly && !inCollection && area;
  const beyondCity = area?.kind === 'outside';
  const areaBlurb  = !areaActive ? null : beyondCity ? RARITY_QUIP.expedition : AREA_BLURBS[area.kind]?.[area.value];
  // Under the title / "where you are" line, one description at a time: the
  // picked rarity's first, then the area's, then the My Collections hint.
  // On a 2K screen these move under the map (ExploreApplied).
  const rarityBlurb = rarity && !wide ? (RARITY_BLURB[lang] || RARITY_BLURB.en)[rarity] : null;
  const titleText  = areaActive
    ? convert(beyondCity ? (RARITY_LABEL[lang]?.expedition ?? RARITY_LABEL.en.expedition) : area.kind === 'district' ? t('detail.district', { n: area.value.slice(6) }) : quarterName(area.value, lang))
    : t(guest ? 'explore.titleGuest' : cityOnly ? 'explore.titleCity' : 'explore.title');

  const changeScope = city => { setCityOnly(city); if (!city || beyondCity) setArea(null); };
  // My Collections shows every collected card, so it has neither control.
  const scopeToggle = wide ? (
    <div className={`scope-controls${inCollection ? ' scope-controls--off' : ''}`}>
      <ScopeToggle cityOnly={cityOnly} onChange={changeScope} />
    </div>
  ) : inCollection ? null : (
    <div className="scope-controls">
      <ScopeToggle cityOnly={cityOnly} onChange={changeScope} />
      {cityOnly && <AreaFilter area={area} onChange={setArea} />}
    </div>
  );

  // The title always sits on exactly one line, filling it on phones. Area
  // names are short, so they keep the base size and only ever shrink.
  const titleRef = useRef(null);
  // In the 2K side column the main title fills the column's width too.
  useFitOneLine(titleRef, [titleText, lang, loading, wide], { maxScale: areaActive ? 1 : wide ? 1.8 : 1.5, growBelow: wide ? Infinity : 600 });

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  // Touch screens get the long-press version, mice the double click.
  const showcaseHint = (
    <>
      <span className="explore-hint--touch">{convert(t('explore.showcaseHintTouch'))}</span>
      <span className="explore-hint--mouse">{convert(t('explore.showcaseHintMouse'))}</span>
    </>
  );
  // On a 2K screen the lines that come and go with a mode sit under the map, so
  // the header keeps its height and the map stays where it is (user's call).
  const sideNotes = [
    !cityOnly && !inCollection && { key: 'all', body: convert(t('explore.allBlurb')) },
    inCollection && hasCollected && { key: 'hint', body: showcaseHint },
  ].filter(Boolean);

  // What the space under the map says while no filter is on.
  let hereCard = null;
  if (wide && myArea?.district) {
    hereCard = {
      areas: [
        { kind: 'district', value: myArea.district, name: t('detail.district', { n: myArea.district.slice(6) }) },
        { kind: 'quarter', value: myArea.quarter, name: quarterName(myArea.quarter, lang) },
      ].map(a => ({ ...a, blurb: AREA_BLURBS[a.kind][a.value], onOpenGuide: () => setAreaGuide({ kind: a.kind, value: a.value }) })),
    };
  }

  let nextUp = null;
  if (wide && user) {
    const nearest = sortedAll.find(l => !l.unlocked && l._distance != null);
    const levels = achData?.levels ?? [];
    const xp = user.totalXP ?? 0;
    const nextIndex = levels.findIndex(l => l.xpRequired > xp);
    const floor = nextIndex > 0 ? levels[nextIndex - 1].xpRequired : 0;
    nextUp = {
      // Straight to the card's detail, never the nearby auto check-in.
      nearest: nearest ? {
        distance: formatDistance(nearest._distance),
        onOpen: () => { setAutoCheckIn(false); setSelectedSlug(nearest.slug); },
      } : null,
      onOpenLevels: () => setLevelsOpen(true),
      level: nextIndex < 0 ? null : {
        next: levels[nextIndex].level,
        name: (lang === 'zh' ? levels[nextIndex].title_zh : lang === 'cz' ? levels[nextIndex].title_cz : null) ?? levels[nextIndex].title,
        left: levels[nextIndex].xpRequired - xp,
        percent: Math.round(((xp - floor) / (levels[nextIndex].xpRequired - floor)) * 100),
      },
      hunt: huntStatus,
      onHuntEnded: refreshHunt,
      reading,
      achievements: closestAchievements(achData?.achievements ?? [], 12),
    };
  }

  const header = (
      <div className="explore-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <h1 ref={titleRef} className="px-title explore-title explore-title--fit">{titleText}</h1>
            {areaActive && !wide
              // The short blurb (if the area has one) and the link to its guide.
              ? !rarityBlurb && (
                <p className="explore-area-blurb">
                  {areaBlurb && convert(areaBlurb[lang] || areaBlurb.en)}
                  {areaBlurb && ' '}
                  <button type="button" className="area-guide-link" onClick={() => setAreaGuide({ kind: area.kind, value: area.value })}>
                    {convert(t('areaGuide.more'))}
                  </button>
                </p>
              )
              : (cityOnly || wide) && hereText
                ? (
                  <p ref={hereRef} className="explore-here">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
                    </svg>
                    <span className="explore-here__parts">
                      {[hereParts.district, hereParts.quarter].filter(Boolean).map((part, i) => (
                        <span key={part.kind} className="explore-here__seg">
                          {i > 0 && <span className="explore-here__divider" aria-hidden="true" />}
                          <button
                            type="button"
                            className="explore-here__part"
                            title={t('areaGuide.open')}
                            onClick={() => setAreaGuide({ kind: part.kind, value: part.value })}
                          >
                            {convert(part.text)}
                          </button>
                        </span>
                      ))}
                    </span>
                  </p>
                )
              // With a rarity picked, its description replaces the intro line.
              : rarityBlurb ? null
              : cityOnly || wide
                // Phones get a shorter line, so it fits on one line.
                ? <p className="explore-area-blurb">
                    <span className="explore-blurb--wide">{convert(t('explore.cityBlurb'))}</span>
                    <span className="explore-blurb--narrow">{convert(t('explore.cityBlurbShort'))}</span>
                  </p>
                // Show all: the day-trip pitch, but not inside My Collections,
                // where the showcase hint below takes its place.
                : !inCollection && <p className="explore-area-blurb">{convert(t('explore.allBlurb'))}</p>}
            {rarityBlurb && <p className="explore-rarity-blurb">{convert(rarityBlurb)}</p>}
            {!wide && inCollection && hasCollected && !areaActive && !rarityBlurb && (
              // Not shown under an area filter, where the area blurb has the space.
              <p className="explore-showcase-hint">{showcaseHint}</p>
            )}
          </div>
          {!wide && <div className="explore-header__scope">{scopeToggle}</div>}
        </div>
      </div>
  );
  const grid = (
    <LocationGrid
      locations={sortedLocations}
      collectionLocations={collectionLocations}
      onCardClick={handleCardClick}
      scopeToggle={scopeToggle}
      hideOutsideLabel={cityOnly}
      onCollectionChange={setInCollection}
      onRarityChange={setRarity}
      initialFilter={initialFilter}
      wide={wide}
      fitRows={!wide ? 0 : belowTwoK ? 2 : 3}
      filterSlot={filterSlot}
      appliedSlot={appliedSlot}
      renderApplied={(filters) => (
        <ExploreApplied
          {...filters}
          notes={sideNotes}
          here={hereCard}
          tip={tip}
          isGuest={guest && !user}
          collection={inCollection && user ? locations : null}
          nextUp={nextUp}
          onOpenAchievement={setOpenAch}
          area={area}
          areaName={titleText}
          areaBlurb={areaBlurb}
          onClearArea={() => setArea(null)}
          onClearAll={() => { filters.onClearAll(); setArea(null); }}
          onOpenGuide={beyondCity ? null : () => setAreaGuide({ kind: area.kind, value: area.value })}
        />
      )}
    />
  );

  return (
    <div className={`explore-page${wide ? ' explore-page--wide' : ''}`}>
      {wide ? (
        <>
          <aside className="explore-side">
            {header}
            <div ref={setFilterSlot} className="explore-side__filters" />
            <ExploreMap locations={locations} area={area} onArea={setArea} outside={!cityOnly} here={myArea} foldable={belowTwoK} />
            <div ref={setAppliedSlot} className="explore-side__applied" />
          </aside>
          <div className="explore-main">{grid}</div>
        </>
      ) : (
        <>
          {header}
          {grid}
        </>
      )}

      {areaGuide && (
        <AreaGuideModal kind={areaGuide.kind} value={areaGuide.value} locations={locations} onClose={() => setAreaGuide(null)} />
      )}

      {selectedSlug && (
        <LocationDetail
          slug={selectedSlug}
          onClose={() => { setSelectedSlug(null); setAutoCheckIn(false); }}
          onCheckIn={handleCheckIn}
          onUpdate={handleUpdate}
          autoCheckIn={autoCheckIn}
        />
      )}

      {openAch && <AchievementModal achievement={openAch} onClose={() => setOpenAch(null)} />}
      {levelsOpen && <LevelsModal currentLevel={user?.explorerLevel ?? 1} onClose={() => setLevelsOpen(false)} />}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
