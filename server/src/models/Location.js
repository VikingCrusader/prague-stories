import mongoose from 'mongoose';

const descriptionSchema = new mongoose.Schema({
  en: { type: String, default: '' },
  cz: { type: String, default: '' },
  zh: { type: String, default: '' },
}, { _id: false });

const locationSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  slug:     { type: String, required: true, unique: true, lowercase: true },
  labels:   [{ type: String }],
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
  isPreset:     { type: Boolean, default: false },
  addedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  xpReward:     { type: Number, default: 10 },
  rarity:       { type: String, enum: ['common', 'rare', 'epic', 'legend'], default: 'common' },
}, { timestamps: true });

locationSchema.index({ labels: 1 });
locationSchema.index({ isPreset: 1 });

export default mongoose.model('Location', locationSchema);
