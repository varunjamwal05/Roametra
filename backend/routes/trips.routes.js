import { Router } from 'express';
import * as tripsController from '../controllers/trips.controller.js';
import auth from '../middleware/auth.js';
import tripGuard from '../middleware/tripGuard.js';
import validate from '../middleware/validate.js';
import { createTripValidator } from '../validators/trip.validators.js';

const router = Router();

router.use(auth); // all trip routes require auth

router.get('/', tripsController.getMyTrips);
router.post('/', validate(createTripValidator), tripsController.create);
router.post('/join', tripsController.join);

// Routes below require membership in the trip
router.get('/:id', tripGuard, tripsController.getOne);
router.delete('/:id', tripGuard, tripsController.remove);
router.get('/:id/members', tripGuard, tripsController.getMembers);

export default router;
