import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isAdmin } from '../utils/admin.js';

export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch { /* invalid token — proceed unauthenticated */ }
  next();
}

// After `protect`: only the admin account gets through.
export function adminOnly(req, res, next) {
  if (!isAdmin(req.user)) return res.status(403).json({ message: 'Only the admin can edit cards' });
  next();
}

export async function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}
