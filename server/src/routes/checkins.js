import { Router } from 'express';
import { getUserCheckins, checkIn, undoCheckIn } from '../controllers/checkinController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use(protect);

router.get('/', getUserCheckins);
router.post('/:slug', checkIn);
router.delete('/:slug', undoCheckIn);

export default router;
