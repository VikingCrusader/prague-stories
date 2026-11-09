import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { locationAPI } from '../../services/api';
import { LABEL_DEFINITIONS } from '../../utils/pixelArtMap';
import { RARITY_ICON, RARITY_LABEL, RARITY_VAR } from '../../utils/rarity';
import { LABEL_BLURB, RARITY_QUIP } from '../../utils/filterBlurbs';

// A short note on a label or rarity, opened from a card's detail like the area
// pills beside it: its one line, the player's progress and a way to its cards on
// Explore (2026-11-09, user's call).
function TagInfo({ kind, value, onClose }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const { user } = useAuth();
  const [locations, setLocations] = useState(null);
  useEffect(() => {
    let live = true;
    locationAPI.getAll().then(res => { if (live) setLocations(res.data); }).catch(() => {});
    return () => { live = false; };
  }, []);
  useEffect(() => {
    // Capture phase, stopped there, so Escape closes only this and not the card below.
    const onKey = e => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      onClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  const progress = useMemo(() => {
    if (!locations) return null;
    const cards = locations.filter(l => (kind === 'label' ? l.labels?.includes(value) : (l.rarity ?? 'common') === value));
    return { total: cards.length, collected: cards.filter(l => l.unlocked).length };
  }, [locations, kind, value]);

  const isLabel = kind === 'label';
  const definition = LABEL_DEFINITIONS[value];
  const name = isLabel
    ? `${definition?.emoji ?? ''} ${convert(definition?.[lang] || definition?.en || value)}`.trim()
    : `${RARITY_ICON[value] ?? ''} ${convert(RARITY_LABEL[lang]?.[value] ?? RARITY_LABEL.en[value] ?? value)}`.trim();
  const blurb = (isLabel ? LABEL_BLURB : RARITY_QUIP)[value];

  return createPortal(
    <div className="px-overlay tag-info-overlay" onClick={e => { e.stopPropagation(); onClose(); }}>
      <div className="px-modal tag-info" onClick={e => e.stopPropagation()} role="dialog" aria-label={name}>
        <button type="button" className="px-modal__close" onClick={onClose} aria-label={t('areaGuide.close')}>✕</button>
        <h2 className="px-title tag-info__name" style={isLabel ? undefined : { color: RARITY_VAR[value] }}>{name}</h2>
        {progress && (
          <p className="tag-info__progress">
            {user ? t('tag.collected', { collected: progress.collected, total: progress.total }) : t('tag.total', { total: progress.total })}
          </p>
        )}
        {blurb && <p className="tag-info__blurb">{convert(blurb[lang] || blurb.en)}</p>}
        <Link className="px-btn px-btn--gold tag-info__go" to="/explore" state={{ [kind]: value, showAll: true }} onClick={onClose}>
          {t('tag.seeOnExplore')}
        </Link>
      </div>
    </div>,
    document.body,
  );
}

// A label or rarity in a card's detail, as a button that opens its note.
export default function TagButton({ kind, value, className, style, title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={`${className} tag-button`} style={style} title={title} onClick={() => setOpen(true)}>
        {children}
      </button>
      {open && <TagInfo kind={kind} value={value} onClose={() => setOpen(false)} />}
    </>
  );
}
