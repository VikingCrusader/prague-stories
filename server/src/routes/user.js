import { Router } from 'express';
import { getProfile, getProgress, getAchievements } from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/profile',      protect,      getProfile);
router.get('/progress',     optionalAuth, getProgress);
router.get('/achievements', optionalAuth, getAchievements);

export default router;
