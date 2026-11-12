// The card animations switch (2026-11-12, user's call): the looping shimmers,
// glows and frames on the cards, and their entrances. Remembered on this device,
// on from the start. The state lives on <html> as data-card-motion="on|off", and
// pixelart.css turns the animations off from it. A card that is flipping (the
// unlock) keeps its flip, since that one animation ends the flip.
const KEY = 'cardMotion';

export function cardMotionOn() {
  try { return localStorage.getItem(KEY) !== 'off'; } catch { return true; }
}

export function applyCardMotion(on) {
  document.documentElement.dataset.cardMotion = on ? 'on' : 'off';
}

export function setCardMotion(on) {
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* only a convenience */ }
  applyCardMotion(on);
}

applyCardMotion(cardMotionOn());
