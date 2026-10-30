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
  // Kept off the XP leaderboard (test accounts such as admin/admin000).
  hideFromLeaderboard: { type: Boolean, default: false },
  explorerLevel: { type: Number, default: 1 },
  achievements:  { type: [achievementSchema], default: [] },
  randomDraw: {
    slug:      { type: String, default: null },
    drawnAt:   { type: Date, default: null },
    bonusUsed: { type: Boolean, default: false }, // the treasure was found
    // The treasure was collected with a normal check-in instead of a press
    // on the Treasure Hunt page: the hunt is over, unfound, no multiplier.
    forfeited: { type: Boolean, default: false },
    // Always 'hidden' (a treasure hunt, see HUNT_* in gamification.js).
    // 'open' (location revealed, 3x XP) is retired but kept valid for old
    // documents; such a draw counts as no draw at all.
    mode:      { type: String, enum: ['open', 'hidden'], default: 'hidden' },
    // The card's labels in the order orderHuntLabels gives (kept for hunts
    // dealt before firstClue existed, whose first clue is labelOrder[0]).
    labelOrder: { type: [String], default: undefined },
    // The clues planned when the hunt is dealt (planHuntClues): the label
    // the label clue shows (clueLabel; firstClue marks a planned hunt), and
    // whether the area clue includes the quarter. Hunts dealt on 2026-10-29
    // may have a 'rarity' firstClue; that is ignored, the rarity comes at
    // 300 m like any other.
    firstClue: { kind: { type: String, enum: ['rarity', 'label'] }, value: String },
    clueLabel: { type: String, default: null },
    showQuarter: { type: Boolean, default: true },
    // Presses that missed, with the treasure's direction from the spot
    // pressed. The spot itself is not kept (GDPR data minimisation). Each
    // miss costs a full step on HUNT_MULTIPLIERS. `skipped` entries come
    // from the old clue hunt's "give up this round" and count as a clue.
    misses: {
      type: [{
        distance: Number,
        direction: String,
        skipped: Boolean,
        at: { type: Date, default: Date.now },
        _id: false,
      }],
      default: undefined,
    },
    // Clues taken (HUNT_CLUES), half a step each, once each. The direction
    // snapshot keeps what it said then (never the position it was taken at).
    clues: {
      // `free`: given for walking in (the area within 1 km, the rarity or
      // the label within 300 m), at no cost.
      type: [{ key: String, direction: String, free: Boolean, at: { type: Date, default: Date.now }, _id: false }],
      default: undefined,
    },
    // How close the player has been, from when walking revealed clues for
    // free (0–3; until 2026-10-30). No longer written or read.
    revealed: { type: Number, default: 0 },
    // Hot-and-cold hint: where the last reading was taken, and
    // whether the one after it was 'closer', 'farther' or 'same'. The only
    // position the server keeps; cleared when the hunt ends or location
    // consent is withdrawn.
    trendRef: { lat: Number, lng: Number, distance: Number },
    trend: { type: String, default: null },
    // Which press found it (1 = first press).
    solvedAttempt: { type: Number, default: null },
    _id: false,
  },
  // The separate hardcore hunt (2026-10-15 to 2026-10-29) was merged into
  // randomDraw; leftover hardcoreDraw data is removed by
  // purgeHuntPositions.js.
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
  // The user's decision on letting the app use their device's location
  // (GDPR art. 6(1)(a) and 7(1): consent, and proof of it). `version` is the
  // version of the notice they saw (LOCATION_CONSENT_VERSION on the client).
  // granted null = never decided on this account. See saveLocationConsent.
  locationConsent: {
    granted:   { type: Boolean, default: null },
    version:   { type: Number, default: null },
    decidedAt: { type: Date, default: null },
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
    locationConsent: {
      granted:   this.locationConsent?.granted ?? null,
      version:   this.locationConsent?.version ?? null,
      decidedAt: this.locationConsent?.decidedAt ?? null,
    },
    createdAt:     this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
