import { useState, useRef, useLayoutEffect } from 'react';
import { getArt, LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { useLang } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import { RARITY_COLOR, RARITY_LABEL } from '../../utils/rarity';

function fmtDist(m) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

export default function LocationCard({ location, onClick, distance }) {
  const { lang } = useLang();
  const { labels = [], pixelArtKey, xpReward, rarity = 'common', unlocked, slug } = location;
  const name  = getLocName(location, lang);
  const art   = getArt(pixelArtKey, labels);
  const color = LABEL_COLORS[labels[0]] || '#1a2a5a';
  const firstLabel = labels[0];
  const [imgFailed, setImgFailed] = useState(false);
  const labelRef = useRef(null);

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
      className={`loc-card${unlocked ? '' : ' loc-card--locked'}`}
      onClick={() => onClick(slug)}
      title={unlocked ? name : '???'}
      style={{ border: `3px solid ${unlocked ? RARITY_COLOR[rarity] : 'transparent'}` }}
    >
      <div className="loc-card__banner" style={{ background: color }}>
        {location.coverImage ? (
          <img
            src={location.coverImage}
            alt={name}
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
        {!unlocked && <span className="loc-card__lock">🔒</span>}
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
                ? (LABEL_DEFINITIONS[firstLabel]?.[lang] || LABEL_DEFINITIONS[firstLabel]?.en || firstLabel)
                : '???'}
            </span>
          </div>
        )}
        <div className="loc-card__footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{
              display: 'inline-block', width: 8, height: 8,
              background: unlocked ? RARITY_COLOR[rarity] : 'rgba(255,255,255,0.2)',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              flexShrink: 0,
            }} />
            <div className="loc-card__xp" style={{ color: unlocked ? RARITY_COLOR[rarity] : undefined }}>
              {unlocked ? RARITY_LABEL[lang]?.[rarity] ?? rarity : '???'}
            </div>
          </div>
          {distance != null && <div className="loc-card__dist">{fmtDist(distance)}</div>}
        </div>
      </div>
    </div>
  );
}
