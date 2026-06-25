import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';

const SLUGS = [
  'stone-bell-house',
  'kostel-sv-simona-judy',
  'cechuv-most',
  'klasterni-kostel-panny-marie-bolestne',
  'kostel-sv-apolinar',
  'porodnice-apolinar',
  'kostel-nejsvetejsiho-srdce-pane',
  'sady-svatopluka-cecha',
  'husuv-sbor-vinohrady',
  'parukarka',
  'kostel-panny-marie-modrany',
  'city-tower-prague',
  'nuselska-radnice',
  'husuv-sbor-smichov',
  'cerny-most',
  'kobylisy',
  'bazilika-sv-margarety',
];

function prepend(greeting, text) {
  return greeting + text[0].toLowerCase() + text.slice(1);
}

async function run() {
  await connectDB();
  let updated = 0;

  for (const slug of SLUGS) {
    const loc = await Location.findOne({ slug });
    if (!loc) { console.log(`Not found: ${slug}`); continue; }

    const patch = {};
    if (!loc.description.en.startsWith('Brave explorer'))
      patch['description.en'] = prepend('Brave explorer, ', loc.description.en);
    if (!loc.description.cz.startsWith('Odvážný průzkumníku'))
      patch['description.cz'] = prepend('Odvážný průzkumníku, ', loc.description.cz);
    if (!loc.description.zh.startsWith('勇敢的探险家'))
      patch['description.zh'] = '勇敢的探险家，' + loc.description.zh;

    if (Object.keys(patch).length) {
      await Location.updateOne({ _id: loc._id }, { $set: patch });
      console.log(`Updated: ${loc.name}`);
      updated++;
    } else {
      console.log(`Already has greeting: ${loc.name}`);
    }
  }

  console.log(`\nDone. ${updated} location(s) updated.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
