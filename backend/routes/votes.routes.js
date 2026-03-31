import { Router } from 'express';
import * as votesController from '../controllers/votes.controller.js';
import auth from '../middleware/auth.js';
import tripGuard from '../middleware/tripGuard.js';

const router = Router({ mergeParams: true });

router.use(auth, tripGuard);

router.get('/', votesController.getAll);
router.post('/', votesController.create);
router.post('/:voteId/vote', votesController.castVote);
router.delete('/:voteId', votesController.remove);

export default router;
