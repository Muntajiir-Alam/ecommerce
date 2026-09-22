import express from 'express';
import * as authController from '../controllers/authController.js';
import {
    loginUserValidationRules,
    registerUserValidationRules,
    resetPasswordValidationRules,
} from '../validators/authValidator.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
router.get('/me', authController.getCurrentUser);
router.post(
    '/register',
    authLimiter,
    registerUserValidationRules,
    authController.registerUser
);
router.post(
    '/login',
    authLimiter,
    loginUserValidationRules,
    authController.loginUser
);
router.post(
    '/reset',
    authLimiter,
    resetPasswordValidationRules,
    authController.resetPass
);
router.post('/logout', authLimiter, authController.logoutUser);
router.post('/refresh', authLimiter, authController.refreshToken);

export default router;
