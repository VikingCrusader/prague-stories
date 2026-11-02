// Newly unlocked achievements travel from the API layer (services/api.js,
// which spots `newAchievements` in any response) to <AchievementUnlocked>,
// mounted once in App, which shows them one at a time with a chime.
export const ACHIEVEMENTS_UNLOCKED_EVENT = 'achievements-unlocked';

// `delay` lets the sound already playing finish first (the card unlock
// arpeggio after a check-in, the treasure-hunt fanfare after a find).
export function announceAchievements(list, delay = 0) {
  if (!Array.isArray(list) || list.length === 0) return;
  try {
    window.dispatchEvent(new CustomEvent(ACHIEVEMENTS_UNLOCKED_EVENT, { detail: { list, delay } }));
  } catch (_) {}
}
