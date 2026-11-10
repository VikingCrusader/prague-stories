import { useLayoutEffect, useRef, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { usePacks } from '../../hooks/usePacks';
import { useFitText } from '../../utils/fitText';
import { getLocName } from '../../utils/locName';
import PackCard from '../packs/PackCard';

// A pack's size before it is scaled to the shelf: art only, so about square.
const PACK_W = 204;
const PACK_H = 220;
const GAP = 10;
// The name and progress under each pack: two fixed lines and the space above them.
const CAPTION_H = 37;
// The small slot's padding, and what the heading takes beside or above the packs.
const CARD_PAD_X = 40;
const CARD_PAD_Y = 20;
const HEAD_W = 140;
const HEAD_H = 30;

// What the profile shows off: only packs already opened, finished ones first.
export const openedPacks = packs => packs
  .filter(p => p.unlocked)
  .sort((a, b) => Number(b.completed) - Number(a.completed) || b.collected / b.total - a.collected / a.total);

// A pack's name and progress in words, under its art.
export function PackCaption({ pack }) {
  const { lang } = useLang();
  const convert = useConvert();
  return (
    <div className="pack-shelf__caption">
      <span className="card-strip__name">{convert(getLocName(pack, lang))}</span>
      <span className="card-strip__meta">{pack.collected} / {pack.total}</span>
    </div>
  );
}

// The profile's card packs, each one whole (2026-11-09, user's call).
// `layout`: 'side' (2K, two across beside the map), 'compact' (one-screen computers,
// in a small slot, so the title sits beside them) or 'stack' (phones, tablets:
// ordinary size, the page scrolls).
// In the first two the packs are scaled to the room there is (the column's
// width, or the slot's height), and only as many as fit whole are shown; the
// "All" opens every one of them.
export default function PackShelf({ layout, max = null, refresh, onOpen, onSeeAll }) {
  const t = useT();
  const convert = useConvert();
  const { lang } = useLang();
  const packs = openedPacks(usePacks(refresh));
  const fits = layout !== 'stack';
  const rowRef = useRef(null);
  const cardRef = useRef(null);
  const [box, setBox] = useState(null);
  // In the small slot the heading sits beside the packs, or above them when the
  // slot is tall enough for that to leave them more room (it isn't everywhere).
  const [headOnTop, setHeadOnTop] = useState(false);

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!fits || !row) return undefined;
    const measure = () => {
      setBox({ w: row.clientWidth, h: row.clientHeight });
      const w = cardRef.current.clientWidth - CARD_PAD_X;
      const h = cardRef.current.clientHeight - CARD_PAD_Y;
      const beside = Math.min((h - CAPTION_H) / PACK_H, (w - HEAD_W - GAP) / (2 * PACK_W));
      const above = Math.min((h - HEAD_H - CAPTION_H) / PACK_H, (w - GAP) / (2 * PACK_W));
      setHeadOnTop(above > beside);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    ro.observe(cardRef.current);
    return () => ro.disconnect();
  }, [fits, packs.length > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const side = layout === 'side';
  const twoAcross = box ? (box.w - GAP) / (2 * PACK_W) : 1;
  // In the small slot the height alone would leave room for just one.
  const zoom = !fits || !box ? 1 : side ? twoAcross : Math.min((box.h - CAPTION_H) / PACK_H, twoAcross);
  let whole = max ?? packs.length;
  if (fits && box) {
    whole = side
      ? 2 * Math.max(1, Math.floor((box.h + GAP) / (PACK_H * zoom + CAPTION_H + GAP)))
      : Math.max(1, Math.floor((box.w + GAP) / (PACK_W * zoom + GAP)));
  }

  useFitText(rowRef, '.card-strip__name, .card-strip__meta', [packs.length, lang, zoom], 8);

  return (
    <div ref={cardRef} className={`stat-card pack-shelf pack-shelf--${layout}${layout === 'compact' && headOnTop ? ' pack-shelf--top' : ''}`}>
      <div className="card-strip__head pack-shelf__head">
        <h2 className="px-title profile-card-title pack-shelf__title">
          {t('grid.filterPacks')}
          {packs.length > 0 && <span className="card-strip__count"> {packs.length}</span>}
        </h2>
        {packs.length > 0 && <button type="button" className="card-strip__all pack-shelf__all" onClick={onSeeAll}>{t('dashboard.seeAll')}</button>}
      </div>
      {packs.length === 0 ? (
        <p className="card-strip__empty pack-shelf__empty">{convert(t('pack.shelfEmpty'))}</p>
      ) : (
        <div ref={rowRef} className="pack-shelf__row" style={{ gap: GAP }}>
          {packs.slice(0, whole).map(pack => (
            <div key={pack.slug} className="pack-shelf__item" style={fits ? { width: PACK_W * zoom } : undefined}>
              <div className="pack-shelf__art" style={fits ? { zoom, width: PACK_W, height: PACK_H } : undefined}>
                <PackCard pack={pack} onClick={onOpen} artOnly />
              </div>
              <PackCaption pack={pack} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
