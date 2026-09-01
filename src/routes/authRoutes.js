import express from 'express';
import * as authController from '../controllers/authController.js';
import {
    loginUserValidationRules,
    registerUserValidationRules,
    resetPasswordValidationRules,
} from '../validators/authValidator.js';

const router = express.Router();
router.post('/me', authController.getCurrentUser);
router.post(
    '/register',
    registerUserValidationRules,
    authController.registerUser
);
router.post('/login', loginUserValidationRules, authController.loginUser);
router.post('/reset', resetPasswordValidationRules, authController.resetPass);
router.post('/logout', authController.logoutUser);

export default router;
