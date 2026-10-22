import 'dotenv/config';
import mongoose from 'mongoose';
import { pathToFileURL } from 'url';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import { isHardcoreLive } from '../services/gamification.js';

// Deletes treasure-hunt positions the server no longer needs (GDPR data
// minimisation and storage limitation):
//  - the spot of every missed guess, in both hunts (stored until 2026-10-22,
//    never read; new misses no longer carry one);
//  - the hardcore hunt's hot-and-cold reference point once that hunt is over.
// Raw-driver writes, since lat/lng are no longer in the misses schema and
// Mongoose would strip the $unset. Safe to rerun. `--dry` only counts.
async function run() {
  const dry = process.argv.includes('--dry');
  await connectDB();
  const users = User.collection;
  const wc = { writeConcern: { w: 'majority', j: true } };

  const missFilter = mode => ({ [`${mode}.misses`]: { $elemMatch: { $or: [{ lat: { $exists: true } }, { lng: { $exists: true } }] } } });
  const unsetMisses = mode => ({ $unset: { [`${mode}.misses.$[].lat`]: '', [`${mode}.misses.$[].lng`]: '' } });

  const stale = (await users.find({ 'hardcoreDraw.trendRef.lat': { $ne: null, $exists: true } }, { projection: { hardcoreDraw: 1 } }).toArray())
    .filter(u => !isHardcoreLive(u.hardcoreDraw));

  const counts = {
    classicMisses: await users.countDocuments(missFilter('randomDraw')),
    hardcoreMisses: await users.countDocuments(missFilter('hardcoreDraw')),
    staleTrendRefs: stale.length,
  };
  console.log(`Users with positions in clue-hunt misses: ${counts.classicMisses}`);
  console.log(`Users with positions in hardcore misses:  ${counts.hardcoreMisses}`);
  console.log(`Ended hardcore hunts still holding a reference point: ${counts.staleTrendRefs}`);

  if (!dry) {
    await users.updateMany(missFilter('randomDraw'), unsetMisses('randomDraw'), wc);
    await users.updateMany(missFilter('hardcoreDraw'), unsetMisses('hardcoreDraw'), wc);
    if (stale.length) {
      await users.updateMany({ _id: { $in: stale.map(u => u._id) } }, { $set: { 'hardcoreDraw.trendRef': null, 'hardcoreDraw.trend': null } }, wc);
    }
    console.log('Deleted.');
  }
  await mongoose.disconnect();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch(err => { console.error(err); process.exit(1); });
}
