import { useState } from 'react';
import { getArt } from '../../utils/pixelArtMap';
import { useLang } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';

const CAT_COLORS = {
  historical:    '#7a5210',
  cultural:      '#5a1480',
  natural:       '#145a20',
  'hidden-gem':  '#0a3a7a',
  entertainment: '#7a0a40',
};

function fmtDist(m) {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

export default function LocationCard({ location, onClick, distance }) {
  const { lang } = useLang();
  const { category, pixelArtKey, xpReward, unlocked, slug } = location;
  const name  = getLocName(location, lang);
  const art   = getArt(pixelArtKey, category);
  const color = CAT_COLORS[category] || '#333';
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
        <div className="loc-card__name">{unlocked ? name : '???'}</div>
        <span className={`cat-badge cat-badge--${category}`}>{category.replace('-', ' ')}</span>
        <div className="loc-card__footer">
          <div className="loc-card__xp">+{xpReward} XP</div>
          {distance != null && <div className="loc-card__dist">{fmtDist(distance)}</div>}
        </div>
      </div>
    </div>
  );
}
