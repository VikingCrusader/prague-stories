import 'dotenv/config';
import mongoose from 'mongoose';
import { pathToFileURL } from 'url';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';
import { resolveRarity, distanceKm } from './rarityMap.js';

// Brings every live card's rarity and xpReward in line with rarityMap.js:
// `outside` cards become expedition, priced by distance and the overrides.
// Rerun after changing EXPEDITION_XP_STEPS or EXPEDITION_XP_OVERRIDES.
// Past check-ins keep the XP they paid. `--dry` lists the changes only.
async function run() {
  const dry = process.argv.includes('--dry');
  await connectDB();
  const locs = await Location.find({}, 'slug labels coordinates rarity xpReward').lean();
  let changed = 0;
  for (const loc of locs) {
    const want = resolveRarity(loc);
    if (want.rarity === loc.rarity && want.xpReward === loc.xpReward) continue;
    changed++;
    const km = Math.round(distanceKm(loc.coordinates));
    console.log(`${loc.slug}: ${loc.rarity}/${loc.xpReward} -> ${want.rarity}/${want.xpReward} (${km} km)`);
    if (!dry) {
      await Location.updateOne({ _id: loc._id }, { $set: want }, { writeConcern: { w: 'majority', j: true } });
    }
  }
  console.log(`\n${changed} of ${locs.length} cards ${dry ? 'would change' : 'updated'}.`);
  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch(err => { console.error(err); process.exit(1); });
}
