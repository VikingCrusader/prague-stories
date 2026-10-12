import { useState, useEffect, useRef, useCallback } from 'react';
import { userAPI, locationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useT, useLang, useConvert } from '../context/LanguageContext';
import { getArt, LABEL_DEFINITIONS, LABEL_COLORS } from '../utils/pixelArtMap';
import { getLocalCoverPath } from '../utils/localCover';
import { getLocName } from '../utils/locName';
import { haversineDistance, formatDistance, getCurrentPosition } from '../utils/geolocation';
import { useUserPosition } from '../hooks/useUserPosition';
import { RARITY_VAR, RARITY_LABEL, lockClosedIcon } from '../utils/rarity';
import LocationCard from '../components/locations/LocationCard';
import RarityFrame from '../components/locations/RarityFrame';
import { isInCity } from '../components/locations/ScopeToggle';
import LocationDetail from '../components/locations/LocationDetail';
import TreasureHuntPanel from '../components/draw/TreasureHuntPanel';

// Guest "try it out" draw: never touches the backend at all, since a guest
// has no account to persist a real draw against. Lives in sessionStorage —
// not localStorage — specifically so it resets the moment the guest closes
// the tab/browser and comes back for a fresh session, per the product call
// to keep this a lightweight preview rather than a real, durable draw.
// Logging in or registering starts a real draw from scratch; nothing here
// is carried over.
const GUEST_DRAW_KEY = 'guestRandomDraw';
const DRAW_SCOPE_KEY = 'drawIncludeOutside';
const DRAW_MODE_KEY = 'drawMode';
const GUEST_DRAW_WINDOW_MS = 24 * 60 * 60 * 1000;

function readGuestDraw() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(GUEST_DRAW_KEY) || 'null');
    return parsed?.location?.slug && parsed?.drawnAt ? parsed : null;
  } catch {
    return null;
  }
}

function buildGuestStatus() {
  const draw = readGuestDraw();
  const drawnAt = draw ? new Date(draw.drawnAt).getTime() : null;
  const active = !!(drawnAt && Date.now() - drawnAt < GUEST_DRAW_WINDOW_MS);
  if (!active) return { active: false, canDraw: true, location: null };
  return {
    active: true,
    canDraw: false,
    location: draw.location,
    drawnAt: draw.drawnAt,
    expiresAt: new Date(drawnAt + GUEST_DRAW_WINDOW_MS).toISOString(),
    bonusUsed: false,
  };
}

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
// callout; the real label and distance render separately via DrawnCardMeta,
// outside the box — see the comment on that component for why it can't just
// live inside this one's returned fragment.
function DrawnCard({ loc, name, lang, convert, onOpen }) {
  const rarity = loc.rarity ?? 'common';
  const art = getArt(loc.pixelArtKey, loc.labels);
  const bannerColor = LABEL_COLORS[loc.labels?.[0]] || '#1a2a5a';
  const localCover = getLocalCoverPath(loc.slug, loc.coverImage);
  const [localFailed, setLocalFailed] = useState(false);
  const [cloudFailed, setCloudFailed] = useState(false);
  const useLocalCover = !!localCover && !localFailed;
  const useCloudCover = !useLocalCover && !!loc.coverImage && !cloudFailed;

  return (
    <>
      <div className="loc-card" data-rarity={rarity} style={{ border: `3px solid ${RARITY_VAR[rarity]}` }} onClick={onOpen}>
        <RarityFrame />
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
            <div className="loc-card__name" style={{ color: RARITY_VAR[rarity] }}>{name}</div>
            {lang !== 'cz' && loc.localizedNames?.cz && (
              <div className="loc-card__cz-name">{loc.localizedNames.cz}</div>
            )}
          </div>
          <div className="loc-card__labels">
            <span
              className="label-pill-sm draw-xp-pill"
              style={{
                backgroundColor: `color-mix(in srgb, ${RARITY_VAR[rarity]} 13%, transparent)`,
                borderColor: RARITY_VAR[rarity],
                color: RARITY_VAR[rarity],
              }}
            >
              {convert(RARITY_LABEL[lang]?.[rarity])}
              <span className="draw-card__xp-old">{loc.xpReward} XP</span>
              <strong>{loc.xpReward * 3} XP</strong>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// DrawnCard's label + distance pills, previously rendered as a sibling
// inside DrawnCard's own fragment. Moved out to a standalone component
// because that fragment now lives inside .flip-card__face--front, which is
// pinned to .flip-card's fixed aspect-ratio box (see pixelart.css) so the
// mystery card-back and the revealed card are exactly the same size. A
// sibling row inside that absolutely-positioned face doesn't get counted in
// the box's height and just overflows below it, visually overlapping
// whatever renders next in normal flow — so this renders as a real sibling
// of .flip-card instead, in normal document flow, where it belongs.
function DrawnCardMeta({ loc, lang, convert, distance }) {
  const firstLabel = loc.labels?.[0];
  return (
    <div className="draw-card__meta-row">
      {firstLabel && (
        <span className="detail-label-pill" style={{ backgroundColor: LABEL_COLORS[firstLabel] || 'var(--pill-fallback, rgba(255,255,255,0.07))' }}>
          {convert(LABEL_DEFINITIONS[firstLabel]?.[lang] || LABEL_DEFINITIONS[firstLabel]?.en || firstLabel)}
        </span>
      )}
      {distance != null && (
        <span className="detail-label-pill" style={{ backgroundColor: LABEL_COLORS[firstLabel] || 'var(--pill-fallback, rgba(255,255,255,0.07))' }}>
          {formatDistance(distance)}
        </span>
      )}
    </div>
  );
}

export default function RandomDrawPage() {
  const { user, guest, applyProgress } = useAuth();
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const userPos = useUserPosition();

  const isGuestMode = guest && !user;

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drawing, setDrawing] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [selectedSlug, setSelectedSlug] = useState(null);
  // Draw only from the city proper by default (cards without the `outside`
  // label); a ticked checkbox widens the pool to every card. Remembered
  // across visits.
  const [includeOutside, setIncludeOutside] = useState(() => localStorage.getItem(DRAW_SCOPE_KEY) === 'all');
  const toggleIncludeOutside = e => {
    setIncludeOutside(e.target.checked);
    localStorage.setItem(DRAW_SCOPE_KEY, e.target.checked ? 'all' : 'city');
  };
  // Game mode tab at the top of the page: 'open' (明抽) or 'hidden' (寻宝).
  // Remembered across visits; while a draw is running the tab follows that
  // draw's mode and can't be switched.
  const [pickedMode, setPickedMode] = useState(() => {
    try { return localStorage.getItem(DRAW_MODE_KEY) === 'hidden' ? 'hidden' : 'open'; } catch { return 'open'; }
  });
  const pickMode = m => {
    setPickedMode(m);
    try { localStorage.setItem(DRAW_MODE_KEY, m); } catch { /* ignore */ }
  };
  const refreshingOnExpiry = useRef(false);
  const [guessing, setGuessing] = useState(false);
  const [huntFlash, setHuntFlash] = useState(null);
  // Latest position for the treasure hunt's distance clue, read by the poll
  // below without restarting it on every GPS update.
  const posRef = useRef(userPos);
  posRef.current = userPos;

  const fetchStatus = useCallback(() => {
    if (isGuestMode) {
      setStatus(buildGuestStatus());
      return Promise.resolve();
    }
    return userAPI.getRandomDraw(posRef.current)
      .then(res => setStatus(res.data))
      .catch(() => setStatus({ active: false, canDraw: true, location: null }));
  }, [isGuestMode]);

  useEffect(() => {
    if (!user && !isGuestMode) { setLoading(false); return; }
    setLoading(true);
    fetchStatus().finally(() => setLoading(false));
  }, [user, isGuestMode, fetchStatus]);

  useEffect(() => {
    if (!status?.active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [status?.active]);

  // Treasure hunt in progress: the distance clue is computed by the server
  // (the client never gets the coordinates), so report the position every
  // 10 s, and right away once the first GPS fix arrives.
  const huntActive = !!(status?.active && status.mode === 'hidden' && !status.bonusUsed);
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

  // One re-roll per draw (see rerollDraw on the server). Two taps: the first
  // asks for confirmation, since a treasure hunt's progress is lost.
  const [rerollConfirm, setRerollConfirm] = useState(false);
  const [rerolling, setRerolling] = useState(false);
  const [rerollError, setRerollError] = useState(null);
  const handleReroll = () => {
    if (!rerollConfirm) { setRerollConfirm(true); return; }
    setRerolling(true);
    setRerollError(null);
    userAPI.rerollDraw(includeOutside, posRef.current)
      .then(res => { setStatus(res.data); setHuntFlash(null); })
      .catch(err => setRerollError(err.response?.data?.message || err.message))
      .finally(() => { setRerolling(false); setRerollConfirm(false); });
  };
  const rerollButton = status?.canReroll && !isGuestMode ? (
    <div className="draw-reroll">
      {rerollConfirm && (
        <span className="draw-reroll__ask">{t(status.mode === 'hidden' ? 'draw.rerollConfirmHunt' : 'draw.rerollConfirm')}</span>
      )}
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
  const mapHref = status?.location
    ? `https://www.google.com/maps/dir/?api=1&destination=${status.location.coordinates.lat},${status.location.coordinates.lng}`
    : null;

  useEffect(() => {
    if (status?.active && expiresAt && msLeft <= 0 && !refreshingOnExpiry.current) {
      refreshingOnExpiry.current = true;
      fetchStatus().finally(() => { refreshingOnExpiry.current = false; });
    }
  }, [msLeft, status?.active, expiresAt, fetchStatus]);

  const handleDraw = (mode = 'open') => {
    setDrawing(true);
    setHuntFlash(null);
    if (isGuestMode) {
      // No account to exclude already-checked-in locations against — a guest
      // has none — so this just samples from the public location list
      // (city cards only unless the checkbox is ticked).
      locationAPI.getAll()
        .then(res => {
          const pool = (res.data || []).filter(l => includeOutside || isInCity(l));
          if (!pool.length) return;
          const picked = pool[Math.floor(Math.random() * pool.length)];
          const drawnAt = new Date().toISOString();
          sessionStorage.setItem(GUEST_DRAW_KEY, JSON.stringify({ location: picked, drawnAt }));
          setStatus(buildGuestStatus());
        })
        .finally(() => setDrawing(false));
      return;
    }
    userAPI.drawRandomLocation(includeOutside, mode, posRef.current)
      .then(res => setStatus(res.data))
      .finally(() => setDrawing(false));
  };

  const handleCheckIn = (slug, result) => {
    applyProgress(result.levelInfo, result.totalXP);
    fetchStatus();
  };

  const rules = [t('draw.rule1'), t('draw.rule2'), t('draw.rule3'), t('draw.rule4')];
  const huntRules = [t('draw.huntRule1'), t('draw.huntRule2'), t('draw.huntRule3'), t('draw.huntRule4'), t('draw.huntRule5'), t('draw.huntRule6')];
  const modeLocked = !!status?.active;
  const mode = modeLocked ? (status.mode || 'open') : pickedMode;
  const solvedHunt = status?.active && status.mode === 'hidden' && status.bonusUsed && status.location;

  return (
    <div className="guide-page draw-page">
      <div className="guide-wrap">
        <div className="draw-mode-tabs" role="tablist">
          {['open', 'hidden'].map(m => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              className={`filter-btn${mode === m ? ' filter-btn--active' : ''}`}
              onClick={() => pickMode(m)}
              disabled={modeLocked && mode !== m}
              title={modeLocked && mode !== m ? t('draw.modeLocked') : undefined}
            >
              {t(m === 'open' ? 'draw.modeOpen' : 'draw.modeHunt')}
            </button>
          ))}
        </div>
        <h1 className="px-title" style={{ fontSize: 26, marginBottom: 6 }}>
          {t(mode === 'hidden' ? 'draw.modeHunt' : 'draw.modeOpen')}
        </h1>
        <p className="guide-intro">{t(mode === 'hidden' ? 'draw.huntTagline' : 'draw.tagline')}</p>
        <div className="guide-challenge">{t(mode === 'hidden' ? 'draw.huntChallenge' : 'draw.challenge')}</div>

        {isGuestMode && (
          <p className="guide-body" style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto 14px', color: 'var(--text-muted)' }}>
            {t('draw.guestTrialNote')}
          </p>
        )}

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
                ) : (
                  <>
                    {/* Persistent 3D flip card: both faces stay mounted across
                        the not-drawn <-> drawn transition, and .flip-card--revealed
                        toggles the rotateY so the mystery back visually turns into
                        the actual result instead of the two states swapping
                        instantly. See .flip-card* in pixelart.css. */}
                    <div className={`flip-card${status?.active && status.location ? ' flip-card--revealed' : ''}`}>
                      <div className="flip-card__inner">
                        <div className="flip-card__face flip-card__face--back">
                          <div className="draw-card draw-card--mystery draw-card--mystery-img">
                            <img className="draw-card__mystery-img" src="/pixel-art/cardback.webp" alt="???" />
                          </div>
                        </div>
                        <div className="flip-card__face flip-card__face--front">
                          {status?.location && (
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
                                  onOpen={() => setSelectedSlug(status.location.slug)}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {status?.active && status.location && !status.bonusUsed && (
                      <DrawnCardMeta loc={status.location} lang={lang} convert={convert} distance={distance} />
                    )}

                    {huntActive && status.hunt ? (
                      <>
                        <TreasureHuntPanel hunt={status.hunt} onGuess={handleGuess} guessing={guessing} flash={huntFlash} now={now} />
                        <div className="draw-countdown">
                          {t('draw.cooldownLabel')} <span className="draw-countdown__time">{formatCountdown(msLeft)}</span>
                        </div>
                        {rerollButton}
                      </>
                    ) : solvedHunt ? (
                      <>
                        <p className="guide-body hunt-found" style={{ marginTop: 14, marginBottom: 4 }}>
                          {t('draw.huntFound', {
                            n: status.solvedAttempt,
                            xp: status.xpEarned ?? 0,
                          })}
                        </p>
                        <div className="draw-countdown">
                          {t('draw.cooldownLabel')} <span className="draw-countdown__time">{formatCountdown(msLeft)}</span>
                        </div>
                      </>
                    ) : status?.active && status.location ? (
                      <>
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
                        {rerollButton}
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
                          {t(mode === 'hidden' ? 'draw.huntMysteryHint' : 'draw.mysteryHint')}
                        </p>
                        {mode === 'hidden' ? (
                          <>
                            <button
                              className="px-btn px-btn--gold px-btn--lg"
                              onClick={() => handleDraw('hidden')}
                              disabled={drawing || isGuestMode}
                            >
                              {drawing ? t('draw.buttonDrawing') : t('draw.buttonHuntStart')}
                            </button>
                            {isGuestMode && <p className="guide-body draw-mode-hint">{t('draw.huntGuestOnly')}</p>}
                          </>
                        ) : (
                          <>
                            <button
                              className="px-btn px-btn--gold px-btn--lg"
                              onClick={() => handleDraw('open')}
                              disabled={drawing}
                            >
                              {drawing ? t('draw.buttonDrawing') : t('draw.buttonDraw')}
                            </button>
                            <label className="draw-scope">
                              <input type="checkbox" checked={includeOutside} onChange={toggleIncludeOutside} />
                              {t('draw.includeOutside')}
                            </label>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            <hr className="px-divider" />

            {mode === 'hidden' ? (
              <>
                <section className="guide-section">
                  <p className="guide-body">{t('draw.huntIntro')}</p>
                </section>

                <hr className="px-divider" />

                <section className="guide-section">
                  <h2 className="guide-h2">{t('draw.rulesTitle')}</h2>
                  {huntRules.map((rule, i) => (
                    <div key={i} className="guide-step">
                      <span className="guide-step-num">{i + 1}</span>
                      <p className="guide-body">{rule}</p>
                    </div>
                  ))}
                </section>
              </>
            ) : (
              <>
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
        </>
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
