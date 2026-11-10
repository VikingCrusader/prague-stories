import { useEffect, useRef, useState } from 'react';
import { userAPI, locationAPI, packAPI } from '../../services/api';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { RARITY_LABEL } from '../../utils/rarity';
import FullCardGrid from '../locations/FullCardGrid';
import { AchievementTile, rarestFirst } from '../achievements/RarestAchievements';
import { CardThumb } from './RecentCardStrip';
import PackCard from '../packs/PackCard';
import { openedPacks, PackCaption } from './PackShelf';

const TITLE = {
  achievements: 'dashboard.achievements',
  treasure: 'dashboard.treasures',
  expedition: 'dashboard.expeditions',
  collection: 'grid.filterDiscovered',
  packs: 'grid.filterPacks',
};

// `kind` is 'treasure', 'expedition', 'collection' (every collected card) or a rarity.
function fetchCards(kind) {
  if (kind === 'treasure') return userAPI.getTreasures().then(res => res.data);
  if (kind === 'expedition') return userAPI.getExpeditions().then(res => res.data);
  if (kind === 'packs') return packAPI.getAll().then(res => openedPacks(res.data));
  return locationAPI.getAll().then(res => res.data
    .filter(l => l.unlocked && (kind === 'collection' || (l.rarity ?? 'common') === kind))
    .sort((a, b) => new Date(b._checkedInAt ?? 0) - new Date(a._checkedInAt ?? 0)));
}

// The profile's "All" window (2026-11-08, user's call): everything of one
// kind in the same small tiles as the profile, or, for all collected cards or
// one rarity's, as whole cards. Achievements come from the catalogue the profile
// already has (unlocked only, highest tier first); the cards are fetched on
// opening, newest first, since the profile only gets the newest few. `paused`
// while a detail window is open on top, so Escape doesn't close this one
// behind it.
export default function ProfileGallery({ kind, achievements, paused, onClose, onOpenAchievement, onOpenCard, onOpenPack }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const isAch = kind === 'achievements';
  const isRarity = !isAch && !TITLE[kind];
  const isCollection = kind === 'collection';
  const fullCards = isRarity || isCollection;
  const isPacks = kind === 'packs';
  const [cards, setCards] = useState(null);
  const [failed, setFailed] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isAch) return undefined;
    let live = true;
    fetchCards(kind)
      .then(list => { if (live) setCards(list); })
      .catch(() => { if (live) setFailed(true); });
    return () => { live = false; };
  }, [kind, isAch]);

  useEffect(() => {
    if (paused) return undefined;
    const onKey = e => {
      // The card showcase (a long press or double click) handles its own.
      if (e.key === 'Escape' && !document.querySelector('.card-showcase')) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paused, onClose]);

  const unlocked = isAch ? achievements.filter(a => a.unlocked).sort(rarestFirst) : null;
  const count = isAch ? unlocked.length : cards?.length;
  const title = isRarity ? convert(RARITY_LABEL[lang]?.[kind] ?? RARITY_LABEL.en[kind]) : t(TITLE[kind]);

  return (
    <div className="px-overlay" onClick={onClose}>
      <div className={`px-modal profile-gallery${fullCards || isPacks ? ' profile-gallery--wide' : ''}`} onClick={e => e.stopPropagation()} role="dialog" aria-label={title}>
        <button type="button" className="px-modal__close" onClick={onClose} aria-label="✕">✕</button>
        <h2 className="px-title profile-gallery__title">
          {title} {count != null && <span className="card-strip__count">{count}</span>}
        </h2>
        <div ref={scrollRef} className="profile-gallery__scroll">
          {failed ? (
            <p className="guide-body" style={{ color: 'var(--text-muted)' }}>{t('dashboard.galleryError')}</p>
          ) : isAch ? (
            <div className="profile-gallery__grid profile-gallery__grid--ach">
              {unlocked.map(a => <AchievementTile key={a.id} achievement={a} onOpen={onOpenAchievement} />)}
            </div>
          ) : !cards ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><div className="spinner" /></div>
          ) : isPacks ? (
            <div className="profile-gallery__packs">
              {cards.map(pack => (
                <div key={pack.slug}>
                  <PackCard pack={pack} onClick={onOpenPack} artOnly />
                  <PackCaption pack={pack} />
                </div>
              ))}
            </div>
          ) : fullCards ? (
            cards.length > 0 && <FullCardGrid cards={cards} onOpen={onOpenCard} scrollRef={scrollRef} loadOnClick={isCollection} />
          ) : (
            <div className="profile-gallery__grid profile-gallery__grid--cards">
              {cards.map(loc => <CardThumb key={loc.slug} location={loc} onOpen={onOpenCard} details={kind === 'treasure'} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
