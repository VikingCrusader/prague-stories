import { useState, useEffect } from 'react';
import { locationAPI, checkinAPI } from '../../services/api';
import { useLang, useT } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { getArt, LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { getLocName } from '../../utils/locName';
import { getCurrentPosition } from '../../utils/geolocation';
import LanguageSwitcher from '../shared/LanguageSwitcher';
import EditLocationForm from './EditLocationForm';


export default function LocationDetail({ slug, onClose, onCheckIn, onUndo, onUpdate }) {
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

  const handleUpdated = (updatedLoc) => {
    setLoc(prev => ({ ...prev, ...updatedLoc }));
    setImgFailed(false);
    onUpdate?.(updatedLoc);
  };

  const description = loc?.description?.[lang] || loc?.description?.en || '';
  const locName = loc ? getLocName(loc, lang) : '';
  const art = loc ? getArt(loc.pixelArtKey, loc.labels) : '📍';
  const bgColor = loc ? (LABEL_COLORS[loc.labels?.[0]] || '#1a2a5a') : '#1a2a5a';

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
              <div style={{ position: 'relative', aspectRatio: '1 / 1', width: '100%', overflow: 'hidden' }}>
                <img
                  src={loc.coverImage || `/pixel-art/${loc.slug}.webp`}
                  alt={locName}
                  onError={() => setImgFailed(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 18px', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}>
                  <h2 className="px-title" style={{ fontSize: 14, marginBottom: lang !== 'cz' && loc.localizedNames?.cz ? 2 : 6 }}>{locName}</h2>
                  {lang !== 'cz' && loc.localizedNames?.cz && (
                    <p style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{loc.localizedNames.cz}</p>
                  )}
                  <div className="loc-card__labels detail-labels--desktop" style={{ marginBottom: 4 }}>
                    {(loc.labels || []).map((lb, i) => (
                      <span
                        key={lb}
                        className={`detail-label-pill${i === 0 ? ' detail-label-pill--superior' : ''}`}
                        style={{ backgroundColor: LABEL_COLORS[lb] || 'rgba(255,255,255,0.07)' }}
                      >
                        {LABEL_DEFINITIONS[lb]?.[lang] || LABEL_DEFINITIONS[lb]?.en || lb}
                      </span>
                    ))}
                  </div>
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
                  <h2 className="px-title" style={{ fontSize: 14, marginBottom: lang !== 'cz' && loc.localizedNames?.cz ? 2 : 10 }}>{locName}</h2>
                  {lang !== 'cz' && loc.localizedNames?.cz && (
                    <p style={{ fontFamily: "'Press Start 2P'", fontSize: 8, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>{loc.localizedNames.cz}</p>
                  )}
                  <div className="loc-card__labels detail-labels--desktop" style={{ marginBottom: 4 }}>
                    {(loc.labels || []).map((lb, i) => (
                      <span
                        key={lb}
                        className={`detail-label-pill${i === 0 ? ' detail-label-pill--superior' : ''}`}
                        style={{ backgroundColor: LABEL_COLORS[lb] || 'rgba(255,255,255,0.07)' }}
                      >
                        {LABEL_DEFINITIONS[lb]?.[lang] || LABEL_DEFINITIONS[lb]?.en || lb}
                      </span>
                    ))}
                  </div>
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
                        COLLECTED!
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
              {(loc.labels || []).length > 0 && (
                <div className="loc-card__labels detail-labels--mobile" style={{ marginTop: 12 }}>
                  {(loc.labels || []).map((lb, i) => (
                    <span
                      key={lb}
                      className={`detail-label-pill${i === 0 ? ' detail-label-pill--superior' : ''}`}
                      style={{ backgroundColor: LABEL_COLORS[lb] || 'rgba(255,255,255,0.07)' }}
                    >
                      {LABEL_DEFINITIONS[lb]?.[lang] || LABEL_DEFINITIONS[lb]?.en || lb}
                    </span>
                  ))}
                </div>
              )}
              {actionLoading && !checkInResult && (
                <p style={{ fontFamily: "'Press Start 2P'", fontSize: 7, color: 'var(--text-muted)', marginTop: 10 }}>
                  Locating...
                </p>
              )}
              {error && <p style={{ color: '#ff6b6b', fontSize: 14, marginTop: 10 }}>{error}</p>}

              {user && !checkInResult && (
                <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid #222' }}>
                  <button
                    className="px-btn px-btn--outline px-btn--sm"
                    onClick={() => setShowEdit(true)}
                    disabled={actionLoading}
                  >
                    Edit
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
