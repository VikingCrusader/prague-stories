import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';

const slugs = [
  'kaple-sv-ludmily',
  'kaple-sv-mari-magdaleny',
  'church-of-our-lady-on-the-lawn',
  'prague-crossroads',
  'church-st-cyril-methodius-karlin',
  'kostel-sv-ignace',
  'vojenskyy-kostel-sv-jana-nepomuckeho',
];

await connectDB();
for (const slug of slugs) {
  const r = await Location.findOneAndUpdate(
    { slug },
    { $addToSet: { labels: 'historical' } },
    { new: true }
  );
  console.log(slug, '->', r?.labels);
}
process.exit(0);
