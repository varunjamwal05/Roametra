import { Router } from 'express';
import * as expensesController from '../controllers/expenses.controller.js';
import auth from '../middleware/auth.js';
import tripGuard from '../middleware/tripGuard.js';
import validate from '../middleware/validate.js';
import { createExpenseValidator } from '../validators/expense.validators.js';

const router = Router({ mergeParams: true });

router.use(auth, tripGuard);

router.get('/', expensesController.getAll);
router.post('/', validate(createExpenseValidator), expensesController.create);
router.delete('/:expId', expensesController.remove);
router.patch('/:expId/settle', expensesController.settle);
router.get('/settlement', expensesController.getSettlement);

export default router;
