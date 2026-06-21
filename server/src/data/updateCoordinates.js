import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';

const corrections = [
  { slug: 'vysehrad',                   coordinates: { lat: 50.0642, lng: 14.4194 } },
  { slug: 'wallenstein-palace',         coordinates: { lat: 50.0900, lng: 14.4067 } },
  { slug: 'strahov-monastery',          coordinates: { lat: 50.0860, lng: 14.3900 } },
  { slug: 'old-jewish-cemetery',        coordinates: { lat: 50.0897, lng: 14.4172 } },
  { slug: 'klementinum',                coordinates: { lat: 50.0867, lng: 14.4164 } },
  { slug: 'pinkas-synagogue',           coordinates: { lat: 50.0893, lng: 14.4170 } },
  { slug: 'nusle-bridge',               coordinates: { lat: 50.0658, lng: 14.4305 } },
  { slug: 'heydrich-assassination-site',coordinates: { lat: 50.1178, lng: 14.4642 } },
  { slug: 'masarykovo-nadrazi',         coordinates: { lat: 50.0880, lng: 14.4330 } },
  { slug: 'national-museum',            coordinates: { lat: 50.0788, lng: 14.4308 } },
  { slug: 'national-theatre',           coordinates: { lat: 50.0811, lng: 14.4136 } },
  { slug: 'state-opera',                coordinates: { lat: 50.0806, lng: 14.4328 } },
  { slug: 'estates-theatre',            coordinates: { lat: 50.0861, lng: 14.4239 } },
  { slug: 'naprstek-museum',            coordinates: { lat: 50.0841, lng: 14.4164 } },
  { slug: 'veletrzni-palace',           coordinates: { lat: 50.1011, lng: 14.4325 } },
  { slug: 'prague-planetarium',         coordinates: { lat: 50.1054, lng: 14.4274 } },
  { slug: 'stromovka-park',             coordinates: { lat: 50.1064, lng: 14.4194 } },
  { slug: 'divoka-sarka',               coordinates: { lat: 50.1086, lng: 14.3508 } },
  { slug: 'troja-chateau-garden',       coordinates: { lat: 50.1164, lng: 14.4129 } },
];

async function run() {
  await connectDB();
  let updated = 0;
  for (const { slug, coordinates } of corrections) {
    const result = await Location.updateOne({ slug }, { $set: { coordinates } });
    if (result.modifiedCount) {
      console.log(`✓ ${slug}: (${coordinates.lat}, ${coordinates.lng})`);
      updated++;
    } else {
      console.log(`- ${slug}: not found or already correct`);
    }
  }
  console.log(`\nDone — ${updated}/${corrections.length} updated.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
