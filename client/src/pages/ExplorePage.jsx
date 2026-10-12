import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { locationAPI } from '../services/api';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import { quarterName } from '../utils/pragueQuarters';
import { AREA_BLURBS } from '../utils/areaBlurbs';
import { useAuth } from '../context/AuthContext';
import { useUserPosition } from '../hooks/useUserPosition';
import { haversineDistance, NEARBY_REVEAL_M } from '../utils/geolocation';
import LocationGrid from '../components/locations/LocationGrid';
import LocationDetail from '../components/locations/LocationDetail';
import ToastContainer from '../components/shared/Toast';
import { useFitOneLine } from '../hooks/useFitOneLine';
import ScopeToggle, { isInCity } from '../components/locations/ScopeToggle';
import AreaFilter, { matchesArea } from '../components/locations/AreaFilter';

let toastId = 0;

export default function ExplorePage() {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const { user, guest } = useAuth();
  const { state, search } = useLocation();
  const navigate = useNavigate();
  const userPos                          = useUserPosition();
  const [locations, setLocations]       = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [autoCheckIn, setAutoCheckIn]   = useState(false);
  // Default to the city proper: cards tagged `outside` lie beyond Prague's
  // administrative boundary (day trips), shown only on "Show all".
  const [cityOnly, setCityOnly]         = useState(true);
  // District / historical-quarter filter; only offered in "City only" mode.
  const [area, setArea]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [toasts, setToasts]             = useState([]);

  // Refetched when the signed-in user changes, e.g. when a sign-in that
  // was retried in the background (AuthContext) lands after the first load.
  const userId = user?._id;
  useEffect(() => {
    locationAPI.getAll()
      .then(res => setLocations(res.data))
      .finally(() => setLoading(false));
  }, [userId]);

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
    result.newAchievements?.forEach(a =>
      addToast(`Achievement unlocked: ${a.id.replace(/_/g, ' ')}`, 'info')
    );
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

  // City only / area filter. "My Collections" ignores it (LocationGrid gets
  // sortedAll for that view): a collection shows everything collected.
  const sortedLocations = useMemo(
    () => (cityOnly ? sortedAll.filter(l => isInCity(l) && matchesArea(l, area)) : sortedAll),
    [sortedAll, cityOnly, area],
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

  // With an area picked, the title becomes the area's name plus a short intro.
  const areaActive = cityOnly && area;
  const areaBlurb  = areaActive ? AREA_BLURBS[area.kind]?.[area.value] : null;
  const titleText  = areaActive
    ? convert(area.kind === 'district' ? t('detail.district', { n: area.value.slice(6) }) : quarterName(area.value, lang))
    : t(guest ? 'explore.titleGuest' : cityOnly ? 'explore.titleCity' : 'explore.title');

  const changeScope = city => { setCityOnly(city); if (!city) setArea(null); };
  const scopeToggle = (
    <div className="scope-controls">
      <ScopeToggle cityOnly={cityOnly} onChange={changeScope} />
      {cityOnly && <AreaFilter area={area} onChange={setArea} />}
    </div>
  );

  // The title always sits on exactly one line, filling it on phones. Area
  // names are short, so they keep the base size and only ever shrink.
  const titleRef = useRef(null);
  useFitOneLine(titleRef, [titleText, lang, loading], { maxScale: areaActive ? 1 : 1.5 });

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="explore-page">
      <div className="explore-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <h1 ref={titleRef} className="px-title explore-title explore-title--fit">{titleText}</h1>
            {areaActive
              ? areaBlurb && <p className="explore-area-blurb">{convert(areaBlurb[lang] || areaBlurb.en)}</p>
              : !cityOnly && <p className="explore-area-blurb">{convert(t('explore.allBlurb'))}</p>}
          </div>
          <div className="explore-header__scope">{scopeToggle}</div>
        </div>
      </div>

      <LocationGrid locations={sortedLocations} collectionLocations={sortedAll} onCardClick={handleCardClick} scopeToggle={scopeToggle} hideOutsideLabel={cityOnly} />

      {selectedSlug && (
        <LocationDetail
          slug={selectedSlug}
          onClose={() => { setSelectedSlug(null); setAutoCheckIn(false); }}
          onCheckIn={handleCheckIn}
          onUpdate={handleUpdate}
          autoCheckIn={autoCheckIn}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
