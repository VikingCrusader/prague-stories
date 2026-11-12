import { useCallback, useLayoutEffect, useRef } from 'react';
import { viewportRect } from '../utils/fitPage';

const PHONE = '(max-width: 600px)';
const EASE_OUT = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const CLEAR = 'rgba(0, 0, 0, 0)';

const matches = (query) => !!window.matchMedia?.(query).matches;
const still = () => matches('(prefers-reduced-motion: reduce)');

// The card on the page that this detail belongs to, if one is in view. A copy
// inside the card showcase doesn't count: that is the thing being opened.
function sourceCard(slug) {
  let cards = [];
  try {
    cards = document.querySelectorAll(`.loc-card[data-slug="${CSS.escape(slug)}"], .pack-card[data-pack="${CSS.escape(slug)}"]`);
  } catch { /* no CSS.escape */ }
  for (const el of cards) {
    if (el.closest('.card-showcase')) continue;
    const r = viewportRect(el);
    if (r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth) return r;
  }
  return null;
}

// Where the window starts (and goes back to): phones slide it up from the bottom
// like the other sheets; elsewhere it grows out of its card, or, with no card in
// view (a name in a text, an achievement's list), fades in a little smaller.
// `finalTransform`: the transform the window rests at, when it has one (the
// showcase is scaled); the animation runs from the card to that.
function restingPlace(modal, slug, { sheet = true, finalTransform = 'none' } = {}) {
  if (sheet && matches(PHONE)) return { transform: 'translateY(100%)', opacity: 1, ms: 260 };
  const card = sourceCard(slug);
  if (!card) return { transform: 'translateY(10px) scale(0.96)', opacity: 0, ms: 180, finalTransform };
  const m = modal.getBoundingClientRect();
  if (!m.width) return null;
  const dx = card.left + card.width / 2 - (m.left + m.width / 2);
  const dy = card.top + card.height / 2 - (m.top + m.height / 2);
  return { transform: `translate(${dx}px, ${dy}px) scale(${card.width / m.width})`, opacity: 0, ms: 300, finalTransform };
}

// Plays the entrance on `modal` (and the backdrop's fade on `overlay`, if given).
// Returns a cancel function, or null when nothing was played (reduced motion,
// no Web Animations, or nothing to measure), so the caller keeps its own look.
export function growIn(modal, slug, { overlay = null, sheet = true, finalTransform = 'none' } = {}) {
  if (!modal?.animate || still()) return null;
  const from = restingPlace(modal, slug, { sheet, finalTransform });
  if (!from) return null;
  if (overlay) overlay.style.overflow = 'hidden'; // the small, shifted window mustn't give it a scrollbar
  const grow = modal.animate(
    [
      { transform: from.transform, opacity: from.opacity },
      { opacity: 1, offset: 0.45 },
      { transform: finalTransform, opacity: 1 },
    ],
    { duration: from.ms, easing: EASE_OUT },
  );
  const dim = overlay?.animate(
    [{ backgroundColor: CLEAR }, { backgroundColor: getComputedStyle(overlay).backgroundColor }],
    { duration: from.ms, easing: 'ease-out' },
  );
  const done = () => { if (overlay) overlay.style.overflow = ''; };
  grow.onfinish = done;
  grow.oncancel = done;
  return () => { grow.cancel(); dim?.cancel(); };
}

// Entrance and exit of a card detail window (2026-11-12). Put `overlayRef` on
// the backdrop and `modalRef` on the window, and close through `close`, which
// plays the exit before calling `onClose`. Only transform, opacity and the
// backdrop's colour move. Skipped under prefers-reduced-motion.
export function useModalEntrance(slug, onClose) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const closing = useRef(false);
  const latest = useRef({});
  latest.current = { slug, onClose };

  useLayoutEffect(() => {
    if (!overlayRef.current || !modalRef.current) return undefined;
    return growIn(modalRef.current, slug, { overlay: overlayRef.current });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const close = useCallback(() => {
    if (closing.current) return;
    const overlay = overlayRef.current;
    const modal = modalRef.current;
    const to = overlay && modal?.animate && !still() ? restingPlace(modal, latest.current.slug) : null;
    if (!to) { latest.current.onClose(); return; }
    closing.current = true;
    overlay.style.overflow = 'hidden';
    const ms = Math.round(to.ms * 0.7);
    const shrink = modal.animate(
      [
        { transform: 'none', opacity: 1 },
        { opacity: 1, offset: 0.55 },
        { transform: to.transform, opacity: to.opacity },
      ],
      { duration: ms, easing: 'ease-in', fill: 'forwards' },
    );
    overlay.animate(
      [{ backgroundColor: getComputedStyle(overlay).backgroundColor }, { backgroundColor: CLEAR }],
      { duration: ms, easing: 'ease-in', fill: 'forwards' },
    );
    const done = () => latest.current.onClose();
    shrink.onfinish = done;
    shrink.oncancel = done;
  }, []);

  return { overlayRef, modalRef, close };
}
