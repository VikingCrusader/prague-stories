import mongoose from 'mongoose';
import { resolveRarity } from '../data/rarityMap.js';

const descriptionSchema = new mongoose.Schema({
  en: { type: String, default: '' },
  cz: { type: String, default: '' },
  zh: { type: String, default: '' },
}, { _id: false });

const locationSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  slug:     { type: String, required: true, unique: true, lowercase: true },
  labels:   [{ type: String }],
  // Prague správní obvod ("Praha 1" … "Praha 22") for cards inside the city
  // boundary; empty for cards labelled `outside`.
  district: { type: String, default: '' },
  // Katastrální území (historical quarter: "Staré Město", "Smíchov", ...),
  // official Czech name; empty for cards labelled `outside`.
  quarter:  { type: String, default: '' },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  description:  { type: descriptionSchema, default: () => ({}) },
  localizedNames: {
    cz: { type: String, default: '' },
    zh: { type: String, default: '' },
    _id: false,
  },
  wikipediaUrl: { type: String, default: '' },
  coverImage:   { type: String, default: '' },
  pixelArtKey:  { type: String, default: '' },
  addedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  xpReward:     { type: Number, default: 10 },
  rarity:       { type: String, enum: ['common', 'rare', 'superior', 'epic', 'mythic', 'legend', 'expedition'], default: 'common' },
}, { timestamps: true });

// Keeps rarity and xpReward in step with the labels and coordinates on every
// save: `outside` cards are always expedition, priced by distance (rarityMap.js).
locationSchema.pre('validate', function () {
  Object.assign(this, resolveRarity(this));
});

locationSchema.index({ labels: 1 });
locationSchema.index({ addedBy: 1 });

export default mongoose.model('Location', locationSchema);
