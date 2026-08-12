import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import { getArt, LABEL_DEFINITIONS, LABEL_COLORS } from '../utils/pixelArtMap';
import { getLocalCoverPath } from '../utils/localCover';
import { getLocName } from '../utils/locName';
import { RARITY_COLOR, RARITY_LABEL } from '../utils/rarity';
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

function DrawnCard({ status, t, lang, convert, onOpen }) {
  const loc = status.location;
  const name = convert(getLocName(loc, lang));
  const art = getArt(loc.pixelArtKey, loc.labels);
  const color = LABEL_COLORS[loc.labels?.[0]] || '#1a2a5a';
  const localCover = getLocalCoverPath(loc.slug);
  const [localFailed, setLocalFailed] = useState(false);
  const [cloudFailed, setCloudFailed] = useState(false);
  const useLocalCover = !!localCover && !localFailed;
  const useCloudCover = !useLocalCover && !!loc.coverImage && !cloudFailed;

  return (
    <div
      className="draw-card draw-card--revealed"
      style={{ borderColor: RARITY_COLOR[loc.rarity ?? 'common'] }}
      onClick={onOpen}
    >
      <div className="draw-card__banner" style={{ background: color }}>
        {useLocalCover ? (
          <img src={localCover} alt={name} onError={() => setLocalFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : useCloudCover ? (
          <img src={loc.coverImage} alt={name} onError={() => setCloudFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <span style={{ fontSize: '3.4rem' }}>{art}</span>
        )}
      </div>
      <div className="draw-card__body">
        <div className="draw-card__name" style={{ color: RARITY_COLOR[loc.rarity ?? 'common'] }}>{name}</div>
        {lang !== 'cz' && loc.localizedNames?.cz && (
          <div className="loc-card__cz-name">{loc.localizedNames.cz}</div>
        )}
        <div className="draw-card__meta">
          <span style={{
            display: 'inline-block', width: 8, height: 8,
            background: RARITY_COLOR[loc.rarity ?? 'common'],
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            flexShrink: 0,
          }} />
          <span style={{ color: RARITY_COLOR[loc.rarity ?? 'common'] }}>
            {convert(RARITY_LABEL[lang]?.[loc.rarity ?? 'common'])}
          </span>
          <span className="draw-card__xp">
            {loc.xpReward} → <strong>{loc.xpReward * 3} XP</strong>
          </span>
        </div>
        <div
          className="draw-bonus-tag"
          style={status.bonusUsed ? { color: '#8eff8e', borderColor: '#8eff8e' } : undefined}
        >
          {status.bonusUsed ? t('draw.alreadyCollected') : t('draw.bonusTag')}
        </div>
        <button className="px-btn px-btn--gold px-btn--sm" style={{ marginTop: 10 }} onClick={onOpen}>
          {t('draw.viewButton')}
        </button>
      </div>
    </div>
  );
}

export default function RandomDrawPage() {
  const { user, guest, applyProgress } = useAuth();
  const navigate = useNavigate();
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();

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
            <section className="guide-section">
              <p className="guide-body">{t('draw.intro1')}</p>
              <p className="guide-body">{t('draw.intro2')}</p>
            </section>

            <hr className="px-divider" />

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
                    <DrawnCard
                      status={status}
                      t={t}
                      lang={lang}
                      convert={convert}
                      onOpen={() => setSelectedSlug(status.location.slug)}
                    />
                    <p className="guide-body" style={{ marginTop: 14, marginBottom: 4 }}>{t('draw.revealedHint')}</p>
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
