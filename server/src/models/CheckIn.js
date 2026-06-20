import mongoose from 'mongoose';

const checkInSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location:    { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  note:        { type: String, maxlength: 280, default: '' },
  checkedInAt: { type: Date, default: Date.now },
});

// One check-in per user per location
checkInSchema.index({ user: 1, location: 1 }, { unique: true });
checkInSchema.index({ user: 1 });

export default mongoose.model('CheckIn', checkInSchema);
