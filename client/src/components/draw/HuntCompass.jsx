import { useT } from '../../context/LanguageContext';

const ANGLE = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
const R = 40;

// Each miss's direction on one compass rose (2026-11-14): an arrow per miss,
// numbered, the newest in gold. Every arrow starts at a different spot (where
// that press was), so the rose only sums up the words in the list beside it;
// it adds nothing the list doesn't say.
export default function HuntCompass({ misses }) {
  const t = useT();
  if (!misses?.length) return null;
  const last = misses.length - 1;
  return (
    <svg className="hunt-compass" viewBox="-60 -60 120 120" role="img" aria-label={t('draw.compass')}>
      <circle r={R + 8} className="hunt-compass__ring" />
      {Object.entries(ANGLE).map(([d, a]) => (
        <line key={d} className="hunt-compass__tick" x1="0" y1={-(R + 8)} x2="0" y2={-(R + (d.length === 1 ? 2 : 5))} transform={`rotate(${a})`} />
      ))}
      <text className="hunt-compass__n" x="0" y={-(R + 12)} textAnchor="middle">N</text>
      {misses.map((m, i) => {
        const a = ANGLE[m.direction];
        if (a == null) return null;
        const rad = (a * Math.PI) / 180;
        const lx = Math.sin(rad) * (R - 6), ly = -Math.cos(rad) * (R - 6);
        return (
          <g key={i} className={`hunt-compass__arrow${i === last ? ' is-last' : ''}`}>
            <g transform={`rotate(${a})`}>
              <line x1="0" y1="0" x2="0" y2={-(R - 14)} />
              <path d={`M0,${-(R - 6)} L-6,${-(R - 17)} L6,${-(R - 17)} Z`} />
            </g>
            <text x={lx * 0.55 + (Math.cos(rad) * 9)} y={ly * 0.55 + (Math.sin(rad) * 9) + 4} textAnchor="middle">{i + 1}</text>
          </g>
        );
      })}
      <circle r="4" className="hunt-compass__hub" />
    </svg>
  );
}
