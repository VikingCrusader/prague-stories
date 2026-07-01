let _ctx = null;
function ctx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
  return _ctx;
}

const EPIC_TIERS = new Set(['epic', 'mythic', 'legend']);

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
