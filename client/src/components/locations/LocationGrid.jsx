import { useState, useMemo } from 'react';
import LocationCard from './LocationCard';
import { CATEGORY_LABELS } from '../../utils/pixelArtMap';

const ALL_CATS = ['all', ...Object.keys(CATEGORY_LABELS)];

export default function LocationGrid({ locations, onCardClick }) {
  const [cat, setCat]       = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = locations;
    if (cat !== 'all') list = list.filter(l => l.category === cat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(l => l.name.toLowerCase().includes(q) || l.unlocked && l.slug.includes(q));
    }
    return list;
  }, [locations, cat, search]);

  const unlocked = locations.filter(l => l.unlocked).length;
  const total    = locations.filter(l => l.isPreset).length;

  return (
    <>
      <div className="filter-bar">
        <input
          className="filter-bar__search"
          placeholder="Search locations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {ALL_CATS.map(c => (
          <button
            key={c}
            className={`filter-btn${cat === c ? ' filter-btn--active' : ''}`}
            onClick={() => setCat(c)}
          >
            {c === 'all' ? '★ All' : CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <p className="explore-stats" style={{ marginBottom: 16 }}>
        <span>{unlocked}</span> / <span>{total}</span> preset locations unlocked
        &nbsp;·&nbsp; showing <span>{filtered.length}</span>
      </p>

      <div className="location-grid">
        {filtered.map(loc => (
          <LocationCard key={loc._id} location={loc} onClick={onCardClick} />
        ))}
        {filtered.length === 0 && (
          <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', padding: 24 }}>
            No locations found.
          </p>
        )}
      </div>
    </>
  );
}
