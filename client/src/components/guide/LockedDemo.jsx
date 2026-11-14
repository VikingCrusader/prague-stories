import { useState } from 'react';
import { useLang, useConvert } from '../../context/LanguageContext';
import LocationCard from '../locations/LocationCard';
import { BOARD } from '../../utils/guideBoard';
import { useCardDistance } from './useCardDistance';

// The card the Locked and Unlocked demo uses (user's pick, 2026-11-13).
export const LOCKED_SLUG = 'tyn-church';

// The Guide's Locked and Unlocked demo: Týn Church as a small detail view.
// Locked, it shows the first paragraph and a fade; collecting it plays the
// real unlock flip and lets the rest of the story and its bonus unfold.
// The story is a short version written for the Guide (utils/guideBoard.js),
// not the card's own text, so the real story stays for those who go there.
export default function LockedDemo({ card }) {
  const { lang } = useLang();
  const convert = useConvert();
  const b = (BOARD[lang] || BOARD.en).locked;
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(false);
  const distanceTo = useCardDistance();

  return (
    <div className="guide-locked">
      {card && (
        <div className="guide-card guide-locked__card">
          <LocationCard
            location={{ ...card, unlocked: open }}
            distance={distanceTo(card)}
            holdable={false}
            onClick={() => { if (!open) setNote(true); }}
          />
        </div>
      )}
      <div className="guide-locked__side">
        <div className={`guide-locked__story${open ? ' is-open' : ''}`}>
          <p className="guide-body">{convert(b.opening)}</p>
          {open ? (
            <>
              <p className="guide-body guide-locked__more" style={{ '--i': 0 }}>{convert(b.body)}</p>
              <p className="guide-body guide-locked__more guide-locked__bonus" style={{ '--i': 1 }}>{convert(b.bonus)}</p>
            </>
          ) : (
            <>
              <p className="guide-body guide-locked__fade" aria-hidden="true">{convert(b.body)}</p>
              <p className="guide-locked__wait">🔒 {convert(b.more)}</p>
            </>
          )}
        </div>
        {note && !open && <p className="guide-demo__hint guide-locked__note">{convert(b.lockNote)}</p>}
        {open ? (
          <button type="button" className="px-btn" onClick={() => { setOpen(false); setNote(false); }}>{convert(b.relock)}</button>
        ) : (
          <button type="button" className="px-btn px-btn--gold" onClick={() => setOpen(true)}>{convert(b.collect)}</button>
        )}
      </div>
    </div>
  );
}
