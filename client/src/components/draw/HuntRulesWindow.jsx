import { useEffect } from 'react';
import { useWindowEntrance } from '../../hooks/useModalEntrance';

// A window on the Treasure Hunt page (2026-11-14): the full rules ("How to
// play") and all past finds, off the phone layout, where the same content is
// in a sheet. It grows out of the button that opened it and shrinks back.
export default function HuntRulesWindow({ label, wide = false, onClose, children }) {
  const { overlayRef, modalRef, close } = useWindowEntrance(onClose);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);
  return (
    <div ref={overlayRef} className="px-overlay" onClick={close}>
      <div ref={modalRef} className={`px-modal hunt-window${wide ? ' hunt-window--wide' : ''}`} onClick={e => e.stopPropagation()} role="dialog" aria-label={label}>
        <button type="button" className="px-modal__close" onClick={close} aria-label="✕">✕</button>
        <div className="hunt-window__scroll">{children}</div>
      </div>
    </div>
  );
}
