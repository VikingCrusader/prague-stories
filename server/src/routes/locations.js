import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  getLocations, getLocation, createLocation, deleteLocation, updateLocation,
  uploadCoverImage, upload,
} from '../controllers/locationController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch {
    // invalid token — proceed unauthenticated
  }
  next();
}

router.get('/',        optionalAuth, getLocations);
router.get('/:slug',   optionalAuth, getLocation);
router.post('/',       protect, createLocation);
router.put('/:slug',   protect, updateLocation);
router.delete('/:slug', protect, deleteLocation);
router.post('/:slug/cover', protect, upload.single('cover'), uploadCoverImage);

export default router;
