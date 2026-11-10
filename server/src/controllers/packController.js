import { PACK_UNLOCK_AT, PACK_UNLOCK_XP, packCompleteXp } from '../data/packs.js';
import { livePacks, collectedIds, packStatus } from '../services/packs.js';
import { storyTeaser } from './locationController.js';

const summary = (pack, status) => ({
  slug: pack.slug,
  name: pack.name,
  localizedNames: pack.localizedNames,
  foil: pack.foil,
  labels: pack.labels || [],
  districts: [...new Set(pack.docs.map(d => d.district).filter(Boolean))],
  quarters: [...new Set(pack.docs.map(d => d.quarter).filter(Boolean))],
  memberSlugs: pack.docs.map(d => d.slug),
  unlockAt: PACK_UNLOCK_AT,
  unlockXp: PACK_UNLOCK_XP,
  completeXp: packCompleteXp(status.total),
  ...status,
});

const recordOf = (user, slug) => user?.packs?.find(r => r.slug === slug);

export async function getPacks(req, res, next) {
  try {
    const [live, collected] = await Promise.all([livePacks(), collectedIds(req.user?._id)]);
    res.json(live.map(p => summary(p, packStatus(p, collected, recordOf(req.user, p.slug)))));
  } catch (err) {
    next(err);
  }
}

// Like a card's story, a pack's text stays with the server until it is unlocked.
export async function getPack(req, res, next) {
  try {
    const [live, collected] = await Promise.all([livePacks('-description'), collectedIds(req.user?._id)]);
    const pack = live.find(p => p.slug === req.params.slug);
    if (!pack) return res.status(404).json({ message: 'Pack not found' });
    const status = packStatus(pack, collected, recordOf(req.user, pack.slug));
    res.json({
      ...summary(pack, status),
      description: status.unlocked ? pack.description : storyTeaser(pack.description),
      storyLocked: !status.unlocked,
      members: pack.docs.map(d => ({ ...d, unlocked: collected.has(String(d._id)) })),
    });
  } catch (err) {
    next(err);
  }
}
