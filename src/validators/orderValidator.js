import { body, param } from 'express-validator';
import validateResult from '../middleware/validate';

const orderValidationRule = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('Items must be an array with at least one item'),
    body('items.*.productId').isMongoId().withMessage('Invalid product ID'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),
    body('totalAmount')
        .isFloat({ min: 0 })
        .withMessage('Total amount must be a non-negative number'),
    validateResult,
];

const getOrderByIdValidationRule = [
    param('id').isMongoId().withMessage('Invalid order ID'),
    validateResult,
];

export const updateOrderStatusValidationRule = [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('status')
        .isIn(['pending', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'])
        .withMessage('Invalid status'),
    body('note').optional().isString().trim().isLength({ max: 200 }),
    validateResult,
];

const deleteOrderValidationRule = [
    param('id').isMongoId().withMessage('Invalid order ID'),
    validateResult,
];

export const getOrderTrackingValidationRule = [
    param('id').isMongoId().withMessage('Invalid order ID'),
    validateResult,
];

export const requestReturnValidationRules = [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('reason').isString().trim().notEmpty().withMessage('Return reason is required'),
    validateResult,
];

export const resolveReturnValidationRules = [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('decision').isIn(['approved', 'rejected']).withMessage('Decision must be approved or rejected'),
    validateResult,
];

export {
    orderValidationRule,
    getOrderByIdValidationRule,
    deleteOrderValidationRule,
    getOrderTrackingValidationRule,
    requestReturnValidationRules,
    resolveReturnValidationRules,
};
