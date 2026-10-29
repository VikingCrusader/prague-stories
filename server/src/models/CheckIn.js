import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location:    { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  note:        { type: String, maxlength: 280, default: '' },
  checkedInAt: { type: Date, default: Date.now },
  xpEarned:    { type: Number }, // actual XP awarded (may be tripled by a random-draw bonus); absent on legacy check-ins
  guessAttempt: { type: Number }, // set when found through a treasure hunt: which press hit (1 = first)
  huntMode:    { type: String, enum: ['hardcore'] }, // 'hardcore' on finds from the old hardcore hunt (until 2026-10-29); absent otherwise
});

// One check-in per user per location
checkInSchema.index({ user: 1, location: 1 }, { unique: true });
checkInSchema.index({ user: 1 });

export default mongoose.model('CheckIn', checkInSchema);
