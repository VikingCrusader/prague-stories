import { useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLang, useT, useConvert } from '../../context/LanguageContext';
import { playLevelUpSound } from '../../utils/sound';

const CONFETTI_COLORS = ['#ffd700', '#ff9500', '#8eff8e', '#7ec8e3', '#ff8ec4', '#fff'];
const CONFETTI_COUNT = 24;

export default function LevelUpModal() {
  const { levelUpEvent, clearLevelUpEvent } = useAuth();
  const { lang } = useLang();
  const t = useT();
  const convert = useConvert();
  const firedFor = useRef(null);

  useEffect(() => {
    if (!levelUpEvent || firedFor.current === levelUpEvent.level) return;
    firedFor.current = levelUpEvent.level;
    playLevelUpSound();
  }, [levelUpEvent]);

  const confetti = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.4,
        duration: 1.6 + Math.random() * 1.2,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotate: Math.random() > 0.5,
      })),
    [levelUpEvent?.level],
  );

  if (!levelUpEvent) return null;

  const title =
    lang === 'zh'
      ? (levelUpEvent.title_zh ?? levelUpEvent.title)
      : lang === 'cz'
      ? (levelUpEvent.title_cz ?? levelUpEvent.title)
      : levelUpEvent.title;

  return (
    <div
      className="px-overlay"
      style={{ zIndex: 500 }}
      onClick={(e) => e.target === e.currentTarget && clearLevelUpEvent()}
    >
      <div className="levelup-modal">
        <div className="levelup-modal__rays" />
        <div className="levelup-confetti">
          {confetti.map((c, i) => (
            <span
              key={i}
              style={{
                left: `${c.left}%`,
                background: c.color,
                borderRadius: c.rotate ? '50%' : 0,
                animationDelay: `${c.delay}s`,
                animationDuration: `${c.duration}s`,
              }}
            />
          ))}
        </div>
        <button className="levelup-modal__close" onClick={clearLevelUpEvent}>✕</button>
        <div className="levelup-modal__inner">
          <div className="levelup-modal__title">★ {t('levelUp.title')} ★</div>
          <div className="levelup-modal__num">{t('levelUp.newLevel', { level: levelUpEvent.level })}</div>
          <div className="levelup-modal__subtitle">{t('levelUp.subtitle')}</div>
          <div className="levelup-modal__jobtitle">{convert(title)}</div>
          <div className="xp-bar" style={{ marginBottom: 20 }}>
            <div className="xp-bar__fill" style={{ width: `${levelUpEvent.progress}%` }} />
          </div>
          <button className="px-btn px-btn--gold" onClick={clearLevelUpEvent}>
            {t('levelUp.continue')}
          </button>
        </div>
      </div>
    </div>
  );
}
