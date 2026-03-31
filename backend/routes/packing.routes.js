import { Router } from 'express';
import * as packingController from '../controllers/packing.controller.js';
import auth from '../middleware/auth.js';
import tripGuard from '../middleware/tripGuard.js';

const router = Router({ mergeParams: true });

router.use(auth, tripGuard);

router.get('/', packingController.getAll);
router.post('/', packingController.create);
router.patch('/:itemId/toggle', packingController.toggleCheck);
router.delete('/:itemId', packingController.remove);

export default router;
