import { useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import { getLocName } from '../../utils/locName';
import PackDetail from './PackDetail';

// The last thing in a card's detail: the packs it belongs to. `fromPack`: the pack
// this card was opened from, whose button leads back to it (`onBack`) instead of
// opening a second copy on top.
export default function PackLinks({ packs, fromPack = null, onBack }) {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const [open, setOpen] = useState(null);
  if (!packs?.length) return null;
  return (
    <div className="detail-packs">
      <span className="detail-packs__label">{convert(t('pack.partOf'))}</span>
      {packs.map(p => (
        <button
          type="button"
          key={p.slug}
          className="detail-packs__pack"
          style={{ '--foil': p.foil }}
          onClick={() => (p.slug === fromPack ? onBack?.() : setOpen(p.slug))}
        >
          {convert(getLocName(p, lang))}
        </button>
      ))}
      {open && <PackDetail slug={open} onClose={() => setOpen(null)} />}
    </div>
  );
}
