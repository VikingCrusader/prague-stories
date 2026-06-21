import { useState, useEffect } from 'react';
import { locationAPI, checkinAPI } from '../../services/api';
import { useLang, useT } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { getArt } from '../../utils/pixelArtMap';
import { getLocName } from '../../utils/locName';
import { getCurrentPosition } from '../../utils/geolocation';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import EditLocationForm from './EditLocationForm';

const CAT_COLORS = {
  historical: '#7a5210', cultural: '#5a1480', natural: '#145a20',
  'hidden-gem': '#0a3a7a', entertainment: '#7a0a40',
};

export default function LocationDetail({ slug, onClose, onCheckIn, onUndo, onDelete, onUpdate }) {
  const { lang } = useLang();
  const t = useT();
  const { user } = useAuth();
  const [loc, setLoc]             = useState(null);
  const [loading, setLoading]     = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError]         = useState('');
  const [imgFailed, setImgFailed] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null);
  const [closing, setClosing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showEdit, setShowEdit]   = useState(false);

  useEffect(() => {
    setLoading(true); setError('');
    locationAPI.getOne(slug)
      .then(res => setLoc(res.data))
      .catch(() => setError('Failed to load location.'))
      .finally(() => setLoading(false));
  }, [slug]);

  // Close modal after success display; cancelled if user manually closes first
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [closing]);

  const handleCheckIn = async () => {
    setActionLoading(true); setError('');
    try {
      const coords = await getCurrentPosition();
      const res = await checkinAPI.checkIn(slug, coords);
      setLoc(prev => ({ ...prev, unlocked: true }));
      setCheckInResult(res.data);
      onCheckIn(slug, res.data); // update grid immediately
      setClosing(true);          // start 2.5s close timer
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Check-in failed');
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

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setActionLoading(true); setError('');
    try {
      await locationAPI.remove(slug);
      onDelete(slug);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete location');
      setConfirmDelete(false);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdated = (updatedLoc) => {
    setLoc(prev => ({ ...prev, ...updatedLoc }));
    setImgFailed(false);
    onUpdate?.(updatedLoc);
  };

  const description = loc?.description?.[lang] || loc?.description?.en || '';
  const locName = loc ? getLocName(loc, lang) : '';
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
              {t('common.loading')}
            </span>
          </div>
        ) : error ? (
          <div style={{ padding: 32, color: '#ff6b6b', fontSize: 16 }}>{error}</div>
        ) : loc ? (
          <>
            {(loc.coverImage || !imgFailed) ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={loc.coverImage || `/pixel-art/${loc.slug}.png`}
                  alt={locName}
                  onError={() => setImgFailed(true)}
                  style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 18px', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}>
                  <h2 className="px-title" style={{ fontSize: 11, marginBottom: 6 }}>{locName}</h2>
                  <span className={`cat-badge cat-badge--${loc.category}`}>{t(`cat.${loc.category}`)}</span>
                  {loc.unlocked && (
                    <span style={{ marginLeft: 8, fontSize: 7, color: '#8eff8e', fontFamily: "'Press Start 2P'" }}>
                      {t('common.visited')}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-modal__header" style={{ background: bgColor }}>
                <span className="detail-art">{art}</span>
                <div style={{ flex: 1 }}>
                  <h2 className="px-title" style={{ fontSize: 11, marginBottom: 10 }}>{locName}</h2>
                  <span className={`cat-badge cat-badge--${loc.category}`}>{t(`cat.${loc.category}`)}</span>
                  {loc.unlocked && (
                    <span style={{ marginLeft: 8, fontSize: 7, color: '#8eff8e', fontFamily: "'Press Start 2P'" }}>
                      {t('common.visited')}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="px-modal__body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <LanguageSwitcher />
                <span style={{ fontSize: 16, color: 'var(--gold)' }}>+{loc.xpReward} XP</span>
              </div>

              {description ? (
                <p className="detail-desc" style={{ marginBottom: 20 }}>{description}</p>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 20 }}>
                  {t('common.noDesc')}
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
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  {checkInResult ? (
                    <div style={{ textAlign: 'center', minWidth: 160 }}>
                      <p style={{ fontFamily: "'Press Start 2P'", fontSize: 9, color: '#8eff8e', marginBottom: 8, letterSpacing: 1 }}>
                        CHECKED IN!
                      </p>
                      <p style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'var(--gold)' }}>
                        +{checkInResult.xpEarned} XP
                      </p>
                      {checkInResult.newAchievements?.map(a => (
                        <p key={a.id} style={{ fontFamily: "'Press Start 2P'", fontSize: 6, color: '#7ec8e3', marginTop: 6 }}>
                          {a.id.replace(/_/g, ' ')}
                        </p>
                      ))}
                    </div>
                  ) : loc.unlocked ? (
                    <button
                      className="px-btn px-btn--danger px-btn--sm"
                      onClick={handleUndo}
                      disabled={actionLoading}
                    >
                      {actionLoading ? '...' : t('common.undoVisit')}
                    </button>
                  ) : (
                    <button
                      className="px-btn px-btn--gold"
                      onClick={handleCheckIn}
                      disabled={actionLoading}
                    >
                      {actionLoading ? '...' : t('common.checkIn')}
                    </button>
                  )}
                </div>
              </div>
              {actionLoading && !checkInResult && (
                <p style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: 'var(--text-muted)', marginTop: 10 }}>
                  Locating...
                </p>
              )}
              {error && <p style={{ color: '#ff6b6b', fontSize: 14, marginTop: 10 }}>{error}</p>}

              {user && !checkInResult && (
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #222', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    className="px-btn px-btn--outline px-btn--sm"
                    onClick={() => setShowEdit(true)}
                    disabled={actionLoading}
                  >
                    Edit
                  </button>
                  <button
                    className="px-btn px-btn--danger px-btn--sm"
                    onClick={handleDelete}
                    disabled={actionLoading}
                    onBlur={() => setConfirmDelete(false)}
                  >
                    {confirmDelete ? 'Confirm delete?' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {showEdit && loc && (
        <EditLocationForm
          location={loc}
          onClose={() => setShowEdit(false)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
}
