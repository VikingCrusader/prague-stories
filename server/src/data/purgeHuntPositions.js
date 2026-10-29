import 'dotenv/config';
import mongoose from 'mongoose';
import { pathToFileURL } from 'url';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import { RANDOM_DRAW_WINDOW_MS } from '../services/gamification.js';

// Deletes treasure-hunt positions the server no longer needs (GDPR data
// minimisation and storage limitation):
//  - the spot of every missed guess (stored until 2026-10-22, never read;
//    new misses no longer carry one);
//  - the hunt's hot-and-cold reference point once that hunt is over;
//  - the whole leftover hardcoreDraw of the retired hardcore hunt (merged
//    into randomDraw on 2026-10-29), which can still hold a reference point.
// Raw-driver writes, since these paths are no longer in the schema and
// Mongoose would strip the $unset. Safe to rerun. `--dry` only counts.
async function run() {
  const dry = process.argv.includes('--dry');
  await connectDB();
  const users = User.collection;
  const wc = { writeConcern: { w: 'majority', j: true } };

  const missFilter = { 'randomDraw.misses': { $elemMatch: { $or: [{ lat: { $exists: true } }, { lng: { $exists: true } }] } } };
  const unsetMisses = { $unset: { 'randomDraw.misses.$[].lat': '', 'randomDraw.misses.$[].lng': '' } };
  const hardcoreFilter = { hardcoreDraw: { $exists: true } };

  const live = d => d?.drawnAt && !d.bonusUsed && Date.now() - new Date(d.drawnAt).getTime() < RANDOM_DRAW_WINDOW_MS;
  const stale = (await users.find({ 'randomDraw.trendRef.lat': { $ne: null, $exists: true } }, { projection: { randomDraw: 1 } }).toArray())
    .filter(u => !live(u.randomDraw));

  const counts = {
    misses: await users.countDocuments(missFilter),
    staleTrendRefs: stale.length,
    hardcore: await users.countDocuments(hardcoreFilter),
  };
  console.log(`Users with positions in hunt misses: ${counts.misses}`);
  console.log(`Ended hunts still holding a reference point: ${counts.staleTrendRefs}`);
  console.log(`Users with leftover hardcore-hunt data: ${counts.hardcore}`);

  if (!dry) {
    await users.updateMany(missFilter, unsetMisses, wc);
    if (stale.length) {
      await users.updateMany({ _id: { $in: stale.map(u => u._id) } }, { $set: { 'randomDraw.trendRef': null, 'randomDraw.trend': null } }, wc);
    }
    await users.updateMany(hardcoreFilter, { $unset: { hardcoreDraw: '' } }, wc);
    console.log('Deleted.');
  }
  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch(err => { console.error(err); process.exit(1); });
}
