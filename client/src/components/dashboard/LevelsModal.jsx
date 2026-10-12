import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { useT, useLang, useConvert } from '../../context/LanguageContext';

// Every explorer level with its title and XP threshold, the current one
// highlighted. Opened from the XP · Lv figure in the navbar (it used to be an
// "Explorer Levels" section on the Profile page).
export default function LevelsModal({ currentLevel, onClose }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [levels, setLevels] = useState(null);

  useEffect(() => {
    userAPI.getAchievements().then(res => setLevels(res.data.levels)).catch(() => setLevels([]));
  }, []);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="px-overlay" onClick={onClose}>
      <div className="px-modal levels-modal" onClick={e => e.stopPropagation()} role="dialog" aria-label={t('dashboard.explorerLevels')}>
        <button className="px-modal__close" onClick={onClose}>✕</button>
        <h2 className="px-title" style={{ fontSize: 22, margin: '0 0 14px' }}>{t('dashboard.explorerLevels')}</h2>
        {!levels ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><div className="spinner" /></div>
        ) : (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {levels.map(lvl => {
              const reached = currentLevel >= lvl.level;
              return (
                <div
                  key={lvl.level}
                  className="levels-modal__level"
                  style={{
                    padding: '8px 14px',
                    border: `3px solid ${reached ? 'var(--gold)' : 'var(--border-strong, #333)'}`,
                    background: currentLevel === lvl.level ? 'rgba(255,215,0,0.12)' : 'var(--bg-card)',
                    boxShadow: reached ? '3px 3px 0 var(--shadow)' : 'none',
                  }}
                >
                  <div style={{ fontFamily: 'var(--ui-font)', fontSize: 13, color: reached ? 'var(--gold)' : 'var(--text-dim, #555)' }}>
                    LVL {lvl.level}
                  </div>
                  <div style={{ fontSize: 14, color: reached ? 'var(--text-primary)' : 'var(--text-dim, #555)' }}>
                    {convert(lang === 'zh' ? (lvl.title_zh ?? lvl.title) : lang === 'cz' ? (lvl.title_cz ?? lvl.title) : lvl.title)}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim, #555)' }}>{lvl.xpRequired} XP</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
