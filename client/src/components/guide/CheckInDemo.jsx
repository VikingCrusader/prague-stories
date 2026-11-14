import { useRef, useState } from 'react';
import { useLang, useConvert } from '../../context/LanguageContext';
import LocationCard from '../locations/LocationCard';
import { BOARD, fill } from '../../utils/guideBoard';
import { NEARBY_M, ALERT_M } from '../../utils/huntRules';
import { useCountUp } from '../../hooks/useCountUp';
import { getLocName } from '../../utils/locName';

const SIZE = 360;           // the little map, in SVG units
const M_PER_UNIT = 2;       // so its edge is 360 m from the card
const C = SIZE / 2;
const START = { x: C - 120, y: C - 105 }; // about 320 m out

// The Guide's check-in demo: drag "you" toward a card on a toy map. Within
// 100 m the card shows its name and its lock shakes (as on Explore), within
// 50 m the alert comes, and from 100 m the Collect button works and plays the
// real unlock flip. Nothing is sent anywhere.
export default function CheckInDemo({ card }) {
  const { lang } = useLang();
  const convert = useConvert();
  const b = (BOARD[lang] || BOARD.en).checkin;
  const svgRef = useRef(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(START);
  const [collected, setCollected] = useState(false);
  const xp = useCountUp(collected ? card?.xpReward ?? 0 : 0);

  const metres = Math.round(Math.hypot(pos.x - C, pos.y - C) * M_PER_UNIT);
  const near = metres <= NEARBY_M;
  const alert = metres <= ALERT_M && !collected;

  const moveTo = (e) => {
    const r = svgRef.current.getBoundingClientRect();
    const k = SIZE / r.width;
    const clamp = v => Math.max(8, Math.min(SIZE - 8, v));
    setPos({ x: clamp((e.clientX - r.left) * k), y: clamp((e.clientY - r.top) * k) });
  };
  const reset = () => { setCollected(false); setPos(START); };

  const status = collected ? fill(b.done, { xp }) : alert ? b.alert : near ? b.near : b.far;

  return (
    <div className="guide-checkin">
      <p className="guide-demo__hint">{convert(b.drag)}</p>
      <div className="guide-checkin__stage">
        <svg
          ref={svgRef}
          className="guide-checkin__map"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          onPointerDown={e => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); moveTo(e); }}
          onPointerMove={e => { if (dragging.current) moveTo(e); }}
          onPointerUp={() => { dragging.current = false; }}
          onPointerCancel={() => { dragging.current = false; }}
        >
          <rect width={SIZE} height={SIZE} className="guide-checkin__ground" />
          {/* a few streets and the river, for the look of a map */}
          <path className="guide-checkin__river" d="M -10 300 C 90 250, 120 330, 220 290 S 330 230, 380 260" />
          <path className="guide-checkin__street" d="M 0 120 L 360 150 M 60 0 L 110 360 M 250 0 L 230 360 M 0 230 L 360 210" />
          <circle cx={C} cy={C} r={NEARBY_M / M_PER_UNIT} className={`guide-checkin__ring${near ? ' guide-checkin__ring--on' : ''}`} />
          <circle cx={C} cy={C} r={ALERT_M / M_PER_UNIT} className={`guide-checkin__ring guide-checkin__ring--alert${metres <= ALERT_M ? ' guide-checkin__ring--on' : ''}`} />
          <text x={C} y={C - NEARBY_M / M_PER_UNIT - 6} textAnchor="middle" className="guide-checkin__ring-label">{NEARBY_M} m</text>
          <text x={C} y={C - ALERT_M / M_PER_UNIT - 5} textAnchor="middle" className="guide-checkin__ring-label">{ALERT_M} m</text>
          <rect x={C - 7} y={C - 7} width={14} height={14} className={`guide-checkin__target${collected ? ' guide-checkin__target--got' : ''}`} />
          <line x1={pos.x} y1={pos.y} x2={C} y2={C} className="guide-checkin__line" />
          <circle cx={pos.x} cy={pos.y} r={9} className="guide-checkin__you" />
          <text x={pos.x} y={pos.y - 14} textAnchor="middle" className="guide-checkin__you-label">{convert(b.you)}</text>
        </svg>

        <div className="guide-checkin__side">
          {alert && (
            <div className="guide-checkin__alert" role="status">
              <img src="/brand/app-icon.png" alt="" width={32} height={32} />
              <span><strong>Prague Stories</strong><br />📍 {card && convert(getLocName(card, lang))}</span>
            </div>
          )}
          {card && (
            <div className={`guide-card guide-checkin__card${near && !collected ? ' guide-checkin__card--tap' : ''}`}>
              <LocationCard location={{ ...card, unlocked: collected }} distance={metres} nearby={near} holdable={false} onClick={() => { if (near && !collected) setCollected(true); }} />
            </div>
          )}
          <p className="guide-checkin__distance">{fill(convert(b.away), { d: metres })}</p>
          <p className="guide-body guide-checkin__status">{convert(status)}</p>
          {collected ? (
            <button type="button" className="px-btn" onClick={reset}>{convert(b.again)}</button>
          ) : (
            <button type="button" className="px-btn px-btn--gold" disabled={!near} onClick={() => setCollected(true)}>{convert(b.collect)}</button>
          )}
        </div>
      </div>
    </div>
  );
}
