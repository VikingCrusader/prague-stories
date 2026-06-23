import { useState } from 'react';
import { getArt, LABEL_DEFINITIONS, LABEL_COLORS } from '../../utils/pixelArtMap';
import { useLang } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';

function fmtDist(m) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

export default function LocationCard({ location, onClick, distance }) {
  const { lang } = useLang();
  const { labels = [], pixelArtKey, xpReward, unlocked, slug } = location;
  const name  = getLocName(location, lang);
  const art   = getArt(pixelArtKey, labels);
  const color = LABEL_COLORS[labels[0]] || '#1a2a5a';
  const firstLabel = labels[0];
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div
      className={`loc-card${unlocked ? '' : ' loc-card--locked'}`}
      onClick={() => onClick(slug)}
      title={unlocked ? name : '???'}
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
          <div className="loc-card__name">{unlocked ? name : '???'}</div>
          {unlocked && lang !== 'cz' && location.localizedNames?.cz && (
            <div className="loc-card__cz-name">
              {location.localizedNames.cz}
            </div>
          )}
        </div>
        {firstLabel && (
          <div className="loc-card__labels">
            <span
              className="label-pill-sm"
              title={LABEL_DEFINITIONS[firstLabel]?.en}
              style={{ backgroundColor: LABEL_COLORS[firstLabel] || 'rgba(255,255,255,0.07)' }}
            >
              {LABEL_DEFINITIONS[firstLabel]?.[lang] || LABEL_DEFINITIONS[firstLabel]?.en || firstLabel}
            </span>
          </div>
        )}
        <div className="loc-card__footer">
          <div className="loc-card__xp">+{xpReward} XP</div>
          {distance != null && <div className="loc-card__dist">{fmtDist(distance)}</div>}
        </div>
      </div>
    </div>
  );
}
