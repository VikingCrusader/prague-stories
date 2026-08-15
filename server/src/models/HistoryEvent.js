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

const historyEventSchema = new mongoose.Schema({
  slug:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  era:       { type: String, required: true }, // key into data/historyEras.js
  startYear: { type: Number, required: true }, // numeric anchor for timeline position/sort; negative = BCE
  year:      { type: String, required: true }, // display string, e.g. "935", "8th century (legendary)"
  title:     { type: localizedTextSchema, default: () => ({}) },
  tone:      { type: String, enum: ['humorous', 'serious'], default: 'humorous' },
  hookLine:  { type: localizedTextSchema, default: () => ({}) },
  summary:   { type: localizedTextSchema, default: () => ({}) },
  relatedLandmarks: [relatedLandmarkSchema],
  wikipediaUrl: { type: String, default: '' },
  // Optional static illustration for the section banner — a path under
  // client/public (e.g. '/history/prehistory.webp'), same convention as
  // pixel-art cover images. Most events won't have one; the frontend just
  // skips the banner when it's empty.
  image: { type: String, default: '' },
}, { timestamps: true });

historyEventSchema.index({ era: 1, startYear: 1 });

export default mongoose.model('HistoryEvent', historyEventSchema);
