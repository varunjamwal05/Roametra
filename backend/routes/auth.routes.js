import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { registerValidator, loginValidator } from '../validators/auth.validators.js';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many requests, please try again later.' },
});

router.post('/register', authLimiter, validate(registerValidator), authController.register);
router.post('/login', authLimiter, validate(loginValidator), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getMe);

export default router;
