import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';

async function run() {
  await connectDB();
  const result = await Location.updateMany({ category: 'food' }, { $set: { category: 'entertainment' } });
  console.log(`Done — ${result.modifiedCount} locations moved from food → entertainment.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
