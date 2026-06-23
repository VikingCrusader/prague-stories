import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { locationAPI, checkinAPI } from '../services/api';
import { useLang, useT } from '../context/LanguageContext';
import { getLocName } from '../utils/locName';
import { getCurrentPosition } from '../utils/geolocation';
import MapView from '../components/map/MapView';
import { getArt, LABEL_DEFINITIONS, LABEL_COLORS } from '../utils/pixelArtMap';

export default function MapPage() {
  const { lang } = useLang();
  const t = useT();
  const navigate = useNavigate();
  const [locations, setLocations]       = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [toasts, setToasts]             = useState([]);
  const [activeLabels, setActiveLabels] = useState(new Set());
  const [labelsOpen, setLabelsOpen]     = useState(false);
  const filterPanelRef = useRef(null);

  useEffect(() => {
    locationAPI.getAll()
      .then(res => setLocations(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e) =>
      setLocations(prev => prev.map(l => l.slug === e.detail.slug ? { ...l, unlocked: true } : l));
    window.addEventListener('proximity-checkin', handler);
    return () => window.removeEventListener('proximity-checkin', handler);
  }, []);

  useEffect(() => {
    if (!labelsOpen) return;
    const closeOnOutside = (e) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target)) {
        setLabelsOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOnOutside);
    return () => document.removeEventListener('mousedown', closeOnOutside);
  }, [labelsOpen]);

  const filteredLocations = useMemo(() => {
    if (activeLabels.size === 0) return locations;
    return locations.filter(l => {
      const locationLabels = l.labels || [];
      return Array.from(activeLabels).every(lb => locationLabels.includes(lb));
    });
  }, [locations, activeLabels]);

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

  const selected = selectedSlug ? filteredLocations.find(l => l.slug === selectedSlug) : null;

  return (
    <div className="map-page">
      <div className="map-container">
        <MapView
          locations={filteredLocations}
          selectedSlug={selectedSlug}
          onLocationClick={setSelectedSlug}
        />
      </div>

      <div className="map-sidebar">
        <div style={{ padding: '12px 16px', borderBottom: '3px solid var(--border)' }}>
          <div className="label-filter" ref={filterPanelRef}>
            <button
              className={`filter-btn${labelsOpen || activeLabels.size > 0 ? ' filter-btn--active' : ''}`}
              onClick={() => setLabelsOpen(o => !o)}
            >
              {t('grid.filterLabels')}{activeLabels.size > 0 ? ` (${activeLabels.size})` : ' ▼'}
            </button>
            {labelsOpen && (
              <div className="label-filter__panel label-filter__panel--inline">
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
          <p style={{ marginTop: 10, fontFamily: "'Press Start 2P'", fontSize: 7, color: 'var(--text-muted)' }}>
            {t('grid.showing')} {filteredLocations.length}
          </p>
        </div>

        {selected ? (
          <div style={{ padding: 0 }}>
            <div style={{ padding: '12px 16px', borderBottom: '3px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer' }}
                onClick={() => setSelectedSlug(null)}
              >✕</button>
            </div>
            <SidebarDetail
              slug={selectedSlug}
              onCheckIn={handleCheckIn}
              onUndo={handleUndo}
              onViewDetail={(slug) => navigate('/explore', { state: { openSlug: slug } })}
            />
          </div>
        ) : (
          <MapSidebarEmpty />
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

function MapSidebarEmpty() {
  const t = useT();
  return (
    <div className="map-sidebar__empty">
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>🗺️</div>
      <p style={{ fontFamily: "'Press Start 2P'", fontSize: 8, lineHeight: 2 }}>
        {t('map.clickMarker')}
      </p>
      <p style={{ marginTop: 12, color: 'var(--text-muted)' }}>
        {t('map.legend')}
      </p>
    </div>
  );
}

function SidebarDetail({ slug, onCheckIn, onUndo, onViewDetail }) {
  const { lang } = useLang();
  const t = useT();
  const [loc, setLoc]                     = useState(null);
  const [loading, setLoading]             = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [checkInError, setCheckInError]   = useState('');
  const [imgFailed, setImgFailed]         = useState(false);

  useEffect(() => {
    setLoading(true);
    setCheckInError('');
    setImgFailed(false);
    locationAPI.getOne(slug)
      .then(res => setLoc(res.data))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div className="spinner" />
      <span style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: 'var(--text-muted)' }}>{t('common.loading')}</span>
    </div>
  );
  if (!loc) return null;

  const desc = loc.description?.[lang] || loc.description?.en || '';

  const doCheckIn = async () => {
    setActionLoading(true);
    try {
      const coords = await getCurrentPosition();
      const res = await checkinAPI.checkIn(slug, coords);
      setLoc(prev => ({ ...prev, unlocked: true }));
      onCheckIn(slug, res.data);
    } catch (err) {
      setCheckInError(err.response?.data?.message || err.message || 'Check-in failed');
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

  const art = getArt(loc.pixelArtKey, loc.labels);

  return (
    <>
      <div style={{ width: '100%', aspectRatio: '1', background: 'var(--bg-secondary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {loc.coverImage ? (
          <img src={loc.coverImage} alt={getLocName(loc, lang)} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
        ) : !imgFailed ? (
          <img
            src={`/pixel-art/${loc.slug}.webp`}
            alt={getLocName(loc, lang)}
            onError={() => setImgFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
        ) : (
          <span style={{ fontSize: '4rem' }}>{art}</span>
        )}
      </div>

      <div style={{ padding: 20 }}>
        <h3 className="px-title" style={{ fontSize: 10, marginBottom: lang !== 'cz' && loc.localizedNames?.cz ? 4 : 12 }}>{getLocName(loc, lang)}</h3>
        {lang !== 'cz' && loc.localizedNames?.cz && (
          <p style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'var(--text-muted)', marginBottom: 12 }}>{loc.localizedNames.cz}</p>
        )}
        <div className="loc-card__labels" style={{ marginBottom: 4 }}>
          {(loc.labels || []).slice(0, 3).map((lb, i) => (
            <span
              key={lb}
              className={`detail-label-pill${i === 0 ? ' detail-label-pill--superior' : ''}`}
              title={LABEL_DEFINITIONS[lb]?.en}
              style={{ backgroundColor: LABEL_COLORS[lb] || 'rgba(255,255,255,0.07)' }}
            >
              {LABEL_DEFINITIONS[lb]?.[lang] || LABEL_DEFINITIONS[lb]?.en || lb}
            </span>
          ))}
        </div>
        {loc.unlocked && <span style={{ marginLeft: 8, color: '#8eff8e', fontFamily: "'Press Start 2P'", fontSize: 6 }}>{t('common.visited')}</span>}

        {desc ? (
          <p className="detail-desc" style={{ marginTop: 14, marginBottom: 16 }}>{desc}</p>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 14, marginBottom: 16 }}>{t('common.noDesc')}</p>
        )}

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
          <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
            {loc.unlocked ? (
              <button className="px-btn px-btn--danger px-btn--sm" onClick={doUndo} disabled={actionLoading}>
                {actionLoading ? '...' : t('common.undo')}
              </button>
            ) : (
              <button className="px-btn px-btn--gold" onClick={doCheckIn} disabled={actionLoading}>
                {actionLoading ? '...' : `${t('common.checkIn')} (+${loc.xpReward} XP)`}
              </button>
            )}
            <button className="px-btn px-btn--dark" onClick={() => onViewDetail(loc.slug)}>
              View Detail
            </button>
          </div>
          {checkInError && (
            <p style={{ color: '#ff6b6b', fontSize: 13, marginTop: 8 }}>{checkInError}</p>
          )}
        </div>
      </div>
    </>
  );
}
