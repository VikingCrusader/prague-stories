import { useEffect, useRef, useState } from 'react';
import { useT, useLang, useConvert } from '../../context/LanguageContext';
import TreasureHuntPanel from '../draw/TreasureHuntPanel';
import { BOARD } from '../../utils/guideBoard';
import { unlockAudio, playClueSound, playMissSound, playHuntWinSound } from '../../utils/sound';
import {
  HUNT_MULTIPLIERS, HUNT_CLUE_ORDER, HUNT_FREE_CLUE_AT, HUNT_TREND_MAX_M,
  HIDDEN_DRAW_HIT_M, HUNT_MISS_STEPS, HUNT_CLUE_STEPS, huntReading,
} from '../../utils/huntRules';

// A practice treasure: an epic Baroque card in Malá Strana. Its clues are
// made up for the demo; the rules (order, free distances, multipliers) are the
// real ones from utils/huntRules.js.
const TREASURE = { side: 'castle', district: 'Praha 1', quarter: 'Malá Strana', label: 'baroque', rarity: 'epic', xp: 50 };
const MAX_M = 6000;
const START_M = 5200;
// The slot keys the panel's texts use: the fourth slot is "the rarity or a
// label" until drawn (here it always draws the label), the fifth the rarity.
const CLUE_KEY = { side: 'side', district: 'district', quarter: 'quarter', close: 'label', other: 'rarity' };
const NEXT_KEY = { side: 'side', district: 'district', quarter: 'quarter', close: 'rarityOrLabel', other: 'rarity' };

// The Guide's hunt demo: a slider walks you toward a practice treasure, and
// the real TreasureHuntPanel shows what a hunt would: the distance, warmer or
// colder, the clues walking brings, buying the next one early, and misses.
export default function HuntDemo() {
  const t = useT();
  const { lang } = useLang();
  const convert = useConvert();
  const b = (BOARD[lang] || BOARD.en).hunt;
  const [d, setD] = useState(START_M);
  const [had, setHad] = useState({});         // clue -> 'free' | 'bought'
  const [step, setStep] = useState(0);
  const [misses, setMisses] = useState([]);
  const [trend, setTrend] = useState(null);
  const [flash, setFlash] = useState(null);
  const [found, setFound] = useState(false);
  const checkpoint = useRef(START_M);

  // Walking brings each clue free at its distance, and outside 500 m a verdict
  // every ~100 m.
  useEffect(() => {
    setHad(h => {
      const next = { ...h };
      HUNT_FREE_CLUE_AT.forEach((at, i) => { if (d <= at && !next[HUNT_CLUE_ORDER[i]]) next[HUNT_CLUE_ORDER[i]] = 'free'; });
      return next;
    });
    if (d <= HUNT_TREND_MAX_M) { setTrend(null); return; }
    const moved = checkpoint.current - d;
    if (Math.abs(moved) >= 100) { setTrend(moved > 0 ? 'closer' : 'farther'); checkpoint.current = d; }
  }, [d]);

  const mult = (s) => HUNT_MULTIPLIERS[Math.min(s, HUNT_MULTIPLIERS.length - 1)];
  const nextIdx = HUNT_CLUE_ORDER.findIndex(k => !had[k]);
  const freeIdx = HUNT_FREE_CLUE_AT.findIndex((_, i) => !had[HUNT_CLUE_ORDER[i]]);
  const hunt = {
    presses: misses.length,
    multiplier: mult(step),
    clueMultiplier: mult(step + HUNT_CLUE_STEPS),
    missMultiplier: mult(step + HUNT_MISS_STEPS),
    xpReward: had.other ? TREASURE.xp : null,
    rarity: had.other ? TREASURE.rarity : null,
    riverSide: had.side ? TREASURE.side : null,
    labels: had.close ? [TREASURE.label] : [],
    district: had.district ? TREASURE.district : null,
    quarter: had.quarter ? TREASURE.quarter : undefined,
    freeClues: HUNT_CLUE_ORDER.filter(k => had[k] === 'free').map(k => ({ key: CLUE_KEY[k], within: HUNT_FREE_CLUE_AT[HUNT_CLUE_ORDER.indexOf(k)] })),
    nextFree: freeIdx >= 0 ? { what: NEXT_KEY[HUNT_CLUE_ORDER[freeIdx]] } : null,
    nextClue: !found && nextIdx >= 0 ? NEXT_KEY[HUNT_CLUE_ORDER[nextIdx]] : null,
    snapshots: [],
    misses,
    reading: huntReading(d),
    trend,
  };

  const onGuess = () => {
    unlockAudio();
    if (d < HIDDEN_DRAW_HIT_M) {
      playHuntWinSound();
      setFound(true);
      setFlash({ type: 'win', text: t('draw.huntFound', { n: misses.length + 1, xp: TREASURE.xp * mult(step) }) });
    } else {
      setMisses(m => [...m, { direction: 'SW' }]);
      setStep(s => s + HUNT_MISS_STEPS);
      playMissSound();
      setFlash({ type: 'miss', text: t('draw.huntMissFlash') });
    }
  };
  const onClue = () => {
    const key = HUNT_CLUE_ORDER[nextIdx];
    if (!key) return;
    unlockAudio();
    playClueSound();
    setHad(h => ({ ...h, [key]: 'bought' }));
    setStep(s => s + HUNT_CLUE_STEPS);
    setFlash({ type: 'miss', text: t('draw.huntClueFlash', { clue: t(`draw.clue.${CLUE_KEY[key]}`) }) });
  };
  const reset = () => {
    setD(START_M); setHad({}); setStep(0); setMisses([]); setTrend(null); setFlash(null); setFound(false);
    checkpoint.current = START_M;
  };

  return (
    <div className="guide-hunt">
      <label className="guide-hunt__slider">
        <span>{convert(b.slider)}: <strong>{d >= 1000 ? `${(d / 1000).toFixed(2)} km` : `${d} m`}</strong></span>
        <input
          type="range" min={0} max={MAX_M} step={25}
          value={MAX_M - d}
          disabled={found}
          onChange={e => setD(MAX_M - Number(e.target.value))}
        />
      </label>
      <div className="guide-hunt__panel">
        <TreasureHuntPanel hunt={hunt} onGuess={onGuess} onClue={onClue} busy={found} flash={flash} />
      </div>
      <div className="guide-hunt__foot">
        <p className="guide-demo__hint">{convert(b.note)}</p>
        <button type="button" className="px-btn" onClick={reset}>{convert(b.again)}</button>
      </div>
    </div>
  );
}
