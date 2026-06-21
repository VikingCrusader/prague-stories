import mongoose from 'mongoose';

const descriptionSchema = new mongoose.Schema({
  en: { type: String, default: '' },
  cz: { type: String, default: '' },
  zh: { type: String, default: '' },
}, { _id: false });

const locationSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  slug:     { type: String, required: true, unique: true, lowercase: true },
  category: {
    type: String,
    required: true,
    enum: ['historical', 'cultural', 'natural', 'hidden-gem', 'entertainment'],
  },
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
  coverImage:   { type: String, default: '' }, // base64 data URL for user-uploaded images
  pixelArtKey:  { type: String, default: '' }, // maps to frontend asset/CSS class
  isPreset:     { type: Boolean, default: false },
  addedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  xpReward:     { type: Number, default: 15 },
  difficulty:   { type: Number, default: 1, min: 1, max: 3 },
}, { timestamps: true });

locationSchema.index({ category: 1 });
locationSchema.index({ isPreset: 1 });

export default mongoose.model('Location', locationSchema);
