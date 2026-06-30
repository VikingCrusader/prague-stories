import { useState, useMemo, useEffect, useRef } from 'react';
import LocationCard from './LocationCard';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { LABEL_DEFINITIONS } from '../../utils/pixelArtMap';
import { RARITY_COLOR, RARITY_LABEL } from '../../utils/rarity';

const RARITIES = ['common', 'rare', 'superior', 'epic', 'mythic', 'legend'];
const RARITY_ORDER = { legend: 0, mythic: 1, epic: 2, superior: 3, rare: 4, common: 5 };
const SORT_MODES = ['distance', 'newest', 'rarity'];
const SORT_MODES_COLLECTED = ['distance', 'newest', 'rarity', 'checkin'];
const SORT_KEY = { distance: 'grid.sortDistance', newest: 'grid.sortNewest', rarity: 'grid.sortRarity', checkin: 'grid.sortCheckin' };

export default function LocationGrid({ locations, onCardClick, onAddClick }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [discovered, setDiscovered]         = useState(false);
  const [activeLabels, setActiveLabels]     = useState(new Set());
  const [activeRarities, setActiveRarities] = useState(new Set());
  const [labelsOpen, setLabelsOpen]         = useState(false);
  const [raritiesOpen, setRaritiesOpen]     = useState(false);
  const [sortOpen, setSortOpen]             = useState(false);
  const [sort, setSort]                     = useState('distance');
  const [search, setSearch]                 = useState('');
  const labelPanelRef  = useRef(null);
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

  const toggleRarity = r => {
    setActiveRarities(prev => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r); else next.add(r);
      return next;
    });
  };

  const clearAll = () => {
    setDiscovered(false);
    setActiveLabels(new Set());
    setActiveRarities(new Set());
    setSearch('');
    setSort('distance');
  };

  const filtered = useMemo(() => {
    let list = locations;
    if (discovered) list = list.filter(l => l.unlocked);
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
    list = [...list].sort((a, b) => {
      if (sort === 'distance') return (a._distance ?? Infinity) - (b._distance ?? Infinity);
      if (sort === 'newest')   return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'rarity')   return (RARITY_ORDER[a.rarity] ?? 4) - (RARITY_ORDER[b.rarity] ?? 4);
      if (sort === 'checkin')  return new Date(b._checkedInAt ?? 0) - new Date(a._checkedInAt ?? 0);
      return 0;
    });
    return list;
  }, [locations, discovered, activeLabels, activeRarities, search, sort]);

  const unlocked = locations.filter(l => l.unlocked).length;
  const total    = locations.length;

  return (
    <>
      <div className="filter-bar">
        <div className="filter-bar__top">
          <input
            className="filter-bar__search"
            placeholder={t('grid.searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {onAddClick && (
            <button className="px-btn px-btn--outline filter-bar__add-btn" onClick={onAddClick}>
              {t('explore.addLocation')}
            </button>
          )}
        </div>
        <div className="filter-bar__bottom">
          <button
            className={`filter-btn${!discovered && activeLabels.size === 0 && activeRarities.size === 0 ? ' filter-btn--active' : ''}`}
            onClick={clearAll}
          >
            {t('grid.filterAll')}
          </button>
          <button
            className={`filter-btn${discovered ? ' filter-btn--active' : ''}`}
            onClick={() => {
              if (discovered && sort === 'checkin') setSort('distance');
              setDiscovered(d => !d);
            }}
          >
            {t('grid.filterDiscovered')}
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
                {Object.entries(LABEL_DEFINITIONS).map(([key, def]) => (
                  <button
                    key={key}
                    className={`label-pill${activeLabels.has(key) ? ' label-pill--active' : ''}`}
                    onClick={() => toggleLabel(key)}
                  >
                    {convert(lang === 'zh' ? def.zh : lang === 'cz' ? def.cz : def.en)}
                  </button>
                ))}
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
              onClick={() => { setRaritiesOpen(o => !o); setLabelsOpen(false); }}
            >
              {t('grid.filterRarity')}{activeRarities.size > 0 ? ` (${activeRarities.size})` : ' ▼'}
            </button>
            {raritiesOpen && (
              <div className="label-filter__panel">
                {RARITIES.map(r => (
                  <button
                    key={r}
                    className={`label-pill${activeRarities.has(r) ? ' label-pill--active' : ''}`}
                    onClick={() => toggleRarity(r)}
                    style={activeRarities.has(r) ? {
                      borderColor: RARITY_COLOR[r],
                      color: RARITY_COLOR[r],
                      background: `${RARITY_COLOR[r]}18`,
                    } : undefined}
                  >
                    ◆ {convert(RARITY_LABEL[lang]?.[r] ?? r)}
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
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <p className="explore-stats" style={{ margin: 0 }}>
          <span>{unlocked}</span> / <span>{total}</span> {t('explore.statsLabel')}
          <br />{t('grid.showing')} <span>{filtered.length}</span>
        </p>
        <div className="label-filter" ref={sortPanelRef}>
          <button
            className={`filter-btn${sortOpen || sort !== 'distance' ? ' filter-btn--active' : ''}`}
            onClick={() => { setSortOpen(o => !o); setLabelsOpen(false); setRaritiesOpen(false); }}
          >
            {t(SORT_KEY[sort])} ▼
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

      <div className="location-grid">
        {filtered.map(loc => (
          <LocationCard key={loc._id} location={loc} onClick={onCardClick} distance={loc._distance} />
        ))}
        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', padding: 24 }}>
            {t('grid.noResults')}
          </p>
        )}
      </div>
    </>
  );
}
