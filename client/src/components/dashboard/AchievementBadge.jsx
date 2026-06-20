export default function AchievementBadge({ achievement }) {
  const { icon, name, description, unlocked, unlockedAt } = achievement;

  return (
    <div className={`ach-badge${unlocked ? ' ach-badge--unlocked' : ' ach-badge--locked'}`}>
      <div className="ach-badge__icon" style={{ filter: unlocked ? 'none' : 'grayscale(1) brightness(0.4)' }}>
        {icon}
      </div>
      <div>
        <div className="ach-badge__name">{name}</div>
        <div className="ach-badge__desc">{description}</div>
        {unlocked && unlockedAt && (
          <div className="ach-badge__date">
            {new Date(unlockedAt).toLocaleDateString()}
          </div>
        )}
        {!unlocked && (
          <div style={{ fontSize: 6, color: '#555', marginTop: 4, fontFamily: "'Press Start 2P'" }}>
            LOCKED
          </div>
        )}
      </div>
    </div>
  );
}
