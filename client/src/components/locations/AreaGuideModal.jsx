import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { locationAPI, userAPI } from '../../services/api';
import { loadAreaGuide, hasAreaGuide, AREA_LANDMARKS } from '../../utils/areaGuides';
import { getLocName } from '../../utils/locName';
import { quarterName } from '../../utils/pragueQuarters';
import { DISTRICT_COLORS } from './DistrictLine';
import FullCardGrid from './FullCardGrid';
import LocationDetail from './LocationDetail';

const SPLIT_QUERY = '(min-width: 1200px)';

// The cards collected in this area, newest first, at Explore's size. A click
// opens the card's detail through `onOpen`. It scrolls on its own beside the
// text, or, given the pop-up's `scrollRef`, runs on under the text.
function AreaCollection({ cards, onOpen, scrollRef }) {
  const t = useT();
  const convert = useConvert();
  const ownScrollRef = useRef(null);
  return (
    <div className={`area-guide__collection${scrollRef ? ' area-guide__collection--stacked' : ''}`}>
      <h2 className="px-title area-guide__collection-title">
        {t('grid.filterDiscovered')} {cards && <span className="card-strip__count">{cards.length}</span>}
      </h2>
      <div ref={scrollRef ? undefined : ownScrollRef} className="area-guide__collection-scroll">
        {!cards ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><div className="spinner" /></div>
        ) : cards.length ? (
          <FullCardGrid cards={cards} onOpen={onOpen} scrollRef={scrollRef || ownScrollRef} />
        ) : (
          <p className="area-guide__soon">{convert(t('areaGuide.noneCollected'))}</p>
        )}
      </div>
    </div>
  );
}

// The longer guide to a district or quarter (utils/areaGuides), as a
// closable pop-up over whatever page opened it, so it can sit on top of a
// card's detail too. Opened from the pills under a card (DistrictLine), the
// Explore header and the profile's map. Above the text, the user's progress
// there: collected cards out of all cards in the area (guests see the total
// only). `locations` can be passed by a page that already has the card list;
// otherwise it is fetched. `withCollection` (the profile's map and list, always
// the user's own cards): on a wide screen the pop-up fills the screen, with the
// text on the left and the cards collected there on the right; on smaller ones
// only the overview shows, the rest behind a button, with the cards under it.
export default function AreaGuideModal({ kind, value, locations, withCollection = false, onClose }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const { user } = useAuth();
  const [sections, setSections] = useState(null);
  const [fetched, setFetched] = useState(null);
  const [wide, setWide] = useState(() => window.matchMedia(SPLIT_QUERY).matches);
  const [openSlug, setOpenSlug] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const modalRef = useRef(null);
  const split = withCollection && wide;
  const stacked = withCollection && !wide;

  useEffect(() => {
    const query = window.matchMedia(SPLIT_QUERY);
    const onChange = e => setWide(e.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    let live = true;
    setSections(null);
    if (!hasAreaGuide(kind, value)) { setSections([]); return undefined; }
    loadAreaGuide(lang, kind, value).then(s => live && setSections(s || [])).catch(() => live && setSections([]));
    return () => { live = false; };
  }, [lang, kind, value]);

  // Opening a guide that has text counts toward Know Your Way Around (ten
  // different areas); an area still "coming soon" doesn't.
  const userId = user?._id;
  useEffect(() => {
    if (userId && hasAreaGuide(kind, value)) userAPI.markAreaGuideRead(kind, value).catch(() => {});
  }, [userId, kind, value]);

  useEffect(() => {
    if (locations) return undefined;
    let live = true;
    locationAPI.getAll().then(res => live && setFetched(res.data)).catch(() => {});
    return () => { live = false; };
  }, [locations]);

  useEffect(() => {
    // Capture phase, stopped there, so Escape closes only this pop-up and not
    // the card detail underneath it. Not while a card opened from here (its
    // detail or showcase) lies on top.
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

  const list = locations || fetched;
  const progress = useMemo(() => {
    if (!list) return null;
    const inArea = list.filter(l => !l.labels?.includes('outside') && l[kind] === value);
    return { total: inArea.length, collected: inArea.filter(l => l.unlocked).length };
  }, [list, kind, value]);
  const collected = useMemo(() => (withCollection && list
    ? list.filter(l => l.unlocked && !l.labels?.includes('outside') && l[kind] === value)
      .sort((a, b) => new Date(b._checkedInAt ?? 0) - new Date(a._checkedInAt ?? 0))
    : null), [withCollection, list, kind, value]);

  // A quarter takes the colour of the district it lies in (from its cards).
  const districtNo = kind === 'district'
    ? Number(value.slice(6))
    : Number(list?.find(l => l.quarter === value)?.district?.slice(6)) || null;
  const color = districtNo ? DISTRICT_COLORS[districtNo - 1] : 'var(--gold)';
  const title = kind === 'district' ? t('detail.district', { n: value.slice(6) }) : quarterName(value, lang);
  const pct = progress?.total ? Math.round((progress.collected / progress.total) * 100) : 0;

  const guide = (
    <>
      <h2 className="px-title area-guide__title">{convert(title)}</h2>
      {progress && (
        <div className="area-guide__progress">
          {user ? (
            <>
              <div className="area-guide__progress-text">
                {convert(t('areaGuide.collected', { collected: progress.collected, total: progress.total }))}
                <span className="area-guide__pct">{pct}%</span>
              </div>
              <div className="area-guide__bar">
                <span className="area-guide__fill" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
            </>
          ) : (
            <div className="area-guide__progress-text">{convert(t('areaGuide.total', { total: progress.total }))}</div>
          )}
        </div>
      )}
      {!sections ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}><div className="spinner" /></div>
      ) : !sections.length ? (
        <p className="area-guide__soon">{convert(t('areaGuide.comingSoon'))}</p>
      ) : (stacked && !expanded ? sections.slice(0, 1) : sections).map(s => {
        // A landmarks section lists cards by slug (AREA_LANDMARKS), named
        // from the cards, collected ones ticked; hidden until the list loads.
        const marks = s.landmarks
          ? (AREA_LANDMARKS[kind]?.[value] || []).map(slug => list?.find(l => l.slug === slug)).filter(Boolean)
          : null;
        if (marks && !marks.length) return null;
        return (
          <section key={s.h} className="area-guide__section">
            <h3 className="area-guide__heading">{convert(s.h)}</h3>
            {marks ? (
              <ul className="area-guide__landmarks">
                {marks.map(l => {
                  const got = user && l.unlocked;
                  return (
                    <li key={l.slug} className={`area-guide__landmark${got ? ' area-guide__landmark--got' : ''}`}>
                      {got && <span aria-label={t('areaGuide.landmarkCollected')}>✓ </span>}
                      {convert(getLocName(l, lang))}
                    </li>
                  );
                })}
              </ul>
            ) : s.p.map((para, i) => <p key={i}>{convert(para)}</p>)}
          </section>
        );
      })}
      {stacked && sections?.length > 1 && (
        <button type="button" className="area-guide-link area-guide__more" aria-expanded={expanded} onClick={() => setExpanded(v => !v)}>
          {convert(t(expanded ? 'areaGuide.readLess' : 'areaGuide.readMore'))}
        </button>
      )}
    </>
  );

  return createPortal(
    // React events bubble out of a portal to the component that rendered it,
    // so clicks stop here instead of reaching (and closing) a detail overlay.
    <>
      <div className={`px-overlay area-guide-overlay${withCollection ? ' area-guide-overlay--profile' : ''}${stacked ? ' area-guide-overlay--stacked' : ''}`} onClick={e => { e.stopPropagation(); onClose(); }}>
        <div ref={modalRef} className={`px-modal area-guide${split ? ' area-guide--split' : ''}${stacked ? ' area-guide--stacked' : ''}`} onClick={e => e.stopPropagation()} role="dialog" aria-label={convert(title)}>
          <button className="px-modal__close" onClick={onClose} aria-label={t('areaGuide.close')}>✕</button>
          {split ? (
            <>
              <div className="area-guide__text">{guide}</div>
              <AreaCollection cards={collected} onOpen={setOpenSlug} />
            </>
          ) : stacked ? (
            <>
              {guide}
              <AreaCollection cards={collected} onOpen={setOpenSlug} scrollRef={modalRef} />
            </>
          ) : guide}
        </div>
      </div>
      {/* After the overlay in the DOM and on its level, so on top of it. */}
      {openSlug && <LocationDetail slug={openSlug} onClose={() => setOpenSlug(null)} />}
    </>,
    document.body,
  );
}
