import { useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import PackDetail from './PackDetail';

// In a card's detail, between its area pills and its story: the packs it belongs to. `fromPack`: the pack
// this card was opened from, whose button leads back to it (`onBack`) instead of
// opening a second copy on top.
// `onOpenPack(slug)` (the Map): the pack opens where the page wants it (the
// right column) instead of in a pop-up.
export default function PackLinks({ packs, fromPack = null, onBack, onOpenPack = null, style, artOnly = false }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [open, setOpen] = useState(null);
  if (!packs?.length) return null;
  return (
    <div className="detail-packs" style={style}>
      <span className="detail-packs__label">{convert(t('pack.partOf'))}</span>
      {packs.map(p => (
        <button
          type="button"
          key={p.slug}
          className="detail-packs__pack"
          style={{ '--foil': p.foil }}
          onClick={() => (p.slug === fromPack ? onBack?.() : onOpenPack ? onOpenPack(p.slug) : setOpen(p.slug))}
        >
          {convert(getLocName(p, lang))}
        </button>
      ))}
      {open && <PackDetail slug={open} onClose={() => setOpen(null)} artOnly={artOnly} />}
    </div>
  );
}
