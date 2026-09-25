import { Router } from 'express';
import { getProfile, getProgress, getAchievements, getRandomDraw, drawRandomLocation, getHistoryProgress, saveHistoryProgress } from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/profile',      protect,      getProfile);
router.get('/progress',     optionalAuth, getProgress);
router.get('/achievements', optionalAuth, getAchievements);
router.get('/random-draw',  protect,      getRandomDraw);
router.post('/random-draw', protect,      drawRandomLocation);
router.get('/history-progress', protect, getHistoryProgress);
router.put('/history-progress', protect, saveHistoryProgress);

export default router;
