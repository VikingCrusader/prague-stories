import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';
import { pragueLocations } from './pragueLocations.js';

async function seed() {
  await connectDB();

  const existing = await Location.countDocuments({ isPreset: true });
  if (existing > 0) {
    console.log(`Seed skipped — ${existing} preset locations already exist.`);
    process.exit(0);
  }

  const docs = pragueLocations.map(loc => ({ ...loc, isPreset: true }));
  await Location.insertMany(docs);
  console.log(`Seeded ${docs.length} Prague locations.`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
