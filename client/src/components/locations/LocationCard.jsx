import { useState, useRef, useLayoutEffect, useEffect, memo } from 'react';
import { getArt, LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { getLocalCoverPath, toThumbPath, toCloudThumbUrl } from '../../utils/localCover';
import { useLang, useConvert, useT } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { RARITY_VAR, RARITY_LABEL, lockClosedIcon, lockOpenIcon, expeditionGem } from '../../utils/rarity';
import RarityFrame from './RarityFrame';
import CardShowcase from './CardShowcase';
import { playUnlockSound } from '../../utils/sound';
import { formatDistance } from '../../utils/geolocation';
import { watchOffscreen } from '../../utils/pauseOffscreen';
import { useHoldGestures } from '../../hooks/useHoldGestures';
import { prefetchLocation } from '../../utils/locationCache';
import { watchLabelFit } from '../../utils/fitLabels';

// Cards the user collected within this window get a green "NEW" tag.
const NEW_BADGE_MS = 48 * 60 * 60 * 1000;

// `nearby` (Explore only): a still-locked card within NEARBY_REVEAL_M of the
// user. It reveals its name, drops the grey filter everywhere except the
// cover, and the lock wobbles (pixelart.css).
// `showcase`: the enlarged copy inside CardShowcase (full-size cover, no
// gestures of its own). `holdable`: false turns the showcase gestures off
// (History forces `unlocked` on every landmark for display, so it passes the
// real collected state here; otherwise an uncollected card's story could be
// read in the showcase). `story` (showcase only): paragraphs that fill the
// whole card in a scrolling panel, under the card's name; only the frame stays.
// `previewable`: the hover preview (CardPreview.jsx) replaces the browser tooltip.
function LocationCard({ location, onClick, distance, nearby = false, showcase = false, story = null, holdable = true, previewable = false }) {
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
  const cardRef = useRef(null);
  useEffect(() => (showcase ? undefined : watchOffscreen(cardRef.current)), [showcase]);
  const teasing = !unlocked && nearby;
  const showName = unlocked || teasing;
  const showLabel = unlocked;
  const checkedInMs = location._checkedInAt ? new Date(location._checkedInAt).getTime() : NaN;
  // Not over the story panel, where the badge would cover the card's name.
  const isNew = unlocked && !flipping && !story && Date.now() - checkedInMs < NEW_BADGE_MS;

  // Long press or double click on a collected card opens the showcase.
  const gestures = holdable && unlocked && !flipping && !showcase;
  const { handlers, showcaseOpen, closeShowcase } = useHoldGestures({ enabled: gestures, onTap: () => onClick(slug) });

  useEffect(() => {
    if (!prevUnlockedRef.current && unlocked) { setFlipping(true); playUnlockSound(rarity); }
    prevUnlockedRef.current = unlocked;
  }, [unlocked]);

  useLayoutEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    if (lang === 'zh') { el.style.fontSize = ''; return; }
    // Fitted with every other card at once (utils/fitLabels.js), on mount, on a
    // resize and once web fonts have loaded.
    return watchLabelFit(el);
  }, [firstLabel, lang, showLabel]);

  return (
    <>
    <div
      ref={cardRef}
      className={`loc-card${(!unlocked || flipping) ? ' loc-card--locked' : ''}${flipping ? ' loc-card--flipping' : ''}${teasing && !flipping ? ' loc-card--nearby' : ''}${gestures ? ' loc-card--holdable' : ''}`}
      {...handlers}
      // A mouse press is nearly always a click: ask for the detail now, so it is
      // there when the window opens. Not on touch, where a press is usually a scroll.
      onPointerDown={e => {
        handlers.onPointerDown(e);
        if (!showcase && e.pointerType === 'mouse' && e.button === 0) prefetchLocation(slug);
      }}
      title={previewable ? undefined : showName ? name : '???'}
      data-slug={slug}
      data-rarity={rarity}
      data-gem={rarity === 'expedition' ? expeditionGem(xpReward) : undefined}
      style={{ border: `3px solid ${rarity === 'expedition' ? 'var(--rarity-expedition-card, var(--rarity-expedition))' : RARITY_VAR[rarity]}` }}
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
          {lang !== 'cz' && (showName && location.localizedNames?.cz ? (
            <div className="loc-card__cz-name">
              {location.localizedNames.cz}
            </div>
          ) : (
            // Holds the line on Explore, so every card there is the same size.
            <div className="loc-card__cz-name loc-card__cz-name--empty" aria-hidden="true">&nbsp;</div>
          ))}
        </div>
        {firstLabel && (
          <div className="loc-card__labels">
            <span
              ref={showLabel ? labelRef : null}
              className="label-pill-sm"
              title={showLabel ? LABEL_DEFINITIONS[firstLabel]?.en : undefined}
              style={{ backgroundColor: (showLabel || teasing) ? (LABEL_COLORS[firstLabel] || 'var(--pill-fallback, rgba(255,255,255,0.07))') : 'var(--pill-fallback, rgba(255,255,255,0.05))' }}
            >
              {showLabel
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
    {showcaseOpen && <CardShowcase location={location} openedBy={showcaseOpen} onClose={closeShowcase} />}
    </>
  );
}

export default memo(LocationCard);
