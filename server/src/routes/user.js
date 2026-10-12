import { Router } from 'express';
import { getProfile, getProgress, getAchievements, getRandomDraw, drawRandomLocation, rerollDraw, guessHiddenDraw, getHistoryProgress, saveHistoryProgress, savePreferences } from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/profile',      protect,      getProfile);
router.get('/progress',     optionalAuth, getProgress);
router.get('/achievements', optionalAuth, getAchievements);
router.get('/random-draw',  protect,      getRandomDraw);
router.post('/random-draw', protect,      drawRandomLocation);
router.post('/random-draw/reroll', protect, rerollDraw);
router.post('/random-draw/guess', protect, guessHiddenDraw);
router.get('/history-progress', protect, getHistoryProgress);
router.put('/history-progress', protect, saveHistoryProgress);
router.put('/preferences', protect, savePreferences);

export default router;
