import { useState, useMemo, useEffect, useRef } from 'react';
import LocationCard from './LocationCard';
import { useT, useLang } from '../../context/LanguageContext';
import { LABEL_DEFINITIONS } from '../../utils/pixelArtMap';

export default function LocationGrid({ locations, onCardClick }) {
  const t = useT();
  const { lang } = useLang();
  const [discovered, setDiscovered] = useState(false);
  const [activeLabels, setActiveLabels] = useState(new Set());
  const [labelsOpen, setLabelsOpen]     = useState(false);
  const [search, setSearch]             = useState('');
  const panelRef = useRef(null);

  useEffect(() => {
    if (!labelsOpen) return;
    const handler = e => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setLabelsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [labelsOpen]);

  const toggleLabel = lb => {
    setActiveLabels(prev => {
      const next = new Set(prev);
      if (next.has(lb)) next.delete(lb); else next.add(lb);
      return next;
    });
  };

  const clearAll = () => {
    setDiscovered(false);
    setActiveLabels(new Set());
    setSearch('');
  };

  const filtered = useMemo(() => {
    let list = locations;
    if (discovered) list = list.filter(l => l.unlocked);
    if (activeLabels.size > 0) {
      list = list.filter(l => {
        const locationLabels = l.labels || [];
        return Array.from(activeLabels).every(lb => locationLabels.includes(lb));
      });
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
  }, [locations, discovered, activeLabels, search]);

  const unlocked = locations.filter(l => l.unlocked).length;
  const total    = locations.filter(l => l.isPreset).length;

  return (
    <>
      <div className="filter-bar">
        <input
          className="filter-bar__search"
          placeholder={t('grid.searchPlaceholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className={`filter-btn${!discovered && activeLabels.size === 0 ? ' filter-btn--active' : ''}`}
          onClick={clearAll}
        >
          {t('grid.filterAll')}
        </button>
        <button
          className={`filter-btn${discovered ? ' filter-btn--active' : ''}`}
          onClick={() => setDiscovered(d => !d)}
        >
          {t('grid.filterDiscovered')}
        </button>
        <div className="label-filter" ref={panelRef}>
          <button
            className={`filter-btn${labelsOpen || activeLabels.size > 0 ? ' filter-btn--active' : ''}`}
            onClick={() => setLabelsOpen(o => !o)}
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
                  {lang === 'zh' ? def.zh : lang === 'cz' ? def.cz : def.en}
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
      </div>

      <p className="explore-stats" style={{ marginBottom: 16 }}>
        <span>{unlocked}</span> / <span>{total}</span> {t('explore.statsLabel')}
        &nbsp;·&nbsp; {t('grid.showing')} <span>{filtered.length}</span>
      </p>

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
