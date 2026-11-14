import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalEntrance } from '../../hooks/useModalEntrance';
import { pageCache, pageKey } from '../../utils/pageCache';
import { useLocation } from 'react-router-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { packAPI } from '../../services/api';
import { getLocName } from '../../utils/locName';
import { LABEL_COLORS, LABEL_DEFINITIONS } from '../../utils/pixelArtMap';
import { useUserPosition } from '../../hooks/useUserPosition';
import { haversineDistance, NEARBY_REVEAL_M } from '../../utils/geolocation';
import LocationCard from '../locations/LocationCard';
import LocationDetail from '../locations/LocationDetail';
import AreaGuideModal from '../locations/AreaGuideModal';
import TagButton from '../locations/TagInfo';
import { PackAreaLine } from '../locations/DistrictLine';
import PackCard from './PackCard';

// One pack with this player's progress; null until it (not the previous one) has
// arrived. `refresh`: fetch again when it changes.
// A pack's full text is kept for the visit (pageCache), so opening it again
// shows it at once and refreshes behind (2026-11-12, as the card details do).
function usePackDetail(slug, refresh) {
  const userId = useAuth().user?._id;
  const key = pageKey(`pack:${slug}`, userId);
  const [pack, setPack] = useState(() => pageCache.get(key) ?? null);
  const wanted = useRef(slug);
  wanted.current = slug;
  const load = useCallback(() => {
    packAPI.getOne(slug).then(res => {
      pageCache.set(key, res.data);
      if (wanted.current === slug) setPack(res.data);
    }).catch(() => {});
  }, [slug, key]);
  useEffect(() => {
    setPack(pageCache.get(key) ?? null);
    load();
  }, [load, userId, refresh]); // eslint-disable-line react-hooks/exhaustive-deps
  return [pack?.slug === slug ? pack : null, load];
}

// Until the pack's text arrives: grey lines where it will be, not a spinner.
const Spinner = () => (
  <div className="detail-story-wait pack-detail__wait" role="status">
    <div className="detail-skeleton" aria-hidden="true">
      {[70, 100, 96, 99, 62, 0, 94, 98, 45].map((w, i) => (
        <span key={i} className="detail-skeleton__line" style={{ width: `${w}%` }} />
      ))}
    </div>
  </div>
);

// A pack opened: its wrapper, its text (the preview until unlocked; the server
// holds back the rest), and its cards, the ones not collected yet locked.
function PackBody({ pack, onOpenCard, onGuide, artOnly = false }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const { user } = useAuth();
  const userPos = useUserPosition();
  const name = convert(getLocName(pack, lang));
  const text = pack.description?.[lang] || pack.description?.en || pack.description?.zh || '';
  const paragraphs = text.split('\n').filter(l => l.trim());
  let hint;
  if (pack.completed) hint = t('pack.hintDone');
  else if (pack.unlocked) hint = t('pack.hintOpen', { total: pack.total, xp: pack.completeXp });
  else if (!user) hint = t('pack.hintGuest', { n: pack.unlockAt });
  else hint = t('pack.hintLocked', { n: Math.max(1, pack.unlockAt - pack.collected), xp: pack.unlockXp });

  return (
    <>
      <div className="pack-detail__top">
        <div className="pack-detail__wrapper"><PackCard pack={pack} artOnly={artOnly} torn /></div>
        <div className="pack-detail__text">
          <h2 className="px-title pack-detail__name">{name}</h2>
          {lang !== 'cz' && pack.localizedNames?.cz && <div className="pack-detail__cz">{pack.localizedNames.cz}</div>}
          {pack.labels?.length > 0 && (
            <div className="loc-card__labels pack-detail__labels">
              {pack.labels.map((lb, i) => (
                <TagButton
                  key={lb}
                  kind="label"
                  value={lb}
                  className={`detail-label-pill area-guide-pill${i === 0 ? ' detail-label-pill--superior' : ''}`}
                  style={{ backgroundColor: LABEL_COLORS[lb] || 'var(--pill-fallback, rgba(255,255,255,0.07))' }}
                >
                  {convert(LABEL_DEFINITIONS[lb]?.[lang] || LABEL_DEFINITIONS[lb]?.en || lb)}
                </TagButton>
              ))}
            </div>
          )}
          <PackAreaLine cards={pack.members} onOpen={onGuide} className="pack-detail__areas" />
          {user && (
            <div className="area-guide__progress">
              <div className="area-guide__progress-text">
                {convert(t('areaGuide.collected', { collected: pack.collected, total: pack.total }))}
                <span className="area-guide__pct">{pack.total ? Math.round((pack.collected / pack.total) * 100) : 0}%</span>
              </div>
              <div className="area-guide__bar">
                <span className="area-guide__fill" style={{ width: `${pack.total ? (pack.collected / pack.total) * 100 : 0}%`, backgroundColor: 'var(--gold)' }} />
              </div>
            </div>
          )}
          <p className="pack-detail__hint">{convert(hint)}</p>
          {paragraphs.map((para, i) => <p key={i} className="detail-desc pack-detail__para">{convert(para)}</p>)}
        </div>
      </div>
      <h3 className="px-title pack-detail__cards-title">{convert(t('pack.cards'))}</h3>
      <div className="pack-detail__cards">
        {pack.members.map(card => {
          const distance = userPos ? haversineDistance(userPos.lat, userPos.lng, card.coordinates.lat, card.coordinates.lng) : null;
          const nearby = !card.unlocked && distance != null && distance <= NEARBY_REVEAL_M;
          return (
            <LocationCard
              key={card.slug}
              location={card}
              distance={distance}
              nearby={nearby}
              onClick={cardSlug => onOpenCard(cardSlug, { nearby: nearby && !!user })}
            />
          );
        })}
      </div>
    </>
  );
}

// The same pack in a side column, not over the page (the Map's right column).
// `onPickCard(slug)`: a card in it was clicked; the page decides what that shows.
export function PackPanel({ slug, refresh, onPickCard }) {
  const [pack] = usePackDetail(slug, refresh);
  const [guide, setGuide] = useState(null);
  return (
    <div className="pack-panel" data-pack-panel={slug}>
      {pack ? <PackBody pack={pack} onOpenCard={onPickCard} onGuide={setGuide} artOnly /> : <Spinner />}
      {guide && <AreaGuideModal kind={guide.kind} value={guide.value} onClose={() => setGuide(null)} />}
    </div>
  );
}

// The pack as a pop-up over the page. `onCheckIn` hears a card collected from
// here, for a page that keeps a list. `artOnly`: see PackCard.
export default function PackDetail({ slug, onClose, onCheckIn, artOnly = false }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [pack, load] = usePackDetail(slug);
  const [openSlug, setOpenSlug] = useState(null);
  // As on Explore: a locked card tapped within NEARBY_REVEAL_M (its lock wobbling)
  // opens and collects at once, for a signed-in player (2026-11-14, user's call).
  const [autoCheckIn, setAutoCheckIn] = useState(false);
  const openCard = useCallback((cardSlug, how) => { setAutoCheckIn(!!how?.nearby); setOpenSlug(cardSlug); }, []);
  const [guide, setGuide] = useState(null);
  // Grows out of the pack it was opened from, and shrinks back to it (2026-11-12).
  const { overlayRef, modalRef, close } = useModalEntrance(slug, onClose);

  // A label's "see on Explore" link, followed while already on Explore, must not
  // leave this lying over the filtered cards.
  const { key: routeKey } = useLocation();
  const openedOn = useRef(routeKey);
  useEffect(() => { if (routeKey !== openedOn.current) onClose(); }, [routeKey, onClose]);

  useEffect(() => {
    // Capture phase, stopped there, so Escape closes only this and not what lies
    // under it. Not while a card opened from here (or its showcase), an area's
    // guide or a label's note is on top.
    const onKey = e => {
      if (e.key !== 'Escape' || openSlug || guide || document.querySelector('.card-showcase, .tag-info-overlay')) return;
      e.stopPropagation();
      onClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose, openSlug, guide]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const name = pack ? convert(getLocName(pack, lang)) : '';

  return createPortal(
    <>
      <div ref={overlayRef} className="px-overlay pack-detail-overlay" onClick={e => { e.stopPropagation(); close(); }}>
        <div ref={modalRef} className="px-modal pack-detail" onClick={e => e.stopPropagation()} role="dialog" aria-label={name}>
          <button type="button" className="px-modal__close" onClick={close} aria-label={t('areaGuide.close')}>✕</button>
          {pack ? <PackBody pack={pack} onOpenCard={openCard} onGuide={setGuide} artOnly={artOnly} /> : <Spinner />}
        </div>
      </div>
      {guide && <AreaGuideModal kind={guide.kind} value={guide.value} onClose={() => setGuide(null)} />}
      {/* After the overlay in the DOM and on its level, so on top of it. */}
      {openSlug && (
        <div className="area-guide-detail">
          <LocationDetail
            slug={openSlug}
            preview={pack?.members.find(m => m.slug === openSlug)}
            fromPack={slug}
            autoCheckIn={autoCheckIn}
            onClose={() => { setOpenSlug(null); setAutoCheckIn(false); }}
            onCheckIn={(cardSlug, result) => { load(); onCheckIn?.(cardSlug, result); }}
          />
        </div>
      )}
    </>,
    document.body,
  );
}
