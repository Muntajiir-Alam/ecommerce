import { body, param } from 'express-validator';
import validateResult from '../middleware/validate.js';

export const createReviewValidationRules = [
    body('productId').isMongoId().withMessage('Invalid product ID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString().trim().isLength({ max: 500 }),
    validateResult,
];

export const updateReviewValidationRules = [
    param('id').isMongoId().withMessage('Invalid review ID'),
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString().trim().isLength({ max: 500 }),
    validateResult,
];

export const deleteReviewValidationRule = [
    param('id').isMongoId().withMessage('Invalid review ID'),
    validateResult,
];

export const getProductReviewsValidationRule = [
    param('productId').isMongoId().withMessage('Invalid product ID'),
    validateResult,
];