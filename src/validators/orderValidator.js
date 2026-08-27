import { body, param, validationResult } from 'express-validator';

async function validateResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

const orderValidationRule = [
    body('userId').isMongoId().withMessage('Invalid user ID'),
    body('items')
        .isArray({ min: 1 })
        .withMessage('Items must be an array with at least one item'),
    body('items.*.productId').isMongoId().withMessage('Invalid product ID'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),
    body('items.*.price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a non-negative number'),
    body('totalAmount')
        .isFloat({ min: 0 })
        .withMessage('Total amount must be a non-negative number'),
    body('status')
        .isIn(['pending', 'completed', 'cancelled'])
        .withMessage('Status must be either pending, completed, or cancelled'),
    validateResult,
];

const getOrderByIdValidationRule = [
    param('id').isMongoId().withMessage('Invalid order ID'),
    validateResult,
];

const updateOrderStatusValidationRule = [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('status')
        .isIn(['pending', 'completed', 'cancelled'])
        .withMessage('Status must be either pending, completed, or cancelled'),
    validateResult,
];

const deleteOrderValidationRule = [
    param('id').isMongoId().withMessage('Invalid order ID'),
    validateResult,
];
export {
    orderValidationRule,
    getOrderByIdValidationRule,
    updateOrderStatusValidationRule,
    deleteOrderValidationRule,
};
