import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import { getArt, LABEL_DEFINITIONS, LABEL_COLORS } from '../utils/pixelArtMap';
import { getLocalCoverPath } from '../utils/localCover';
import { getLocName } from '../utils/locName';
import { haversineDistance, formatDistance } from '../utils/geolocation';
import { useUserPosition } from '../hooks/useUserPosition';
import { RARITY_COLOR, RARITY_LABEL, lockClosedIcon } from '../utils/rarity';
import LocationCard from '../components/locations/LocationCard';
import LocationDetail from '../components/locations/LocationDetail';

function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const hrs = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return `${pad2(hrs)}:${pad2(mins)}:${pad2(secs)}`;
}

// The drawn-but-not-yet-collected card: same loc-card shell/lock treatment as
// a locked Explore card (image desaturated, lock icon over the banner), but
// the name is already revealed — the draw's whole point is telling you what
// you got. The label slot inside the card is swapped for the rarity + 3x XP
// callout; the real label and distance move below the card, outside the box.
function DrawnCard({ loc, name, lang, convert, distance, onOpen }) {
  const rarity = loc.rarity ?? 'common';
  const art = getArt(loc.pixelArtKey, loc.labels);
  const bannerColor = LABEL_COLORS[loc.labels?.[0]] || '#1a2a5a';
  const firstLabel = loc.labels?.[0];
  const localCover = getLocalCoverPath(loc.slug);
  const [localFailed, setLocalFailed] = useState(false);
  const [cloudFailed, setCloudFailed] = useState(false);
  const useLocalCover = !!localCover && !localFailed;
  const useCloudCover = !useLocalCover && !!loc.coverImage && !cloudFailed;

  return (
    <>
      <div className="loc-card" style={{ border: `3px solid ${RARITY_COLOR[rarity]}` }} onClick={onOpen}>
        <div className="loc-card__banner" style={{ background: bannerColor, position: 'relative' }}>
          {useLocalCover ? (
            <img src={localCover} alt={name} onError={() => setLocalFailed(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(0.15)' }} />
          ) : useCloudCover ? (
            <img src={loc.coverImage} alt={name} onError={() => setCloudFailed(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(0.15)' }} />
          ) : (
            <span style={{ fontSize: '2.8rem', filter: 'saturate(0.15)' }}>{art}</span>
          )}
          <img className="loc-card__lock" src={lockClosedIcon(rarity)} alt="" />
        </div>
        <div className="loc-card__body">
          <div>
            <div className="loc-card__name" style={{ color: RARITY_COLOR[rarity] }}>{name}</div>
            {lang !== 'cz' && loc.localizedNames?.cz && (
              <div className="loc-card__cz-name">{loc.localizedNames.cz}</div>
            )}
          </div>
          <div className="loc-card__labels">
            <span
              className="label-pill-sm draw-xp-pill"
              style={{
                backgroundColor: `${RARITY_COLOR[rarity]}22`,
                borderColor: RARITY_COLOR[rarity],
                color: RARITY_COLOR[rarity],
              }}
            >
              {convert(RARITY_LABEL[lang]?.[rarity])}
              <span className="draw-card__xp-old">{loc.xpReward} XP</span>
              <strong>{loc.xpReward * 3} XP</strong>
            </span>
          </div>
        </div>
      </div>
      <div className="draw-card__meta-row">
        {firstLabel && (
          <span className="detail-label-pill" style={{ backgroundColor: LABEL_COLORS[firstLabel] || 'rgba(255,255,255,0.07)' }}>
            {convert(LABEL_DEFINITIONS[firstLabel]?.[lang] || LABEL_DEFINITIONS[firstLabel]?.en || firstLabel)}
          </span>
        )}
        {distance != null && (
          <span className="detail-label-pill" style={{ backgroundColor: LABEL_COLORS[firstLabel] || 'rgba(255,255,255,0.07)' }}>
            {formatDistance(distance)}
          </span>
        )}
      </div>
    </>
  );
}

export default function RandomDrawPage() {
  const { user, guest, applyProgress } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const userPos = useUserPosition();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [selectedSlug, setSelectedSlug] = useState(null);
  const refreshingOnExpiry = useRef(false);

  const fetchStatus = useCallback(() => {
    return userAPI.getRandomDraw()
      .then(res => setStatus(res.data))
      .catch(() => setStatus({ active: false, canDraw: true, location: null }));
  }, []);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    fetchStatus().finally(() => setLoading(false));
  }, [user, fetchStatus]);

  useEffect(() => {
    if (!status?.active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [status?.active]);

  const expiresAt = status?.expiresAt ? new Date(status.expiresAt).getTime() : null;
  const msLeft = expiresAt ? expiresAt - now : 0;
  const distance = status?.location && userPos
    ? haversineDistance(userPos.lat, userPos.lng, status.location.coordinates.lat, status.location.coordinates.lng)
    : null;
  const mapHref = status?.location
    ? `https://www.google.com/maps/dir/?api=1&destination=${status.location.coordinates.lat},${status.location.coordinates.lng}`
    : null;

  useEffect(() => {
    if (status?.active && expiresAt && msLeft <= 0 && !refreshingOnExpiry.current) {
      refreshingOnExpiry.current = true;
      fetchStatus().finally(() => { refreshingOnExpiry.current = false; });
    }
  }, [msLeft, status?.active, expiresAt, fetchStatus]);

  const handleDraw = () => {
    setDrawing(true);
    userAPI.drawRandomLocation()
      .then(res => setStatus(res.data))
      .finally(() => setDrawing(false));
  };

  const handleCheckIn = (slug, result) => {
    applyProgress(result.levelInfo, result.totalXP);
    fetchStatus();
  };

  const handleUndo = () => {
    fetchStatus();
  };

  const rules = [t('draw.rule1'), t('draw.rule2'), t('draw.rule3'), t('draw.rule4')];

  return (
    <div className="guide-page draw-page">
      <div className="guide-wrap">
        <h1 className="px-title" style={{ fontSize: 13, marginBottom: 6 }}>{t('draw.title')}</h1>
        <p className="guide-intro">{t('draw.tagline')}</p>
        <div className="guide-challenge">{t('draw.challenge')}</div>

        {guest && !user ? (
          <div className="draw-stage">
            <div className="draw-card draw-card--mystery">
              <div className="draw-card__mystery-mark">❓</div>
              <div className="draw-card__mystery-label">？？？</div>
            </div>
            <h2 className="guide-h2" style={{ marginTop: 18 }}>{t('draw.loginTitle')}</h2>
            <p className="guide-body" style={{ textAlign: 'center', maxWidth: 420 }}>{t('draw.loginBody')}</p>
            <button className="px-btn px-btn--gold" onClick={() => navigate('/login')}>
              {t('draw.loginCta')}
            </button>
          </div>
        ) : (
          <>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
                <div className="spinner" />
              </div>
            ) : (
              <div className="draw-stage">
                {status?.noneLeft ? (
                  <>
                    <div className="draw-card draw-card--mystery draw-card--empty">
                      <div className="draw-card__mystery-mark">🏆</div>
                    </div>
                    <h2 className="guide-h2" style={{ marginTop: 18 }}>{t('draw.noneLeftTitle')}</h2>
                    <p className="guide-body" style={{ textAlign: 'center', maxWidth: 420 }}>{t('draw.noneLeft')}</p>
                  </>
                ) : status?.active && status.location ? (
                  <>
                    <div className="draw-stage__card">
                      {status.bonusUsed ? (
                        <LocationCard
                          location={{ ...status.location, unlocked: true }}
                          onClick={() => setSelectedSlug(status.location.slug)}
                          distance={distance}
                        />
                      ) : (
                        <DrawnCard
                          loc={status.location}
                          name={convert(getLocName(status.location, lang))}
                          lang={lang}
                          convert={convert}
                          distance={distance}
                          onOpen={() => setSelectedSlug(status.location.slug)}
                        />
                      )}
                    </div>
                    <p className="guide-body" style={{ marginTop: 14, marginBottom: 4 }}>
                      {t('draw.revealedHintPre')}
                      <a
                        href={mapHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t('common.googleMaps')}
                        style={{ textDecoration: 'underline' }}
                      >
                        {t('draw.revealedHintLink')}
                      </a>
                      {t('draw.revealedHintPost')}
                    </p>
                    <div className="draw-countdown">
                      {t('draw.cooldownLabel')} <span className="draw-countdown__time">{formatCountdown(msLeft)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="draw-card draw-card--mystery">
                      <div className="draw-card__mystery-mark">❓</div>
                      <div className="draw-card__mystery-label">？？？</div>
                    </div>
                    <p className="guide-body" style={{ textAlign: 'center', maxWidth: 420, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {t('draw.mysteryHint')}
                    </p>
                    <button
                      className="px-btn px-btn--gold px-btn--lg"
                      onClick={handleDraw}
                      disabled={drawing}
                    >
                      {drawing ? t('draw.buttonDrawing') : t('draw.buttonDraw')}
                    </button>
                  </>
                )}
              </div>
            )}

            <hr className="px-divider" />

            <section className="guide-section">
              <p className="guide-body">{t('draw.intro1')}</p>
              <p className="guide-body">{t('draw.intro2')}</p>
            </section>

            <hr className="px-divider" />

            <section className="guide-section">
              <h2 className="guide-h2">{t('draw.rulesTitle')}</h2>
              {rules.map((rule, i) => (
                <div key={i} className="guide-step">
                  <span className="guide-step-num">{i + 1}</span>
                  <p className="guide-body">{rule}</p>
                </div>
              ))}
            </section>
          </>
        )}
      </div>

      {selectedSlug && (
        <LocationDetail
          slug={selectedSlug}
          onClose={() => { setSelectedSlug(null); fetchStatus(); }}
          onCheckIn={handleCheckIn}
          onUndo={handleUndo}
        />
      )}
    </div>
  );
}
