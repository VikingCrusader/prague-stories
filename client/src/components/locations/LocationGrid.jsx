import { useState, useMemo, useEffect, useRef, useDeferredValue } from 'react';
import { createPortal } from 'react-dom';
import LocationCard from './LocationCard';
import PackCard from '../packs/PackCard';
import { useCardPreview } from './CardPreview';
import { useFitRows } from '../../hooks/useFitRows';
import { viewportRect } from '../../utils/fitPage';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import LabelFilterGroups from './LabelFilterGroups';
import { RARITY_VAR, RARITY_LABEL, RARITY_ICON, CITY_RARITIES, ALL_RARITIES } from '../../utils/rarity';
import { NEARBY_REVEAL_M } from '../../utils/geolocation';
import { packMatches, nearestPackFirst } from '../../utils/packs';
import { firstVisitOrder, featuredPacksFirst, interleavePacks, isFeatured } from '../../utils/gridOrder';

// Expedition sorts first (it pays 60-300 XP), highest XP first among them.
export const RARITY_ORDER = { expedition: -1, legend: 0, mythic: 1, epic: 2, superior: 3, rare: 4, common: 5 };
export const SORT_MODES = ['distance', 'newest', 'rarity'];
const SORT_MODES_COLLECTED = ['distance', 'newest', 'rarity', 'checkin'];
export const SORT_KEY = { distance: 'grid.sortDistance', newest: 'grid.sortNewest', rarity: 'grid.sortRarity', checkin: 'grid.sortCheckin' };
// Cards are mounted in batches as the user scrolls — mounting all ~1300 at once
// (each with a cover image, a label-fit measurement and a ResizeObserver) made
// every search keystroke stall.
const PAGE_SIZE = 60;

// `onCollectionChange` (optional) hears whether "My Collections" is on, so
// the page header can react to it (ExplorePage's showcase hint).
// `wide` (Explore on a 2K screen) puts the search, filters and count into
// `filterSlot`, an element in the side column, and what `renderApplied` returns
// for the filters that are on into `appliedSlot`.
// `initialFilter` ({ rarity, label }) opens the grid already filtered, e.g. on
// Expedition from the nudge on the profile's empty expedition strip.
export default function LocationGrid({ locations: scopedLocations, collectionLocations, onCardClick, scopeToggle, hideOutsideLabel, onCollectionChange, onRarityChange, initialFilter, wide = false, fitRows = 0, filterSlot = null, appliedSlot = null, exitSlot = null, loadTreasures = null, renderApplied, onCountChange, filtersFolded = false, onToggleFilters, filterExtraCount = 0, onClearFilters, onViewFilters, onFilterCount, toolbarExtra = null, packs = [], onPackClick, areaChosen = false, guestPreview = false }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [discovered, setDiscovered]         = useState(false);
  // "My Collections" lists every collected card, city or outside, whatever
  // City only says (ExplorePage passes that list as collectionLocations).
  const locations = discovered && collectionLocations ? collectionLocations : scopedLocations;
  useEffect(() => { onCollectionChange?.(discovered); }, [discovered, onCollectionChange]);
  // The cards found on the Treasure Hunt (slugs), read each time the collection
  // opens; null until known. `treasureOnly` narrows the collection to them.
  const [treasureSlugs, setTreasureSlugs] = useState(null);
  const [treasureOnly, setTreasureOnly]   = useState(false);
  useEffect(() => {
    if (!discovered || !wide || !loadTreasures) return undefined;
    let stale = false;
    loadTreasures()
      .then(res => { if (!stale) setTreasureSlugs(new Set(res.data.map(l => l.slug))); })
      .catch(() => {});
    return () => { stale = true; };
  }, [discovered, wide, loadTreasures]);
  const [activeLabels, setActiveLabels]     = useState(() => new Set(initialFilter?.label ? [initialFilter.label] : []));
  const [activeRarities, setActiveRarities] = useState(() => new Set(initialFilter?.rarity ? [initialFilter.rarity] : []));
  // Packs only, no cards. They have no rarity, so that filter and the sort are
  // off meanwhile; labels, search and the area still apply.
  const [packsOnly, setPacksOnly] = useState(false);
  // The picked rarity (or null), so ExplorePage can show its description.
  // The header only has room for one description, so it shows with a single rarity.
  const activeRarity = activeRarities.size === 1 ? [...activeRarities][0] : null;
  useEffect(() => { onRarityChange?.(activeRarity); }, [activeRarity, onRarityChange]);
  const [labelsOpen, setLabelsOpen]         = useState(false);
  const [raritiesOpen, setRaritiesOpen]     = useState(false);
  const [sortOpen, setSortOpen]             = useState(false);
  const [sort, setSort]                     = useState('distance');
  const [search, setSearch]                 = useState('');
  const [visibleCount, setVisibleCount]     = useState(PAGE_SIZE);
  // Filter against a deferred copy so the input itself stays responsive while
  // the grid catches up in a lower-priority render.
  const deferredSearch = useDeferredValue(search);
  const labelPanelRef  = useRef(null);
  const sentinelRef    = useRef(null);
  const gridRef        = useRef(null);
  useFitRows(gridRef, fitRows);
  // The side-column layout's toolbar stays at the top; once the third row has
  // scrolled up to it, it also offers the way back (2026-11-08, user's call).
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    if (!wide) { setShowBackToTop(false); return undefined; }
    let frame = 0;
    const check = () => {
      frame = 0;
      const grid = gridRef.current;
      const bar = grid?.previousElementSibling;
      if (!bar) return;
      const columns = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
      const third = grid.children[columns * 2];
      setShowBackToTop(!!third && viewportRect(third).top <= bar.getBoundingClientRect().bottom);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(check); };
    window.addEventListener('scroll', onScroll, { passive: true });
    check();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [wide]);
  const rarityPanelRef = useRef(null);
  const sortPanelRef   = useRef(null);

  useEffect(() => {
    if (!labelsOpen) return;
    const handler = e => {
      if (labelPanelRef.current && !labelPanelRef.current.contains(e.target)) setLabelsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [labelsOpen]);

  useEffect(() => {
    if (!raritiesOpen) return;
    const handler = e => {
      if (rarityPanelRef.current && !rarityPanelRef.current.contains(e.target)) setRaritiesOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [raritiesOpen]);

  useEffect(() => {
    if (!sortOpen) return;
    const handler = e => {
      if (sortPanelRef.current && !sortPanelRef.current.contains(e.target)) setSortOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [sortOpen]);

  const toggleLabel = lb => {
    setActiveLabels(prev => {
      const next = new Set(prev);
      if (next.has(lb)) next.delete(lb); else next.add(lb);
      return next;
    });
  };

  // One rarity at a time (2026-10-16): picking another replaces it, picking
  // the active one again clears it.
  const toggleRarity = r => {
    setActiveRarities(prev => { const next = new Set(prev); if (!next.delete(r)) next.add(r); return next; });
  };

  const filtered = useMemo(() => {
    let list = locations;
    if (discovered) list = list.filter(l => l.unlocked);
    if (treasureOnly && treasureSlugs) list = list.filter(l => treasureSlugs.has(l.slug));
    if (activeLabels.size > 0) {
      list = list.filter(l =>
        Array.from(activeLabels).every(lb => (l.labels || []).includes(lb))
      );
    }
    if (activeRarities.size > 0) {
      list = list.filter(l => activeRarities.has(l.rarity ?? 'common'));
    }
    const trimmed = deferredSearch.trim();
    if (trimmed) {
      const q = deferredSearch.toLowerCase();
      list = list.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.localizedNames?.cz?.toLowerCase().includes(q) ||
        l.localizedNames?.zh?.includes(trimmed)
      );
    }
    list = [...list].sort((a, b) => {
      if (sort === 'distance') return (a._distance ?? Infinity) - (b._distance ?? Infinity);
      if (sort === 'newest')   return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'rarity')   return (RARITY_ORDER[a.rarity] ?? 4) - (RARITY_ORDER[b.rarity] ?? 4) || (b.xpReward ?? 0) - (a.xpReward ?? 0);
      if (sort === 'checkin')  return new Date(b._checkedInAt ?? 0) - new Date(a._checkedInAt ?? 0);
      return 0;
    });
    // No position, so nothing to measure: lead with Prague's best-known places.
    if (sort === 'distance' && !list.some(l => l._distance != null)) return firstVisitOrder(list);
    return list;
  }, [locations, discovered, treasureOnly, treasureSlugs, activeLabels, activeRarities, deferredSearch, sort]);

  // The packs that search and labels leave, nearest first (as listed without a position).
  const shownPacks = useMemo(
    () => packs.filter(p => packMatches(p, deferredSearch, activeLabels)).sort(nearestPackFirst),
    [packs, deferredSearch, activeLabels],
  );

  // What the grid shows. Packs stand among the cards, except in a view that is
  // only about cards (My Collections, treasure finds, a rarity: packs have none).
  // Within 100 m of any of its cards a pack goes first, whatever the sort; the
  // others stand at their nearest card when sorting by distance. With no
  // distance to go by they are spread among the cards, so a first visit isn't a
  // wall of sealed packs, unless the player narrowed the grid to look for
  // something (search, labels, an area): then the packs that match lead it.
  const gridItems = useMemo(() => {
    if (packsOnly) return shownPacks;
    if (discovered || treasureOnly || activeRarities.size > 0) return filtered;
    const isNear = p => p._distance != null && p._distance <= NEARBY_REVEAL_M;
    const near = shownPacks.filter(isNear);
    const rest = shownPacks.filter(p => !isNear(p));
    if (sort === 'distance' && filtered.some(l => l._distance != null)) {
      return [...near, ...[...rest, ...filtered].sort((a, b) => (a._distance ?? Infinity) - (b._distance ?? Infinity))];
    }
    const narrowed = deferredSearch.trim() || activeLabels.size > 0 || areaChosen;
    return [...near, ...(narrowed ? [...rest, ...filtered] : interleavePacks(featuredPacksFirst(rest), filtered))];
  }, [packsOnly, shownPacks, discovered, treasureOnly, activeRarities, filtered, sort, deferredSearch, activeLabels, areaChosen]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [discovered, treasureOnly, activeLabels, activeRarities, deferredSearch, sort]);

  // City only's filter restrictions don't apply inside My Collections.
  const cityScoped = hideOutsideLabel && !discovered;
  // "City only" hides every `outside` card, so an active `outside` filter
  // would leave an empty grid; drop it when switching back to the city.
  useEffect(() => {
    if (cityScoped && activeLabels.has('outside')) {
      setActiveLabels(prev => { const next = new Set(prev); next.delete('outside'); return next; });
    }
  }, [cityScoped, activeLabels]);
  // Same for the expedition rarity, which only outside cards carry; its
  // filter option only shows with "Show all".
  useEffect(() => {
    if (cityScoped && activeRarities.has('expedition')) {
      setActiveRarities(prev => { const next = new Set(prev); next.delete('expedition'); return next; });
    }
  }, [cityScoped, activeRarities]);
  const rarityOptions = cityScoped ? CITY_RARITIES : ALL_RARITIES;

  const hasMore = visibleCount < gridItems.length;
  const { handlers: previewHandlers, preview } = useCardPreview(filtered);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) setVisibleCount(c => c + PAGE_SIZE);
    }, { rootMargin: '800px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, visibleCount]);

  // Counted over what the filters and search leave, so the stats follow them.
  const unlocked = filtered.filter(l => l.unlocked).length;
  const total    = filtered.length;
  const shownCount = gridItems.length;
  useEffect(() => { onCountChange?.(shownCount); }, [shownCount, onCountChange]);

  // My Collections is a view, not a filter: it isn't counted, and has its own way out.
  const filterCount = activeLabels.size + activeRarities.size + (treasureOnly ? 1 : 0) + (packsOnly ? 1 : 0) + (search.trim() ? 1 : 0) + filterExtraCount;
  useEffect(() => { onFilterCount?.(filterCount); }, [filterCount, onFilterCount]);
  const clearAllFilters = () => {
    setSearch('');
    setActiveLabels(new Set());
    setActiveRarities(new Set());
    setTreasureOnly(false);
    setPacksOnly(false);
    // My Collections is left with its own button; its hidden scope and area stay as they were.
    if (!discovered) onClearFilters?.();
  };
  const leaveCollection = () => {
    if (sort === 'checkin') setSort('distance');
    setTreasureOnly(false);
    setDiscovered(false);
  };
  const togglePacks = () => {
    if (!packsOnly) {
      setActiveRarities(new Set());
      setRaritiesOpen(false);
      setSortOpen(false);
      if (discovered) leaveCollection();
    }
    setPacksOnly(!packsOnly);
  };
  const filterBar = (
    <div className="filter-bar">
      <div className="filter-bar__top">
        <input
          className="filter-bar__search"
          placeholder={t('grid.searchPlaceholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {scopeToggle && <div className="filter-bar__scope">{scopeToggle}</div>}
      </div>
      <div className="filter-bar__bottom">
        <button
          className={`filter-btn${discovered ? ' filter-btn--active' : ''}${discovered && wide ? ' filter-btn--current' : ''}`}
          disabled={discovered && wide}
          onClick={() => {
            // "My collection" opens sorted by most recently collected; leaving
            // it drops that sort, which only exists inside the collection.
            if (discovered) { leaveCollection(); return; }
            setPacksOnly(false);
            setSort('checkin');
            setDiscovered(true);
          }}
        >
          {t('grid.filterDiscovered')}
        </button>
        <button type="button" className={`filter-btn${packsOnly ? ' filter-btn--active' : ''}`} aria-pressed={packsOnly} onClick={togglePacks}>
          {t('grid.filterPacks')}
        </button>
        <div className="label-filter" ref={labelPanelRef}>
          <button
            className={`filter-btn${labelsOpen || activeLabels.size > 0 ? ' filter-btn--active' : ''}`}
            onClick={() => { setLabelsOpen(o => !o); setRaritiesOpen(false); }}
          >
            {t('grid.filterLabels')}{activeLabels.size > 0 ? ` (${activeLabels.size})` : ' ▼'}
          </button>
          {labelsOpen && (
            <div className="label-filter__panel">
              <LabelFilterGroups
                activeLabels={activeLabels}
                onToggle={toggleLabel}
                hidden={cityScoped ? ['outside'] : []}
              />
              {activeLabels.size > 0 && (
                <button
                  className="label-pill label-pill--clear"
                  onClick={() => setActiveLabels(new Set())}
                >
                  ✕ {t('grid.clearLabels')}
                </button>
              )}
            </div>
          )}
        </div>
        <div className="label-filter" ref={rarityPanelRef}>
          <button
            className={`filter-btn${raritiesOpen || activeRarities.size > 0 ? ' filter-btn--active' : ''}`}
            disabled={packsOnly}
            onClick={() => { setRaritiesOpen(o => !o); setLabelsOpen(false); }}
          >
            {t('grid.filterRarity')}{activeRarities.size > 0 ? ` (${activeRarities.size})` : ' ▼'}
          </button>
          {raritiesOpen && (
            <div className="label-filter__panel">
              {rarityOptions.map(r => (
                <button
                  key={r}
                  className={`label-pill${activeRarities.has(r) ? ' label-pill--active' : ''}`}
                  onClick={() => toggleRarity(r)}
                  style={activeRarities.has(r) ? {
                    borderColor: RARITY_VAR[r],
                    color: RARITY_VAR[r],
                    background: `color-mix(in srgb, ${RARITY_VAR[r]} 9%, transparent)`,
                  } : undefined}
                >
                  {RARITY_ICON[r]} {convert(RARITY_LABEL[lang]?.[r] ?? r)}
                </button>
              ))}
              {activeRarities.size > 0 && (
                <button
                  className="label-pill label-pill--clear"
                  onClick={() => setActiveRarities(new Set())}
                >
                  ✕ {t('grid.clearLabels')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {!wide && (filterCount > 0 || discovered) && (
        <div className="explore-filter-actions">
          {filterCount > 0 && (
            <>
              <button type="button" className="filter-btn explore-view-filters" onClick={onViewFilters}>
                {t('explore.viewFilters')}
              </button>
              <button type="button" className="filter-btn explore-clear-filters" onClick={clearAllFilters}>
                {t('explore.clearAllFilters')}
              </button>
            </>
          )}
          {discovered && (
            <button type="button" className="filter-btn explore-leave-collection" onClick={leaveCollection}>
              {t('explore.backToExplore')}
            </button>
          )}
        </div>
      )}
    </div>
  );
  const stats = packsOnly ? (
    <p className="explore-stats" style={{ margin: 0 }}>{convert(t('pack.count', { n: shownPacks.length, done: shownPacks.filter(p => p.completed).length }))}</p>
  ) : (
    <p className="explore-stats" style={{ margin: 0 }}>
      <span>{unlocked}</span>{cityScoped && <> / <span>{total}</span></>} <em className="explore-stats__long">{t('explore.statsLabel')}</em><em className="explore-stats__short">{t('explore.statsLabelShort')}</em>
      {/* A total and a share only for the city: expedition cards are an extra, not the goal (user's call). */}
      {cityScoped && total > 0 && <>{' '}<br /><em className="explore-stats__label explore-stats__long">{t('explore.progress')} </em><em className="explore-stats__label explore-stats__short">{t('explore.progressShort')} </em><span>{(unlocked / total * 100).toFixed(1)}%</span></>}
    </p>
  );

  return (
    <>
      {wide ? (filterSlot && createPortal(filterBar, filterSlot)) : !filtersFolded && filterBar}
      {/* Under the map, so the map stays put when the collection opens. */}
      {wide && discovered && exitSlot && createPortal(
        <button type="button" className="filter-btn explore-leave-collection" onClick={leaveCollection}>
          {t('explore.backToExplore')}
        </button>,
        exitSlot,
      )}
      {appliedSlot && createPortal(renderApplied({
        search: !wide && search.trim() ? search.trim() : null,
        onClearSearch: () => setSearch(''),
        labels: [...activeLabels],
        onClearLabel: toggleLabel,
        rarities: ALL_RARITIES.filter(r => activeRarities.has(r)),
        onClearRarity: toggleRarity,
        treasureCount: treasureSlugs ? treasureSlugs.size : null,
        treasureOnly,
        onShowTreasure: () => setTreasureOnly(true),
        onClearTreasure: () => setTreasureOnly(false),
        packsOnly,
        onClearPacks: () => setPacksOnly(false),
        onClearAll: wide ? () => { setActiveLabels(new Set()); setActiveRarities(new Set()); setTreasureOnly(false); setPacksOnly(false); } : clearAllFilters,
      }), appliedSlot)}

      <div className={`explore-sortbar${wide ? ' explore-toolbar' : ''}`} style={{ display: 'flex', alignItems: wide ? 'center' : 'stretch', justifyContent: 'space-between', marginBottom: wide ? 8 : 16 }}>
        {stats}
        {showBackToTop && (
          <button type="button" className="filter-btn explore-toolbar__top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {t('explore.backToTop')}
          </button>
        )}
        {toolbarExtra}
        <div className="explore-sortbar__actions">
        {!wide && onToggleFilters && (
          <button type="button" className={`filter-btn explore-filters-fold${filtersFolded && filterCount > 0 ? ' filter-btn--active' : ''}`} aria-expanded={!filtersFolded} onClick={onToggleFilters}>
            {filtersFolded ? `${t('explore.filtersUnfold')}${filterCount > 0 ? ` (${filterCount})` : ''}` : t('explore.filtersFold')} <span className="explore-caret">{filtersFolded ? '▼' : '▲'}</span>
          </button>
        )}
        <div className="label-filter" ref={sortPanelRef} style={packsOnly ? { display: 'none' } : undefined}>
          <button
            className={`filter-btn${sortOpen || sort !== 'distance' ? ' filter-btn--active' : ''}`}
            onClick={() => { setSortOpen(o => !o); setLabelsOpen(false); setRaritiesOpen(false); }}
          >
            {t(SORT_KEY[sort])} <span className="explore-caret">▼</span>
          </button>
          {sortOpen && (
            <div className="label-filter__panel" style={{ minWidth: 160 }}>
              {(discovered ? SORT_MODES_COLLECTED : SORT_MODES).map(mode => (
                <button
                  key={mode}
                  className={`label-pill${sort === mode ? ' label-pill--active' : ''}`}
                  onClick={() => { setSort(mode); setSortOpen(false); }}
                >
                  {t(SORT_KEY[mode])}
                </button>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>

      <div ref={gridRef} className="location-grid" {...previewHandlers}>
        {gridItems.slice(0, visibleCount).map(item => (item.coordinates ? (
          <LocationCard
            key={item._id}
            location={item}
            onClick={onCardClick}
            distance={item._distance}
            nearby={!item.unlocked && item._distance != null && item._distance <= NEARBY_REVEAL_M}
            uncovered={guestPreview && isFeatured(item.slug)}
            previewable
          />
        ) : <PackCard key={`pack-${item.slug}`} pack={item} onClick={onPackClick} />))}
        {shownCount === 0 && (
          <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', padding: 24 }}>
            {t('grid.noResults')}
          </p>
        )}
      </div>
      {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
      {preview}
    </>
  );
}
