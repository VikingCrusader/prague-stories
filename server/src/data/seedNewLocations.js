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
  // New batch
  { name: 'O2 Arena', slug: 'o2-arena', category: 'entertainment', coordinates: { lat: 50.1011, lng: 14.4963 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/O2_Arena_(Prague)', pixelArtKey: 'arena', xpReward: 15, difficulty: 1 },
  { name: 'New Royal Palace', slug: 'new-royal-palace', category: 'historical', coordinates: { lat: 50.0906, lng: 14.4027 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/New_Royal_Palace_(Prague)', pixelArtKey: 'new-royal-palace', xpReward: 20, difficulty: 2 },
  { name: 'Vítkov National Memorial', slug: 'vitkov-national-memorial', category: 'historical', coordinates: { lat: 50.0862, lng: 14.4564 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/National_Memorial_on_the_Vítkov_Hill', pixelArtKey: 'national-monument', xpReward: 25, difficulty: 2 },
  { name: 'Lake Džbán', slug: 'lake-dzban', category: 'natural', coordinates: { lat: 50.0976, lng: 14.3300 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Džbán_(přírodní_rezervace)', pixelArtKey: 'lake', xpReward: 20, difficulty: 2 },
  { name: 'Modřanská rokle', slug: 'modranska-rokle', category: 'natural', coordinates: { lat: 49.9970, lng: 14.4062 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Modřanská_rokle', pixelArtKey: 'gorge', xpReward: 25, difficulty: 3 },
  { name: 'Charles University (Carolinum)', slug: 'charles-university', category: 'historical', coordinates: { lat: 50.0852, lng: 14.4195 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Charles_University', pixelArtKey: 'university', xpReward: 20, difficulty: 2 },
  { name: 'Reinhard Heydrich Assassination Site', slug: 'heydrich-assassination-site', category: 'historical', coordinates: { lat: 50.1115, lng: 14.4646 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Assassination_of_Reinhard_Heydrich', pixelArtKey: 'assassination-site', xpReward: 30, difficulty: 3 },
  { name: 'Cathedral of Saints Cyril and Methodius', slug: 'cathedral-cyril-methodius', category: 'historical', coordinates: { lat: 50.0776, lng: 14.4167 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Cathedral_of_Saints_Cyril_and_Methodius,_Prague', pixelArtKey: 'orthodox-cathedral', xpReward: 25, difficulty: 2 },
  { name: 'Smíchovské nádraží', slug: 'smichovske-nadrazi', category: 'entertainment', coordinates: { lat: 50.0694, lng: 14.4050 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Praha_Smíchov_railway_station', pixelArtKey: 'modern-station', xpReward: 15, difficulty: 1 },
  { name: 'Masarykovo nádraží', slug: 'masarykovo-nadrazi', category: 'historical', coordinates: { lat: 50.0894, lng: 14.4338 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Praha_Masarykovo_railway_station', pixelArtKey: 'historic-station', xpReward: 15, difficulty: 1 },
  { name: 'Centrální park Praha', slug: 'centralni-park-praha', category: 'natural', coordinates: { lat: 50.0500, lng: 14.3197 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Centrální_park_(Praha_13)', pixelArtKey: 'central-park', xpReward: 15, difficulty: 2 },
  { name: 'Václav Havel Airport Prague', slug: 'vaclav-havel-airport', category: 'entertainment', coordinates: { lat: 50.1008, lng: 14.2600 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Václav_Havel_Airport_Prague', pixelArtKey: 'airport', xpReward: 20, difficulty: 2 },
  // New batch 2
  { name: 'Praha hlavní nádraží', slug: 'praha-hlavni-nadrazi', category: 'historical', coordinates: { lat: 50.0831, lng: 14.4356 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Praha_hlavní_nádraží', pixelArtKey: 'grand-station', xpReward: 20, difficulty: 1 },
  { name: 'Sapa Praha', slug: 'sapa-praha', category: 'entertainment', coordinates: { lat: 50.0013, lng: 14.4356 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Sapa_(Prague)', pixelArtKey: 'vietnamese-market', xpReward: 25, difficulty: 3 },
  { name: 'Háje', slug: 'haje', category: 'hidden-gem', coordinates: { lat: 50.0309, lng: 14.5272 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Háje_(Praha)', pixelArtKey: 'metro-terminus', xpReward: 20, difficulty: 2 },
  { name: 'Pankrác Skyline', slug: 'pankrac-skyline', category: 'hidden-gem', coordinates: { lat: 50.0613, lng: 14.4285 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Pankrác', pixelArtKey: 'skyline', xpReward: 20, difficulty: 2 },
  { name: 'Anděl', slug: 'andel', category: 'entertainment', coordinates: { lat: 50.0698, lng: 14.4023 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Anděl_(Prague)', pixelArtKey: 'urban-hub', xpReward: 15, difficulty: 1 },
  { name: 'Trojská lávka', slug: 'trojska-lavka', category: 'natural', coordinates: { lat: 50.1148, lng: 14.4148 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Trojská_lávka', pixelArtKey: 'footbridge', xpReward: 20, difficulty: 2 },
  { name: 'Podbaba', slug: 'podbaba', category: 'hidden-gem', coordinates: { lat: 50.1106, lng: 14.3980 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Podbaba', pixelArtKey: 'riverside-village', xpReward: 20, difficulty: 3 },
  // New batch 3
  { name: 'Olšanské hřbitovy', slug: 'olsanske-hrbitovy', category: 'historical', coordinates: { lat: 50.0778, lng: 14.4644 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Olšany_Cemeteries', pixelArtKey: 'grand-cemetery', xpReward: 20, difficulty: 2 },
  { name: 'Průhonice Park', slug: 'pruhonice-park', category: 'natural', coordinates: { lat: 49.9889, lng: 14.5514 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Průhonice_Park', pixelArtKey: 'castle-park', xpReward: 30, difficulty: 3 },
  { name: 'Žluté lázně', slug: 'zlute-lazne', category: 'natural', coordinates: { lat: 50.0483, lng: 14.4136 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Žluté_lázně', pixelArtKey: 'riverside-beach', xpReward: 15, difficulty: 2 },
  { name: 'Karlín', slug: 'karlin', category: 'hidden-gem', coordinates: { lat: 50.0939, lng: 14.4546 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Karlín', pixelArtKey: 'revival-district', xpReward: 20, difficulty: 2 },
  { name: 'Náměstí Míru', slug: 'namesti-miru', category: 'entertainment', coordinates: { lat: 50.0751, lng: 14.4392 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Náměstí_Míru', pixelArtKey: 'peace-square', xpReward: 15, difficulty: 1 },
  // New batch 4
  { name: 'Suchdol', slug: 'suchdol', category: 'natural', coordinates: { lat: 50.1342, lng: 14.3737 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Suchdol_(Praha)', pixelArtKey: 'riverside-village2', xpReward: 20, difficulty: 3 },
  { name: 'Lihovar', slug: 'lihovar', category: 'hidden-gem', coordinates: { lat: 50.0617, lng: 14.4009 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Lihovar_(Praha)', pixelArtKey: 'distillery', xpReward: 20, difficulty: 2 },
  { name: 'Hráz přehrady Hostivař', slug: 'hraz-preharady-hostivar', category: 'natural', coordinates: { lat: 50.0417, lng: 14.5292 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Hostivařská_přehrada', pixelArtKey: 'reservoir-dam', xpReward: 20, difficulty: 2 },
  { name: 'Soutok Berounky a Vltavy', slug: 'soutok-berounky-vltavy', category: 'natural', coordinates: { lat: 49.9897, lng: 14.3569 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Soutok_Berounky_a_Vltavy', pixelArtKey: 'river-confluence', xpReward: 25, difficulty: 3 },
  // New batch 5
  { name: 'Bohnice', slug: 'bohnice', category: 'hidden-gem', coordinates: { lat: 50.1395, lng: 14.4247 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Bohnice', pixelArtKey: 'asylum-park', xpReward: 20, difficulty: 3 },
  { name: 'Letňany', slug: 'letňany', category: 'entertainment', coordinates: { lat: 50.1218, lng: 14.5083 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Letňany', pixelArtKey: 'exhibition-airfield', xpReward: 15, difficulty: 2 },
  // New batch 6
  { name: 'Grand Hotel Prague Towers', slug: 'grand-hotel-prague-towers', category: 'entertainment', coordinates: { lat: 50.0879, lng: 14.4279 }, wikipediaUrl: '', pixelArtKey: 'hotel-towers', xpReward: 20, difficulty: 1 },
  { name: 'Muzeum Policie České republiky', slug: 'muzeum-policie-cr', category: 'cultural', coordinates: { lat: 50.0746, lng: 14.4291 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Muzeum_Policie_%C4%8Cesk%C3%A9_republiky', pixelArtKey: 'police-museum', xpReward: 20, difficulty: 2 },
  { name: 'Vyšehrad Railway Bridge', slug: 'vysehrad-railway-bridge', category: 'historical', coordinates: { lat: 50.0644, lng: 14.4118 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Vy%C5%A1ehradsk%C3%BD_%C5%BEelezni%C4%8Dn%C3%AD_most', pixelArtKey: 'railway-bridge', xpReward: 25, difficulty: 2 },
  { name: 'Great Strahov Stadium', slug: 'strahov-stadium', category: 'historical', coordinates: { lat: 50.0793, lng: 14.3820 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/Strahov_Stadium', pixelArtKey: 'mega-stadium', xpReward: 30, difficulty: 2 },
  { name: 'Staroměstská vodárenská věž', slug: 'staromestska-vodarenska-vez', category: 'historical', coordinates: { lat: 50.0864, lng: 14.4147 }, wikipediaUrl: 'https://cs.wikipedia.org/wiki/Starom%C4%9Bstsk%C3%A1_vod%C3%A1rensk%C3%A1_v%C4%9B%C5%BE', pixelArtKey: 'water-tower-old', xpReward: 20, difficulty: 1 },
  { name: 'Národní technická knihovna', slug: 'narodni-technicka-knihovna', category: 'cultural', coordinates: { lat: 50.1047, lng: 14.3893 }, wikipediaUrl: 'https://en.wikipedia.org/wiki/National_Technical_Library_(Prague)', pixelArtKey: 'technical-library', xpReward: 15, difficulty: 1 },
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
