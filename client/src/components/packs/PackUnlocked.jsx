import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { PACKS_UNLOCKED_EVENT, PACK_SHOW_MS } from '../../utils/achievementEvents';
import { getLocalCoverPath, toThumbPath } from '../../utils/localCover';
import { getLocName } from '../../utils/locName';
import { playHuntWinSound, playUnlockSound } from '../../utils/sound';
import PackCard from './PackCard';
import PackDetail from './PackDetail';

const LEAVE_MS = 300;

// The moment a pack opens: its top strip tears off, the cards that opened it
// fan out above it, then the XP. Completing one adds the holographic wrapper
// and the hunt's fanfare. Like the achievement banner it waits for a level-up
// modal, and several play one after another.
export default function PackUnlocked() {
  const { levelUpEvent } = useAuth();
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const [openSlug, setOpenSlug] = useState(null);
  const timers = useRef([]);
  // A response repeated (/auth/me fetched twice) must not bring it back.
  const seen = useRef(new Set());

  useEffect(() => {
    const onUnlocked = (e) => {
      const { list = [], delay = 0 } = e.detail || {};
      const fresh = list.filter((p) => !seen.current.has(`${p.slug}|${p.stage}`));
      fresh.forEach((p) => seen.current.add(`${p.slug}|${p.stage}`));
      if (!fresh.length) return;
      timers.current.push(setTimeout(() => setQueue((q) => [...q, ...fresh]), delay));
    };
    window.addEventListener(PACKS_UNLOCKED_EVENT, onUnlocked);
    return () => {
      window.removeEventListener(PACKS_UNLOCKED_EVENT, onUnlocked);
      timers.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (current || levelUpEvent || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    setLeaving(false);
    setCurrent(next);
    if (next.stage === 'complete') playHuntWinSound(); else playUnlockSound('legend');
  }, [current, levelUpEvent, queue]);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => { setCurrent(null); setLeaving(false); }, LEAVE_MS);
  };

  useEffect(() => {
    if (!current) return undefined;
    const id = setTimeout(dismiss, PACK_SHOW_MS);
    return () => clearTimeout(id);
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  const complete = current?.stage === 'complete';
  return (
    <>
      {current && (
        <div className={`pack-open${complete ? ' pack-open--complete' : ''}${leaving ? ' pack-open--leaving' : ''}`} role="status" aria-live="assertive" onClick={dismiss}>
          <div className="pack-open__stage">
            <div className="pack-open__fan" aria-hidden="true">
              {current.cards.map((slug, i) => {
                const cover = getLocalCoverPath(slug, null);
                return (
                  <div key={slug} className="pack-open__card" style={{ '--i': i - (current.cards.length - 1) / 2 }}>
                    {cover ? <img src={toThumbPath(cover)} alt="" /> : null}
                  </div>
                );
              })}
            </div>
            <div className="pack-open__pack">
              <PackCard pack={{ ...current, unlocked: true, completed: complete }} holdable={false} />
              <div className="pack-open__strip" style={{ '--foil': current.foil }} aria-hidden="true" />
            </div>
          </div>
          <div className="pack-open__text">
            <div className="pack-open__label">{convert(t(complete ? 'pack.completed' : 'pack.unlocked'))}</div>
            <div className="pack-open__name">{convert(getLocName(current, lang))}</div>
            <div className="pack-open__xp">+{current.xp} XP</div>
            <button type="button" className="px-btn px-btn--gold pack-open__go" onClick={(e) => { e.stopPropagation(); dismiss(); setOpenSlug(current.slug); }}>
              {convert(t('pack.open'))}
            </button>
          </div>
        </div>
      )}
      {openSlug && <PackDetail slug={openSlug} onClose={() => setOpenSlug(null)} />}
    </>
  );
}
