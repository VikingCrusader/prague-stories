# HOWTO: Manually add/edit History Timeline events

Quick reference for adding or editing `HistoryEvent` entries by hand, without Claude. Written 2026-08-26.

## 1. File locations

- All event data: `server/src/data/seedHistoryEvents.js` — one big array, one object per event.
- Era config: `server/src/data/historyEras.js` — era `key`/order/year range/etc. Editing this does **not** need a script rerun; `historyController.js` reads it directly.

## 2. Adding a new event

Insert a new object into the array in `seedHistoryEvents.js`, roughly in `startYear` order. Field template:

```js
{
  slug: "some-unique-slug-year",       // unique, year suffix by convention
  era: "rise-of-a-kingdom",             // must match a key in historyEras.js
  startYear: 1350,                      // sort/timeline anchor; decimals (e.g. 1345.9) break same-year ties
  images: ["/history/xxx.webp"],        // optional — omit or leave [] if none yet
  year: { en: "1350", cz: "1350", zh: "1350年" },
  tone: "humorous",                     // or "serious" — stored but not yet read by the frontend
  title: { en: "...", cz: "...", zh: "..." },
  hookLine: { en: "...", cz: "...", zh: "..." },   // one-sentence hook
  summary: {                            // 2-3+ sentences, paragraphs separated by \n\n
    en: "Para 1.\n\nPara 2.",
    cz: "...",
    zh: "...",
  },
  relatedLandmarks: [],                 // or [{ slug: "xxx", relation: { en, cz, zh } }]
  wikipediaUrl: "https://...",          // optional
},
```

Then, from `server/`:

```bash
node --check src/data/seedHistoryEvents.js   # syntax check first
node src/data/seedHistoryEvents.js           # upsert — inserts any new slug
```

## 3. Editing an existing event (the important gotcha)

`seedHistoryEvents.js` uses `$setOnInsert`. **Editing an already-seeded event's fields in the source file and rerunning the script does NOT update the live database** — it sees the slug already exists and skips it.

Two ways to actually push an edit live:

**Option A — a one-off sync script** (cleanest, edit only the fields you touched):

```js
// server/src/data/_tmp_sync.mjs
import "dotenv/config";
import { connectDB } from "../config/db.js";
import HistoryEvent from "../models/HistoryEvent.js";
import mongoose from "mongoose";

await connectDB();
await HistoryEvent.updateOne(
  { slug: "some-existing-slug" },
  { $set: {
      "title.zh": "新标题",
      // or a full field: summary: { en: "...", cz: "...", zh: "..." }
  }},
);
await mongoose.disconnect();
```

Run with `node src/data/_tmp_sync.mjs` from `server/`, then delete the temp file.

**Option B — delete and reseed** (faster for a big rewrite, don't want to hand-copy every field):

Using a Mongo client (Compass or `mongosh`), run `db.historyevents.deleteOne({ slug: "xxx" })`, then rerun `node src/data/seedHistoryEvents.js` — the source file's version gets inserted fresh as a "new" record.

## 4. Always syntax-check after editing

```bash
node --check src/data/seedHistoryEvents.js
```

Pure syntax check, no DB connection, a few seconds. Catches most hand-editing slips (missing comma, mismatched quote). Run it after every substantial edit, not just once at the end.

## 5. Content style cheat sheet

- **Voice**: wry/deadpan comic history-writing by default — short punchy sentences, concrete details, a dry closing line. Once content reaches `brief-independence` (1918+) and later eras, pull back to a more restrained/measured tone.
- **Em-dashes (—)**: use sparingly, last resort only. Prefer comma / period / colon / parentheses first.
- **Primary-source quotes**: don't embed as inline quoted prose. Use `quotes: [{ text: {en,cz,zh}, attribution: {en,cz,zh} }]` plus a `"[[quote:N]]"` marker on its own line (blank lines before and after) inside `summary` at the point it should appear.
- **Background-knowledge cards**: non-dated explainer asides get `cardType: "background"`. They must **never** have an `image` or a non-empty `relatedLandmarks` — supplementary context only.
- **Trilingual parity**: EN/CZ/ZH must stay structurally matched — same paragraph count/breaks, same meaning — even when phrasing isn't a literal translation. A structural change in one language needs to be mirrored in the other two.
- **`relatedLandmarks`**: slugs must exist in the live `Location` collection — an unresolved slug is silently dropped, not an error. Query the actual database rather than trusting `seedLocations.js` alone; some real Locations only exist in the DB.

## 6. Images (optional)

Not required — the frontend falls back to an emoji placeholder if `image`/`images` is missing. To add one: drop the generated `.webp` file into `client/public/history/`, then set the event's `image`/`images` field to the matching `/history/<file>.webp` path. Setting this on an *already-seeded* event is an edit — follow step 3's sync process, it won't take effect just by rerunning the seed script.
