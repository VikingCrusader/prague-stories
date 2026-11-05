// Achievements and the History Timeline events they belong to, picked by hand:
// matching on shared places would tie every Old Town card to every Old Town set.
// A timeline event shows these as related achievements, and an achievement's
// detail links back to the event. A slug that doesn't exist is dropped.
export const ACHIEVEMENT_HISTORY_EVENTS = {
  mind_the_window: ['the-first-defenestration-1419', 'the-good-old-bohemian-way-1618'],
  chalice_be_with_you: ['the-rise-of-tabor-1419', 'lipany-1434', 'what-did-the-compacts-grant-1436'],
  charles_iv: ['the-great-year-1348', 'once-a-year-down-from-karlstejn-1356', 'the-great-bridge-1357', 'father-of-the-fatherland-1378'],
  after_white_mountain: ['two-hours-1620'],
  iron_and_golden_king: ['iron-and-golden-king-1266', 'battle-of-marchfeld-1278'],
  generalissimo: ['war-feeds-war-1625', 'the-stars-saw-it-coming-1630', 'the-night-at-eger-1634'],
  cabinet_of_curiosities: ['the-vegetable-emperor-1591'],
  aeiou: ['the-habsburgs-come-in-1526'],
  aula_regia: ['aula-regia-1292'],
  king_died_of_anger: ['the-king-who-was-frightened-to-death-1419'],
};
