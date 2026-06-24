import 'dotenv/config';
import { connectDB } from '../config/db.js';
import Location from '../models/Location.js';

function split(text, lang) {
  if (!text || text.includes('\n\n')) return text;

  const keyword = lang === 'en' ? 'Unlock' : lang === 'cz' ? 'Odemkni' : '解锁';
  const unlockIdx = text.indexOf(keyword);
  if (unlockIdx === -1) return text;

  const before = text.substring(0, unlockIdx);
  const para3 = text.substring(unlockIdx).trim();

  // Find sentence end positions within `before`
  const ends = [];
  if (lang === 'zh') {
    const re = /[。！？]/g;
    let m;
    while ((m = re.exec(before)) !== null) ends.push(m.index + 1);
  } else {
    const re = /[.!?]\s+/g;
    let m;
    while ((m = re.exec(before)) !== null) ends.push(m.index + m[0].length);
  }

  if (ends.length < 2) {
    // Not enough sentences to split into two — just add para3
    return `${before.trim()}\n\n${para3}`;
  }

  // Pick the sentence end closest to the midpoint of `before`
  const mid = before.length / 2;
  const splitAt = ends.reduce((best, idx) =>
    Math.abs(idx - mid) < Math.abs(best - mid) ? idx : best, ends[0]);

  const para1 = before.substring(0, splitAt).trim();
  const para2 = before.substring(splitAt).trim();

  if (!para2) return `${para1}\n\n${para3}`;
  return `${para1}\n\n${para2}\n\n${para3}`;
}

async function run() {
  await connectDB();
  const locs = await Location.find({ 'description.en': { $exists: true, $ne: '' } });

  let updated = 0;
  for (const loc of locs) {
    const { en, cz, zh } = loc.description || {};
    const needsWork = (en && !en.includes('\n\n')) ||
                      (cz && !cz.includes('\n\n')) ||
                      (zh && !zh.includes('\n\n'));
    if (!needsWork) continue;

    await Location.updateOne({ _id: loc._id }, {
      $set: {
        'description.en': split(en, 'en'),
        'description.cz': split(cz, 'cz'),
        'description.zh': split(zh, 'zh'),
      }
    });
    console.log(`Segmented: ${loc.slug}`);
    updated++;
  }
  console.log(`\nDone — ${updated} locations updated.`);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
