import { Router } from 'express';
import { getHistoryEvents } from '../controllers/historyController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Read-only: this content is hand-curated by the editorial team via
// seedHistoryEvents.js, not user-submitted, so there's no write route to
// wire up here (unlike /api/locations). optionalAuth is still needed on
// the read so relatedLandmarks can report each one's real unlocked state
// for the logged-in requester, same as GET /api/locations does.
router.get('/', optionalAuth, getHistoryEvents);

export default router;
