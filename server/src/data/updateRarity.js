import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';
import { SLUG_RARITY, RARITY_XP } from './rarityMap.js';

async function run() {
  await connectDB();
  const locs = await Location.find({}).select('slug rarity xpReward').lean();
  let updated = 0;

  for (const loc of locs) {
    const rarity  = SLUG_RARITY[loc.slug] ?? 'common';
    const xpReward = RARITY_XP[rarity];
    if (loc.rarity === rarity && loc.xpReward === xpReward) continue;
    await Location.updateOne({ _id: loc._id }, { $set: { rarity, xpReward } });
    console.log(`${loc.slug}: ${rarity} (+${xpReward} XP)`);
    updated++;
  }

  console.log(`\nDone — ${updated} locations updated.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
