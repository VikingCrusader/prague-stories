import { useState, useEffect } from 'react';
import { locationAPI, checkinAPI } from '../services/api';
import MapView from '../components/map/MapView';
import LocationDetail from '../components/locations/LocationDetail';
import { getArt } from '../utils/pixelArtMap';

export default function MapPage() {
  const [locations, setLocations]       = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [toasts, setToasts]             = useState([]);

  useEffect(() => {
    locationAPI.getAll()
      .then(res => setLocations(res.data))
      .finally(() => setLoading(false));
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  const handleCheckIn = (slug, result) => {
    setLocations(prev => prev.map(l => l.slug === slug ? { ...l, unlocked: true } : l));
    addToast(`+${result.xpEarned} XP — ${result.levelInfo.title}!`);
    if (result.newAchievements?.length) {
      result.newAchievements.forEach(a => addToast(`Achievement: ${a.id.replace(/_/g, ' ')}`, 'info'));
    }
  };

  const handleUndo = (slug) => {
    setLocations(prev => prev.map(l => l.slug === slug ? { ...l, unlocked: false } : l));
    addToast('Visit removed', 'info');
  };

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );

  const selected = selectedSlug ? locations.find(l => l.slug === selectedSlug) : null;

  return (
    <div className="map-page">
      <div className="map-container">
        <MapView
          locations={locations}
          selectedSlug={selectedSlug}
          onLocationClick={setSelectedSlug}
        />
      </div>

      <div className="map-sidebar">
        {selected ? (
          <div style={{ padding: 0 }}>
            <div style={{ padding: '12px 16px', borderBottom: '3px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: 'var(--text-muted)' }}>
                {getArt(selected.pixelArtKey, selected.category)} {selected.category}
              </span>
              <button
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer' }}
                onClick={() => setSelectedSlug(null)}
              >✕</button>
            </div>
            <SidebarDetail
              slug={selectedSlug}
              onCheckIn={handleCheckIn}
              onUndo={handleUndo}
            />
          </div>
        ) : (
          <div className="map-sidebar__empty">
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🗺️</div>
            <p style={{ fontFamily: "'Press Start 2P'", fontSize: 8, lineHeight: 2 }}>
              Click a marker to explore
            </p>
            <p style={{ marginTop: 12, color: 'var(--text-muted)' }}>
              ● Gold = unlocked &nbsp;· &nbsp;● Grey = locked
            </p>
          </div>
        )}
      </div>

      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(t => <div key={t.id} className={`toast toast--${t.type}`}>{t.message}</div>)}
        </div>
      )}
    </div>
  );
}

// Inline sidebar detail to avoid extra modal layer on the map page
function SidebarDetail({ slug, onCheckIn, onUndo }) {
  const [loc, setLoc]                   = useState(null);
  const [loading, setLoading]           = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [lang, setLang]                 = useState(localStorage.getItem('lang') || 'en');

  useEffect(() => {
    setLoading(true);
    locationAPI.getOne(slug)
      .then(res => setLoc(res.data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div className="spinner" />
      <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: 'var(--text-muted)' }}>Loading...</span>
    </div>
  );
  if (!loc) return null;

  const desc = loc.description?.[lang] || loc.description?.en || '';

  const doCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await checkinAPI.checkIn(slug);
      setLoc(prev => ({ ...prev, unlocked: true }));
      onCheckIn(slug, res.data);
    } finally { setActionLoading(false); }
  };

  const doUndo = async () => {
    setActionLoading(true);
    try {
      const res = await checkinAPI.undo(slug);
      setLoc(prev => ({ ...prev, unlocked: false }));
      onUndo(slug, res.data);
    } finally { setActionLoading(false); }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3 className="px-title" style={{ fontSize: 9, marginBottom: 12 }}>{loc.name}</h3>
      <span className={`cat-badge cat-badge--${loc.category}`}>{loc.category}</span>
      {loc.unlocked && <span style={{ marginLeft: 8, color: '#8eff8e', fontFamily: "'Press Start 2P'", fontSize: 6 }}>✓ VISITED</span>}

      <div className="lang-tabs" style={{ marginTop: 14 }}>
        {['en', 'cz', 'zh'].map(l => (
          <button key={l} className={`lang-tab${lang === l ? ' lang-tab--active' : ''}`} onClick={() => setLang(l)}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {desc ? (
        <p className="detail-desc" style={{ marginBottom: 16 }}>{desc}</p>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 16 }}>Description not yet available.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loc.wikipediaUrl && (
          <a className="detail-wiki" href={loc.wikipediaUrl} target="_blank" rel="noopener noreferrer">
            📖 Wikipedia
          </a>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {loc.unlocked ? (
            <button className="px-btn px-btn--danger px-btn--sm" onClick={doUndo} disabled={actionLoading}>
              {actionLoading ? '...' : '✕ Undo'}
            </button>
          ) : (
            <button className="px-btn px-btn--gold" onClick={doCheckIn} disabled={actionLoading}>
              {actionLoading ? '...' : '★ Check In (+' + loc.xpReward + ' XP)'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
