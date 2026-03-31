import { Router } from 'express';
import * as itineraryController from '../controllers/itinerary.controller.js';
import auth from '../middleware/auth.js';
import tripGuard from '../middleware/tripGuard.js';

const router = Router({ mergeParams: true });

router.use(auth, tripGuard);

router.get('/', itineraryController.getAll);
router.post('/', itineraryController.create);
router.patch('/reorder', itineraryController.reorder);
router.patch('/:itemId', itineraryController.update);
router.delete('/:itemId', itineraryController.remove);

export default router;
