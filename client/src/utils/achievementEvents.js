// Newly unlocked achievements travel from the API layer (services/api.js,
// which spots `newAchievements` in any response) to <AchievementUnlocked>,
// mounted once in App, which shows them one at a time with a chime.
export const ACHIEVEMENTS_UNLOCKED_EVENT = 'achievements-unlocked';

// The same for card packs (`newPacks`), to <PackUnlocked>. It fills the screen for
// this long, so achievements from the same response wait for it.
export const PACKS_UNLOCKED_EVENT = 'packs-unlocked';
export const PACK_SHOW_MS = 5000;
export function announcePacks(list, delay = 0) {
  if (!Array.isArray(list) || list.length === 0) return;
  try {
    window.dispatchEvent(new CustomEvent(PACKS_UNLOCKED_EVENT, { detail: { list, delay } }));
  } catch (_) {}
}

// XP paid by achievements unlocked outside a check-in (app load, the
// achievements page): { levelBefore, levelInfo, totalXP }. AuthContext
// listens, updates the user and opens the level-up modal if needed.
export const ACHIEVEMENT_PROGRESS_EVENT = 'achievement-progress';
export function announceAchievementProgress(progress) {
  if (!progress?.levelInfo) return;
  try {
    window.dispatchEvent(new CustomEvent(ACHIEVEMENT_PROGRESS_EVENT, { detail: progress }));
  } catch (_) {}
}

// `delay` lets the sound already playing finish first (the card unlock
// arpeggio after a check-in, the treasure-hunt fanfare after a find).
export function announceAchievements(list, delay = 0) {
  if (!Array.isArray(list) || list.length === 0) return;
  try {
    window.dispatchEvent(new CustomEvent(ACHIEVEMENTS_UNLOCKED_EVENT, { detail: { list, delay } }));
  } catch (_) {}
}
