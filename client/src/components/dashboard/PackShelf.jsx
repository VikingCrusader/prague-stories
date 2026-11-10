import { useLayoutEffect, useRef, useState } from 'react';
import { useT, useConvert } from '../../context/LanguageContext';
import { usePacks } from '../../hooks/usePacks';
import PackCard from '../packs/PackCard';

// A pack's size before it is scaled to the shelf: art only, so about square.
const PACK_W = 204;
const PACK_H = 220;
const GAP = 10;

// What the profile shows off: only packs already opened, finished ones first.
export const openedPacks = packs => packs
  .filter(p => p.unlocked)
  .sort((a, b) => Number(b.completed) - Number(a.completed) || b.collected / b.total - a.collected / a.total);

// The profile's card packs, each one whole (2026-11-09, user's call).
// `layout`: 'side' (2K, two across beside the map), 'compact' (one-screen computers,
// in a small slot, so the title sits beside them) or 'stack' (phones, tablets:
// ordinary size, the page scrolls).
// In the first two the packs are scaled to the room there is (the column's
// width, or the slot's height), and only as many as fit whole are shown; the
// title opens all of them.
export default function PackShelf({ layout, refresh, onOpen, onSeeAll }) {
  const t = useT();
  const convert = useConvert();
  const packs = openedPacks(usePacks(refresh));
  const fits = layout !== 'stack';
  const rowRef = useRef(null);
  const [box, setBox] = useState(null);

  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!fits || !row) return undefined;
    const measure = () => setBox({ w: row.clientWidth, h: row.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, [fits, packs.length > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const side = layout === 'side';
  const twoAcross = box ? (box.w - GAP) / (2 * PACK_W) : 1;
  // In the small slot the height alone would leave room for just one.
  const zoom = !fits || !box ? 1 : side ? twoAcross : Math.min(box.h / PACK_H, twoAcross);
  let whole = packs.length;
  if (fits && box) {
    whole = side
      ? 2 * Math.max(1, Math.floor((box.h + GAP) / (PACK_H * zoom + GAP)))
      : Math.max(1, Math.floor((box.w + GAP) / (PACK_W * zoom + GAP)));
  }

  const title = (
    <h2 className="px-title profile-card-title pack-shelf__title">
      {packs.length > 0
        ? <button type="button" className="quiet-link pack-shelf__all" onClick={onSeeAll}>{t('grid.filterPacks')}</button>
        : t('grid.filterPacks')}
      {packs.length > 0 && <span className="card-strip__count"> {packs.length}</span>}
    </h2>
  );

  return (
    <div className={`stat-card pack-shelf pack-shelf--${layout}`}>
      {title}
      {packs.length === 0 ? (
        <p className="card-strip__empty pack-shelf__empty">{convert(t('pack.shelfEmpty'))}</p>
      ) : (
        <div ref={rowRef} className="pack-shelf__row" style={{ gap: GAP }}>
          {packs.slice(0, whole).map(pack => (
            <div key={pack.slug} className="pack-shelf__item" style={fits ? { zoom, width: PACK_W, height: PACK_H } : undefined}>
              <PackCard pack={pack} onClick={onOpen} artOnly />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
