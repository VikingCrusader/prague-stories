// One-off: copies the whole database to a new cluster (2026-11-13, the move
// from the US to Frankfurt, next to the Render server). Every collection with
// all its documents and indexes; then checks that each count matches.
//
//   OLD_MONGO_URI=... NEW_MONGO_URI=... node src/data/copyDatabase.js          (copy)
//   OLD_MONGO_URI=... NEW_MONGO_URI=... node src/data/copyDatabase.js --check  (compare only)
//
// OLD_MONGO_URI defaults to MONGO_URI from .env. Both URIs must name the
// database (…mongodb.net/prague-stories?…). It refuses to write into a
// database that already has documents, so it can't overwrite the live one by
// a swapped argument; --force skips that check (for a retry after a failed run).
import 'dotenv/config';
import mongoose from 'mongoose';

const { MongoClient } = mongoose.mongo;
const OLD = process.env.OLD_MONGO_URI || process.env.MONGO_URI;
const NEW = process.env.NEW_MONGO_URI;
const checkOnly = process.argv.includes('--check');
const force = process.argv.includes('--force');
const BATCH = 1000;

const hostOf = uri => uri.replace(/^mongodb(\+srv)?:\/\/[^@]*@/, '').replace(/\/.*$/, '');
const dbNameOf = uri => (uri.match(/^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]*)/) || [])[1] || '';

if (!OLD || !NEW) {
  console.error('Set NEW_MONGO_URI (and OLD_MONGO_URI, or MONGO_URI in .env).');
  process.exit(1);
}
if (hostOf(OLD) === hostOf(NEW)) {
  console.error('OLD and NEW point at the same cluster; nothing to copy.');
  process.exit(1);
}
if (!dbNameOf(OLD) || !dbNameOf(NEW)) {
  console.error('Both URIs must name the database, e.g. …mongodb.net/prague-stories?retryWrites=true');
  process.exit(1);
}

const from = await new MongoClient(OLD).connect();
const to = await new MongoClient(NEW).connect();
const src = from.db();
const dst = to.db();
console.log(`from ${hostOf(OLD)}/${src.databaseName}\nto   ${hostOf(NEW)}/${dst.databaseName}\n`);

const names = (await src.listCollections({}, { nameOnly: true }).toArray())
  .map(c => c.name)
  .filter(n => !n.startsWith('system.'))
  .sort();

try {
  if (!checkOnly) {
    const existing = [];
    for (const name of names) {
      const n = await dst.collection(name).estimatedDocumentCount();
      if (n) existing.push(`${name} (${n})`);
    }
    if (existing.length && !force) {
      console.error(`The new database already has documents: ${existing.join(', ')}.\nRun with --force to empty those collections and copy again.`);
      process.exit(1);
    }

    for (const name of names) {
      const target = dst.collection(name);
      if (force) await target.deleteMany({});
      let copied = 0;
      let batch = [];
      for await (const doc of src.collection(name).find({}).batchSize(BATCH)) {
        batch.push(doc);
        if (batch.length === BATCH) {
          await target.insertMany(batch, { ordered: false });
          copied += batch.length;
          batch = [];
        }
      }
      if (batch.length) {
        await target.insertMany(batch, { ordered: false });
        copied += batch.length;
      }
      // Indexes, with their options (unique, sparse, partial, TTL, …), not the default _id one.
      const indexes = (await src.collection(name).indexes()).filter(ix => ix.name !== '_id_');
      for (const { key, name: indexName, v, ns, ...options } of indexes) {
        await target.createIndex(key, { name: indexName, ...options });
      }
      console.log(`copied ${name}: ${copied} documents, ${indexes.length} indexes`);
    }
    console.log('');
  }

  // Counts and indexes on both sides.
  let ok = true;
  for (const name of names) {
    const [a, b] = await Promise.all([src.collection(name).countDocuments(), dst.collection(name).countDocuments()]);
    const [ia, ib] = await Promise.all([
      src.collection(name).indexes().then(l => l.map(i => i.name).sort().join(',')),
      dst.collection(name).indexes().then(l => l.map(i => i.name).sort().join(','), () => ''),
    ]);
    const same = a === b && ia === ib;
    if (!same) ok = false;
    console.log(`${same ? 'OK  ' : 'DIFF'} ${name.padEnd(16)} documents ${a} -> ${b}${ia === ib ? '' : `  indexes [${ia}] -> [${ib}]`}`);
  }
  console.log(ok ? '\nEverything matches.' : '\nSome collections differ (see DIFF above).');
  process.exitCode = ok ? 0 : 1;
} finally {
  await from.close();
  await to.close();
}
