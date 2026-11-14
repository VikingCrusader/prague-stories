import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import AchievementIcon from '../achievements/AchievementIcon';
import AchievementModal from '../achievements/AchievementModal';
import { achField } from '../../utils/achievementText';
import { BOARD } from '../../utils/guideBoard';

// A few achievements to show the range, bronze to diamond (hand-picked,
// 2026-11-13): their real rows from GET /api/user/achievements (fetched by
// GuideBoard), so a signed-in player sees their own progress, and a click
// opens the real detail window.
export const SAMPLE_ACHIEVEMENTS = ['first_step', 'mind_the_window', 'golem_in_the_attic', 'night_owl', 'chalice_be_with_you', 'veni_vidi_vici'];

export default function AchDemo({ all }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const b = (BOARD[lang] || BOARD.en).ach;
  const [open, setOpen] = useState(null);
  // `all`: every achievement, fetched by the board (null while it loads).
  const list = all ? SAMPLE_ACHIEVEMENTS.map(id => all.find(a => a.id === id)).filter(Boolean) : null;

  return (
    <div className="guide-ach">
      <p className="guide-demo__hint">{convert(b.pick)}</p>
      {!list ? <div className="spinner" /> : (
        <ul className="guide-ach__list">
          {list.map(ach => {
            const p = ach.progress;
            return (
              <li key={ach.id}>
                <button type="button" className={`ach-row guide-ach__row${ach.unlocked ? ' ach-row--unlocked' : ''}`} onClick={() => setOpen(ach)}>
                  <span className={`ach-icon${ach.unlocked ? '' : ' ach-icon--locked'}`} data-difficulty={ach.difficulty}><AchievementIcon achievement={ach} /></span>
                  <span className="ach-row__main">
                    <span className="ach-row__name">{convert(achField(ach, 'name', lang))}</span>
                    <span className="ach-row__flavor">{convert(achField(ach, 'flavor', lang))}</span>
                    {p && (
                      <span className="ach-progress">
                        <span className="ach-bar"><span className="ach-bar__fill" style={{ width: `${Math.min(100, Math.round((p.current / p.target) * 100))}%` }} /></span>
                        <span className="ach-progress__count">{p.current} / {p.target}</span>
                      </span>
                    )}
                  </span>
                  <span className="ach-row__side">
                    <span className="ach-row__tier" data-difficulty={ach.difficulty}>{t(`ach.difficulty.${ach.difficulty}`)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <Link to="/achievements" className="px-btn px-btn--gold guide-ach__all">{convert(b.all)} →</Link>
      {/* Over the Guide's window, in a portal (as the card details in the other demos). */}
      {open && createPortal(
        <div className="guide-detail" onClick={e => e.stopPropagation()}>
          <AchievementModal achievement={open} onClose={() => setOpen(null)} />
        </div>,
        document.body,
      )}
    </div>
  );
}
