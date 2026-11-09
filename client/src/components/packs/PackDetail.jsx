import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { packAPI } from '../../services/api';
import { getLocName } from '../../utils/locName';
import { quarterName } from '../../utils/pragueQuarters';
import { useUserPosition } from '../../hooks/useUserPosition';
import { haversineDistance, NEARBY_REVEAL_M } from '../../utils/geolocation';
import LocationCard from '../locations/LocationCard';
import LocationDetail from '../locations/LocationDetail';
import PackCard from './PackCard';

// A pack opened: its wrapper, its text (the preview until unlocked; the server
// holds back the rest), and its cards, the ones not collected yet locked.
// `onCheckIn` hears a card collected from here, for a page that keeps a list.
export default function PackDetail({ slug, onClose, onCheckIn }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const { user } = useAuth();
  const userPos = useUserPosition();
  const [pack, setPack] = useState(null);
  const [openSlug, setOpenSlug] = useState(null);

  const userId = user?._id;
  const load = useCallback(() => {
    packAPI.getOne(slug).then(res => setPack(res.data)).catch(() => {});
  }, [slug]);
  useEffect(() => { load(); }, [load, userId]);

  useEffect(() => {
    // Capture phase, stopped there, so Escape closes only this and not what lies
    // under it. Not while a card opened from here (or its showcase) is on top.
    const onKey = e => {
      if (e.key !== 'Escape' || openSlug || document.querySelector('.card-showcase')) return;
      e.stopPropagation();
      onClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose, openSlug]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const name = pack ? convert(getLocName(pack, lang)) : '';
  const text = pack?.description?.[lang] || pack?.description?.en || pack?.description?.zh || '';
  const paragraphs = text.split('\n').filter(l => l.trim());
  let hint = null;
  if (pack) {
    if (pack.completed) hint = t('pack.hintDone');
    else if (pack.unlocked) hint = t('pack.hintOpen', { total: pack.total, xp: pack.completeXp });
    else if (!user) hint = t('pack.hintGuest', { n: pack.unlockAt });
    else hint = t('pack.hintLocked', { n: Math.max(1, pack.unlockAt - pack.collected), xp: pack.unlockXp });
  }
  const areas = pack ? pack.quarters.map(q => quarterName(q, lang)) : [];

  return createPortal(
    <>
      <div className="px-overlay pack-detail-overlay" onClick={e => { e.stopPropagation(); onClose(); }}>
        <div className="px-modal pack-detail" onClick={e => e.stopPropagation()} role="dialog" aria-label={name}>
          <button type="button" className="px-modal__close" onClick={onClose} aria-label={t('areaGuide.close')}>✕</button>
          {!pack ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
          ) : (
            <>
              <div className="pack-detail__top">
                <div className="pack-detail__wrapper"><PackCard pack={pack} /></div>
                <div className="pack-detail__text">
                  <h2 className="px-title pack-detail__name">{name}</h2>
                  {lang !== 'cz' && pack.localizedNames?.cz && <div className="pack-detail__cz">{pack.localizedNames.cz}</div>}
                  {areas.length > 0 && <div className="pack-detail__areas">{convert(areas.join(' · '))}</div>}
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
                  return (
                    <LocationCard
                      key={card.slug}
                      location={card}
                      distance={distance}
                      nearby={!card.unlocked && distance != null && distance <= NEARBY_REVEAL_M}
                      onClick={setOpenSlug}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
      {/* After the overlay in the DOM and on its level, so on top of it. */}
      {openSlug && (
        <div className="area-guide-detail">
          <LocationDetail
            slug={openSlug}
            fromPack={slug}
            onClose={() => setOpenSlug(null)}
            onCheckIn={(cardSlug, result) => { load(); onCheckIn?.(cardSlug, result); }}
          />
        </div>
      )}
    </>,
    document.body,
  );
}
