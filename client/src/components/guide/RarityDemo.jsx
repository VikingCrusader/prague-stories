import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useLang, useConvert } from '../../context/LanguageContext';
import LocationCard from '../locations/LocationCard';
import { RARITY_VAR, RARITY_LABEL, RARITY_ICON, ALL_RARITIES } from '../../utils/rarity';
import { RARITY_BLURB } from '../../utils/rarityBlurbs';
import { BOARD } from '../../utils/guideBoard';
import LocationDetail from '../locations/LocationDetail';
import { useCardDistance } from './useCardDistance';

// The Guide's rarity demo: one real card of each rank in a row; the picked one
// stands large beside its description, and can be switched between locked and
// collected, which plays the real unlock flip. Collected, it can be picked up
// (double-click) into the showcase like any card.
export default function RarityDemo({ samples }) {
  const { lang } = useLang();
  const convert = useConvert();
  const b = (BOARD[lang] || BOARD.en).rarity;
  const ranks = ALL_RARITIES.filter(r => samples?.[r]);
  const [picked, setPicked] = useState(() => (ranks.includes('legend') ? 'legend' : ranks[0]));
  const [collected, setCollected] = useState(true);
  const [detail, setDetail] = useState(null);
  const distanceTo = useCardDistance();
  if (!ranks.length) return <p className="guide-body">{convert(b.noCards)}</p>;
  const card = samples[picked];

  return (
    <div className="guide-rarity">
      <p className="guide-demo__hint">{convert(b.pick)}</p>
      <div className="guide-rarity__row">
        {ranks.map(r => (
          <div key={r} className={`guide-card guide-rarity__pick${r === picked ? ' guide-rarity__pick--on' : ''}`}>
            <LocationCard location={{ ...samples[r], unlocked: true }} distance={distanceTo(samples[r])} holdable={false} onClick={() => setPicked(r)} />
          </div>
        ))}
      </div>
      <div className="guide-rarity__stage">
        <div className="guide-card guide-rarity__big">
          <LocationCard key={picked} location={{ ...card, unlocked: collected }} distance={distanceTo(card)} holdable onClick={() => setDetail(card)} />
        </div>
        <div className="guide-rarity__about">
          <h4 className="guide-rarity__name" style={{ color: RARITY_VAR[picked] }}>
            {RARITY_ICON[picked]} {convert(RARITY_LABEL[lang]?.[picked] ?? RARITY_LABEL.en[picked])}
          </h4>
          <p className="guide-body">{convert(RARITY_BLURB[lang]?.[picked] ?? RARITY_BLURB.en[picked])}</p>
          <div className="guide-rarity__toggle" role="group">
            <button type="button" className={`filter-btn${!collected ? ' filter-btn--active' : ''}`} aria-pressed={!collected} onClick={() => setCollected(false)}>
              {convert(b.locked)}
            </button>
            <button type="button" className={`filter-btn${collected ? ' filter-btn--active' : ''}`} aria-pressed={collected} onClick={() => setCollected(true)}>
              {convert(b.collected)}
            </button>
          </div>
          <p className="guide-demo__hint">{convert(collected ? b.hold : b.open)}</p>
        </div>
      </div>
      {detail && <CardDetail card={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}

// A card's real detail window, over the Guide's window (in a portal, so the
// window's clipping and its click handling stay out of it).
export function CardDetail({ card, onClose }) {
  return createPortal(
    <div className="guide-detail" onClick={e => e.stopPropagation()}>
      <LocationDetail slug={card.slug} preview={card} onClose={onClose} />
    </div>,
    document.body,
  );
}

// The Showing Off tile: two collected cards side by side (user's pick,
// 2026-11-13), each to be picked up into the showcase or opened.
export function ShowcaseDemo({ cards }) {
  const { lang } = useLang();
  const convert = useConvert();
  const b = (BOARD[lang] || BOARD.en).rarity;
  const [detail, setDetail] = useState(null);
  const distanceTo = useCardDistance();
  const shown = (cards || []).filter(Boolean);
  if (!shown.length) return <p className="guide-body">{convert(b.noCards)}</p>;
  return (
    <div className="guide-showcase-demo">
      <div className="guide-showcase-demo__pair">
        {shown.map(card => (
          <div key={card.slug} className="guide-card guide-showcase-demo__card">
            <LocationCard location={{ ...card, unlocked: true }} distance={distanceTo(card)} holdable onClick={() => setDetail(card)} />
          </div>
        ))}
      </div>
      <p className="guide-demo__hint">{convert(b.holdPair)}</p>
      {detail && <CardDetail card={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
