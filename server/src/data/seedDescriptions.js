import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';
import { generateLocationDescription } from '../services/claudeService.js';

const DELAY_MS = 15000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function seedDescriptions() {
  await connectDB();

  const locations = await Location.find({
    $or: [
      { 'description.en': { $exists: false } },
      { 'description.en': '' },
    ],
  }).sort({ createdAt: 1 });

  if (locations.length === 0) {
    console.log('All locations already have descriptions. Nothing to do.');
    process.exit(0);
  }

  const total = locations.length;
  console.log(`Found ${total} location(s) with missing descriptions. Starting...\n`);

  let done = 0;
  let failed = 0;

  for (const loc of locations) {
    process.stdout.write(`Generating "${loc.name}"... `);
    try {
      const description = await generateLocationDescription(loc.name, loc.category);
      loc.description = description;
      await loc.save();
      done++;
      console.log(`done (${done}/${total})`);
    } catch (err) {
      failed++;
      console.log(`FAILED — ${err.message}`);
    }

    if (done + failed < total) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`\nFinished. ${done} generated, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

seedDescriptions().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
