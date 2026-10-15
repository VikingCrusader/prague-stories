import { useState, useEffect, useRef, useCallback } from 'react';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { useUserPosition } from '../../hooks/useUserPosition';
import { getCurrentPosition } from '../../utils/geolocation';
import { getLocName } from '../../utils/locName';
import { LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { RARITY_VAR, RARITY_LABEL } from '../../utils/rarity';
import { quarterName } from '../../utils/pragueQuarters';
import LocationCard from '../locations/LocationCard';
import DeckShuffle, { SHUFFLE_MS, prefersReducedMotion } from './DeckShuffle';

const pad2 = n => String(n).padStart(2, '0');
function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const s = Math.floor(ms / 1000);
  return `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor((s % 3600) / 60))}:${pad2(s % 60)}`;
}
const km = m => (m >= 1000 ? `${m / 1000} km` : `${m} m`);

// The server's rough distance ({ over } or { about }, metres).
function readingText(r, t) {
  if (r.over) return t('draw.huntBandOver', { r: km(r.over) });
  return t('draw.hcAbout', { d: km(r.about) });
}

// Hardcore treasure hunt (硬核寻宝): few clues, mostly a rough distance plus,
// outside 1 km, whether the last stretch walked got closer or farther. The
// river side appears within 3 km, then within 1 km one label + the quarter, and 500 m (a
// second label + the rarity). Three presses within 500 m. Everything comes
// from the server (buildHardcoreResponse); the card stays secret until found
// or failed. `onOpen(slug)` opens a card's detail on the parent page.
export default function HardcoreHunt({ onOpen, refreshKey, onSwitch }) {
  const { user, applyProgress } = useAuth();
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const userPos = useUserPosition();
  const posRef = useRef(userPos);
  posRef.current = userPos;

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [flash, setFlash] = useState(null);
  const [now, setNow] = useState(Date.now());
  const refreshingOnExpiry = useRef(false);

  const fetchStatus = useCallback(() => {
    if (!user) return Promise.resolve();
    return userAPI.getHardcoreHunt(posRef.current)
      .then(res => setStatus(res.data))
      .catch(() => setStatus({ active: false, canDraw: true }));
  }, [user]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    fetchStatus().finally(() => setLoading(false));
  }, [user, fetchStatus]);
  // The parent bumps refreshKey after a card detail closes (a check-in there
  // may have found the treasure): refresh quietly, no spinner.
  useEffect(() => { if (refreshKey) fetchStatus(); }, [refreshKey, fetchStatus]);

  const running = !!(status?.active && status.hunt);
  useEffect(() => {
    if (!status?.active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [status?.active]);

  // The distance is computed on the server: report the position every 10 s.
  const hasPos = !!userPos;
  useEffect(() => {
    if (!running || !hasPos) return;
    const tick = () => {
      if (posRef.current) userAPI.getHardcoreHunt(posRef.current).then(res => setStatus(res.data)).catch(() => {});
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, [running, hasPos]);

  const expiresAt = status?.expiresAt ? new Date(status.expiresAt).getTime() : null;
  const msLeft = expiresAt ? expiresAt - now : 0;
  useEffect(() => {
    if (status?.active && expiresAt && msLeft <= 0 && !refreshingOnExpiry.current) {
      refreshingOnExpiry.current = true;
      fetchStatus().finally(() => { refreshingOnExpiry.current = false; });
    }
  }, [msLeft, status?.active, expiresAt, fetchStatus]);

  const hunt = status?.hunt;
  useEffect(() => { if (!hunt?.canGuess) setConfirming(false); }, [hunt?.canGuess, hunt?.attempt]);

  const handleStart = () => {
    setStarting(true);
    setFlash(null);
    const anim = prefersReducedMotion() ? Promise.resolve() : (setShuffling(true), new Promise(r => setTimeout(r, SHUFFLE_MS)));
    Promise.all([userAPI.startHardcoreHunt(posRef.current), anim])
      .then(([res]) => setStatus(res.data))
      .catch(() => fetchStatus())
      .finally(() => { setShuffling(false); setStarting(false); });
  };

  const handlePress = async () => {
    if (!confirming) { setConfirming(true); return; }
    setConfirming(false);
    setPressing(true);
    setFlash(null);
    try {
      const res = await userAPI.guessHardcoreHunt(await getCurrentPosition());
      if (res.data.hit) applyProgress(res.data.levelInfo, res.data.totalXP);
      else setFlash({ type: 'miss', text: t('draw.hcMissFlash') });
      setStatus(res.data.hunt);
    } catch (err) {
      setFlash({ type: 'error', text: err.response?.data?.message || err.message });
      fetchStatus();
    } finally {
      setPressing(false);
    }
  };

  const countdown = (
    <div className="draw-countdown">
      {t('draw.cooldownLabel')} <span className="draw-countdown__time">{formatCountdown(msLeft)}</span>
    </div>
  );
  const answerLink = loc => (
    <a href="#" onClick={e => { e.preventDefault(); onOpen(loc.slug); }} style={{ textDecoration: 'underline' }}>
      {convert(getLocName(loc, lang))}
    </a>
  );

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>;

  if (status?.noneLeft) return (
    <div className="draw-stage">
      <div className="draw-card draw-card--mystery draw-card--empty"><div className="draw-card__mystery-mark">🏆</div></div>
      <h2 className="guide-h2" style={{ marginTop: 18 }}>{t('draw.noneLeftTitle')}</h2>
      <p className="guide-body" style={{ textAlign: 'center', maxWidth: 420 }}>{t('draw.noneLeft')}</p>
    </div>
  );

  const found = status?.active && status.found && status.location;
  const canGuess = !!hunt?.canGuess && !pressing;

  return (
    <div className="draw-stage">
      {shuffling ? <DeckShuffle /> : found ? (
        <div className="draw-stage__card">
          <LocationCard location={{ ...status.location, unlocked: true }} onClick={() => onOpen(status.location.slug)} />
        </div>
      ) : (
        <div className="draw-card draw-card--mystery draw-card--mystery-img">
          <img className="draw-card__mystery-img" src="/pixel-art/cardback.webp" alt="???" />
        </div>
      )}

      {running ? (
        <>
          <div className="hunt-panel">
            <div className="hunt-panel__head">
              <span>{t('draw.huntAttempt', { n: hunt.attempt, max: hunt.maxAttempts })}</span>
              <span className="hunt-panel__reward" style={hunt.rarity ? { color: RARITY_VAR[hunt.rarity] } : undefined}>
                {t('draw.huntReward', { mult: hunt.multiplier })}
                {hunt.xpReward != null && <> · {hunt.xpReward * hunt.multiplier} XP</>}
              </span>
            </div>

            <div className="hunt-panel__distance">
              {hunt.reading ? t('draw.huntDistance', { d: readingText(hunt.reading, t) }) : t('draw.huntLocating')}
              {hunt.reading && hunt.trend && <> · {t(`draw.hcTrend.${hunt.trend}`)}</>}
            </div>

            {hunt.riverSide && (
              <div className="hunt-panel__square">
                {t(hunt.riverSide === 'castle' ? 'draw.huntSideCastle' : 'draw.huntSideOldTown')}
              </div>
            )}

            {hunt.labels.length === 0 ? (
              <div className="hunt-panel__square">{t('draw.hcNoClues')}</div>
            ) : (
              <>
                <div className="loc-card__labels hunt-panel__clues">
                  {hunt.rarity && (
                    <span className="detail-label-pill" style={{ backgroundColor: `color-mix(in srgb, ${RARITY_VAR[hunt.rarity]} 13%, transparent)`, borderColor: RARITY_VAR[hunt.rarity], color: RARITY_VAR[hunt.rarity] }}>
                      {convert(RARITY_LABEL[lang]?.[hunt.rarity] ?? hunt.rarity)}
                    </span>
                  )}
                  {hunt.labels.map(lb => (
                    <span key={lb} className="detail-label-pill" style={{ backgroundColor: LABEL_COLORS[lb] || 'var(--pill-fallback, rgba(255,255,255,0.07))' }}>
                      {convert(LABEL_DEFINITIONS[lb]?.[lang] || LABEL_DEFINITIONS[lb]?.en || lb)}
                    </span>
                  ))}
                  {hunt.quarter && <span className="detail-label-pill">{convert(quarterName(hunt.quarter, lang))}</span>}
                </div>
                {!hunt.rarity && <div className="hunt-panel__square">{t('draw.hcNextReveal')}</div>}
              </>
            )}

            {flash && <div className={`hunt-panel__flash hunt-panel__flash--${flash.type}`}>{flash.text}</div>}

            {confirming ? (
              <div className="hunt-panel__confirm">
                <span>{t('draw.hcConfirm', { n: hunt.attempt })}</span>
                <div className="hunt-panel__confirm-buttons">
                  <button className="px-btn px-btn--gold" onClick={handlePress} disabled={!canGuess}>{t('draw.huntConfirmYes')}</button>
                  <button className="px-btn" onClick={() => setConfirming(false)}>{t('draw.huntCancel')}</button>
                </div>
              </div>
            ) : (
              <>
                <button className="px-btn px-btn--gold px-btn--lg" onClick={handlePress} disabled={!canGuess}>
                  {canGuess || pressing ? t('draw.huntGuess') : t('draw.huntGuessLocked')}
                </button>
                {!canGuess && !pressing && <div className="hunt-panel__range">{t('draw.huntGuessRange', { r: km(hunt.radius) })}</div>}
              </>
            )}
          </div>
          {countdown}
        </>
      ) : found ? (
        <>
          <p className="guide-body hunt-found" style={{ marginTop: 14, marginBottom: 4 }}>
            {t('draw.huntFound', { n: status.solvedAttempt, xp: status.xpEarned ?? 0 })}
          </p>
          {countdown}
        </>
      ) : status?.active && status.failed ? (
        <>
          <p className="guide-body" style={{ textAlign: 'center', maxWidth: 420, marginTop: 14 }}>
            {t('draw.hcFailed')}{answerLink(status.location)}
          </p>
          {countdown}
        </>
      ) : (
        <>
          {status?.lastHunt?.location && (
            <p className="guide-body" style={{ textAlign: 'center', maxWidth: 420 }}>
              {t('draw.huntLastAnswer')}{answerLink(status.lastHunt.location)}
            </p>
          )}
          <p className="guide-body" style={{ textAlign: 'center', maxWidth: 420, color: 'var(--text-muted)' }}>{t('draw.hcHint')}</p>
          <button className="px-btn px-btn--gold px-btn--lg" onClick={handleStart} disabled={starting || !user || !!status?.blockedBy}>
            {starting ? t('draw.buttonDrawing') : t('draw.hcStart')}
          </button>
          {status?.blockedBy && (
            <p className="guide-body draw-mode-hint">
              {(() => {
                const m = t('draw.blockedByClues').match(/^([\s\S]*)\[\[clues\]\]([\s\S]*)\[\[\/clues\]\]([\s\S]*)$/);
                return m ? <>{m[1]}<a href="#" onClick={e => { e.preventDefault(); onSwitch?.(); }} style={{ textDecoration: 'underline' }}>{m[2]}</a>{m[3]}</> : t('draw.blockedByClues');
              })()}
            </p>
          )}
          {!user && <p className="guide-body draw-mode-hint">{t('draw.huntGuestOnly')}</p>}
        </>
      )}
    </div>
  );
}
