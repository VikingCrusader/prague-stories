import { Router } from 'express';
import { getProfile, getProgress, getAchievements } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/profile', getProfile);
router.get('/progress', getProgress);
router.get('/achievements', getAchievements);

export default router;
