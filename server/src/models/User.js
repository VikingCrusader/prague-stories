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
    createdAt:     this.createdAt,
  };
};

export default mongoose.model('User', userSchema);
