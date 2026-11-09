import { Router } from 'express';
import { getPacks, getPack } from '../controllers/packController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getPacks);
router.get('/:slug', optionalAuth, getPack);

export default router;
