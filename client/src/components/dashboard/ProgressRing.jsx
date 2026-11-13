import { useCountUp } from '../../hooks/useCountUp';

// The ring fills up from 0 when it first shows and runs to a new value after
// that, its percentage counting along (2026-11-13).
export default function ProgressRing({ percent: target, size = 160, label = 'UNLOCKED' }) {
  const percent = useCountUp(target, { ms: 900, fromZero: true });
  const r         = (size - 20) / 2;
  const circ      = 2 * Math.PI * r;
  const dash      = (percent / 100) * circ;
  const cx        = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', flex: '0 0 auto' }}>
      {/* track */}
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--bg-input, #1a1f3a)" strokeWidth={12} />
      {/* progress */}
      <circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke="var(--gold)"
        strokeWidth={12}
        strokeLinecap="square"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={0}
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ filter: 'drop-shadow(0 0 6px #FFD700aa)' }}
      />
      {/* text */}
      <text x={cx} y={cx - 10} textAnchor="middle" fill="var(--gold)"
        fontFamily="var(--ui-font-text)" fontWeight="800" fontSize={Math.round(size * 0.2)}>
        {percent}%
      </text>
      <text x={cx} y={cx + 16} textAnchor="middle" fill="var(--text-muted)"
        fontFamily="var(--ui-font)" fontSize={Math.round(size * 0.1)}>
        {label}
      </text>
    </svg>
  );
}
