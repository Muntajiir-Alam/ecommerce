import { body, param } from 'express-validator';
import validateResult from '../middleware/validate.js';

export const addToWishlistValidationRules = [
    body('productId').isMongoId().withMessage('Invalid product ID'),
    validateResult,
];

export const removeFromWishlistValidationRule = [
    param('productId').isMongoId().withMessage('Invalid product ID'),
    validateResult,
];