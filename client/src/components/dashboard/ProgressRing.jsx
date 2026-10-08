export default function ProgressRing({ percent, size = 160 }) {
  const r         = (size - 20) / 2;
  const circ      = 2 * Math.PI * r;
  const dash      = (percent / 100) * circ;
  const cx        = size / 2;

  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
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
        style={{ filter: 'drop-shadow(0 0 6px #FFD700aa)', transition: 'stroke-dasharray 0.6s ease' }}
      />
      {/* text */}
      <text x={cx} y={cx - 10} textAnchor="middle" fill="var(--gold)"
        fontFamily="var(--ui-font-text)" fontWeight="800" fontSize={Math.round(size * 0.2)}>
        {percent}%
      </text>
      <text x={cx} y={cx + 16} textAnchor="middle" fill="var(--text-muted)"
        fontFamily="var(--ui-font)" fontSize={Math.round(size * 0.1)}>
        UNLOCKED
      </text>
    </svg>
  );
}
