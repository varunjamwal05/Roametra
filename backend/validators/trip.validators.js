import { body } from 'express-validator';

export const createTripValidator = [
  body('name').trim().notEmpty().withMessage('Trip name required').isLength({ min: 3, max: 100 }),
  body('destination').trim().notEmpty().withMessage('Destination required').isLength({ min: 2 }),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
  body('invites').optional().isArray(),
  body('invites.*').optional().isEmail().withMessage('Each invite must be a valid email'),
];
