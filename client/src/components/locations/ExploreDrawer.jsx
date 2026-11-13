import { useEffect, useRef } from 'react';
import { useT } from '../../context/LanguageContext';

const CLOSE_DISTANCE = 90; // px dragged down before the sheet lets go

// Explore without the side column (phones, tablets upright, narrow windows): the
// area filter is the side column's Prague map, in a sheet that slides up
// (2026-11-09, user's call; the rest of the stacked page stays as it was).
// Only the handle drags it, so the map's zoom and the sheet's own scrolling keep
// their gestures. The phone's back button closes it: opening pushes a history
// entry, every way of closing goes back through it, and the sheet slides
// back down before it goes (2026-11-13).
export default function ExploreDrawer({ count, onClose, onClear, autoClose = false, label, children }) {
  const t = useT();
  const sheetRef = useRef(null);
  const backdropRef = useRef(null);
  const drag = useRef(null);
  const latestClose = useRef(onClose);
  latestClose.current = onClose;

  // Slides the sheet back down (from wherever a drag left it) and fades the
  // backdrop before the drawer goes; skipped under reduced motion.
  const leave = () => {
    const sheet = sheetRef.current;
    if (!sheet?.animate || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { latestClose.current(); return; }
    const from = getComputedStyle(sheet).transform;
    sheet.style.transition = 'none';
    const slide = sheet.animate(
      [{ transform: from === 'none' ? 'translateY(0)' : from }, { transform: 'translateY(100%)' }],
      { duration: 200, easing: 'cubic-bezier(0.4, 0, 1, 1)', fill: 'forwards' },
    );
    backdropRef.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-in', fill: 'forwards' });
    const done = () => latestClose.current();
    slide.onfinish = done;
    slide.oncancel = done;
  };

  useEffect(() => {
    window.history.pushState({ exploreDrawer: true }, '');
    const onPop = () => leave();
    window.addEventListener('popstate', onPop);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('popstate', onPop);
      document.body.style.overflow = overflow;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => window.history.back();
  // Nothing left to show (the last filter was cleared from inside).
  useEffect(() => { if (autoClose) window.history.back(); }, [autoClose]);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, t: e.timeStamp, dy: 0 };
    sheetRef.current.style.transition = 'none';
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    drag.current.dy = Math.max(0, e.clientY - drag.current.y);
    sheetRef.current.style.transform = `translateY(${drag.current.dy}px)`;
  };
  const onPointerUp = (e) => {
    if (!drag.current) return;
    const { dy, t: start } = drag.current;
    drag.current = null;
    const sheet = sheetRef.current;
    sheet.style.removeProperty('transition');
    if (dy > CLOSE_DISTANCE || dy / Math.max(1, e.timeStamp - start) > 0.6) close();
    else sheet.style.removeProperty('transform');
  };

  return (
    <div className="explore-drawer" role="dialog" aria-modal="true" aria-label={label ?? t('area.button')}>
      <div className="explore-drawer__backdrop" ref={backdropRef} onClick={close} />
      <div className="explore-drawer__sheet" ref={sheetRef}>
        <div
          className="explore-drawer__handle"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-hidden="true"
        >
          <span />
        </div>
        <div className="explore-side explore-drawer__body">{children}</div>
        {count != null && (
          <div className="explore-drawer__foot">
            {onClear && (
              <button type="button" className="filter-btn explore-drawer__clear" onClick={onClear}>
                ✕ {t('grid.clearLabels')}
              </button>
            )}
            <button type="button" className="px-btn px-btn--gold explore-drawer__view" onClick={close}>
              {t('explore.viewCards', { n: count })}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
