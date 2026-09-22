import { body, param } from 'express-validator';
import validateResult from '../middleware/validate.js';

export const createCategoryValidationRules = [
    body('name').isString().trim().notEmpty().withMessage('Category name is required'),
    body('description').optional().isString().trim(),
    body('parentCategory').optional().isMongoId().withMessage('Invalid parent category ID'),
    validateResult,
];

export const updateCategoryValidationRules = [
    param('id').isMongoId().withMessage('Invalid category ID'),
    body('name').optional().isString().trim().notEmpty(),
    body('description').optional().isString().trim(),
    body('isActive').optional().isBoolean(),
    validateResult,
];

export const getCategoryByIdValidationRule = [
    param('id').isMongoId().withMessage('Invalid category ID'),
    validateResult,
];