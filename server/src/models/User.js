import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { calculateLevel } from '../services/gamification.js';

const achievementSchema = new mongoose.Schema({
  id:         { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  totalXP:       { type: Number, default: 0 },
  explorerLevel: { type: Number, default: 1 },
  achievements:  { type: [achievementSchema], default: [] },
  randomDraw: {
    slug:      { type: String, default: null },
    drawnAt:   { type: Date, default: null },
    bonusUsed: { type: Boolean, default: false },
    _id: false,
  },
  // Where the user last was in the History Timeline feed, so /history can
  // reopen at that event on any device. `updatedAt` lets the client pick
  // between this and its own localStorage copy, whichever is newer.
  historyProgress: {
    slug:      { type: String, default: null },
    updatedAt: { type: Date, default: null },
    _id: false,
  },
  // Display preferences (colour theme, language, Chinese script), so they
  // follow the user to any device. null = never chosen.
  preferences: {
    theme:     { type: String, enum: ['dark', 'light', null], default: null },
    lang:      { type: String, enum: ['en', 'cz', 'zh', null], default: null },
    zhVariant: { type: String, enum: ['cn', 'tw', null], default: null },
    _id: false,
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function () {
  return {
    _id:           this._id,
    username:      this.username,
    email:         this.email,
    totalXP:       this.totalXP,
    explorerLevel: calculateLevel(this.totalXP).level,
    achievements:  this.achievements,
    preferences:   {
      theme:     this.preferences?.theme ?? null,
      lang:      this.preferences?.lang ?? null,
      zhVariant: this.preferences?.zhVariant ?? null,
    },
    createdAt:     this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
