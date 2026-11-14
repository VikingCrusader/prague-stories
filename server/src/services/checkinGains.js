import { ACHIEVEMENTS, describeAchievement } from './gamification.js';
import { livePacks } from './packs.js';
import { PACK_UNLOCK_AT } from '../data/packs.js';

// What a check-in moved forward besides the XP (2026-11-14, user's call): the
// achievements whose progress went up without unlocking, and the packs the card
// belongs to that it didn't open or complete. Shown with the XP right after
// collecting (CheckInReward.jsx); what unlocked keeps its own announcement.
export const GAINS_SHOWN = 3;

export function achievementGains(before, after, unlockedIds) {
  const done = new Set(unlockedIds);
  const gains = [];
  for (const ach of ACHIEVEMENTS) {
    if (done.has(ach.id)) continue;
    let was, now;
    try {
      was = ach.progress(before);
      now = ach.progress(after);
    } catch (_) { continue; }
    const target = now?.target;
    if (!target || !(now.current > was.current) || was.current >= target) continue;
    const d = describeAchievement({ id: ach.id });
    gains.push({
      id: d.id, icon: d.icon, difficulty: d.difficulty,
      name: d.name, name_cz: d.name_cz, name_zh: d.name_zh,
      before: was.current, current: Math.min(now.current, target), target,
    });
  }
  // Closest to done first.
  gains.sort((a, b) => b.current / b.target - a.current / a.target || b.current - a.current);
  return { achievementGains: gains.slice(0, GAINS_SHOWN), moreAchievementGains: Math.max(0, gains.length - GAINS_SHOWN) };
}

export async function packGains(location, checkedSlugs, newPacks, records = []) {
  const announced = new Set(newPacks.map(p => p.slug));
  const have = new Set(checkedSlugs);
  const packs = await livePacks('slug');
  return packs
    .filter(p => !announced.has(p.slug) && p.docs.some(d => d.slug === location.slug))
    .map(p => {
      const total = p.docs.length;
      const record = records.find(r => r.slug === p.slug);
      return {
        slug: p.slug, name: p.name, localizedNames: p.localizedNames, foil: p.foil,
        collected: p.docs.filter(d => have.has(d.slug)).length,
        total,
        unlocked: !!record?.unlockedAt,
        unlockAt: Math.min(PACK_UNLOCK_AT, total),
      };
    });
}
