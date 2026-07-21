import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { getArt, LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { useLang, useConvert } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { RARITY_COLOR, RARITY_LABEL, lockClosedIcon, lockOpenIcon } from '../../utils/rarity';
import { playUnlockSound } from '../../utils/sound';
import { formatDistance } from '../../utils/geolocation';

export default function LocationCard({ location, onClick, distance }) {
  const { lang } = useLang();
  const convert = useConvert();
  const { labels = [], pixelArtKey, xpReward, rarity = 'common', unlocked, slug } = location;
  const name  = convert(getLocName(location, lang));
  const art   = getArt(pixelArtKey, labels);
  const color = LABEL_COLORS[labels[0]] || '#1a2a5a';
  const firstLabel = labels[0];
  const [coverFailed, setCoverFailed] = useState(false);
  const [imgFailed,   setImgFailed]   = useState(false);
  const [flipping,    setFlipping]    = useState(false);
  const prevUnlockedRef = useRef(unlocked);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!prevUnlockedRef.current && unlocked) { setFlipping(true); playUnlockSound(rarity); }
    prevUnlockedRef.current = unlocked;
  }, [unlocked]);

  useLayoutEffect(() => {
    const el = labelRef.current;
    if (!el || lang === 'zh') return;
    el.style.fontSize = '';
    const maxSize = parseFloat(getComputedStyle(el).fontSize);
    let size = maxSize;
    while (el.scrollWidth > el.offsetWidth && size > 9) {
      size -= 0.5;
      el.style.fontSize = `${size}px`;
    }
  }, [firstLabel, lang]);

  return (
    <div
      className={`loc-card${(!unlocked || flipping) ? ' loc-card--locked' : ''}${flipping ? ' loc-card--flipping' : ''}`}
      onClick={() => onClick(slug)}
      title={unlocked ? name : '???'}
      style={{ border: `3px solid ${RARITY_COLOR[rarity]}` }}
      onAnimationEnd={e => { if (e.animationName === 'card-flip') setFlipping(false); }}
    >
      <div className="loc-card__banner" style={{ background: color }}>
        {location.coverImage && !coverFailed ? (
          <img
            src={location.coverImage}
            alt={name}
            onError={() => setCoverFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : !imgFailed ? (
          <img
            src={`/pixel-art/${slug}.webp`}
            alt={name}
            onError={() => setImgFailed(true)}
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
          <div className="loc-card__name" style={!unlocked ? { textAlign: 'center' } : { color: RARITY_COLOR[rarity] }}>
            {unlocked ? name : '???'}
          </div>
          {unlocked && lang !== 'cz' && location.localizedNames?.cz && (
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
              style={{ backgroundColor: unlocked ? (LABEL_COLORS[firstLabel] || 'rgba(255,255,255,0.07)') : 'rgba(255,255,255,0.05)' }}
            >
              {unlocked
                ? convert(LABEL_DEFINITIONS[firstLabel]?.[lang] || LABEL_DEFINITIONS[firstLabel]?.en || firstLabel)
                : '???'}
            </span>
          </div>
        )}
        <div className="loc-card__footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              display: 'inline-block', width: 8, height: 8,
              background: RARITY_COLOR[rarity],
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              flexShrink: 0,
            }} />
            <div className="loc-card__xp" style={{ color: RARITY_COLOR[rarity] }}>
              {convert(RARITY_LABEL[lang]?.[rarity] ?? rarity)}
            </div>
          </div>
          {distance != null && <div className="loc-card__dist">{formatDistance(distance)}</div>}
        </div>
      </div>
    </div>
  );
}
