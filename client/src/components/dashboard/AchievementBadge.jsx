import { useT, useLang, useConvert } from '../../context/LanguageContext';

export default function AchievementBadge({ achievement }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const { icon, name, description, unlocked, unlockedAt } = achievement;

  const displayName = convert(
    lang === 'zh' ? (achievement.name_zh ?? name) :
    lang === 'cz' ? (achievement.name_cz ?? name) : name
  );
  const displayDesc = convert(
    lang === 'zh' ? (achievement.description_zh ?? description) :
    lang === 'cz' ? (achievement.description_cz ?? description) : description
  );

  return (
    <div className={`ach-badge${unlocked ? ' ach-badge--unlocked' : ' ach-badge--locked'}`}>
      <div className="ach-badge__icon" style={{ filter: unlocked ? 'none' : 'grayscale(1) brightness(0.4)' }}>
        {icon}
      </div>
      <div>
        <div className="ach-badge__name">{displayName}</div>
        <div className="ach-badge__desc">{displayDesc}</div>
        {unlocked && unlockedAt && (
          <div className="ach-badge__date">
            {new Date(unlockedAt).toLocaleDateString()}
          </div>
        )}
        {!unlocked && (
          <div style={{ fontSize: 6, color: '#555', marginTop: 4, fontFamily: "'Press Start 2P'" }}>
            {t('common.locked')}
          </div>
        )}
      </div>
    </div>
  );
}
