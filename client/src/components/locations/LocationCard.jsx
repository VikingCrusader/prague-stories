import { useState, useRef, useLayoutEffect, useEffect, memo } from 'react';
import { getArt, LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { getLocalCoverPath, toThumbPath, toCloudThumbUrl } from '../../utils/localCover';
import { useLang, useConvert, useT } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { RARITY_VAR, RARITY_LABEL, lockClosedIcon, lockOpenIcon } from '../../utils/rarity';
import RarityFrame from './RarityFrame';
import CardShowcase from './CardShowcase';
import { playUnlockSound } from '../../utils/sound';
import { formatDistance } from '../../utils/geolocation';

// Cards the user collected within this window get a green "NEW" tag.
const NEW_BADGE_MS = 48 * 60 * 60 * 1000;
// Showcase gestures on a collected card: hold this long on a touch screen,
// or click twice within this long with a mouse.
const LONG_PRESS_MS = 450;
const DOUBLE_CLICK_MS = 250;

// `nearby` (Explore only): a still-locked card within NEARBY_REVEAL_M of the
// user. It reveals its name, drops the grey filter everywhere except the
// cover, and the lock wobbles (pixelart.css).
// `showcase`: the enlarged copy inside CardShowcase (full-size cover, no
// gestures of its own). `story` (showcase only): paragraphs that fill the
// whole card in a scrolling panel, under the card's name; only the frame stays.
function LocationCard({ location, onClick, distance, nearby = false, showcase = false, story = null }) {
  const { lang } = useLang();
  const convert = useConvert();
  const t = useT();
  const { labels = [], pixelArtKey, xpReward, rarity = 'common', unlocked, slug } = location;
  const name  = convert(getLocName(location, lang));
  const art   = getArt(pixelArtKey, labels);
  const color = LABEL_COLORS[labels[0]] || '#1a2a5a';
  const firstLabel = labels[0];
  const localCover = getLocalCoverPath(slug, location.coverImage);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [localFailed, setLocalFailed] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const [flipping,    setFlipping]    = useState(false);
  const prevUnlockedRef = useRef(unlocked);
  const labelRef = useRef(null);
  const teasing = !unlocked && nearby;
  const showName = unlocked || teasing;
  const checkedInMs = location._checkedInAt ? new Date(location._checkedInAt).getTime() : NaN;
  const isNew = unlocked && !flipping && Date.now() - checkedInMs < NEW_BADGE_MS;

  // Long press (touch) or double click (mouse) on a collected card opens the
  // showcase. A mouse click on such a card waits DOUBLE_CLICK_MS for a
  // possible second click before opening the detail as usual.
  // How the showcase was opened ('touch' or 'mouse'), or false when closed.
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const gestures = unlocked && !flipping && !showcase;
  const press = useRef({ timer: null, fired: false, x: 0, y: 0, pointer: 'mouse', clickTimer: null });
  const clearPress = () => { clearTimeout(press.current.timer); press.current.timer = null; };
  useEffect(() => () => { clearTimeout(press.current.timer); clearTimeout(press.current.clickTimer); }, []);
  const handlePointerDown = e => {
    press.current.pointer = e.pointerType;
    if (!gestures || e.pointerType === 'mouse') return;
    press.current.fired = false;
    press.current.x = e.clientX;
    press.current.y = e.clientY;
    clearPress();
    press.current.timer = setTimeout(() => {
      press.current.fired = true;
      navigator.vibrate?.(12);
      setShowcaseOpen('touch');
    }, LONG_PRESS_MS);
  };
  const handlePointerMove = e => {
    if (press.current.timer && Math.hypot(e.clientX - press.current.x, e.clientY - press.current.y) > 10) clearPress();
  };
  // The finger that opened the showcase lifts over it: cancel the mouse
  // events and click the browser would emulate, or they land on the
  // showcase and close it again at once.
  const handleTouchEnd = e => { if (press.current.fired) e.preventDefault(); };
  const handleClick = () => {
    if (press.current.fired) { press.current.fired = false; return; }
    if (!gestures || press.current.pointer !== 'mouse') { onClick(slug); return; }
    if (press.current.clickTimer) {
      clearTimeout(press.current.clickTimer);
      press.current.clickTimer = null;
      setShowcaseOpen('mouse');
      return;
    }
    press.current.clickTimer = setTimeout(() => { press.current.clickTimer = null; onClick(slug); }, DOUBLE_CLICK_MS);
  };

  useEffect(() => {
    if (!prevUnlockedRef.current && unlocked) { setFlipping(true); playUnlockSound(rarity); }
    prevUnlockedRef.current = unlocked;
  }, [unlocked]);

  useLayoutEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    if (lang === 'zh') { el.style.fontSize = ''; return; }
    // Re-fit once web fonts finish loading (measuring against the narrower
    // fallback font let Cinzel labels overflow) and whenever the card resizes.
    // Measuring forces layout, so skip cards the browser isn't rendering
    // (inside a content-visibility: auto panel that is off screen, see
    // history.css); measuring those one by one cost ~2 s on the History page.
    // The ResizeObserver fits them once they are rendered and get a size.
    const fit = () => {
      if (el.checkVisibility && !el.checkVisibility({ contentVisibilityAuto: true })) return;
      if (el.style.fontSize) el.style.fontSize = '';
      let size = parseFloat(getComputedStyle(el).fontSize);
      while (el.scrollWidth > el.clientWidth && size > 9) {
        size -= 0.5;
        el.style.fontSize = `${size}px`;
      }
    };
    fit();
    let cancelled = false;
    document.fonts?.ready.then(() => { if (!cancelled) fit(); });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(fit) : null;
    ro?.observe(el);
    return () => { cancelled = true; ro?.disconnect(); };
  }, [firstLabel, lang, unlocked]);

  return (
    <>
    <div
      className={`loc-card${(!unlocked || flipping) ? ' loc-card--locked' : ''}${flipping ? ' loc-card--flipping' : ''}${teasing && !flipping ? ' loc-card--nearby' : ''}${gestures ? ' loc-card--holdable' : ''}`}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={clearPress}
      onTouchEnd={handleTouchEnd}
      onPointerCancel={clearPress}
      onPointerLeave={clearPress}
      onContextMenu={gestures ? e => e.preventDefault() : undefined}
      title={showName ? name : '???'}
      data-rarity={rarity}
      style={{ border: `3px solid ${RARITY_VAR[rarity]}` }}
      onAnimationEnd={e => { if (e.animationName === 'card-flip') setFlipping(false); }}
    >
      <RarityFrame />
      {isNew && <span className="loc-card__new">NEW</span>}
      {story ? (
        <div className="loc-card__story">
          <div className="loc-card__story-title" style={{ color: RARITY_VAR[rarity] }}>{name}</div>
          {lang !== 'cz' && location.localizedNames?.cz && <div className="loc-card__story-sub">{location.localizedNames.cz}</div>}
          {story.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      ) : (<>
      <div className="loc-card__banner" style={{ background: teasing ? 'var(--nearby-banner, #4a4a4a)' : color }}>
        {/* width/height give a lazy cover a square placeholder (covers are
            almost all square) so the card doesn't grow when it loads. */}
        {localCover && !localFailed ? (
          <img
            src={thumbFailed || showcase ? localCover : toThumbPath(localCover)}
            alt={name}
            loading={showcase ? 'eager' : 'lazy'}
            draggable={false}
            width={480}
            height={480}
            decoding="async"
            onError={() => (thumbFailed ? setLocalFailed(true) : setThumbFailed(true))}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : location.coverImage && !coverFailed ? (
          <img
            src={showcase ? location.coverImage : toCloudThumbUrl(location.coverImage)}
            alt={name}
            loading={showcase ? 'eager' : 'lazy'}
            draggable={false}
            width={480}
            height={480}
            decoding="async"
            onError={() => setCoverFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span style={{ fontSize: '2.8rem' }}>{art}</span>
        )}
        {flipping ? (
          <div className="loc-card__flip-overlay">
            <img className="loc-card__flip-lock" src={lockClosedIcon(rarity)} alt="" />
            <img className="loc-card__flip-unlock" src={lockOpenIcon(rarity)} alt="" />
            <div className="loc-card__flip-shine" />
          </div>
        ) : (!unlocked && (
          <img className="loc-card__lock" src={lockClosedIcon(rarity)} alt="" />
        ))}
      </div>
      <div className="loc-card__body">
        <div>
          <div className="loc-card__name" style={!showName ? { textAlign: 'center' } : { color: RARITY_VAR[rarity] }}>
            {showName ? name : '???'}
          </div>
          {showName && lang !== 'cz' && location.localizedNames?.cz && (
            <div className="loc-card__cz-name">
              {location.localizedNames.cz}
            </div>
          )}
        </div>
        {firstLabel && (
          <div className="loc-card__labels">
            <span
              ref={unlocked ? labelRef : null}
              className="label-pill-sm"
              title={unlocked ? LABEL_DEFINITIONS[firstLabel]?.en : undefined}
              style={{ backgroundColor: (unlocked || teasing) ? (LABEL_COLORS[firstLabel] || 'var(--pill-fallback, rgba(255,255,255,0.07))') : 'var(--pill-fallback, rgba(255,255,255,0.05))' }}
            >
              {unlocked
                ? convert(LABEL_DEFINITIONS[firstLabel]?.[lang] || LABEL_DEFINITIONS[firstLabel]?.en || firstLabel)
                : '???'}
            </span>
          </div>
        )}
        <div className="loc-card__footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div className="loc-card__xp" style={{ color: RARITY_VAR[rarity] }}>
              {convert(RARITY_LABEL[lang]?.[rarity] ?? rarity)}
            </div>
          </div>
          {distance != null && <div className="loc-card__dist" style={{ color: RARITY_VAR[rarity] }}>{formatDistance(distance)}</div>}
        </div>
      </div>
      </>)}
    </div>
    {showcaseOpen && <CardShowcase location={location} openedBy={showcaseOpen} onClose={() => setShowcaseOpen(false)} />}
    </>
  );
}

export default memo(LocationCard);
