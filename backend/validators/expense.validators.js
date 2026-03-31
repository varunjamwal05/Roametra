import { body } from 'express-validator';

export const createExpenseValidator = [
  body('title').trim().notEmpty().withMessage('Expense title required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('paidBy').isMongoId().withMessage('paidBy must be a valid user ID'),
  body('date').optional().isISO8601().withMessage('Valid date required'),
  body('category')
    .optional()
    .isIn(['food', 'transport', 'accommodation', 'entertainment', 'shopping', 'other'])
    .withMessage('Invalid category'),
  body('splits').isArray({ min: 1 }).withMessage('Splits must be a non-empty array'),
  body('splits.*.userId').isMongoId().withMessage('Each split userId must be valid'),
  body('splits.*.share').isFloat({ min: 0 }).withMessage('Each split share must be >= 0'),
];
