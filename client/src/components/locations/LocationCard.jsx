import { useState } from 'react';
import { getArt } from '../../utils/pixelArtMap';
import { useLang } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';

const CAT_COLORS = {
  historical:    '#7a5210',
  cultural:      '#5a1480',
  natural:       '#145a20',
  food:          '#7a2000',
  'hidden-gem':  '#0a3a7a',
  entertainment: '#7a0a40',
};

export default function LocationCard({ location, onClick }) {
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
        {!imgFailed ? (
          <img
            src={`/pixel-art/${slug}.png`}
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
        <div className="loc-card__xp">+{xpReward} XP</div>
      </div>
    </div>
  );
}
