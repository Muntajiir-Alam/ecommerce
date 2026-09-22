import { body, param } from 'express-validator';
import validateResult from '../middleware/validate.js';

export const initiatePaymentValidationRules = [
    body('orderId').isMongoId().withMessage('Invalid order ID'),
    body('method').isIn(['card', 'upi', 'cod']).withMessage('Invalid payment method'),
    validateResult,
];

export const getPaymentByOrderValidationRule = [
    param('orderId').isMongoId().withMessage('Invalid order ID'),
    validateResult,
];