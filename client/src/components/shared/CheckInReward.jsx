import { useEffect, useRef, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { CHECKIN_REWARD_EVENT } from '../../utils/achievementEvents';
import { achField } from '../../utils/achievementText';
import { getLocName } from '../../utils/locName';
import AchievementIcon from '../achievements/AchievementIcon';

// What a newly collected card brought (2026-11-14, user's call): the XP, and
// beside it the achievements it moved on and the packs it adds to, from the
// check-in's response (`achievementGains`, `packProgress`, server
// services/checkinGains.js). It comes up with the XP, silent, in the corner.
// What the card unlocked or completed keeps its own announcement
// (PackUnlocked, AchievementUnlocked, the level-up modal): this sits below
// those (z-index), and its clock stops while one of them is on screen, so it
// is still there to read once they are over.
const SHOW_MS = 6500;
const ROW_MS = 600;
const LEAVE_MS = 250;
const BLOCKERS = '.pack-open, .ach-unlock, .levelup-modal';

const pct = (n, target) => `${Math.max(0, Math.min(100, (n / target) * 100))}%`;

function Bar({ before, current, target }) {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setGrown(true), 350);
    return () => clearTimeout(id);
  }, []);
  return (
    <span className="ci-reward__bar" aria-hidden="true">
      <span className="ci-reward__bar-gain" style={{ width: pct(grown ? current : before, target) }} />
      <span className="ci-reward__bar-was" style={{ width: pct(before, target) }} />
    </span>
  );
}

export default function CheckInReward() {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [reward, setReward] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const leaveTimer = useRef(null);

  useEffect(() => {
    const onReward = (e) => {
      clearTimeout(leaveTimer.current);
      setLeaving(false);
      setReward({ ...e.detail, key: Date.now() });
    };
    window.addEventListener(CHECKIN_REWARD_EVENT, onReward);
    return () => window.removeEventListener(CHECKIN_REWARD_EVENT, onReward);
  }, []);

  const dismiss = () => {
    setLeaving(true);
    leaveTimer.current = setTimeout(() => { setReward(null); setLeaving(false); }, LEAVE_MS);
  };

  // Counts down only while no unlock moment is on screen.
  useEffect(() => {
    if (!reward) return undefined;
    const rows = (reward.achievementGains?.length || 0) + (reward.packProgress?.length || 0);
    let left = SHOW_MS + rows * ROW_MS;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      if (!document.querySelector(BLOCKERS)) left -= now - last;
      last = now;
      if (left <= 0) { clearInterval(id); dismiss(); }
    }, 200);
    return () => clearInterval(id);
  }, [reward?.key]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  if (!reward) return null;
  const { xpEarned, levelInfo, achievementGains = [], moreAchievementGains = 0, packProgress = [] } = reward;
  const levelTitle = levelInfo
    ? (lang === 'zh' ? levelInfo.title_zh : lang === 'cz' ? levelInfo.title_cz : null) ?? levelInfo.title
    : null;

  return (
    <div className="ci-reward-wrap">
      <div
        key={reward.key}
        className={`ci-reward${leaving ? ' ci-reward--leaving' : ''}`}
        role="status"
        aria-live="polite"
        onClick={dismiss}
      >
        <div className="ci-reward__head">
          <span className="ci-reward__xp">+{xpEarned} XP</span>
          {levelInfo && (
            <span className="ci-reward__level">Lv {levelInfo.level} · {convert(levelTitle)}</span>
          )}
        </div>

        {achievementGains.length > 0 && (
          <div className="ci-reward__group">
            <div className="ci-reward__heading">{t('reward.achievements')}</div>
            {achievementGains.map((a) => (
              <div className="ci-reward__row" key={a.id}>
                <span className="ach-icon ci-reward__icon" data-difficulty={a.difficulty}>
                  <AchievementIcon achievement={a} />
                </span>
                <span className="ci-reward__body">
                  <span className="ci-reward__line">
                    <span className="ci-reward__name">{convert(achField(a, 'name', lang))}</span>
                    <span className="ci-reward__count">
                      {a.current}/{a.target}
                      <span className="ci-reward__plus"> +{a.current - a.before}</span>
                    </span>
                  </span>
                  <Bar before={a.before} current={a.current} target={a.target} />
                </span>
              </div>
            ))}
            {moreAchievementGains > 0 && (
              <div className="ci-reward__more">{t('reward.moreAchievements', { n: moreAchievementGains })}</div>
            )}
          </div>
        )}

        {packProgress.length > 0 && (
          <div className="ci-reward__group">
            <div className="ci-reward__heading">{t('reward.packs')}</div>
            {packProgress.map((p) => {
              const sealed = !p.unlocked;
              const toOpen = Math.max(1, p.unlockAt - p.collected);
              return (
                <div className="ci-reward__row" key={p.slug}>
                  <span className="ci-reward__icon ci-reward__pack" aria-hidden="true">
                    {sealed ? '🔒' : <img src="/pixel-art/pack-emblem.webp" alt="" draggable="false" />}
                  </span>
                  <span className="ci-reward__body">
                    <span className="ci-reward__line">
                      <span className="ci-reward__name">{convert(getLocName(p, lang))}</span>
                      <span className="ci-reward__count">{p.collected}/{p.total}</span>
                    </span>
                    <Bar before={p.collected - 1} current={p.collected} target={p.total} />
                    {sealed && (
                      <span className="ci-reward__note">{t('reward.packToOpen', { n: toOpen })}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
