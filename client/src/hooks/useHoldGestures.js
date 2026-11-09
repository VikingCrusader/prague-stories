import { useEffect, useRef, useState } from 'react';

// Showcase gestures on a card or pack: hold this long on a touch screen,
// or click twice within this long with a mouse.
const LONG_PRESS_MS = 450;
const DOUBLE_CLICK_MS = 250;

// Long press (touch) or double click (mouse) opens the showcase. A mouse click
// waits DOUBLE_CLICK_MS for a possible second click before counting as a tap;
// a touch tap is immediate. `enabled`: false makes every click a plain tap.
// `showcaseOpen` is how it was opened ('touch' or 'mouse'), or false.
export function useHoldGestures({ enabled, onTap }) {
  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const press = useRef({ timer: null, fired: false, x: 0, y: 0, pointer: 'mouse', clickTimer: null });
  const clearPress = () => { clearTimeout(press.current.timer); press.current.timer = null; };
  useEffect(() => () => { clearTimeout(press.current.timer); clearTimeout(press.current.clickTimer); }, []);

  const handlers = {
    onClick: () => {
      if (press.current.fired) { press.current.fired = false; return; }
      if (!enabled || press.current.pointer !== 'mouse') { onTap(); return; }
      if (press.current.clickTimer) {
        clearTimeout(press.current.clickTimer);
        press.current.clickTimer = null;
        setShowcaseOpen('mouse');
        return;
      }
      press.current.clickTimer = setTimeout(() => { press.current.clickTimer = null; onTap(); }, DOUBLE_CLICK_MS);
    },
    onPointerDown: e => {
      press.current.pointer = e.pointerType;
      if (!enabled || e.pointerType === 'mouse') return;
      press.current.fired = false;
      press.current.x = e.clientX;
      press.current.y = e.clientY;
      clearPress();
      press.current.timer = setTimeout(() => {
        press.current.fired = true;
        navigator.vibrate?.(12);
        setShowcaseOpen('touch');
      }, LONG_PRESS_MS);
    },
    onPointerMove: e => {
      if (press.current.timer && Math.hypot(e.clientX - press.current.x, e.clientY - press.current.y) > 10) clearPress();
    },
    onPointerUp: clearPress,
    onPointerCancel: clearPress,
    onPointerLeave: clearPress,
    // The finger that opened the showcase lifts over it: cancel the mouse
    // events and click the browser would emulate, or they land on the
    // showcase and close it again at once.
    onTouchEnd: e => { if (press.current.fired) e.preventDefault(); },
    onContextMenu: enabled ? e => e.preventDefault() : undefined,
  };

  return { handlers, showcaseOpen, closeShowcase: () => setShowcaseOpen(false) };
}
