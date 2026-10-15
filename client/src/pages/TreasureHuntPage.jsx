import { useState, useEffect, useRef, useCallback } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import { getLocName } from '../utils/locName';
import { haversineDistance, getCurrentPosition } from '../utils/geolocation';
import { useUserPosition } from '../hooks/useUserPosition';
import LocationCard from '../components/locations/LocationCard';
import LocationDetail from '../components/locations/LocationDetail';
import TreasureHuntPanel from '../components/draw/TreasureHuntPanel';
import HardcoreHunt from '../components/draw/HardcoreHunt';
import DeckShuffle, { SHUFFLE_MS, prefersReducedMotion } from '../components/draw/DeckShuffle';

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

// The treasure hunt's guesses at a glance, for the rules section. Multipliers
// and radii mirror HIDDEN_DRAW_MULTIPLIERS / HIDDEN_DRAW_RADII on the server.
const HUNT_GUESSES = [
  { mult: 10, unlock: '3 km' },
  { mult: 5, unlock: '2 km' },
  { mult: 3, unlock: '1 km' },
  { mult: 2, unlock: '500 m' },
  { mult: 1, unlock: '100 m' },
];

function HuntClueTable({ t }) {
  return (
    <div className="hunt-table-wrap">
      <div className="hunt-table-scroll">
        <table className="hunt-table">
          <thead>
            <tr>{[1, 2, 3, 4, 5].map(k => <th key={k}>{t(`draw.huntTable.h${k}`)}</th>)}</tr>
          </thead>
          <tbody>
            {HUNT_GUESSES.map((g, i) => (
              <tr key={i}>
                <td className="hunt-table__num">{i + 1}</td>
                <td className="hunt-table__num">{g.mult}×</td>
                <td className="hunt-table__nowrap">{g.unlock}</td>
                <td>{t(`draw.huntTable.clues${i + 1}`)}</td>
                <td>{t(`draw.huntTable.dist${i + 1}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="hunt-table__note">{t('draw.huntTableNote')}</p>
    </div>
  );
}

// A rule may wrap a phrase in [[hardcore]]…[[/hardcore]]: it becomes a link
// that switches to the Hardcore tab.
function renderRule(rule, onHardcore) {
  const m = rule.match(/^([\s\S]*)\[\[hardcore\]\]([\s\S]*)\[\[\/hardcore\]\]([\s\S]*)$/);
  if (!m) return rule;
  return (
    <>
      {m[1]}
      <a href="#" onClick={e => { e.preventDefault(); onHardcore(); }} style={{ textDecoration: 'underline' }}>{m[2]}</a>
      {m[3]}
    </>
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

  // Clue hunt (线索模式) or the hardcore one (HardcoreHunt), remembered per device.
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('huntMode') === 'hardcore' ? 'hardcore' : 'normal'; } catch { return 'normal'; }
  });
  const switchMode = m => { setMode(m); try { localStorage.setItem('huntMode', m); } catch { /* private mode */ } };
  const [hardcoreRefresh, setHardcoreRefresh] = useState(0);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [selectedSlug, setSelectedSlug] = useState(null);
  const refreshingOnExpiry = useRef(false);
  const [guessing, setGuessing] = useState(false);
  const [huntFlash, setHuntFlash] = useState(null);
  // The deck is being shuffled and a card drawn (DeckShuffle), on a new hunt
  // or a re-roll. The new hunt's status is only shown once the animation and
  // the server have both finished.
  const [shuffling, setShuffling] = useState(false);
  const shuffleDone = () => {
    if (prefersReducedMotion()) return Promise.resolve();
    setShuffling(true);
    return new Promise(resolve => setTimeout(resolve, SHUFFLE_MS));
  };
  // Latest position for the hunt's distance clue, read by the poll below
  // without restarting it on every GPS update.
  const posRef = useRef(userPos);
  posRef.current = userPos;

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
  // Only one mode runs at a time: coming back to this tab, recheck whether
  // the hardcore hunt has ended in the meantime.
  useEffect(() => { if (mode === 'normal') fetchStatus(); }, [mode, fetchStatus]);

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
  const classicShown = mode === 'normal';
  useEffect(() => {
    if (!huntActive || !hasPos || !classicShown) return;
    const tick = () => {
      if (!posRef.current) return;
      userAPI.getRandomDraw(posRef.current).then(res => setStatus(res.data)).catch(() => {});
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, [huntActive, hasPos, classicShown]);

  const handleGuess = async () => {
    setGuessing(true);
    setHuntFlash(null);
    try {
      const pos = await getCurrentPosition();
      const res = await userAPI.guessTreasure(pos);
      if (res.data.hit) applyProgress(res.data.levelInfo, res.data.totalXP);
      else setHuntFlash({ type: 'miss', text: t('draw.huntMissFlash') });
      setStatus(res.data.draw);
    } catch (err) {
      setHuntFlash({ type: 'error', text: err.response?.data?.message || err.message });
      fetchStatus();
    } finally {
      setGuessing(false);
    }
  };

  // "Give up this round, take the clues": no position check, see
  // skipHiddenDraw on the server. The position only feeds the distance clue.
  const handleSkip = () => {
    setGuessing(true);
    setHuntFlash(null);
    userAPI.skipTreasure(posRef.current)
      .then(res => { setStatus(res.data.draw); setHuntFlash({ type: 'miss', text: t('draw.huntSkipFlash') }); })
      .catch(err => { setHuntFlash({ type: 'error', text: err.response?.data?.message || err.message }); fetchStatus(); })
      .finally(() => setGuessing(false));
  };

  // One re-roll per hunt (see rerollDraw on the server). Two taps: the first
  // asks for confirmation, since the clues and guesses so far are lost.
  const [rerollConfirm, setRerollConfirm] = useState(false);
  const [rerolling, setRerolling] = useState(false);
  const [rerollError, setRerollError] = useState(null);
  const handleReroll = () => {
    if (!rerollConfirm) { setRerollConfirm(true); return; }
    setRerolling(true);
    setRerollError(null);
    Promise.all([userAPI.rerollDraw(posRef.current), shuffleDone()])
      .then(([res]) => { setStatus(res.data); setHuntFlash(null); })
      .catch(err => setRerollError(err.response?.data?.message || err.message))
      .finally(() => { setShuffling(false); setRerolling(false); setRerollConfirm(false); });
  };
  const rerollButton = status?.canReroll ? (
    <div className="draw-reroll">
      {rerollConfirm && <span className="draw-reroll__ask">{t('draw.rerollConfirmHunt')}</span>}
      <div className="draw-reroll__buttons">
        <button className="px-btn" onClick={handleReroll} disabled={rerolling}>
          {rerollConfirm ? t('draw.rerollYes') : t('draw.reroll')}
        </button>
        {rerollConfirm && <button className="px-btn" onClick={() => setRerollConfirm(false)}>{t('draw.huntCancel')}</button>}
      </div>
      {rerollError && <span className="hunt-panel__flash hunt-panel__flash--error">{rerollError}</span>}
    </div>
  ) : null;

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

  const handleStart = () => {
    setStarting(true);
    setHuntFlash(null);
    Promise.all([userAPI.drawRandomLocation(posRef.current), shuffleDone()])
      .then(([res]) => setStatus(res.data))
      .catch(() => fetchStatus())
      .finally(() => { setShuffling(false); setStarting(false); });
  };

  const handleCheckIn = (slug, result) => {
    applyProgress(result.levelInfo, result.totalXP);
    fetchStatus();
  };

  // Rule 3 introduces the per-guess table rendered right under it.
  const huntRules = [t('draw.huntRule1'), t('draw.huntRule2'), t('draw.huntRule3'), t('draw.huntRuleLuck'), t('draw.huntRule6')];
  const hardcoreRules = [t('draw.hcRule1'), t('draw.hcRule2'), t('draw.hcRule3'), t('draw.hcRule4')];
  const solvedHunt = status?.active && status.bonusUsed && status.location;
  const countdown = (
    <div className="draw-countdown">
      {t('draw.cooldownLabel')} <span className="draw-countdown__time">{formatCountdown(msLeft)}</span>
    </div>
  );

  return (
    <div className="guide-page draw-page">
      <div className="guide-wrap">
        <h1 className="px-title" style={{ fontSize: 26, marginBottom: 6 }}>{t(mode === 'hardcore' ? 'draw.hcTitle' : 'draw.modeHunt')}</h1>
        <p className="guide-intro">{t(mode === 'hardcore' ? 'draw.hcTagline' : 'draw.huntTagline')}</p>
        <div className="guide-challenge">{t(mode === 'hardcore' ? 'draw.hcChallenge' : 'draw.huntChallenge')}</div>

        <div className="hunt-tabs" role="tablist">
          {['normal', 'hardcore'].map(m => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              className={`hunt-tabs__tab${mode === m ? ' hunt-tabs__tab--active' : ''}`}
              onClick={() => switchMode(m)}
            >
              {t(m === 'hardcore' ? 'draw.tabHardcore' : 'draw.tabNormal')}
            </button>
          ))}
        </div>

        {mode === 'hardcore' ? (
          <HardcoreHunt onOpen={setSelectedSlug} refreshKey={hardcoreRefresh} onSwitch={() => switchMode('normal')} />
        ) : loading ? (
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
                    <TreasureHuntPanel hunt={status.hunt} onGuess={handleGuess} onSkip={handleSkip} guessing={guessing} flash={huntFlash} />
                    {countdown}
                    {rerollButton}
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
                    <button className="px-btn px-btn--gold px-btn--lg" onClick={handleStart} disabled={starting || !user || !!status?.blockedBy}>
                      {starting ? t('draw.buttonDrawing') : t('draw.buttonHuntStart')}
                    </button>
                    {status?.blockedBy && (
                      <p className="guide-body draw-mode-hint">
                        {renderRule(t('draw.blockedByHardcore'), () => switchMode('hardcore'))}
                      </p>
                    )}
                    {!user && <p className="guide-body draw-mode-hint">{t('draw.huntGuestOnly')}</p>}
                  </>
                )}
              </>
            )}
          </div>
        )}

        <hr className="px-divider" />

        {mode === 'normal' && (
          <>
            <section className="guide-section">
              <p className="guide-body">{t('draw.huntIntro')}</p>
            </section>
            <hr className="px-divider" />
          </>
        )}

        <section className="guide-section">
          <h2 className="guide-h2">{t('draw.rulesTitle')}</h2>
          {(mode === 'hardcore' ? hardcoreRules : huntRules).map((rule, i) => (
            <div key={i}>
              <div className="guide-step">
                <span className="guide-step-num">{i + 1}</span>
                <p className="guide-body">{renderRule(rule, () => { switchMode('hardcore'); window.scrollTo({ top: 0, behavior: 'smooth' }); })}</p>
              </div>
              {mode === 'normal' && i === 2 && <HuntClueTable t={t} />}
            </div>
          ))}
        </section>
      </div>

      {selectedSlug && (
        <LocationDetail
          slug={selectedSlug}
          onClose={() => { setSelectedSlug(null); fetchStatus(); setHardcoreRefresh(k => k + 1); }}
          onCheckIn={handleCheckIn}
        />
      )}
    </div>
  );
}
