import { useLayoutEffect, useRef, useState } from 'react';
import { useT } from '../../context/LanguageContext';

// Explore/Map's switch between the city proper (the default: cards without the
// `outside` label) and every card. Two halves, the current one lit, so it reads
// as a state and not as an action (2026-11-10, user's call; it used to be one
// button naming the current mode, which looked like it named what a press did).
// Each half has a long label ("布拉格市区 | 全部（含市外）") and falls back to the
// short one ("市区 | 全部") when a long one doesn't fit its half.
export default function ScopeToggle({ cityOnly, onChange, className = '', style }) {
  const t = useT();
  const ref = useRef(null);
  const thumbRef = useRef(null);
  const [short, setShort] = useState(false);

  // The lit half is one sliding frame (.scope-toggle__thumb) that glides over to
  // the chosen half, instead of the two halves swapping their look (2026-11-12).
  // Placed from the chosen half's offsets; it only moves once placed (data-ready).
  const place = () => {
    const el = ref.current;
    const thumb = thumbRef.current;
    const on = el?.querySelector('.scope-toggle__opt--on');
    if (!el || !thumb || !on) return;
    thumb.style.width = `${on.offsetWidth}px`;
    thumb.style.height = `${on.offsetHeight}px`;
    thumb.style.transform = `translateX(${on.offsetLeft}px)`;
    thumb.style.opacity = '1';
    if (!el.hasAttribute('data-ready')) requestAnimationFrame(() => el.setAttribute('data-ready', ''));
  };
  useLayoutEffect(place, [cityOnly, short]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      // The long labels stay laid out (absolutely, hidden) in short mode, so
      // they can always be measured against their half.
      const tooWide = [...el.querySelectorAll('.scope-toggle__opt')].some(opt => {
        const long = opt.querySelector('.scope-toggle__long');
        const cs = getComputedStyle(opt);
        const room = opt.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        return long.offsetWidth > room + 0.5;
      });
      setShort(tooWide);
    };
    fit();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { fit(); place(); }) : null;
    ro?.observe(el);
    document.fonts?.ready.then(() => { fit(); place(); });
    return () => ro?.disconnect();
  }, [t]); // eslint-disable-line react-hooks/exhaustive-deps

  const option = (city, key) => (
    <button
      type="button"
      className={`filter-btn scope-toggle__opt${cityOnly === city ? ' scope-toggle__opt--on' : ''}`}
      aria-pressed={cityOnly === city}
      onClick={() => { if (cityOnly !== city) onChange(city); }}
    >
      <span className="scope-toggle__long">{t(key)}</span>
      <span className="scope-toggle__short">{t(`${key}Short`)}</span>
    </button>
  );

  return (
    <div
      ref={ref}
      role="group"
      className={`scope-toggle${short ? ' scope-toggle--short' : ''}${className ? ` ${className}` : ''}`}
      style={style}
    >
      <span ref={thumbRef} className="scope-toggle__thumb" aria-hidden="true" />
      {option(true, 'explore.scopeCity')}
      {option(false, 'explore.scopeAll')}
    </div>
  );
}

// Cards beyond Prague's administrative boundary carry the `outside` label.
export const isInCity = l => !l.labels?.includes('outside');
