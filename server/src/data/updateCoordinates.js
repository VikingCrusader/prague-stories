import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';

const corrections = [
  // Round 1 — already applied; kept here for reference if re-running from scratch
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
  // Round 2
  { slug: 'josefov',                    coordinates: { lat: 50.0897, lng: 14.4186 } },
  { slug: 'mala-strana',               coordinates: { lat: 50.0881, lng: 14.4039 } },
  { slug: 'wenceslas-square',          coordinates: { lat: 50.0814, lng: 14.4275 } },
  { slug: 'bethlehem-chapel',          coordinates: { lat: 50.0844, lng: 14.4175 } },
  { slug: 'kampa-island',              coordinates: { lat: 50.0850, lng: 14.4083 } },
  { slug: 'vysehrad-rock',             coordinates: { lat: 50.0642, lng: 14.4194 } },
  { slug: 'sapa-praha',               coordinates: { lat: 50.0033, lng: 14.4703 } },
  { slug: 'aquapalace',               coordinates: { lat: 50.0075, lng: 14.5711 } },
  { slug: 'zizkov-tv-tower',          coordinates: { lat: 50.0808, lng: 14.4514 } },
  { slug: 'certovka',                 coordinates: { lat: 50.0850, lng: 14.4075 } },
  { slug: 'john-lennon-wall',         coordinates: { lat: 50.0862, lng: 14.4069 } },
  { slug: 'kotva-department-store',   coordinates: { lat: 50.0889, lng: 14.4272 } },
  { slug: 'pankrac-skyline',          coordinates: { lat: 50.0564, lng: 14.4349 } },
  { slug: 'karlin',                   coordinates: { lat: 50.0919, lng: 14.4453 } },
  { slug: 'cross-club',               coordinates: { lat: 50.1082, lng: 14.4432 } },
  { slug: 'o2-arena',                 coordinates: { lat: 50.1048, lng: 14.4935 } },
  { slug: 'smichovske-nadrazi',       coordinates: { lat: 50.0614, lng: 14.4089 } },
  { slug: 'vaclav-havel-airport',     coordinates: { lat: 50.1018, lng: 14.2632 } },
  { slug: 'namesti-miru',             coordinates: { lat: 50.0753, lng: 14.4377 } },
  { slug: 'prague-zoo',               coordinates: { lat: 50.1169, lng: 14.4061 } },
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
