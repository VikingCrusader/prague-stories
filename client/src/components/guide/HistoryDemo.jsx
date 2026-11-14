import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang, useConvert } from '../../context/LanguageContext';
import { HISTORY_ERA_LINES } from '../../utils/historyEraLines';
import { BOARD } from '../../utils/guideBoard';

// The Guide's History demo (2026-11-14, user's design): every era as a row of
// a table, number, title and years; a click shows its one plain line (what
// the era tells: the Hussite Wars, the Thirty Years' War...). Eras not yet
// written say so. Static text (utils/historyEraLines.js), nothing to fetch.
export default function HistoryDemo() {
  const { lang } = useLang();
  const convert = useConvert();
  const b = (BOARD[lang] || BOARD.en).history;
  const [open, setOpen] = useState(null);
  const pick = f => f[lang] ?? f.en;

  return (
    <div className="guide-history">
      <p className="guide-demo__hint">{convert(b.pick)}</p>
      <ol className="guide-history__list">
        {HISTORY_ERA_LINES.map((era, i) => {
          const on = open === era.key;
          return (
            <li key={era.key} className={`guide-history__row${on ? ' is-open' : ''}`}>
              <button type="button" className="guide-history__head" aria-expanded={on} onClick={() => setOpen(on ? null : era.key)}>
                <span className="guide-history__num">{i + 1}</span>
                <span className="guide-history__name">{convert(pick(era.title))}</span>
                <span className="guide-history__years">{convert(pick(era.years))}</span>
              </button>
              {on && <p className="guide-history__line">{convert(pick(era.line))}</p>}
            </li>
          );
        })}
      </ol>
      <Link to="/history" className="px-btn px-btn--gold guide-history__read">{convert(b.read)} →</Link>
    </div>
  );
}
