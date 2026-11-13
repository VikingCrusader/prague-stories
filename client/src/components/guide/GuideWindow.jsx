import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLang, useConvert } from '../../context/LanguageContext';
import { useWindowEntrance } from '../../hooks/useModalEntrance';
import { BOARD } from '../../utils/guideBoard';

// One tile's window on the Guide's overview board (2026-11-13): the section's
// text on the left and, for tiles that have one, a demo to play with on the
// right. It grows out of its tile like every other window.
export default function GuideWindow({ title, demo, variant, children, onClose }) {
  const { lang } = useLang();
  const convert = useConvert();
  const { overlayRef, modalRef, close } = useWindowEntrance(onClose);

  useEffect(() => {
    // Not while a card opened from a demo (its showcase or detail) lies on top.
    const onKey = e => { if (e.key === 'Escape' && !document.querySelector('.card-showcase, .guide-detail')) close(); };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; };
  }, [close]);

  return createPortal(
    <div ref={overlayRef} className="px-overlay guide-window-overlay" onClick={close}>
      <div
        ref={modalRef}
        className={`px-modal guide-window${demo ? ' guide-window--demo' : ''}${variant ? ` guide-window--${variant}` : ''}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label={title}
      >
        <button type="button" className="px-modal__close" onClick={close} aria-label="✕">✕</button>
        <div className="guide-window__text">
          <h2 className="px-title guide-window__title">{title}</h2>
          {children}
        </div>
        {demo && (
          <div className="guide-window__demo">
            <h3 className="guide-window__try">{convert((BOARD[lang] || BOARD.en).tryIt)}</h3>
            {demo}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
