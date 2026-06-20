import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';

const newLocations = [
  { name: 'Dancing House', slug: 'dancing-house', category: 'historical', coordinates: { lat: 50.0753, lng: 14.4136 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Dancing_House', pixelArtKey: 'dancing-house', xpReward: 25, difficulty: 1 },
  { name: 'Nusle Bridge', slug: 'nusle-bridge', category: 'historical', coordinates: { lat: 50.0606, lng: 14.4283 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Nusle_Bridge', pixelArtKey: 'viaduct', xpReward: 20, difficulty: 2 },
  { name: 'Lobkowicz Palace', slug: 'lobkowicz-palace', category: 'historical', coordinates: { lat: 50.0908, lng: 14.4042 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Lobkowicz_Palace,_Prague', pixelArtKey: 'palace', xpReward: 25, difficulty: 2 },
  { name: 'Kampa Island', slug: 'kampa-island', category: 'natural', coordinates: { lat: 50.0869, lng: 14.4058 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Kampa_Island', pixelArtKey: 'river-island', xpReward: 20, difficulty: 1 },
  { name: 'Vyšehrad Rock', slug: 'vysehrad-rock', category: 'natural', coordinates: { lat: 50.0639, lng: 14.4176 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Vyšehrad', pixelArtKey: 'cliff', xpReward: 20, difficulty: 2 },
  { name: 'Žižkov Horse Statue', slug: 'zizkov-horse-statue', category: 'hidden-gem', coordinates: { lat: 50.0872, lng: 14.4601 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Jan_%C5%BDi%C5%BEka_Monument', pixelArtKey: 'equestrian', xpReward: 15, difficulty: 2 },
];

async function run() {
  await connectDB();
  let inserted = 0;
  for (const loc of newLocations) {
    const result = await Location.updateOne(
      { slug: loc.slug },
      { $setOnInsert: { ...loc, isPreset: true } },
      { upsert: true }
    );
    if (result.upsertedCount) {
      console.log(`Inserted: ${loc.name}`);
      inserted++;
    } else {
      console.log(`Already exists: ${loc.name}`);
    }
  }
  console.log(`\nDone. ${inserted} new location(s) added.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
