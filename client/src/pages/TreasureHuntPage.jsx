import { useState, useEffect, useRef, useCallback } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LocationOffNotice from '../components/shared/LocationOffNotice';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import { getLocName } from '../utils/locName';
import { haversineDistance, getCurrentPosition } from '../utils/geolocation';
import { useUserPosition } from '../hooks/useUserPosition';
import LocationCard from '../components/locations/LocationCard';
import LocationDetail from '../components/locations/LocationDetail';
import TreasureHuntPanel from '../components/draw/TreasureHuntPanel';
import DeckShuffle, { SHUFFLE_MS, prefersReducedMotion } from '../components/draw/DeckShuffle';
import { unlockAudio, playShuffleSound, playClueSound, playMissSound, playHuntWinSound, HUNT_WIN_SOUND_MS } from '../utils/sound';

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

// The hunt's clues, for the rules section, in the order they come: the
// distance always, then each clue free within its distance or bought early
// for one rung. Mirrors HUNT_CLUE_ORDER and HUNT_FREE_CLUE_AT on the server.
const HUNT_CLUES = [
  { key: 'reading', free: 'draw.huntTable.always', take: false },
  { key: 'side', free: '3 km', take: true },
  { key: 'district', free: '1 km', take: true },
  { key: 'quarter', free: '500 m', take: true },
  { key: 'close', free: '300 m*', take: true },
  { key: 'other', free: '—', take: true },
];

function HuntClueTable({ t }) {
  return (
    <div className="hunt-table-wrap">
      <div className="hunt-table-scroll">
        <table className="hunt-table">
          <thead>
            <tr>{[1, 2, 3].map(k => <th key={k}>{t(`draw.huntTable.h${k}`)}</th>)}</tr>
          </thead>
          <tbody>
            {HUNT_CLUES.map(c => (
              <tr key={c.key}>
                <td>{t(`draw.huntTable.${c.key}`)}</td>
                <td className="hunt-table__nowrap">{c.free.startsWith('draw.') ? t(c.free) : c.free}</td>
                <td className="hunt-table__num">{c.take ? '✓' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hunt-table__note">{t('draw.huntTableNote')}</p>
    </div>
  );
}

// Treasure hunt, one every 24 hours: a random uncollected card is hidden and
// the user tracks it down from clues (see TreasureHuntPanel and
// buildHuntClues on the server). The API still uses the old "random draw"
// names from when this page also offered an open draw. Guests see the rules
// but need an account to play, since a hunt lives on the server.
export default function TreasureHuntPage() {
  const { user, applyProgress } = useAuth();
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const userPos = useUserPosition();

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  // Why the server refused to start a hunt: 'outsidePrague' or
  // 'positionRequired' (drawRandomLocation on the server).
  const [startError, setStartError] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const refreshingOnExpiry = useRef(false);
  const [busy, setBusy] = useState(false);
  const [huntFlash, setHuntFlash] = useState(null);
  // The deck is being shuffled and a card drawn (DeckShuffle) on a new hunt.
  // The new hunt's status is only shown once the animation and the server
  // have both finished.
  const [shuffling, setShuffling] = useState(false);
  const shuffleDone = () => {
    if (prefersReducedMotion()) return Promise.resolve();
    playShuffleSound();
    setShuffling(true);
    return new Promise(resolve => setTimeout(resolve, SHUFFLE_MS));
  };
  // Latest position for the hunt's distance clue, read by the poll below
  // without restarting it on every GPS update.
  const posRef = useRef(userPos);
  posRef.current = userPos;

  // Free clues arrive with a poll: announce a new one once, like a clue
  // taken (not the ones already there when the page loads).
  const freeClues = status?.hunt?.freeClues;
  const freeKeys = (freeClues || []).map(c => c.key).join(',');
  const seenFree = useRef(null);
  useEffect(() => {
    if (!freeClues) return;
    const fresh = seenFree.current && freeClues.find(c => !seenFree.current.includes(c.key));
    if (fresh) {
      playClueSound();
      setHuntFlash({ type: 'miss', text: t('draw.huntFreeClue', { r: fresh.within >= 1000 ? `${fresh.within / 1000} km` : `${fresh.within} m`, clue: t(`draw.clue.${fresh.key}`) }) });
    }
    seenFree.current = freeClues.map(c => c.key);
  }, [freeKeys]);

  const fetchStatus = useCallback(() => {
    if (!user) return Promise.resolve();
    return userAPI.getRandomDraw(posRef.current)
      .then(res => setStatus(res.data))
      .catch(() => setStatus({ active: false, canDraw: true, location: null }));
  }, [user]);

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

  // Hunt in progress: the distance clue is computed by the server (the
  // client never gets the coordinates), so report the position every 10 s,
  // and right away once the first GPS fix arrives.
  const huntActive = !!(status?.active && !status.bonusUsed);
  const hasPos = !!userPos;
  useEffect(() => {
    if (!huntActive || !hasPos) return;
    const tick = () => {
      if (!posRef.current) return;
      userAPI.getRandomDraw(posRef.current).then(res => setStatus(res.data)).catch(() => {});
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, [huntActive, hasPos]);

  const handleGuess = async () => {
    unlockAudio();
    setBusy(true);
    setHuntFlash(null);
    try {
      const pos = await getCurrentPosition();
      const res = await userAPI.guessTreasure(pos);
      if (res.data.hit) {
        playHuntWinSound();
        // The XP (and a level-up, with its own fanfare) lands once the
        // victory fanfare is over, so the two don't play on top of each other.
        const { levelInfo, totalXP } = res.data;
        setTimeout(() => applyProgress(levelInfo, totalXP), HUNT_WIN_SOUND_MS);
      } else {
        playMissSound();
        setHuntFlash({ type: 'miss', text: t('draw.huntMissFlash') });
      }
      setStatus(res.data.draw);
    } catch (err) {
      setHuntFlash({ type: 'error', text: err.response?.data?.message || err.message });
      fetchStatus();
    } finally {
      setBusy(false);
    }
  };

  // "Take a clue" (see takeHuntClue on the server): the next one in the
  // order. The position goes along for the distance reading in the reply.
  const handleClue = async () => {
    unlockAudio();
    setBusy(true);
    setHuntFlash(null);
    const pos = await getCurrentPosition().catch(() => posRef.current);
    userAPI.takeHuntClue(pos)
      .then(res => { playClueSound(); setStatus(res.data.draw); setHuntFlash({ type: 'miss', text: t('draw.huntClueFlash', { clue: t(`draw.clue.${res.data.clue}`) }) }); })
      .catch(err => { setHuntFlash({ type: 'error', text: err.response?.data?.message || err.message }); fetchStatus(); })
      .finally(() => setBusy(false));
  };

  const expiresAt = status?.expiresAt ? new Date(status.expiresAt).getTime() : null;
  const msLeft = expiresAt ? expiresAt - now : 0;
  const distance = status?.location && userPos
    ? haversineDistance(userPos.lat, userPos.lng, status.location.coordinates.lat, status.location.coordinates.lng)
    : null;

  useEffect(() => {
    if (status?.active && expiresAt && msLeft <= 0 && !refreshingOnExpiry.current) {
      refreshingOnExpiry.current = true;
      fetchStatus().finally(() => { refreshingOnExpiry.current = false; });
    }
  }, [msLeft, status?.active, expiresAt, fetchStatus]);

  // A hunt can only start inside Prague, and the treasure is picked at least
  // 4 km from here (when possible), so ask for a fresh position.
  const handleStart = async () => {
    unlockAudio();
    setStarting(true);
    setHuntFlash(null);
    setStartError(null);
    const pos = await getCurrentPosition().catch(() => posRef.current);
    Promise.all([userAPI.drawRandomLocation(pos), shuffleDone()])
      .then(([res]) => setStatus(res.data))
      .catch(err => {
        const code = err.response?.data?.code;
        if (code === 'outsidePrague' || code === 'positionRequired') setStartError(code);
        fetchStatus();
      })
      .finally(() => { setShuffling(false); setStarting(false); });
  };

  const handleCheckIn = (slug, result) => {
    applyProgress(result.levelInfo, result.totalXP);
    fetchStatus();
  };

  // Rule 3 introduces the clue table rendered right under it.
  const huntRules = [1, 2, 3, 4, 5].map(n => t(`draw.huntRule${n}`));
  const solvedHunt = status?.active && status.bonusUsed && status.location;
  const countdown = (
    <div className="draw-countdown">
      {t('draw.cooldownLabel')} <span className="draw-countdown__time">{formatCountdown(msLeft)}</span>
    </div>
  );

  return (
    <div className="guide-page draw-page">
      <div className="guide-wrap">
        <h1 className="px-title" style={{ fontSize: 26, marginBottom: 6 }}>{t('draw.modeHunt')}</h1>
        <p className="guide-intro">{t('draw.huntTagline')}</p>
        {/* On phones the challenge box starts folded to a few lines, in a
            smaller font (pixelart.css); on desktop the toggle is hidden. */}
        <div className={`guide-challenge guide-challenge--fold${challengeOpen ? ' is-open' : ''}`}>
          <div className="guide-challenge__text">{t('draw.huntChallenge')}</div>
          <button type="button" className="guide-challenge__toggle" onClick={() => setChallengeOpen(o => !o)} aria-expanded={challengeOpen}>
            {t(challengeOpen ? 'draw.huntChallengeLess' : 'draw.huntChallengeMore')}
          </button>
        </div>

        {user && <LocationOffNotice />}

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
            ) : (
              <>
                {/* Persistent 3D flip card: the mystery back turns into the
                    found card once the treasure is collected. See .flip-card*
                    in pixelart.css. */}
                {shuffling ? <DeckShuffle /> : (
                <div className={`flip-card${solvedHunt ? ' flip-card--revealed' : ''}`}>
                  <div className="flip-card__inner">
                    <div className="flip-card__face flip-card__face--back">
                      <div className="draw-card draw-card--mystery draw-card--mystery-img">
                        <img className="draw-card__mystery-img" src="/pixel-art/cardback.webp" alt="???" />
                      </div>
                    </div>
                    <div className="flip-card__face flip-card__face--front">
                      {solvedHunt && (
                        <div className="draw-stage__card">
                          <LocationCard
                            location={{ ...status.location, unlocked: true }}
                            onClick={() => setSelectedSlug(status.location.slug)}
                            distance={distance}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                )}

                {huntActive && status.hunt ? (
                  <>
                    <TreasureHuntPanel hunt={status.hunt} onGuess={handleGuess} onClue={handleClue} busy={busy} flash={huntFlash} />
                    {countdown}
                  </>
                ) : status?.forfeited ? (
                  <>
                    {status.lastHunt?.location && (
                      <p className="guide-body" style={{ textAlign: 'center', maxWidth: 420, marginTop: 14 }}>
                        {t('draw.huntForfeited')}
                        <a
                          href="#"
                          onClick={e => { e.preventDefault(); setSelectedSlug(status.lastHunt.location.slug); }}
                          style={{ textDecoration: 'underline' }}
                        >
                          {convert(getLocName(status.lastHunt.location, lang))}
                        </a>
                      </p>
                    )}
                    {countdown}
                  </>
                ) : solvedHunt ? (
                  <>
                    <p className="guide-body hunt-found" style={{ marginTop: 14, marginBottom: 4 }}>
                      {t('draw.huntFound', { n: status.solvedAttempt, xp: status.xpEarned ?? 0 })}
                    </p>
                    {countdown}
                  </>
                ) : (
                  <>
                    {status?.lastHunt?.location && (
                      <p className="guide-body" style={{ textAlign: 'center', maxWidth: 420 }}>
                        {t('draw.huntLastAnswer')}
                        <a
                          href="#"
                          onClick={e => { e.preventDefault(); setSelectedSlug(status.lastHunt.location.slug); }}
                          style={{ textDecoration: 'underline' }}
                        >
                          {convert(getLocName(status.lastHunt.location, lang))}
                        </a>
                      </p>
                    )}
                    <p className="guide-body" style={{ textAlign: 'center', maxWidth: 420, color: 'var(--text-muted)' }}>
                      {t('draw.huntMysteryHint')}
                    </p>
                    <button className="px-btn px-btn--gold px-btn--lg" onClick={handleStart} disabled={starting || !user}>
                      {starting ? t('draw.buttonDrawing') : t('draw.buttonHuntStart')}
                    </button>
                    {!user && <p className="guide-body draw-mode-hint">{t('draw.huntGuestOnly')}</p>}
                    {startError && <p className="guide-body draw-mode-hint" role="alert">{t(`draw.huntStartError.${startError}`)}</p>}
                  </>
                )}
              </>
            )}
          </div>
        )}

        <hr className="px-divider" />

        <section className="guide-section">
          <p className="guide-body">{t('draw.huntIntro')}</p>
        </section>
        <hr className="px-divider" />

        <section className="guide-section">
          <h2 className="guide-h2">{t('draw.rulesTitle')}</h2>
          {huntRules.map((rule, i) => (
            <div key={i}>
              <div className="guide-step">
                <span className="guide-step-num">{i + 1}</span>
                <p className="guide-body">{rule}</p>
              </div>
              {i === 2 && <HuntClueTable t={t} />}
            </div>
          ))}
        </section>
      </div>

      {selectedSlug && (
        <LocationDetail
          slug={selectedSlug}
          onClose={() => { setSelectedSlug(null); fetchStatus(); }}
          onCheckIn={handleCheckIn}
        />
      )}
    </div>
  );
}
