import { getArt } from '../../utils/pixelArtMap';

const CAT_COLORS = {
  historical:    '#7a5210',
  cultural:      '#5a1480',
  natural:       '#145a20',
  food:          '#7a2000',
  'hidden-gem':  '#0a3a7a',
  entertainment: '#7a0a40',
};

export default function LocationCard({ location, onClick }) {
  const { name, category, pixelArtKey, xpReward, unlocked } = location;
  const art   = getArt(pixelArtKey, category);
  const color = CAT_COLORS[category] || '#333';

  return (
    <div
      className={`loc-card${unlocked ? '' : ' loc-card--locked'}`}
      onClick={() => onClick(location.slug)}
      title={unlocked ? name : '???'}
    >
      <div className="loc-card__banner" style={{ background: color }}>
        <span style={{ fontSize: '2.8rem' }}>{art}</span>
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
