export default function ProgressRing({ percent, size = 160 }) {
  const r         = (size - 20) / 2;
  const circ      = 2 * Math.PI * r;
  const dash      = (percent / 100) * circ;
  const cx        = size / 2;

  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      {/* track */}
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#1a1f3a" strokeWidth={12} />
      {/* progress */}
      <circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke="#FFD700"
        strokeWidth={12}
        strokeLinecap="square"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={0}
        transform={`rotate(-90 ${cx} ${cx})`}
        style={{ filter: 'drop-shadow(0 0 6px #FFD700aa)', transition: 'stroke-dasharray 0.6s ease' }}
      />
      {/* text */}
      <text x={cx} y={cx - 10} textAnchor="middle" fill="#FFD700"
        fontFamily="'Press Start 2P', monospace" fontSize={Math.round(size * 0.13)}>
        {percent}%
      </text>
      <text x={cx} y={cx + 16} textAnchor="middle" fill="#7a6e5f"
        fontFamily="'Press Start 2P', monospace" fontSize={Math.round(size * 0.065)}>
        UNLOCKED
      </text>
    </svg>
  );
}
