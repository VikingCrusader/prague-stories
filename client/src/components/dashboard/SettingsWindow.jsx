import { useEffect, useState } from 'react';
import { useT, useConvert } from '../../context/LanguageContext';
import { cardMotionOn, setCardMotion } from '../../utils/cardMotion';

// The settings window, opened from the profile's header (2026-11-12, user's call:
// beside the leaderboard and privacy buttons, not at the bottom of the page). The
// things a player sets once on this device: the screen staying on, and the card
// animations (remembered in utils/cardMotion.js). More can go in the list later.
export default function SettingsWindow({ wakeLock, onClose }) {
  const t = useT();
  const convert = useConvert();
  const [motion, setMotion] = useState(cardMotionOn);
  const toggleMotion = () => {
    const next = !motion;
    setCardMotion(next);
    setMotion(next);
  };
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="px-overlay settings-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="px-modal settings-window" role="dialog" aria-label={convert(t('settings.title'))}>
        <button type="button" className="px-modal__close" onClick={onClose} aria-label={convert(t('areaGuide.close'))}>✕</button>
        <h2 className="px-title settings-window__title">{convert(t('settings.title'))}</h2>
        <ul className="settings-window__list">
          <li className="settings-row">
            <span className="settings-row__label">{convert(t('settings.wakeLock'))}</span>
            {wakeLock.supported ? (
              <button type="button" className="settings-switch" aria-pressed={wakeLock.active} onClick={wakeLock.toggle}>
                {convert(t(wakeLock.active ? 'settings.on' : 'settings.off'))}
              </button>
            ) : (
              <span className="settings-row__note">{convert(t('dashboard.wakeLockUnsupported'))}</span>
            )}
          </li>
          <li className="settings-row">
            <span className="settings-row__label">{convert(t('settings.cardMotion'))}</span>
            <button type="button" className="settings-switch" aria-pressed={motion} onClick={toggleMotion}>
              {convert(t(motion ? 'settings.on' : 'settings.off'))}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
