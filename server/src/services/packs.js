import CheckIn from '../models/CheckIn.js';
import Location from '../models/Location.js';
import User from '../models/User.js';
import { PACKS, PACK_UNLOCK_AT, PACK_UNLOCK_XP, packCompleteXp } from '../data/packs.js';
import { calculateLevel } from './gamification.js';

// Every pack with the cards that exist right now, in `docs` (members' order).
export async function livePacks(select = 'slug district quarter') {
  const docs = await Location.find({ slug: { $in: [...new Set(PACKS.flatMap(p => p.members))] } }, select).lean();
  const bySlug = new Map(docs.map(d => [d.slug, d]));
  return PACKS.map(p => ({ ...p, docs: p.members.map(s => bySlug.get(s)).filter(Boolean) }));
}

export async function collectedIds(userId) {
  if (!userId) return new Set();
  const checkins = await CheckIn.find({ user: userId }).select('location').lean();
  return new Set(checkins.map(c => String(c.location)));
}

// A pack smaller than the threshold (cards removed) unlocks with all of them.
const unlockNeeds = total => Math.min(PACK_UNLOCK_AT, total);

// What this player has of the pack. Once unlocked or completed it stays so,
// also if cards join the pack later: the progress then shows honestly as, say,
// 19/20, but nothing paid is taken back.
export function packStatus(pack, collected, record) {
  const total = pack.docs.length;
  const got = pack.docs.filter(d => collected.has(String(d._id))).length;
  return {
    total,
    collected: got,
    unlocked: !!record?.unlockedAt || (total > 0 && got >= unlockNeeds(total)),
    completed: !!record?.completedAt || (total > 0 && got === total),
  };
}

function packAwards(live, collected, records = []) {
  const awards = [];
  for (const pack of live) {
    const total = pack.docs.length;
    if (!total) continue;
    const owned = pack.docs.filter(d => collected.has(String(d._id)));
    const record = records.find(r => r.slug === pack.slug);
    const unlock = !record?.unlockedAt && owned.length >= unlockNeeds(total);
    const complete = !record?.completedAt && owned.length === total;
    if (!unlock && !complete) continue;
    awards.push({
      pack, owned, unlock, complete,
      xp: (unlock ? PACK_UNLOCK_XP : 0) + (complete ? packCompleteXp(total) : 0),
    });
  }
  return awards;
}

// For the announcement (PackUnlocked.jsx); several stages at once are one moment.
const describe = ({ pack, owned, complete, xp }) => ({
  slug: pack.slug,
  name: pack.name,
  localizedNames: pack.localizedNames,
  foil: pack.foil,
  stage: complete ? 'complete' : 'unlock',
  xp,
  collected: owned.length,
  total: pack.docs.length,
  cards: owned.slice(-3).map(d => d.slug),
});

// During a check-in: changes the user document, which the caller then saves.
export async function awardPacks(user) {
  const awards = packAwards(await livePacks(), await collectedIds(user._id), user.packs);
  const now = new Date();
  for (const { pack, unlock, complete, xp } of awards) {
    if (unlock) user.packs.push({ slug: pack.slug, unlockedAt: now, completedAt: complete ? now : null });
    else user.packs.find(r => r.slug === pack.slug).completedAt = now;
    user.totalXP += xp;
  }
  return awards.map(describe);
}

// On app load: settles what earlier check-ins earned (a new pack, or the first
// visit after packs arrived). Guarded updates, as in syncAchievements, so a
// repeated request can't pay twice.
export async function syncPacks(user) {
  const awards = packAwards(await livePacks(), await collectedIds(user._id), user.packs);
  const paid = [];
  let gained = 0;
  const now = new Date();
  for (const award of awards) {
    const { pack, unlock, complete } = award;
    let xp = 0;
    if (unlock) {
      const res = await User.updateOne(
        { _id: user._id, 'packs.slug': { $ne: pack.slug } },
        { $push: { packs: { slug: pack.slug, unlockedAt: now, completedAt: null } }, $inc: { totalXP: PACK_UNLOCK_XP } },
      );
      if (res.modifiedCount) xp += PACK_UNLOCK_XP;
    }
    if (complete) {
      const bonus = packCompleteXp(pack.docs.length);
      const res = await User.updateOne(
        { _id: user._id, packs: { $elemMatch: { slug: pack.slug, completedAt: null } } },
        { $set: { 'packs.$.completedAt': now }, $inc: { totalXP: bonus } },
      );
      if (res.modifiedCount) xp += bonus;
    }
    if (xp) {
      gained += xp;
      paid.push(describe({ ...award, xp }));
    }
  }
  let progress = null;
  if (gained) {
    const levelBefore = calculateLevel(user.totalXP || 0).level;
    const fresh = await User.findById(user._id, 'totalXP').lean();
    const levelInfo = calculateLevel(fresh.totalXP);
    await User.updateOne({ _id: user._id }, { $set: { explorerLevel: levelInfo.level } });
    user.totalXP = fresh.totalXP;
    user.explorerLevel = levelInfo.level;
    progress = { levelBefore, levelInfo, totalXP: fresh.totalXP };
  }
  return { newPacks: paid, progress };
}
