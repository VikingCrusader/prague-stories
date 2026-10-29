let _ctx = null;
function ctx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  return _ctx;
}

const EPIC_TIERS = new Set(['epic', 'mythic', 'legend', 'expedition']);

function playSimpleArpeggio(ac) {
  // C5 E5 G5 C6 — major arpeggio
  [523, 659, 784, 1047].forEach((freq, i) => {
    const osc = ac.createOscillator(), gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = 'square';
    osc.frequency.value = freq;
    const t = ac.currentTime + i * 0.1;
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.start(t); osc.stop(t + 0.2);
  });
}

function playEpicFanfare(ac) {
  // Ascending run: G4 C5 E5 G5 C6 E6, then full C major chord
  const run = [392, 523, 659, 784, 1047, 1319];
  run.forEach((freq, i) => {
    const osc = ac.createOscillator(), gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = i < 4 ? 'square' : 'triangle';
    osc.frequency.value = freq;
    const t   = ac.currentTime + i * 0.13;
    const dur = i >= 4 ? 0.5 : 0.2;
    gain.gain.setValueAtTime(0.13, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.start(t); osc.stop(t + dur + 0.05);
  });
  // Final held chord C6 + E6 + G6 (triangle for shimmer)
  const chordStart = ac.currentTime + 5 * 0.13;
  [1047, 1319, 1568].forEach((freq, i) => {
    const osc = ac.createOscillator(), gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const t = chordStart + i * 0.025;
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    osc.start(t); osc.stop(t + 0.75);
  });
}

export function playUnlockSound(rarity = 'common') {
  const epic = EPIC_TIERS.has(rarity);
  navigator.vibrate?.(epic ? [80, 40, 80, 40, 200] : [60, 30, 120]);
  try {
    if (epic) playEpicFanfare(ctx());
    else      playSimpleArpeggio(ctx());
  } catch (_) {}
}

function playLevelUpFanfare(ac) {
  // Two rising runs a fourth apart, then a bright sustained major-add-octave chord
  const runs = [
    [523, 659, 784, 1047],  // C5 E5 G5 C6
    [698, 880, 1047, 1397], // F5 A5 C6 F6
  ];
  let i = 0;
  for (const run of runs) {
    for (const freq of run) {
      const osc = ac.createOscillator(), gain = ac.createGain();
      osc.connect(gain); gain.connect(ac.destination);
      osc.type = 'square';
      osc.frequency.value = freq;
      const t = ac.currentTime + i * 0.11;
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t); osc.stop(t + 0.22);
      i++;
    }
  }
  const chordStart = ac.currentTime + i * 0.11;
  [1047, 1319, 1568, 2093].forEach((freq, ci) => {
    const osc = ac.createOscillator(), gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const t = chordStart + ci * 0.02;
    gain.gain.setValueAtTime(0.11, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    osc.start(t); osc.stop(t + 0.95);
  });
}

export function playLevelUpSound() {
  navigator.vibrate?.([90, 50, 90, 50, 90, 50, 260]);
  try { playLevelUpFanfare(ctx()); } catch (_) {}
}

// Starts (or resumes) the AudioContext from inside a tap. A sound played
// after an await (a request, a GPS fix) is no longer "in" the tap, and iOS
// keeps a context created then silent; call this first in the tap handler.
export function unlockAudio() {
  try { ctx().resume?.(); } catch (_) {}
}

// ── Treasure hunt ────────────────────────────────────────────────────────
// Card sounds are short bursts of filtered noise rather than notes.
function noiseBurst(ac, t, dur, { freq = 3000, q = 1.2, gain = 0.25, sweepTo } = {}) {
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buf = ac.createBuffer(1, len, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  const filter = ac.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = q;
  filter.frequency.setValueAtTime(freq, t);
  if (sweepTo) filter.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
  const g = ac.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(filter); filter.connect(g); g.connect(ac.destination);
  src.start(t); src.stop(t + dur + 0.02);
}

function tone(ac, freq, t, dur, { type = 'square', gain = 0.12, slideTo } = {}) {
  const osc = ac.createOscillator(), g = ac.createGain();
  osc.connect(g); g.connect(ac.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.start(t); osc.stop(t + dur + 0.02);
}

// Starting a hunt, timed to DeckShuffle's 2.3 s animation (deck-* keyframes
// in pixelart.css): two riffles as the halves come back together (about
// 27–38% and 55–66%), a swish as the top card is drawn (66–76%), and a soft
// tap as it settles.
export function playShuffleSound() {
  try {
    const ac = ctx();
    const t0 = ac.currentTime;
    for (const start of [0.62, 1.27]) {
      for (let i = 0; i < 14; i++) {
        noiseBurst(ac, t0 + start + i * 0.018 + Math.random() * 0.006, 0.025, { freq: 2600 + Math.random() * 1600, gain: 0.18 });
      }
    }
    noiseBurst(ac, t0 + 1.52, 0.22, { freq: 1200, sweepTo: 4500, q: 0.8, gain: 0.2 });
    noiseBurst(ac, t0 + 2.2, 0.06, { freq: 700, q: 1, gain: 0.3 });
  } catch (_) {}
}

// Taking a clue: a bright two-note chime.
export function playClueSound() {
  try {
    const ac = ctx();
    const t = ac.currentTime;
    tone(ac, 1319, t, 0.18, { type: 'triangle', gain: 0.14 });
    tone(ac, 1976, t + 0.09, 0.32, { type: 'triangle', gain: 0.12 });
  } catch (_) {}
}

// A press that missed: two low notes sliding down.
export function playMissSound() {
  navigator.vibrate?.([120, 60, 120]);
  try {
    const ac = ctx();
    const t = ac.currentTime;
    tone(ac, 311, t, 0.18, { gain: 0.1 });
    tone(ac, 233, t + 0.2, 0.38, { gain: 0.1, slideTo: 175 });
  } catch (_) {}
}

// The treasure found: a short fanfare (three quick notes, a held one, then
// a rising run into a chord), longer and brassier than the level-up sound.
// HUNT_WIN_SOUND_MS is how long it lasts, so a level-up fanfare can wait.
export const HUNT_WIN_SOUND_MS = 2300;
export function playHuntWinSound() {
  navigator.vibrate?.([80, 40, 80, 40, 80, 40, 300]);
  try {
    const ac = ctx();
    const t = ac.currentTime;
    [0, 0.12, 0.24].forEach(d => tone(ac, 523, t + d, 0.1, { gain: 0.13 }));
    tone(ac, 784, t + 0.36, 0.42, { gain: 0.14 });
    [659, 784, 880, 1047].forEach((f, i) => tone(ac, f, t + 0.82 + i * 0.09, 0.14, { gain: 0.12 }));
    [1047, 1319, 1568, 2093].forEach((f, i) => tone(ac, f, t + 1.2 + i * 0.02, 1.0, { type: 'triangle', gain: 0.09 }));
  } catch (_) {}
}
