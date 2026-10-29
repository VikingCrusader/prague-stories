import { Router } from 'express';
import { getProfile, getProgress, getAchievements, getRandomDraw, drawRandomLocation, getTreasures, guessHiddenDraw, takeHuntClue, getHistoryProgress, saveHistoryProgress, savePreferences, saveLocationConsent,getLeaderboard, getExplorer } from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/profile',      protect,      getProfile);
router.get('/progress',     optionalAuth, getProgress);
router.get('/achievements', optionalAuth, getAchievements);
router.get('/random-draw',  protect,      getRandomDraw);
router.post('/random-draw', protect,      drawRandomLocation);
router.get('/treasures', protect, getTreasures);
router.post('/random-draw/guess', protect, guessHiddenDraw);
router.post('/random-draw/clue', protect, takeHuntClue);
router.get('/history-progress', protect, getHistoryProgress);
router.put('/history-progress', protect, saveHistoryProgress);
router.put('/preferences', protect, savePreferences);
router.put('/location-consent', protect, saveLocationConsent);
router.get('/leaderboard', optionalAuth, getLeaderboard);
router.get('/explorers/:username', optionalAuth, getExplorer);

export default router;
