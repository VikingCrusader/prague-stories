import { useState, useEffect } from 'react';
import { locationAPI, checkinAPI } from '../../services/api';
import { useLang } from '../../context/LanguageContext';
import { getArt } from '../../utils/pixelArtMap';
import LanguageSwitcher from '../shared/LanguageSwitcher';

const CAT_COLORS = {
  historical: '#7a5210', cultural: '#5a1480', natural: '#145a20',
  food: '#7a2000', 'hidden-gem': '#0a3a7a', entertainment: '#7a0a40',
};

export default function LocationDetail({ slug, onClose, onCheckIn, onUndo }) {
  const { lang } = useLang();
  const [loc, setLoc]             = useState(null);
  const [loading, setLoading]     = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError]         = useState('');

  useEffect(() => {
    setLoading(true); setError('');
    locationAPI.getOne(slug)
      .then(res => setLoc(res.data))
      .catch(() => setError('Failed to load location.'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCheckIn = async () => {
    setActionLoading(true); setError('');
    try {
      const res = await checkinAPI.checkIn(slug);
      setLoc(prev => ({ ...prev, unlocked: true }));
      onCheckIn(slug, res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUndo = async () => {
    setActionLoading(true); setError('');
    try {
      const res = await checkinAPI.undo(slug);
      setLoc(prev => ({ ...prev, unlocked: false }));
      onUndo(slug, res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to undo');
    } finally {
      setActionLoading(false);
    }
  };

  const description = loc?.description?.[lang] || loc?.description?.en || '';
  const art = loc ? getArt(loc.pixelArtKey, loc.category) : '📍';
  const bgColor = loc ? (CAT_COLORS[loc.category] || '#333') : '#333';

  return (
    <div className="px-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="px-modal">
        <button className="px-modal__close" onClick={onClose}>✕</button>

        {loading ? (
          <div style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div className="spinner" />
            <span style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'var(--text-muted)' }}>
              Generating description...
            </span>
          </div>
        ) : error ? (
          <div style={{ padding: 32, color: '#ff6b6b', fontSize: 16 }}>{error}</div>
        ) : loc ? (
          <>
            <div className="px-modal__header" style={{ background: bgColor }}>
              <span className="detail-art">{art}</span>
              <div style={{ flex: 1 }}>
                <h2 className="px-title" style={{ fontSize: 11, marginBottom: 10 }}>{loc.name}</h2>
                <span className={`cat-badge cat-badge--${loc.category}`}>{loc.category.replace('-', ' ')}</span>
                {loc.unlocked && (
                  <span style={{ marginLeft: 8, fontSize: 7, color: '#8eff8e', fontFamily: "'Press Start 2P'" }}>
                    ✓ VISITED
                  </span>
                )}
              </div>
            </div>

            <div className="px-modal__body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <LanguageSwitcher />
                <span style={{ fontSize: 16, color: 'var(--gold)' }}>+{loc.xpReward} XP</span>
              </div>

              {description ? (
                <p className="detail-desc" style={{ marginBottom: 20 }}>{description}</p>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 20 }}>
                  Description not yet available.
                </p>
              )}

              <hr className="px-divider" />

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                {loc.wikipediaUrl && (
                  <a
                    className="detail-wiki"
                    href={loc.wikipediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📖 Wikipedia
                  </a>
                )}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  {loc.unlocked ? (
                    <button
                      className="px-btn px-btn--danger px-btn--sm"
                      onClick={handleUndo}
                      disabled={actionLoading}
                    >
                      {actionLoading ? '...' : '✕ Undo Visit'}
                    </button>
                  ) : (
                    <button
                      className="px-btn px-btn--gold"
                      onClick={handleCheckIn}
                      disabled={actionLoading}
                    >
                      {actionLoading ? '...' : '★ Check In'}
                    </button>
                  )}
                </div>
              </div>
              {error && <p style={{ color: '#ff6b6b', fontSize: 14, marginTop: 10 }}>{error}</p>}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
