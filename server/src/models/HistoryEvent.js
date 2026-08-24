import mongoose from 'mongoose';

const localizedTextSchema = new mongoose.Schema({
  en: { type: String, default: '' },
  cz: { type: String, default: '' },
  zh: { type: String, default: '' },
}, { _id: false });

const relatedLandmarkSchema = new mongoose.Schema({
  slug:     { type: String, required: true, lowercase: true },
  relation: { type: localizedTextSchema, default: () => ({}) },
}, { _id: false });

const referenceMapLinkSchema = new mongoose.Schema({
  label:       { type: String, required: true }, // short chip text, e.g. "954"
  description: { type: localizedTextSchema, default: () => ({}) }, // what this specific year/link shows
  url:         { type: String, required: true },
}, { _id: false });

const referenceMapsSchema = new mongoose.Schema({
  // One-line explanation of what the links below actually show — without
  // this, a bare row of year chips next to a link icon doesn't tell a
  // reader why they'd click it.
  caption: { type: localizedTextSchema, default: () => ({}) },
  links:   [referenceMapLinkSchema],
}, { _id: false });

// A direct quote from a primary source (a chronicle, a historian) that gets
// pulled out of the summary's own prose and rendered as its own visually
// distinct blockquote — large decorative quotation marks, italic text, a
// right-aligned "— Source Name" attribution line — instead of sitting
// inline as quoted text inside a regular paragraph. Referenced from
// `summary` via an inline marker on its own line/paragraph, e.g.
// "[[quote:0]]", which HistoryEventSection.jsx swaps out for quotes[0] at
// render time — see that component for the exact marker syntax.
const chronicleQuoteSchema = new mongoose.Schema({
  text:        { type: localizedTextSchema, default: () => ({}) },
  attribution: { type: localizedTextSchema, default: () => ({}) },
}, { _id: false });

const historyEventSchema = new mongoose.Schema({
  slug:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  era:       { type: String, required: true }, // key into data/historyEras.js
  startYear: { type: Number, required: true }, // numeric anchor for timeline position/sort; negative = BCE
  year:      { type: localizedTextSchema, default: () => ({}) }, // display string per language, e.g. "935", "8th century (legendary)"
  title:     { type: localizedTextSchema, default: () => ({}) },
  tone:      { type: String, enum: ['humorous', 'serious'], default: 'humorous' },
  // 'event' (default) is a normal dated timeline entry. 'background' is a
  // non-narrative explainer card — context the reader needs at this point
  // in the feed but that isn't itself a dated happening (e.g. "Bohemia
  // wasn't a one-city story yet" between duke-go-round-1092 and
  // battle-of-chlumec-1126). Sorts into the feed by startYear like any
  // other event, but HistorySidebar excludes it from the era event lists
  // (see that component) so it doesn't claim a year slot in the nav, and
  // HistoryEventSection renders it with a distinct, collapsible treatment
  // instead of the normal year/title/wiki-link header.
  cardType:  { type: String, enum: ['event', 'background'], default: 'event' },
  hookLine:  { type: localizedTextSchema, default: () => ({}) },
  summary:   { type: localizedTextSchema, default: () => ({}) },
  // Primary-source quotes referenced from inside `summary` via "[[quote:N]]"
  // markers — see chronicleQuoteSchema above for why this exists instead of
  // just leaving quotes embedded inline as regular quoted prose.
  quotes: [chronicleQuoteSchema],
  relatedLandmarks: [relatedLandmarkSchema],
  wikipediaUrl: { type: String, default: '' },
  // Optional links out to an external interactive historical-border map
  // (e.g. oldmapsonline.org's TimeMap) for specific years mentioned in the
  // event — lets a territorial-change event point at real cartographic
  // sources instead of (or until) a custom illustrated map exists.
  referenceMaps: { type: referenceMapsSchema, default: () => ({}) },
  // Optional static illustration(s) for the section banner — path(s) under
  // client/public (e.g. '/history/prehistory.webp'), same convention as
  // pixel-art cover images. Most events have zero or one; a few multi-beat
  // events (e.g. a massacre scene followed by its political aftermath) use
  // two or more, rendered in array order. The frontend just skips the
  // banner block entirely when this is empty.
  images: { type: [String], default: [] },
}, { timestamps: true });

historyEventSchema.index({ era: 1, startYear: 1 });

export default mongoose.model('HistoryEvent', historyEventSchema);
