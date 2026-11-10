import { useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { locationAPI, checkinAPI } from '../services/api';
import { useLang, useT, useConvert } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getLocName } from '../utils/locName';
import { getCurrentPosition, haversineDistance, formatDistance } from '../utils/geolocation';
import { useUserPosition } from '../hooks/useUserPosition';
import MapView from '../components/map/MapView';
import MapTopBar from '../components/map/MapTopBar';
import MapAreaFocus from '../components/map/MapAreaFocus';
import DistrictQuarters from '../components/map/DistrictQuarters';
import MapHere from '../components/map/MapHere';
import MapBoundaries from '../components/map/MapBoundaries';
import MapAreaInfo from '../components/map/MapAreaInfo';
import MapBottomBar from '../components/map/MapBottomBar';
import PackLinks from '../components/packs/PackLinks';
import PackCard from '../components/packs/PackCard';
import { PackPanel } from '../components/packs/PackDetail';
import { usePacks } from '../hooks/usePacks';
import { packInArea, packMatches, withPackDistance, nearestPackFirst } from '../utils/packs';
import MapLegend from '../components/map/MapLegend';
import MapFrame from '../components/map/MapFrame';
import MapFilterChips from '../components/map/MapFilterChips';
import AreaGuideModal from '../components/locations/AreaGuideModal';
import { areaIn, loadPragueAreas } from '../utils/pragueAreas';
import ExploreMap from '../components/locations/ExploreMap';
import { useMedia } from '../hooks/useMedia';
import { IS_APPLE } from '../utils/fitPage';
import ScopeToggle, { isInCity } from '../components/locations/ScopeToggle';
import { matchesArea } from '../components/locations/AreaFilter';
import ExploreDrawer from '../components/locations/ExploreDrawer';
import DistrictLine, { descriptiveLabels } from '../components/locations/DistrictLine';
import { getArt, LABEL_DEFINITIONS, LABEL_COLORS } from '../utils/pixelArtMap';
import { getLocalCoverPath } from '../utils/localCover';
import { RARITY_VAR, RARITY_LABEL, CITY_RARITIES, ALL_RARITIES, lockClosedIcon } from '../utils/rarity';
import { playUnlockSound } from '../utils/sound';

const formatDate = (d) => new Date(d).toISOString().slice(0, 10);
// The page's layouts (.map-board in pixelart.css): a 2K screen as designed; Macs the
// same scaled to fit (their screens are sharp enough; user's call); ordinary computer
// screens a tighter version; iPads and narrow laptops that without a right column,
// which slides out instead; phones and upright tablets a full map, the rest in sheets.
const TWO_K_QUERY = '(min-width: 2400px) and (min-height: 1200px)';
const COMPACT_QUERY = '(min-width: 1400px) and (min-height: 650px)';
const APPLE_QUERY = '(min-width: 1024px) and (orientation: landscape)';
// Below this the left column, which must not scroll, can't hold both small maps.
const SHORT_QUERY = '(max-height: 860px)';
const WIDE_COMPACT_QUERY = '(min-width: 1800px)';
const NARROW_QUERY = '(min-width: 1024px) and (min-height: 560px)';
const FOUR_TILES_QUERY = '(min-width: 1180px)';
// iPads call themselves Macs; a touch screen tells them apart.
const IS_TABLET = IS_APPLE && navigator.maxTouchPoints > 0;
// The 2K design's smallest size, which the scale is worked out from.
const DESIGN_WIDTH = 2400;
const DESIGN_HEIGHT = 1140;

export default function MapPage() {
  // Refetched when the signed-in user changes (see ExplorePage).
  const userId = useAuth().user?._id;
  const { lang } = useLang();
  const t = useT();
  const convert = useConvert();
  const navigate = useNavigate();
  const twoK = useMedia(TWO_K_QUERY);
  const compactFits = useMedia(COMPACT_QUERY);
  const appleFits = useMedia(APPLE_QUERY);
  const short = useMedia(SHORT_QUERY);
  const wideCompact = useMedia(WIDE_COMPACT_QUERY);
  const narrowFits = useMedia(NARROW_QUERY);
  const fourTiles = useMedia(FOUR_TILES_QUERY);
  const scaled = !twoK && IS_APPLE && !IS_TABLET && appleFits;
  const threeColumns = !twoK && !scaled && !IS_TABLET && compactFits;
  const narrow = !twoK && !scaled && !threeColumns && narrowFits;
  const compact = threeColumns || narrow;
  const phone = !twoK && !scaled && !compact;
  const swapMaps = compact && short;
  const maxTiles = phone ? 4 : narrow ? (fourTiles ? 4 : 3) : compact ? (wideCompact ? 5 : 4) : 6;
  const [infoOpen, setInfoOpen] = useState(false);
  const [sheet, setSheet] = useState(null); // on phones: 'area' | 'info' | 'near'
  const pageRef = useRef(null);
  const [uiScale, setUiScale] = useState(1);
  const userPos = useUserPosition();
  const [areasData, setAreasData] = useState(null);
  const [areaGuide, setAreaGuide] = useState(null);
  useLayoutEffect(() => {
    if (!scaled || !pageRef.current) return undefined;
    const fit = () => {
      const top = pageRef.current?.getBoundingClientRect().top ?? 0;
      setUiScale(Math.min(1, window.innerWidth / DESIGN_WIDTH, (window.innerHeight - top) / DESIGN_HEIGHT));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  });
  const knowsPosition = !!userPos;
  useEffect(() => {
    if (knowsPosition && !areasData) loadPragueAreas().then(setAreasData).catch(() => {});
  }, [knowsPosition, areasData]);
  const myArea = useMemo(
    () => (knowsPosition && areasData ? areaIn(areasData, userPos.lat, userPos.lng) : null),
    [knowsPosition, areasData, userPos?.lat, userPos?.lng],
  );
  const [locations, setLocations]       = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [flyTo, setFlyTo]               = useState(null);
  useEffect(() => { if (selectedSlug) setInfoOpen(false); }, [selectedSlug]);
  const rightColumnRef = useRef(null);
  // A pack in the right column; a chosen card lies on top of it, and closing the
  // card comes back to it.
  const [selectedPack, setSelectedPack] = useState(null);
  useEffect(() => { if (rightColumnRef.current) rightColumnRef.current.scrollTop = 0; }, [selectedSlug, selectedPack]);
  const [loading, setLoading]           = useState(true);
  const [toasts, setToasts]             = useState([]);
  const [activeLabels, setActiveLabels]     = useState(new Set());
  const [activeRarities, setActiveRarities] = useState(new Set());
  const [search, setSearch]                 = useState('');
  const [cityOnly, setCityOnly]             = useState(true);
  const [area, setArea]                     = useState(null);
  const [sort, setSort]                     = useState('distance');
  const [packsOnly, setPacksOnly]           = useState(false);
  const closeSheet = useCallback(() => { setSheet(null); setSelectedSlug(null); setSelectedPack(null); }, []);

  useEffect(() => {
    locationAPI.getAll()
      .then(res => setLocations(res.data))
      .finally(() => setLoading(false));
  }, [userId]);

  useEffect(() => {
    const handler = (e) =>
      setLocations(prev => prev.map(l => l.slug === e.detail.slug ? { ...l, unlocked: true } : l));
    window.addEventListener('proximity-checkin', handler);
    return () => window.removeEventListener('proximity-checkin', handler);
  }, []);

  const collectedCount = useMemo(() => locations.filter(l => l.unlocked).length, [locations]);
  const allPacks = usePacks(collectedCount);
  // The packs the filters leave, nearest first. Packs have no rarity, so a rarity
  // filter leaves none (as on Explore).
  const shownPacks = useMemo(() => {
    if (activeRarities.size > 0) return [];
    const matching = allPacks.filter(p => packInArea(p, area) && packMatches(p, search, activeLabels));
    return withPackDistance(matching, locations, userPos).sort(nearestPackFirst);
  }, [allPacks, area, search, activeLabels, activeRarities, locations, userPos]);

  const filteredLocations = useMemo(() => {
    let list = (cityOnly ? locations.filter(isInCity) : locations).filter(l => matchesArea(l, area));
    // With the Packs filter the search and labels have picked the packs; the map
    // shows those packs' cards.
    if (packsOnly) {
      const members = new Set(shownPacks.flatMap(p => p.memberSlugs || []));
      return list.filter(l => members.has(l.slug));
    }
    if (activeLabels.size > 0) {
      list = list.filter(l =>
        Array.from(activeLabels).every(lb => (l.labels || []).includes(lb))
      );
    }
    if (activeRarities.size > 0) {
      list = list.filter(l => activeRarities.has(l.rarity ?? 'common'));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.localizedNames?.cz?.toLowerCase().includes(q) ||
        l.localizedNames?.zh?.includes(search.trim())
      );
    }
    return list;
  }, [locations, cityOnly, area, activeLabels, activeRarities, search, packsOnly, shownPacks]);

  // Under the Packs filter a pack the filters no longer leave closes, like a card.
  useEffect(() => {
    if (packsOnly && selectedPack && !shownPacks.some(p => p.slug === selectedPack)) setSelectedPack(null);
  }, [packsOnly, selectedPack, shownPacks]);

  // An `outside` label filter would empty the map in "City only" mode.
  useEffect(() => {
    if (cityOnly && activeLabels.has('outside')) {
      setActiveLabels(prev => { const next = new Set(prev); next.delete('outside'); return next; });
    }
  }, [cityOnly, activeLabels]);
  // Expedition is the outside cards' rarity: only offered with "Show all".
  useEffect(() => {
    if (cityOnly && activeRarities.has('expedition')) {
      setActiveRarities(prev => { const next = new Set(prev); next.delete('expedition'); return next; });
    }
  }, [cityOnly, activeRarities]);
  const rarityOptions = cityOnly ? CITY_RARITIES : ALL_RARITIES;

  useEffect(() => {
    if (!selectedSlug) return;
    const stillVisible = filteredLocations.some(l => l.slug === selectedSlug);
    if (!stillVisible) setSelectedSlug(null);
  }, [filteredLocations, selectedSlug]);

  const toggleLabel = (lb) => {
    setActiveLabels(prev => {
      const next = new Set(prev);
      if (next.has(lb)) next.delete(lb);
      else next.add(lb);
      return next;
    });
  };

  // One rarity at a time, as on Explore.
  const toggleRarity = (r) => {
    setActiveRarities(prev => { const next = new Set(prev); if (!next.delete(r)) next.add(r); return next; });
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const handleCheckIn = (slug, result) => {
    setLocations(prev => prev.map(l => l.slug === slug ? { ...l, unlocked: true, _checkedInAt: new Date().toISOString() } : l));
    addToast(`+${result.xpEarned} XP — ${result.levelInfo.title}!`);
  };

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  const selected = selectedSlug ? filteredLocations.find(l => l.slug === selectedSlug) : null;
  const changeScope = city => { setCityOnly(city); if (!city || area?.kind === 'outside') setArea(null); };
  // A quarter chosen inside a district keeps that district chosen on the upper map.
  const parentDistrict = area?.kind === 'district' ? area.value : area?.kind === 'quarter' ? area.district ?? area.homeDistrict ?? null : null;
  const upperArea = parentDistrict ? { kind: 'district', value: parentDistrict } : area;
  // With no district chosen, the lower map shows the one the player is in.
  const shownDistrict = parentDistrict ?? myArea?.district ?? null;
  // An area the player picks (the left column's maps, a click on the map, the
  // chips, the back button) closes an open pack, so the right column follows
  // the new area (2026-11-10). Opening a card from the pack may also move the
  // area, but goes through setArea, so closing the card still leads back to it.
  const chooseArea = next => { setSelectedPack(null); setArea(next); };
  const pickQuarter = name => chooseArea(area?.kind === 'quarter' && area.value === name
    ? { kind: 'district', value: shownDistrict }
    : { kind: 'quarter', value: name, district: shownDistrict });
  const markedQuarter = area?.kind === 'quarter' ? area.value : area ? null : myArea?.quarter ?? null;
  const pickCard = card => { setSelectedSlug(card.slug); setFlyTo({ ...card.coordinates }); };
  // A landmark the filters hide (a label filter, the other side of a district line)
  // brings its own quarter into view, or the selection wouldn't hold.
  const pickLandmark = card => {
    if (!filteredLocations.some(l => l.slug === card.slug)) {
      setPacksOnly(false);
      setSearch('');
      setActiveLabels(new Set());
      setActiveRarities(new Set());
      setArea(card.quarter ? { kind: 'quarter', value: card.quarter, district: card.district } : null);
    }
    pickCard(card);
  };
  const leavePacks = () => { setPacksOnly(false); setSelectedPack(null); if (sheet === 'packs') setSheet(null); };
  const togglePacks = () => {
    if (packsOnly) { leavePacks(); return; }
    setPacksOnly(true);
    setSelectedPack(null);
    setSelectedSlug(null);
    setActiveRarities(new Set());
    if (phone) setSheet('packs');
  };
  const pickPack = slug => { setSelectedSlug(null); setInfoOpen(false); setSelectedPack(slug); };
  const pickPackCard = slug => { const card = locations.find(l => l.slug === slug); if (card) pickLandmark(card); };
  const addFilter = (kind, value) => {
    if (kind === 'rarity' && packsOnly) leavePacks();
    (kind === 'label' ? setActiveLabels : setActiveRarities)(prev => new Set(prev).add(value));
  };
  const clearFilters = () => { if (packsOnly) leavePacks(); setSearch(''); setActiveLabels(new Set()); setActiveRarities(new Set()); setArea(null); };
  const hasIntro = !!shownDistrict && area?.kind !== 'outside';
  const chips = (
    <MapFilterChips
      area={area}
      onArea={chooseArea}
      search={search}
      onClearSearch={() => setSearch('')}
      labels={[...activeLabels]}
      onToggleLabel={toggleLabel}
      rarities={[...activeRarities]}
      onToggleRarity={toggleRarity}
      packsOnly={packsOnly}
      onClearPacks={leavePacks}
      onClearAll={clearFilters}
    />
  );
  const cardDetail = selected && (
    <SidebarDetail
      slug={selectedSlug}
      onCheckIn={handleCheckIn}
      onViewDetail={(slug) => navigate('/explore', { state: { openSlug: slug } })}
      onAddFilter={addFilter}
      onArea={a => chooseArea(a.kind === 'quarter' ? { kind: 'quarter', value: a.value, district: a.district } : { kind: 'district', value: a.value })}
      onOpenPack={pickPack}
    />
  );
  const bottomBar = (
    <MapBottomBar
      filtered={filteredLocations}
      selected={selected}
      sort={sort}
      userPos={userPos}
      collectedCount={collectedCount}
      maxTiles={maxTiles}
      onPick={pickCard}
      packs={allPacks}
      leadPacks={packsOnly || area ? shownPacks : []}
      onPickPack={pickPack}
    />
  );
  const packPanel = selectedPack && <PackPanel slug={selectedPack} refresh={collectedCount} onPickCard={pickPackCard} />;
  const packList = (
    <div className="map-pack-list">
      <h2 className="px-title profile-card-title map-pack-list__title">{t('grid.filterPacks')}</h2>
      {shownPacks.length ? (
        <div className="map-pack-list__grid">
          {/* Whole packs: the list has the room on every screen (2026-11-10, user's call). */}
          {shownPacks.map(pack => <PackCard key={pack.slug} pack={pack} onClick={pickPack} />)}
        </div>
      ) : <p className="map-bottom__empty">{t('grid.noResults')}</p>}
    </div>
  );
  const rightOpen = !!(selected || selectedPack || packsOnly || infoOpen);
  const areaIntro = <MapAreaInfo district={hasIntro ? shownDistrict : null} quarter={markedQuarter} locations={locations} area={area} onPickLandmark={pickLandmark} />;

  return (
    <div
      ref={pageRef}
      className={`map-page map-board${compact ? ' map-board--compact' : ''}${narrow ? ' map-board--narrow' : ''}${scaled ? ' map-board--scaled' : ''}${phone ? ' map-board--phone' : ''}`}
      style={{ '--map-ui': uiScale, '--map-tiles': maxTiles }}
    >
      <div className="map-container">
        <MapView
          locations={filteredLocations}
          selectedSlug={selectedSlug}
          onLocationClick={setSelectedSlug}
          cityOnly={cityOnly}
          touch={phone}
          viewButton={narrow && hasIntro && !selected && !infoOpen ? { label: t('map.areaIntro'), onClick: () => setInfoOpen(true) } : null}
        >
          <MapBoundaries area={area} cityOnly={cityOnly} onArea={chooseArea} />
          <MapAreaFocus area={area} cityOnly={cityOnly} flyTo={flyTo} selected={selected} panelRef={narrow ? rightColumnRef : null} />
        </MapView>
        <MapFrame />
        <MapLegend />
      </div>

      {!phone && (
      <div className="map-slot map-slot--left">
          <>
            {myArea && <MapHere here={myArea} onOpenGuide={setAreaGuide} />}
            <ScopeToggle cityOnly={cityOnly} onChange={changeScope} />
            <div className="map-left__heading">{t('explore.mapFilterLabel')}</div>
            {swapMaps && parentDistrict ? (
              <button type="button" className="filter-btn map-back" onClick={() => chooseArea(null)}>{t('map.backToDistricts')}</button>
            ) : (
              <ExploreMap locations={locations} area={upperArea} onArea={chooseArea} outside={!cityOnly} here={myArea} showToggle={false} />
            )}
            {(!swapMaps || parentDistrict) && (
              <DistrictQuarters
                district={shownDistrict}
                selected={markedQuarter}
                locations={locations}
                onPick={pickQuarter}
                area={area}
                onArea={chooseArea}
              />
            )}
            {chips}
          </>
      </div>
      )}
      <div className="map-slot map-slot--top">
        <MapTopBar
          cityOnly={cityOnly}
          area={area}
          search={search}
          onSearch={setSearch}
          activeLabels={activeLabels}
          onToggleLabel={toggleLabel}
          onClearLabels={() => setActiveLabels(new Set())}
          activeRarities={activeRarities}
          onToggleRarity={toggleRarity}
          onClearRarities={() => setActiveRarities(new Set())}
          rarityOptions={rarityOptions}
          sort={sort}
          onSort={setSort}
          packsOnly={packsOnly}
          onTogglePacks={togglePacks}
        />
      </div>
      {!phone && <div className="map-slot map-slot--bottom">{bottomBar}</div>}
      {!phone && (
      <div className={`map-slot map-slot--right${rightOpen ? ' map-slot--open' : ''}`} ref={rightColumnRef}>
        {narrow && !rightOpen ? null : selected ? (
          <>
            {/* The column is short on an ordinary screen: there the card has it to itself. */}
            {!compact && <MapAreaInfo district={selected.district ?? null} quarter={selected.quarter ?? null} locations={locations} compact />}
            <div className="map-card">
              <button type="button" className="map-card__close" aria-label={t('areaGuide.close')} onClick={() => setSelectedSlug(null)}>✕</button>
              {cardDetail}
            </div>
          </>
        ) : selectedPack ? (
          <div className="map-card">
            <button type="button" className="map-card__close" aria-label={t('areaGuide.close')} onClick={() => setSelectedPack(null)}>✕</button>
            {packPanel}
          </div>
        ) : packsOnly ? (
          <>
            {narrow && <button type="button" className="map-card__close" aria-label={t('areaGuide.close')} onClick={leavePacks}>✕</button>}
            {packList}
          </>
        ) : (
          <>
            {narrow && <button type="button" className="map-card__close" aria-label={t('areaGuide.close')} onClick={() => setInfoOpen(false)}>✕</button>}
            {areaIntro}
          </>
        )}
      </div>
      )}

      {phone && (
        <div className="map-phone-actions">
          <button type="button" className={`filter-btn${area ? ' filter-btn--active' : ''}`} onClick={() => setSheet('area')}>{t('explore.mapFilterLabel')}</button>
          <button type="button" className="filter-btn" disabled={!hasIntro} onClick={() => setSheet('info')}>{t('map.areaIntro')}</button>
          <button type="button" className="filter-btn" onClick={() => setSheet('near')}>{t('map.nearby')}</button>
        </div>
      )}
      {phone && (sheet || selected || selectedPack) && (
        <ExploreDrawer
          onClose={closeSheet}
          label={selected ? getLocName(selected, lang) : selectedPack ? getLocName(allPacks.find(p => p.slug === selectedPack) ?? { name: '' }, lang) : sheet === 'packs' ? t('grid.filterPacks') : t('explore.mapFilterLabel')}
          count={!selected && !selectedPack && sheet === 'area' ? filteredLocations.length : undefined}
        >
          {selected ? (
            <div className="map-sheet">
              <div className="map-card">{cardDetail}</div>
              {bottomBar}
            </div>
          ) : selectedPack ? (
            <div className="map-sheet"><div className="map-card">{packPanel}</div></div>
          ) : sheet === 'packs' ? packList : sheet === 'area' ? (
            <>
              {myArea && <MapHere here={myArea} onOpenGuide={setAreaGuide} />}
              <ScopeToggle cityOnly={cityOnly} onChange={changeScope} />
              <ExploreMap locations={locations} area={area} onArea={chooseArea} outside={!cityOnly} here={myArea} />
              {chips}
            </>
          ) : sheet === 'info' ? areaIntro : bottomBar}
        </ExploreDrawer>
      )}

      {areaGuide && <AreaGuideModal kind={areaGuide.kind} value={areaGuide.value} locations={locations} onClose={() => setAreaGuide(null)} />}

      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => <div key={t.id} className={`toast toast--${t.type}`}>{t.message}</div>)}
        </div>
      )}
    </div>
  );
}

// `onAddFilter(kind, value)`: on the Map a label or rarity adds that filter right here;
// an area pill picks that area (`onArea`) and a pack opens in the right column
// (`onOpenPack`), 2026-11-10.
function SidebarDetail({ slug, onCheckIn, onViewDetail, onAddFilter, onArea, onOpenPack }) {
  const { lang } = useLang();
  const t = useT();
  const convert = useConvert();
  const { guest, applyProgress } = useAuth();
  const navigate = useNavigate();
  const userPos = useUserPosition();
  const [loc, setLoc]                     = useState(null);
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [checkInError, setCheckInError]   = useState('');
  const [localFailed, setLocalFailed]     = useState(false);
  const [cloudFailed, setCloudFailed]     = useState(false);

  useEffect(() => {
    setLoading(true);
    setCheckInError('');
    setLocalFailed(false);
    setCloudFailed(false);
    locationAPI.getOne(slug)
      .then(res => setLoc(res.data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div className="spinner" />
      <span style={{ fontFamily: "var(--ui-font)", fontSize: 13, color: 'var(--text-muted)' }}>{t('common.loading')}</span>
    </div>
  );
  if (!loc) return null;

  const desc = convert(loc.description?.[lang] || loc.description?.en || '');
  const TEASER = {
    zh: [
      '......',
      '🔒档案似乎被被锁住了...未完待续...',
      '这个地方等着你亲自到场来解锁完整档案，暂时不予剧透。',
      '“来吧，勇敢的探险家，我会一直等着你~”',
    ],
    en: [
      '......',
      '🔒The archive seems to be locked...To be continued...',
      'This location is waiting for you to unlock its full archive in person. No spoilers — yet.',
      '“Come on, brave adventurer, I will be waiting for you~”',
    ],
    cz: [
      '......',
      '🔒Soubor se zdá být uzamčený....Pokračování příště...',
      'Tento archiv zůstává utajen, dokud sem osobně nedorazíš. Zatím žádné spoilery.',
      '“Pojď, statečný dobrodruhu, budu na tebe čekat~”',
    ],
  };

  const doCheckIn = async () => {
    setActionLoading(true);
    try {
      const coords = await getCurrentPosition();
      const res = await checkinAPI.checkIn(slug, coords);
      setLoc(prev => ({ ...prev, unlocked: true, checkedInAt: new Date().toISOString(), guessAttempt: res.data.guessAttempt, huntMode: res.data.huntMode, xpEarned: res.data.xpEarned }));
      // The server only sent a preview of the story until now: fetch it whole.
      locationAPI.getOne(slug).then(r => setLoc(prev => ({ ...prev, description: r.data.description, storyLocked: r.data.storyLocked }))).catch(() => {});
      playUnlockSound(loc.rarity);
      applyProgress(res.data.levelInfo, res.data.totalXP);
      onCheckIn(slug, res.data);
    } catch (err) {
      setCheckInError(err.response?.data?.message || err.message || 'Check-in failed');
    } finally { setActionLoading(false); }
  };

  const art = getArt(loc.pixelArtKey, loc.labels);
  const localCover = getLocalCoverPath(loc.slug, loc.coverImage);
  const useLocalCover = !!localCover && !localFailed;
  const useCloudCover = !useLocalCover && !!loc.coverImage && !cloudFailed;
  const mapHref = `https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates.lat},${loc.coordinates.lng}`;
  // Unlocked cards keep the whole image clickable to Google Maps; locked
  // cards only navigate via the lock icon, so the wrapper must not also be
  // a link there.
  const ImgWrap = loc.unlocked ? 'a' : 'div';

  return (
    <>
      <ImgWrap
        {...(loc.unlocked
          ? { href: mapHref, target: '_blank', rel: 'noopener noreferrer', title: t('common.googleMaps') }
          : {})}
        style={{ position: 'relative', width: '100%', aspectRatio: '1', background: 'var(--bg-secondary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: loc.unlocked ? 'pointer' : undefined }}
      >
        {useLocalCover ? (
          <img
            src={localCover}
            alt={getLocName(loc, lang)}
            onError={() => setLocalFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', filter: loc.unlocked ? undefined : 'saturate(0.15)' }}
          />
        ) : useCloudCover ? (
          <img
            src={loc.coverImage}
            alt={getLocName(loc, lang)}
            onError={() => setCloudFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', filter: loc.unlocked ? undefined : 'saturate(0.15)' }}
          />
        ) : (
          <span style={{ fontSize: '4rem', filter: loc.unlocked ? undefined : 'saturate(0.15)' }}>{art}</span>
        )}
        {!loc.unlocked && (
          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            title={t('common.googleMaps')}
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', zIndex: 2, cursor: 'pointer' }}
          >
            <img src={lockClosedIcon(loc.rarity)} alt="" style={{ display: 'block', width: '100%', height: 'auto', imageRendering: 'pixelated' }} />
          </a>
        )}
      </ImgWrap>

      <div style={{ padding: 20 }}>
        <h3 className="px-title" style={{ fontSize: 24, lineHeight: lang === 'zh' ? undefined : 1.25, marginBottom: lang !== 'cz' && loc.localizedNames?.cz ? 4 : 12, color: RARITY_VAR[loc.rarity ?? 'common'] }}>{convert(getLocName(loc, lang))}</h3>
        {lang !== 'cz' && loc.localizedNames?.cz && (
          <p style={{ fontFamily: "var(--ui-font)", fontSize: 14, color: 'var(--text-muted)', marginBottom: 12 }}>{loc.localizedNames.cz}</p>
        )}
        <div className="loc-meta-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display: 'inline-block', width: 8, height: 8,
              background: RARITY_VAR[loc.rarity ?? 'common'],
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              flexShrink: 0,
            }} />
            <button type="button" className="loc-meta__rarity tag-button" style={{ color: RARITY_VAR[loc.rarity ?? 'common'] }} onClick={() => onAddFilter('rarity', loc.rarity ?? 'common')}>
              {convert(RARITY_LABEL[lang]?.[loc.rarity ?? 'common'])}
            </button>
            <span className="loc-meta__xp" style={{ color: 'var(--gold)', marginLeft: 4 }}>+{loc.xpReward} XP</span>
          </div>
          {userPos && (
            <span className="loc-meta__distance" style={{ color: RARITY_VAR[loc.rarity ?? 'common'] }}>
              {t('detail.distanceAway', { dist: formatDistance(haversineDistance(userPos.lat, userPos.lng, loc.coordinates.lat, loc.coordinates.lng)) })}
            </span>
          )}
        </div>
        {loc.unlocked && loc.checkedInAt && (
          <div style={{ marginBottom: 4 }}>
            <span style={{ color: 'var(--success-text, #8eff8e)', fontFamily: "var(--ui-font)", fontSize: 12 }}>
              {t('common.visited')}
              {`${lang === 'zh' ? '' : ' '}${t('detail.at')}${lang === 'zh' ? '' : ' '}${formatDate(loc.checkedInAt)}`}
              {loc.guessAttempt > 0 && loc.xpEarned != null && t(loc.huntMode === 'hardcore' ? 'detail.huntFindHardcore' : 'detail.huntFind', { n: loc.guessAttempt, xp: loc.xpEarned })}
            </span>
          </div>
        )}
        <div className="loc-card__labels" style={{ marginBottom: 4 }}>
          {descriptiveLabels(loc.labels).slice(0, 3).map((lb, i) => (
            <button
              type="button"
              key={lb}
              className={`detail-label-pill area-guide-pill tag-button${i === 0 ? ' detail-label-pill--superior' : ''}`}
              title={LABEL_DEFINITIONS[lb]?.en}
              style={{ backgroundColor: LABEL_COLORS[lb] || 'var(--pill-fallback, rgba(255,255,255,0.07))' }}
              onClick={() => onAddFilter('label', lb)}
            >
              {convert(LABEL_DEFINITIONS[lb]?.[lang] || LABEL_DEFINITIONS[lb]?.en || lb)}
            </button>
          ))}
        </div>
        <DistrictLine loc={loc} style={{ marginBottom: 4 }} onArea={onArea} />
        <PackLinks packs={loc.packs} artOnly onOpenPack={onOpenPack} style={{ marginTop: 6, marginBottom: 10 }} />

        {(() => {
          const paras = desc ? desc.split('\n').filter(l => l.trim()) : [];
          if (!paras.length) return (
            <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 14, marginBottom: 16 }}>{t('common.noDesc')}</p>
          );
          const enParas = (loc.description?.en || '').split('\n').filter(l => l.trim());
          const firstEnWords = enParas[0] ? enParas[0].trim().split(/\s+/).length : 0;
          const showCount = paras.length <= 3 || firstEnWords > 30 ? 1 : 2;
          // storyLocked: the server already cut it to the preview.
          const visible = loc.unlocked || loc.storyLocked ? paras : paras.slice(0, showCount);
          return (
            <div style={{ marginTop: 14, marginBottom: 16 }}>
              {visible.map((para, i) => (
                <p key={i} className="detail-desc" style={{ marginBottom: 10 }}>{para}</p>
              ))}
              {!loc.unlocked && (TEASER[lang] || TEASER.en).map((line, i, arr) => (
                <p key={i} className="detail-desc detail-desc--teaser" style={{ marginBottom: i === arr.length - 1 ? 10 : 4, color: 'var(--text-muted)' }}>
                  {convert(line)}
                </p>
              ))}
            </div>
          );
        })()}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loc.wikipediaUrl && (
            <a className="detail-wiki" href={loc.wikipediaUrl} target="_blank" rel="noopener noreferrer">
              {t('common.wikipedia')}
            </a>
          )}
          <a
            className="detail-wiki"
            href={`https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates.lat},${loc.coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('common.googleMaps')}
          </a>
          {loc.createdAt && (
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 13, color: 'var(--gold)', fontFamily: "var(--ui-font)" }}>
                {`${t('detail.added')}${lang === 'zh' ? '' : ' '}${t('detail.at')}${lang === 'zh' ? '' : ' '}${formatDate(loc.createdAt)}`}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            {guest ? (
              <button className="px-btn px-btn--gold" onClick={() => navigate('/login')}>
                {t('auth.loginToCollect')}
              </button>
            ) : loc.unlocked ? null : (
              <button className="px-btn px-btn--gold" onClick={doCheckIn} disabled={actionLoading}>
                {actionLoading ? '...' : `${t('common.checkIn')} (+${loc.xpReward} XP)`}
              </button>
            )}
            <button className="px-btn px-btn--dark" onClick={() => onViewDetail(loc.slug)}>
              View Detail
            </button>
          </div>
          {checkInError && (
            <p style={{ color: 'var(--danger-text, #ff6b6b)', fontSize: 13, marginTop: 8 }}>{checkInError}</p>
          )}
        </div>
      </div>
    </>
  );
}
