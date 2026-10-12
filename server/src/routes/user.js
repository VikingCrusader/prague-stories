import { Router } from 'express';
import { getProfile, getProgress, getAchievements, getRandomDraw, drawRandomLocation, rerollDraw, getTreasures, guessHiddenDraw, skipHiddenDraw, getHistoryProgress, saveHistoryProgress, savePreferences, getLeaderboard } from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/profile',      protect,      getProfile);
router.get('/progress',     optionalAuth, getProgress);
router.get('/achievements', optionalAuth, getAchievements);
router.get('/random-draw',  protect,      getRandomDraw);
router.post('/random-draw', protect,      drawRandomLocation);
router.post('/random-draw/reroll', protect, rerollDraw);
router.get('/treasures', protect, getTreasures);
router.post('/random-draw/guess', protect, guessHiddenDraw);
router.post('/random-draw/skip', protect, skipHiddenDraw);
router.get('/history-progress', protect, getHistoryProgress);
router.put('/history-progress', protect, saveHistoryProgress);
router.put('/preferences', protect, savePreferences);
router.get('/leaderboard', optionalAuth, getLeaderboard);

export default router;
