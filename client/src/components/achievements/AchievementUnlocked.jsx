import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { ACHIEVEMENTS_UNLOCKED_EVENT } from '../../utils/achievementEvents';
import { achField } from '../../utils/achievementText';
import { playAchievementSound } from '../../utils/sound';
import AchievementIcon from './AchievementIcon';

// The "achievement unlocked" moment (2026-11-02, user's call: stronger than
// the level-up). A gold flash over the whole screen, then a banner that
// drops in near the top with turning light rays and sparks round the icon,
// a sweep of light across it and an original bell chime (sound.js). Several
// unlocks queue up and play one after another; while the level-up modal is
// open they wait, so the two never talk over each other. A tap on the
// banner opens /achievements.
const SHOW_MS = 6000;
const LEAVE_MS = 450;
const SPARKS = 14;

export default function AchievementUnlocked() {
  const { levelUpEvent } = useAuth();
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef([]);
  // Ids already announced this session: a response repeated (e.g. /auth/me
  // fetched twice) must not bring the same banner back.
  const seen = useRef(new Set());

  useEffect(() => {
    const onUnlocked = (e) => {
      const { list = [], delay = 0 } = e.detail || {};
      const fresh = list.filter((a) => !seen.current.has(a.id));
      fresh.forEach((a) => seen.current.add(a.id));
      if (!fresh.length) return;
      const id = setTimeout(() => setQueue((q) => [...q, ...fresh]), delay);
      timers.current.push(id);
    };
    window.addEventListener(ACHIEVEMENTS_UNLOCKED_EVENT, onUnlocked);
    return () => {
      window.removeEventListener(ACHIEVEMENTS_UNLOCKED_EVENT, onUnlocked);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  // Next one in, once the stage is free (and no level-up modal is open).
  useEffect(() => {
    if (current || levelUpEvent || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    setLeaving(false);
    setCurrent({ ...next, key: `${next.id}-${Date.now()}` });
    playAchievementSound();
  }, [current, levelUpEvent, queue]);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => { setCurrent(null); setLeaving(false); }, LEAVE_MS);
  };

  useEffect(() => {
    if (!current) return;
    const id = setTimeout(dismiss, SHOW_MS);
    return () => clearTimeout(id);
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!current) return null;

  return (
    <div className={`ach-unlock${leaving ? ' ach-unlock--leaving' : ''}`} key={current.key}>
      <div className="ach-unlock__flash" aria-hidden="true" />
      <div
        className="ach-unlock__banner"
        role="status"
        aria-live="assertive"
        onClick={() => { dismiss(); navigate('/achievements'); }}
      >
        <div className="ach-unlock__shine" aria-hidden="true" />
        <div className="ach-unlock__iconwrap">
          <div className="ach-unlock__rays" aria-hidden="true" />
          {Array.from({ length: SPARKS }, (_, i) => (
            <span
              key={i}
              className="ach-unlock__spark"
              aria-hidden="true"
              style={{ '--a': `${(360 / SPARKS) * i}deg`, '--d': `${48 + (i % 3) * 14}px`, animationDelay: `${0.25 + (i % 4) * 0.04}s` }}
            />
          ))}
          <span className="ach-icon ach-unlock__icon"><AchievementIcon achievement={current} /></span>
        </div>
        <div className="ach-unlock__text">
          <div className="ach-unlock__label">🏆 {t('ach.unlockedBanner')}</div>
          <div className="ach-unlock__name">{convert(achField(current, 'name', lang))}</div>
          {current.flavor && <div className="ach-unlock__flavor">{convert(achField(current, 'flavor', lang))}</div>}
        </div>
        <button
          type="button"
          className="ach-unlock__close"
          aria-label="✕"
          onClick={(e) => { e.stopPropagation(); dismiss(); }}
        >✕</button>
        <div className="ach-unlock__timer" style={{ animationDuration: `${SHOW_MS}ms` }} aria-hidden="true" />
      </div>
    </div>
  );
}
