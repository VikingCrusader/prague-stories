import { pageCache, pageKey } from '../utils/pageCache';
import { Link } from 'react-router-dom';
import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LocationOffNotice from '../components/shared/LocationOffNotice';
import { useT } from '../context/LanguageContext';
import { haversineDistance, getCurrentPosition } from '../utils/geolocation';
import { useUserPosition } from '../hooks/useUserPosition';
import LocationCard from '../components/locations/LocationCard';
import LocationDetail from '../components/locations/LocationDetail';
import TreasureHuntPanel from '../components/draw/TreasureHuntPanel';
import DeckShuffle, { SHUFFLE_MS, prefersReducedMotion } from '../components/draw/DeckShuffle';
import HuntMap from '../components/draw/HuntMap';
import HuntFinds from '../components/draw/HuntFinds';
import HuntRulesWindow from '../components/draw/HuntRulesWindow';
import { CardThumb } from '../components/dashboard/RecentCardStrip';
import { unlockAudio, playShuffleSound, playClueSound, playMissSound, playHuntWinSound, HUNT_WIN_SOUND_MS } from '../utils/sound';
import { formatCountdown } from '../utils/formatCountdown';
import { useMedia } from '../hooks/useMedia';
import { useWakeLock } from '../hooks/useWakeLock';
import { useCountUp } from '../hooks/useCountUp';
import '../styles/hunt.css';

// Three layouts (2026-11-14, user's call: the page redone for every screen):
// - phone (and anything as narrow): played walking, the stack below with
//   thumb-sized buttons;
// - board (a landscape screen from 1024 x 600: laptops, Macs, iPads sideways,
//   2K): one screen in three columns. Redone the same day (user's call: a first
//   visit met a wall of text, and this is a hot-and-cold game): the card and
//   "It's here!" big in the middle, a short how to play and the finds on the
//   left (the full rules in a window), the clues and the clue map on the right.
//   Each column scrolls on its own if it must, never the page; on a 2K screen
//   none does;
// - stack (upright tablets, short windows): one centred column.
const PHONE_QUERY = '(max-width: 720px)';
const BOARD_QUERY = '(min-width: 1024px) and (min-height: 600px) and (orientation: landscape)';
// How many finds the board's side column shows before "All": one row.
const BOARD_FINDS = 3;
const CELEBRATE_MS = 3200;

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

// A find: gold rays behind the card and the XP counting up over it, for a few
// seconds after the hitting press (the fanfare plays at the same time).
function HuntCelebration({ xp }) {
  const shown = useCountUp(xp, { ms: 1400, fromZero: true });
  return (
    <div className="hunt-celebrate" aria-hidden="true">
      <div className="hunt-celebrate__rays" />
      <div className="hunt-celebrate__xp">+{Math.round(shown)} XP</div>
    </div>
  );
}

// The page's first load, before the hunt's status is in: grey shapes where
// the card and the panel will be, so nothing jumps (no spinner, like the
// other pages).
function HuntSkeleton() {
  return (
    <div className="hunt-skel" aria-busy="true">
      <div className="hunt-skel__card hunt-skeleton" />
      <div className="hunt-skel__line hunt-skeleton" />
      <div className="hunt-skel__line hunt-skel__line--short hunt-skeleton" />
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
  const userPos = useUserPosition();

  const huntKey = pageKey('hunt', user?._id);
  const [status, setStatus] = useState(() => pageCache.get(huntKey) ?? null);
  const [loading, setLoading] = useState(() => !pageCache.get(huntKey));
  const [starting, setStarting] = useState(false);
  // Why the server refused to start a hunt: 'outsidePrague' or
  // 'positionRequired' (drawRandomLocation on the server).
  const [startError, setStartError] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [selectedSlug, setSelectedSlug] = useState(null);
  // The user's past finds: in the side column on the board, at the bottom of
  // the stacked page, in a sheet on phones; loaded once.
  const [finds, setFinds] = useState(null);
  const [openFind, setOpenFind] = useState(null);
  const findsAsked = useRef(false);
  const loadFinds = useCallback(() => {
    if (findsAsked.current) return;
    findsAsked.current = true;
    userAPI.getTreasures().then(res => setFinds(res.data)).catch(() => setFinds([]));
  }, []);
  const phone = useMedia(PHONE_QUERY);
  const board = useMedia(BOARD_QUERY) && !phone;
  // The board's right column, where the panel puts the clue track.
  const [trackSlot, setTrackSlot] = useState(null);
  const layout = phone ? 'phone' : board ? 'board' : 'stack';
  // Keep screen on: the switch lives only in the profile's settings window
  // (2026-11-14, user's call: no button here); the hook holds the lock while
  // this page is open when that setting is on.
  useWakeLock();
  // 'finds': all past finds; 'rules': the full rules (the board's left
  // column only has the short version). Windows.
  const [sheet, setSheet] = useState(null);
  const [celebrate, setCelebrate] = useState(null);
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

  // The board fills the window under the navbar.
  useLayoutEffect(() => {
    const nav = document.querySelector('.navbar');
    if (!nav || typeof ResizeObserver === 'undefined') return undefined;
    const root = document.documentElement;
    const measure = () => root.style.setProperty('--navbar-h', `${nav.offsetHeight}px`);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    return () => { ro.disconnect(); root.style.removeProperty('--navbar-h'); };
  }, []);

  // The finds show on the page itself except on phones.
  useEffect(() => { if (user) loadFinds(); }, [user, loadFinds]);

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
      .then(res => { pageCache.set(huntKey, res.data); setStatus(res.data); })
      .catch(() => setStatus({ active: false, canDraw: true, location: null }));
  }, [user]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const kept = pageCache.get(huntKey);
    setStatus(kept ?? null);
    setLoading(!kept);
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

  useEffect(() => {
    if (!celebrate) return;
    const id = setTimeout(() => setCelebrate(null), CELEBRATE_MS);
    return () => clearTimeout(id);
  }, [celebrate]);

  const handleGuess = async () => {
    unlockAudio();
    setBusy(true);
    setHuntFlash(null);
    try {
      const pos = await getCurrentPosition();
      const res = await userAPI.guessTreasure(pos);
      if (res.data.hit) {
        playHuntWinSound();
        if (!prefersReducedMotion()) setCelebrate({ xp: res.data.xpEarned ?? 0 });
        // The XP (and a level-up, with its own fanfare) lands once the
        // victory fanfare is over, so the two don't play on top of each other.
        const { levelInfo, totalXP } = res.data;
        setTimeout(() => applyProgress(levelInfo, totalXP), HUNT_WIN_SOUND_MS);
        // A new find for the list.
        findsAsked.current = false;
        loadFinds();
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
  const hunting = huntActive && !!status?.hunt;
  const idle = !loading && !hunting && !solvedHunt && !status?.forfeited && !status?.noneLeft;
  // On phones the tagline steps aside while a hunt is on, to keep the panel
  // close to the card. The buttons stay in the panel, under the clues and
  // above the map (2026-11-14, user's call: a bar fixed to the bottom of the
  // screen was dropped).
  const compact = phone && hunting;
  const countdown = (
    <div className="draw-countdown">
      {t('draw.cooldownLabel')} <span className="draw-countdown__time">{formatCountdown(msLeft)}</span>
    </div>
  );

  const introSection = (
    <section className="guide-section hunt-intro">
      {/* A walk through a hunt, in more detail since the challenge box
          above it went (2026-11-10, user's call). */}
      {t('draw.huntIntro').split('\n\n').map((para, i) => <p key={i} className="guide-body">{para}</p>)}
    </section>
  );
  const rulesSection = (
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
      {/* The Guide's practice hunt (GuideBoard, ?open=hunt). */}
      <Link to="/guide?open=hunt" className="px-btn hunt-practice-link">{t('draw.practiceLink')} →</Link>
    </section>
  );
  const findsBox = (opts = {}) => user && <HuntFinds finds={finds} onOpen={setOpenFind} {...opts} />;

  const header = (
    <header className="hunt-header">
      <h1 className="px-title hunt-title">{t('draw.modeHunt')}</h1>
      {!compact && <p className="guide-intro hunt-tagline">{t('draw.huntTagline')}</p>}
      {user && <LocationOffNotice />}
    </header>
  );

  // The card: a persistent 3D flip card, the mystery back turning into the
  // found card once the treasure is collected (.flip-card* in pixelart.css);
  // the deck shuffle while a hunt starts; a trophy when nothing is left.
  const stage = status?.noneLeft ? (
    <div className="draw-card draw-card--mystery draw-card--empty">
      <div className="draw-card__mystery-mark">🏆</div>
    </div>
  ) : (
    <div className="hunt-stage">
      {shuffling ? <DeckShuffle /> : (
        <div className={`flip-card${solvedHunt ? ' flip-card--revealed' : ''}`}>
          <div className="flip-card__inner">
            <div className="flip-card__face flip-card__face--back">
              <div className="draw-card draw-card--mystery draw-card--mystery-img">
                <img className="draw-card__mystery-img" src="/brand/hunt-back.webp" alt="???" />
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
      {celebrate && <HuntCelebration xp={celebrate.xp} />}
    </div>
  );

  // What goes with the card when no hunt is being played: the start button,
  // the find, the forfeit, the last answer as a small card.
  const lastAnswer = loc => (
    <div className="hunt-last">
      <CardThumb location={loc} onOpen={setSelectedSlug} />
    </div>
  );
  const status_ = status?.noneLeft ? (
    <>
      <h2 className="guide-h2 hunt-status__title">{t('draw.noneLeftTitle')}</h2>
      <p className="guide-body hunt-status__text">{t('draw.noneLeft')}</p>
    </>
  ) : hunting ? countdown : status?.forfeited ? (
    <>
      {status.lastHunt?.location && (
        <>
          <p className="guide-body hunt-status__text">{t('draw.huntForfeited')}</p>
          {lastAnswer(status.lastHunt.location)}
          <p className="guide-body hunt-status__text hunt-status__muted">{t('draw.huntForfeitedTip')}</p>
        </>
      )}
      {countdown}
    </>
  ) : solvedHunt ? (
    <>
      <p className="guide-body hunt-found">{t('draw.huntFound', { n: status.solvedAttempt, xp: status.xpEarned ?? 0 })}</p>
      {countdown}
    </>
  ) : (
    <>
      <p className="guide-body hunt-status__text hunt-status__muted">{t('draw.huntMysteryHint')}</p>
      <button className="px-btn px-btn--gold px-btn--lg" onClick={handleStart} disabled={starting || !user}>
        {starting ? t('draw.buttonDrawing') : t('draw.buttonHuntStart')}
      </button>
      {!user && <p className="guide-body draw-mode-hint">{t('draw.huntGuestOnly')}</p>}
      {startError && <p className="guide-body draw-mode-hint" role="alert">{t(`draw.huntStartError.${startError}`)}</p>}
      {/* On the board the last answer sits in the right column. */}
      {status?.lastHunt?.location && layout !== 'board' && (
        <>
          <p className="guide-body hunt-status__text hunt-status__muted">{t('draw.huntLastAnswer')}</p>
          {lastAnswer(status.lastHunt.location)}
        </>
      )}
    </>
  );
  // The board's right column: the last hunt's answer beside its label.
  const lastHuntBox = idle && status?.lastHunt?.location && (
    <section className="hunt-lastbox">
      <p className="hunt-lastbox__label">{t('draw.huntLastAnswer')}</p>
      {lastAnswer(status.lastHunt.location)}
    </section>
  );

  const panel = hunting && (
    <TreasureHuntPanel hunt={status.hunt} onGuess={handleGuess} onClue={handleClue} busy={busy} flash={huntFlash} split={layout === 'board'} trackTarget={trackSlot} />
  );
  // The clue map: during a hunt, and before one as a taste of it (the plain
  // city with the player's dot).
  const map = !status?.noneLeft && (hunting || idle) && <HuntMap hunt={hunting ? status.hunt : null} position={userPos} />;
  // How to play: the walk-through and the full rules (with the clue table under
  // rule 3), always on the page, never folded away (2026-11-14, user's call).
  const howToPlay = (
    <div className="hunt-howto">
      {introSection}
      {rulesSection}
    </div>
  );

  // The board's left column: how to play in four short steps, the full rules
  // in a window, and the finds.
  const shortHowTo = (
    <section className="hunt-short">
      <h2 className="guide-h2 hunt-short__title">{t('draw.howToPlay')}</h2>
      <ol className="hunt-short__steps">
        {[1, 2, 3, 4].map(n => (
          <li key={n} className="guide-step">
            <span className="guide-step-num">{n}</span>
            <p className="guide-body">{t(`draw.huntStep${n}`)}</p>
          </li>
        ))}
      </ol>
      <div className="hunt-short__links">
        <button type="button" className="px-btn" onClick={() => setSheet('rules')}>{t('draw.fullRules')}</button>
        <Link to="/guide?open=hunt" className="px-btn hunt-practice-link">{t('draw.practiceLink')} →</Link>
      </div>
    </section>
  );
  // The board's right column: the clues. During a hunt the panel puts its
  // live clue track here (trackTarget); otherwise the table of the clues.
  const cluesTitle = <h2 className="guide-h2 hunt-clues__title">{t('draw.cluesTitle')}</h2>;

  let body;
  if (loading) {
    body = layout === 'board'
      ? <div className="hunt-board"><div className="hunt-col hunt-col--left"><div className="hunt-skel__panel hunt-skeleton" /></div><div className="hunt-col hunt-col--mid">{header}<HuntSkeleton /></div><div className="hunt-col hunt-col--right"><div className="hunt-map hunt-map--loading" /></div></div>
      : <div className="hunt-stack">{header}<HuntSkeleton /></div>;
  } else if (layout === 'board') {
    body = (
      <div className="hunt-board">
        <div className="hunt-col hunt-col--left">
          {/* A short lead in gold in a box, above how to play: the walk-through's
              jokes without what the steps repeat (2026-11-14, user's call). */}
          <p className="hunt-lead">{t('draw.huntLead')}</p>
          {shortHowTo}
          {findsBox({ limit: BOARD_FINDS, onSeeAll: () => setSheet('finds') })}
        </div>
        <div className="hunt-col hunt-col--mid">
          {header}
          {stage}
          {hunting ? <>{panel}{countdown}</> : <div className="hunt-status">{status_}</div>}
        </div>
        <div className="hunt-col hunt-col--right">
          {cluesTitle}
          {hunting ? <div ref={setTrackSlot} className="hunt-clues-slot" /> : <HuntClueTable t={t} />}
          {map}
          {lastHuntBox}
        </div>
      </div>
    );
  } else {
    body = (
      <div className="hunt-stack">
        {header}
        <div className="draw-stage">
          {stage}
          {!hunting && <div className="hunt-status">{status_}</div>}
          {panel}
          {hunting && countdown}
        </div>
        {map && <div className="hunt-stack__map">{map}</div>}
        <hr className="px-divider" />
        {howToPlay}
        {/* The finds at the bottom of the page, on phones too (2026-11-14,
            user's call: a button for them under the title looked odd). */}
        {user && <div className="hunt-stack__finds">{findsBox()}</div>}
      </div>
    );
  }

  return (
    <div className={`guide-page draw-page hunt-page hunt-page--${layout}${phone ? ' draw-page--phone' : ''}${hunting ? ' hunt-page--hunting' : ''}`}>
      {body}

      {sheet === 'rules' && (
        <HuntRulesWindow label={t('draw.rulesTitle')} wide onClose={() => setSheet(null)}>
          {howToPlay}
        </HuntRulesWindow>
      )}

      {sheet === 'finds' && (
        <HuntRulesWindow label={t('draw.myFinds')} wide onClose={() => setSheet(null)}>
          {findsBox()}
        </HuntRulesWindow>
      )}

      {openFind && <LocationDetail slug={openFind} onClose={() => setOpenFind(null)} />}

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
